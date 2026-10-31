import type {
  BulkEmbeddingsFns,
  BulkEmbeddingOutput,
  BulkEmbeddingRunStatus,
  BatchSubmission,
} from 'payloadcms-vectorize'

const OPENAI_API_BASE = 'https://api.openai.com/v1'
const EMBEDDING_MODEL = 'text-embedding-3-small'

// Keep batches modest: well below OpenAI's 50,000-request and 200 MB limits.
const MAX_BATCH_REQUESTS = 1_000

type OpenAIBatch = {
  id: string
  status: string
  output_file_id?: string | null
  error_file_id?: string | null
}

type OpenAIFile = {
  id: string
}

const getApiKey = () => {
  const apiKey = process.env.OPENAI_API_KEY

  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is required for bulk embedding')
  }

  return apiKey
}

async function openAIRequest<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const response = await fetch(`${OPENAI_API_BASE}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${getApiKey()}`,
      ...init?.headers,
    },
  })

  if (!response.ok) {
    const detail = await response.text()
    throw new Error(`OpenAI API ${path} failed (${response.status}): ${detail}`)
  }

  return (await response.json()) as T
}

async function submitBatch(
  chunks: Array<{ id: string; text: string }>,
): Promise<BatchSubmission> {
  const jsonl = chunks
    .map((chunk) =>
      JSON.stringify({
        custom_id: chunk.id,
        method: 'POST',
        url: '/v1/embeddings',
        body: {
          model: EMBEDDING_MODEL,
          input: chunk.text,
        },
      }),
    )
    .join('\n')

  const form = new FormData()
  form.append(
    'file',
    new Blob([jsonl], { type: 'application/jsonl' }),
    'odlabs-embedding-input.jsonl',
  )
  form.append('purpose', 'batch')

  const file = await openAIRequest<OpenAIFile>('/files', {
    method: 'POST',
    body: form,
  })

  const batch = await openAIRequest<OpenAIBatch>('/batches', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      input_file_id: file.id,
      endpoint: '/v1/embeddings',
      completion_window: '24h',
      metadata: { application: 'od-labs-knowledgebase' },
    }),
  })

  return { providerBatchId: batch.id }
}

async function readOutputFile(
  fileId: string,
  onChunk: (chunk: BulkEmbeddingOutput) => Promise<void>,
): Promise<void> {
  const response = await fetch(`${OPENAI_API_BASE}/files/${fileId}/content`, {
    headers: { Authorization: `Bearer ${getApiKey()}` },
  })

  if (!response.ok) {
    throw new Error(
      `OpenAI output download failed (${response.status}): ${await response.text()}`,
    )
  }

  const content = await response.text()

  for (const line of content.split('\n')) {
    if (!line.trim()) continue

    const result = JSON.parse(line) as {
      custom_id: string
      response?: {
        status_code?: number
        body?: { data?: Array<{ embedding?: number[] }> }
      } | null
      error?: { message?: string; code?: string } | null
    }

    const embedding = result.response?.body?.data?.[0]?.embedding

    if (
      result.response?.status_code === 200 &&
      Array.isArray(embedding)
    ) {
      await onChunk({ id: result.custom_id, embedding })
    } else {
      await onChunk({
        id: result.custom_id,
        error:
          result.error?.message ??
          `OpenAI embedding request failed (HTTP ${result.response?.status_code ?? 'unknown'})`,
      })
    }
  }
}

export function createOpenAIBulkEmbeddingsFns(): BulkEmbeddingsFns {
  let accumulatedChunks: Array<{ id: string; text: string }> = []

  return {
    addChunk: async ({ chunk, isLastChunk }) => {
      accumulatedChunks.push(chunk)

      if (
        accumulatedChunks.length < MAX_BATCH_REQUESTS &&
        !isLastChunk
      ) {
        return null
      }

      const chunksToSubmit = accumulatedChunks
      accumulatedChunks = []

      if (chunksToSubmit.length === 0) return null

      return submitBatch(chunksToSubmit)
    },

    pollOrCompleteBatch: async ({ providerBatchId, onChunk }) => {
      const batch = await openAIRequest<OpenAIBatch>(
        `/batches/${encodeURIComponent(providerBatchId)}`,
      )

      let status: BulkEmbeddingRunStatus

      switch (batch.status) {
        case 'completed':
          status = 'succeeded'
          break
        case 'failed':
        case 'expired':
          status = 'failed'
          break
        case 'cancelled':
          status = 'canceled'
          break
        case 'validating':
        case 'in_progress':
        case 'finalizing':
        case 'cancelling':
        default:
          status = 'running'
      }

      if (status !== 'succeeded') {
        return {
          status,
          ...(status === 'failed'
            ? { error: `OpenAI batch ended with status: ${batch.status}` }
            : {}),
        }
      }

      if (batch.output_file_id) {
        await readOutputFile(batch.output_file_id, onChunk)
      }

      if (batch.error_file_id) {
        await readOutputFile(batch.error_file_id, onChunk)
      }

      if (!batch.output_file_id && !batch.error_file_id) {
        return {
          status: 'failed',
          error: 'OpenAI completed the batch without an output or error file.',
        }
      }

      return { status: 'succeeded' }
    },
  }
}
