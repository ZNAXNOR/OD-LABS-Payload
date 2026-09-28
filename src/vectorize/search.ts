import { getPayload } from 'payload'
import { getVectorizedPayload } from 'payloadcms-vectorize'

import config from '@/payload.config'

export async function searchKnowledge(query: string, limit = 5) {
  const payload = await getPayload({
    config,
    cron: true,
  })

  const vectorizedPayload = getVectorizedPayload(payload)

  if (!vectorizedPayload) {
    throw new Error("Payload's vectorize plugin is not configuted")
  }

  return vectorizedPayload.search({
    query,
    knowledgePool: 'odlabs_knowledge',
    limit,
  })
}
