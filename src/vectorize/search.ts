import { getPayload } from 'payload'
import { getVectorizedPayload } from 'payloadcms-vectorize'

import configPromise from '@/payload.config'
import { CONTENT_COLLECTIONS, CONTENT_SCOPES, type ContentCollection, type ContentScope } from '@/components/AI/contentScopes'

export type KnowledgeCollection = ContentCollection

export type KnowledgeSource = {
  id: string
  contentType: KnowledgeCollection
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
  scope: ContentScope = 'all',
): Promise<KnowledgeResult[]> {
  const payload = await getPayload({
    config: configPromise,
  })

  const vectorizedPayload = getVectorizedPayload(payload)

  if (!vectorizedPayload) {
    throw new Error("Payload's vectorize plugin is not configured")
  }

  const selectedScope = CONTENT_SCOPES.find((item) => item.value === scope)
  if (!selectedScope) {
    throw new Error(`Unsupported knowledge content scope: ${scope}`)
  }

  const collectionFilter =
    selectedScope.collections.length === 1
      ? { equals: selectedScope.collections[0] }
      : { not_equals: 'test-documents' }

  const results = await vectorizedPayload.search({
    knowledgePool: 'odlabs_knowledge',
    query,
    // Oversample before validating current publication/indexing eligibility.
    limit: Math.min(Math.max(limit * 4, limit), 20),
    where: {
      sourceCollection: collectionFilter,
    },
  })

  const documents = new Map<string, { collection: KnowledgeCollection; id: string }>()

  for (const result of results) {
    if (!CONTENT_COLLECTIONS.includes(result.sourceCollection as ContentCollection)) {
      continue
    }

    const key = `${result.sourceCollection}:${String(result.docId)}`
    documents.set(key, {
      collection: result.sourceCollection,
      id: String(result.docId),
    })
  }

  const eligibleByDocument = new Map<string, boolean>()

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
    .filter((result) => {
      if (!CONTENT_COLLECTIONS.includes(result.sourceCollection as ContentCollection)) {
        return false
      }

      return eligibleByDocument.get(
        `${result.sourceCollection}:${String(result.docId)}`,
      ) === true
    })
    .slice(0, limit)
    .map((result) => {
      const contentType = result.sourceCollection as KnowledgeCollection
      const pageSlug = typeof result.pageSlug === 'string' ? result.pageSlug : ''
      const pageTitle =
        typeof result.pageTitle === 'string' ? result.pageTitle : ''
      const section = typeof result.section === 'string' ? result.section : ''
      const blockType =
        typeof result.blockType === 'string' ? result.blockType : ''
      const id = `${contentType}:${String(result.id)}`

      return {
        id,
        text: result.chunkText,
        source: {
          id,
          contentType,
          title: pageTitle || 'OD LABS',
          url: pageSlug && pageSlug !== 'home' ? `/${pageSlug}` : '/',
          section,
          blockType,
          score: result.score,
        },
      }
    })
}
