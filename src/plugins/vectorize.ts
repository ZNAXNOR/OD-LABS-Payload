import type { Plugin } from 'payload'
import { embed, embedMany } from 'ai'
import { openai } from '@ai-sdk/openai'
import payloadVectorize, { deleteDocumentEmbeddings } from 'payloadcms-vectorize'

import { vectorIntegration } from '@/vectorize/config'
import { pagesToKnowledgePool } from '@/vectorize/pagesToKnowledgePool'
import { postsToKnowledgePool } from '@/vectorize/postsToKnowledgePool'
import { createOpenAIBulkEmbeddingsFns } from '@/vectorize/openaiBulkEmbeddings'

const embedDocuments = async (texts: string[]): Promise<number[][]> => {
  const { embeddings } = await embedMany({
    model: openai.embedding('text-embedding-3-small'),
    values: texts,
  })
  return embeddings
}

const embedQuery = async (text: string): Promise<number[]> => {
  const { embedding } = await embed({
    model: openai.embedding('text-embedding-3-small'),
    value: text,
  })
  return embedding
}

export const vectorizePlugin: Plugin = payloadVectorize({
  dbAdapter: vectorIntegration.adapter,
  realtimeQueueName: 'odlabs-vectorize-realtime',
  bulkQueueNames: {
    prepareBulkEmbedQueueName: 'odlabs-vectorize-bulk-prepare',
    pollOrCompleteQueueName: 'odlabs-vectorize-bulk-poll',
  },

  knowledgePools: {
    odlabs_knowledge: {
      extensionFields: [
        {
          name: 'pageTitle',
          type: 'text',
        },
        {
          name: 'pageSlug',
          type: 'text',
        },
        {
          name: 'section',
          type: 'text',
        },
        {
          name: 'blockType',
          type: 'text',
        },
      ],

      collections: {
        pages: {
          toKnowledgePool: pagesToKnowledgePool,

          shouldEmbedFn: async (doc) => {
            return doc._status === 'published' && !doc.meta?.excludeFromIndex
          },
        },

        posts: {
          toKnowledgePool: postsToKnowledgePool,

          shouldEmbedFn: async (doc) => {
            return doc._status === 'published' && !doc.meta?.excludeFromIndex
          },
        },
      },

      embeddingConfig: {
        version: 'v1.1.0',
        queryFn: embedQuery,
        realTimeIngestionFn: embedDocuments,
        bulkEmbeddingsFns: createOpenAIBulkEmbeddingsFns(),
      },
    },
  },
})

// The plugin skips ingestion when shouldEmbedFn returns false, but it does
// not remove existing chunks when a published document is explicitly excluded.
// Only clean up on the explicit exclusion flag: draft saves can have draft
// status while the previously published version remains publicly available.
export const vectorizeHooksPlugin: Plugin = (config) => {
  for (const collectionSlug of ['pages', 'posts']) {
    const collection = config.collections?.find(
      (item) => item.slug === collectionSlug,
    )

    if (!collection) continue

    collection.hooks = {
      ...collection.hooks,
      afterChange: [
        ...(collection.hooks?.afterChange ?? []),
        async ({ doc, req }) => {
          const meta = doc.meta as
            | { excludeFromIndex?: boolean | null }
            | null
            | undefined

          if (!meta?.excludeFromIndex) return doc

          await deleteDocumentEmbeddings({
            payload: req.payload,
            poolName: 'odlabs_knowledge',
            collection: collectionSlug,
            docId: String(doc.id),
            adapter: vectorIntegration.adapter,
          })

          return doc
        },
      ],
    }
  }

  return config
}

// The Vectorize plugin generates these collections internally, so group them
// after it has registered them instead of maintaining custom collection configs.
export const vectorizeAdminEndpointsPlugin: Plugin = (config) => {
  const aiCollectionLabels: Record<
    string,
    { singular: string; plural: string }
  > = {
    'vector-bulk-embeddings-runs': {
      singular: 'Embedding Run',
      plural: 'Embedding Runs',
    },
    'vector-bulk-embeddings-batches': {
      singular: 'Embedding Batch',
      plural: 'Embedding Batches',
    },
    'vector-bulk-embedding-input-metadata': {
      singular: 'Embedding Input Record',
      plural: 'Embedding Input Records',
    },
    odlabs_knowledge: {
      singular: 'Knowledge Chunk',
      plural: 'Knowledge Chunks',
    },
  }

  config.collections = (config.collections ?? []).map((collection) => {
    const labels = aiCollectionLabels[collection.slug]

    if (!labels) return collection

    return {
      ...collection,
      labels,
      admin: {
        ...collection.admin,
        group: 'AI',
        components: {
          ...collection.admin?.components,
          beforeList: undefined,
          edit: {
            ...collection.admin?.components?.edit,
            beforeDocumentControls: undefined,
          },
        },
      },
    }
  })

  // Bulk embedding endpoints can incur provider costs. Require an authenticated
  // Payload user before allowing a bulk run or failed-batch retry to be queued.
  config.endpoints = (config.endpoints ?? []).map((endpoint) => {
    if (
      endpoint.path !== '/vector-bulk-embed' &&
      endpoint.path !== '/vector-retry-failed-batch'
    ) {
      return endpoint
    }

    const originalHandler = endpoint.handler

    return {
      ...endpoint,
      handler: async (req) => {
        if (!req.user) {
          return Response.json(
            { error: 'Authentication required.' },
            { status: 401 },
          )
        }

        return originalHandler(req)
      },
    }
  })

  return config
}

export const vectorizePlugins: Plugin[] = [
  vectorizePlugin,
  vectorizeHooksPlugin,
  vectorizeAdminEndpointsPlugin,
]
