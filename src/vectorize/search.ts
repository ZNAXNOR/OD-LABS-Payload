import { getPayload } from 'payload'
import { getVectorizedPayload } from 'payloadcms-vectorize'

import config from '@/payload.config'

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
  // console.log('[VECTORIZE] Creating Payload Instance')

  const payload = await getPayload({
    config,
    cron: true,
  })

  // console.log('[VECTORIZE] Payload Instance Created')
  // console.log(
  //   '[VECTORIZE] Config custom keys:',
  //   Object.keys(payload.config.custom ?? {}),
  // )

  const vectorizedPayload = getVectorizedPayload(payload)

  // console.log(
  //   '[VECTORIZE] Vectorized Payload:',
  //   vectorizedPayload ? 'AVAILABLE' : 'MISSING',
  // )

  if (!vectorizedPayload) {
    throw new Error("Payload's vectorize plugin is not configuted")
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
        url: pageSlug ? `/${pageSlug}` : '/',
        section,
        blockType,
        score: result.score,
      },
    }
  })
}
