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
    limit,
  })

  return results.map((result) => {
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
