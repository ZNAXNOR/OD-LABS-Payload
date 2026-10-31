import { getPayload } from 'payload'
import { getVectorizedPayload } from 'payloadcms-vectorize'

import configPromise from '@/payload.config'

export type KnowledgeSource = {
  id: string
  title: string
  url: string
  section: string
  blockType: string
  score: number
}

export type KnowledgeResult = {
  id: string
  text: string
  source: KnowledgeSource
}

export async function searchKnowledge(
  query: string,
  limit = 5,
): Promise<KnowledgeResult[]> {
  const payload = await getPayload({
    config: configPromise,
  })

  const vectorizedPayload = getVectorizedPayload(payload)

  if (!vectorizedPayload) {
    throw new Error("Payload's vectorize plugin is not configured")
  }

  const results = await vectorizedPayload.search({
    knowledgePool: 'odlabs_knowledge',
    query,
    limit: Math.min(Math.max(limit * 4, limit), 20),
    // Legacy test-document vectors may still exist in the database. Keep them
    // out of public RAG retrieval without deleting records during deployment.
    where: {
      sourceCollection: {
        not_equals: 'test-documents',
      },
    },
  })

  const eligibleByDocument = new Map<string, boolean>()
  const documents = new Map<string, { collection: 'pages' | 'posts'; id: string }>()

  for (const result of results) {
    if (result.sourceCollection !== 'pages' && result.sourceCollection !== 'posts') {
      eligibleByDocument.set(
        `${result.sourceCollection}:${String(result.docId)}`,
        result.sourceCollection !== 'test-documents',
      )
      continue
    }

    const key = `${result.sourceCollection}:${String(result.docId)}`
    documents.set(key, {
      collection: result.sourceCollection,
      id: String(result.docId),
    })
  }

  await Promise.all(
    Array.from(documents.entries()).map(async ([key, source]) => {
      try {
        const doc = await payload.findByID({
          collection: source.collection,
          id: source.id,
          depth: 0,
        })
        const meta = doc.meta as
          | { excludeFromIndex?: boolean | null }
          | null
          | undefined

        eligibleByDocument.set(
          key,
          doc._status === 'published' && !meta?.excludeFromIndex,
        )
      } catch {
        eligibleByDocument.set(key, false)
      }
    }),
  )

  return results
    .filter((result) =>
      eligibleByDocument.get(
        `${result.sourceCollection}:${String(result.docId)}`,
      ),
    )
    .slice(0, limit)
    .map((result) => {
    const pageSlug = typeof result.pageSlug === 'string' ? result.pageSlug : ''
    const pageTitle =
      typeof result.pageTitle === 'string' ? result.pageTitle : ''
    const section = typeof result.section === 'string' ? result.section : ''
    const blockType =
      typeof result.blockType === 'string' ? result.blockType : ''

    return {
      id: String(result.id),
      text: result.chunkText,
      source: {
        id: String(result.id),
        title: pageTitle || 'OD LABS',
        url: pageSlug && pageSlug !== 'home' ? `/${pageSlug}` : '/',
        section,
        blockType,
        score: result.score,
      },
    }
  })
}
