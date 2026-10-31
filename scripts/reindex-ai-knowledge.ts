import { getPayload } from 'payload'
import { getVectorizedPayload } from 'payloadcms-vectorize'

import config from '../src/payload.config'

const knowledgePool = 'odlabs_knowledge'

const main = async () => {
  const payload = await getPayload({ config })

  try {
    const vectorizedPayload = getVectorizedPayload(payload)

    if (!vectorizedPayload._isBulkEmbedEnabled(knowledgePool)) {
      throw new Error(
        `Bulk embedding is not enabled for knowledge pool "${knowledgePool}".`,
      )
    }

    const result = await vectorizedPayload.bulkEmbed({ knowledgePool })

    payload.logger.info({
      msg: 'Queued AI knowledgebase bulk embedding run',
      knowledgePool,
      ...result,
    })

    if ('conflict' in result && result.conflict) {
      throw new Error(result.message || 'An embedding run is already active.')
    }
  } finally {
    await payload.destroy()
  }
}

main().catch((error: unknown) => {
  console.error(
    '[AI Knowledge] Could not queue a bulk embedding run:',
    error instanceof Error ? error.message : error,
  )
  process.exitCode = 1
})
