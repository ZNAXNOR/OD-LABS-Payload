import { createPostgresVectorIntegration } from '@payloadcms-vectorize/pg'

export const vectorIntegration = createPostgresVectorIntegration({
  odlabs_knowledge: {
    dims: 1536,
    ivfflatLists: 100,
  },
})
