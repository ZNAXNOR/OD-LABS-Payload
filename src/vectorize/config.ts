import { createPostgresVectorIntegration } from '@payloadcms-vectorize/pg'

export const vectorIntegration = createPostgresVectorIntegration({
  odlabs_knowledge: {
    dims: 1536,
    ivfflatLists: 100,
  },
})

const originalHook = vectorIntegration.afterSchemaInitHook

vectorIntegration.afterSchemaInitHook = async (args) => {
  console.log('[VECTORIZE] afterSchemaInitHook RUNNING')

  const result = await originalHook(args)

  console.log('[VECTORIZE] afterSchemaInitHook COMPLETE')

  return result
}
