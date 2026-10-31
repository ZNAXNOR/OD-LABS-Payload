import * as Sentry from '@sentry/nextjs'
import { sentryPlugin } from '@payloadcms/plugin-sentry'
import { formBuilderPlugin } from '@payloadcms/plugin-form-builder'
import { nestedDocsPlugin } from '@payloadcms/plugin-nested-docs'
import { redirectsPlugin } from '@payloadcms/plugin-redirects'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { searchPlugin } from '@payloadcms/plugin-search'
import { Plugin } from 'payload'
import { revalidateRedirects } from '@/hooks/revalidateRedirects'
import { GenerateTitle, GenerateURL } from '@payloadcms/plugin-seo/types'
import {
  FixedToolbarFeature,
  HeadingFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import { searchFields } from '@/search/fieldOverrides'
import { beforeSyncWithSearch } from '@/search/beforeSync'

import { Page, Post } from '@/payload-types'
import { getServerSideURL } from '@/utilities/getURL'

import { embed, embedMany } from 'ai'
import { openai } from '@ai-sdk/openai'

import payloadVectorize, { deleteDocumentEmbeddings } from 'payloadcms-vectorize'

import { ToKnowledgePoolFn } from 'payloadcms-vectorize'
import { vectorIntegration } from '@/vectorize/config'
import { pagesToKnowledgePool } from '@/vectorize/pagesToKnowledgePool'
import { postsToKnowledgePool } from '@/vectorize/postsToKnowledgePool'
import { createOpenAIBulkEmbeddingsFns } from '@/vectorize/openaiBulkEmbeddings'
import { s3Storage } from '@payloadcms/storage-s3'
import { wrapEmailHtml } from '@/email/template'

const generateTitle: GenerateTitle<Post | Page> = ({ doc }) => {
  return doc?.title ? `${doc.title} | OD LABS` : 'OD LABS'
}

const generateURL: GenerateURL<Post | Page> = ({ doc }) => {
  const url = getServerSideURL()

  return doc?.slug ? `${url}/${doc.slug}` : url
}

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

const testDocumentsToKnowledgePool: ToKnowledgePoolFn = async (doc) => {
  return [
    {
      chunk: `${doc.title}\n\n${doc.content}`,
    },
  ]
}

export const plugins: Plugin[] = [
  sentryPlugin({ Sentry }),
  redirectsPlugin({
    collections: ['pages', 'posts'],
    overrides: {
      // @ts-expect-error - This is a valid override, mapped fields don't resolve to the same type
      fields: ({ defaultFields }) => {
        return defaultFields.map((field) => {
          if ('name' in field && field.name === 'from') {
            return {
              ...field,
              admin: {
                description:
                  'You will need to rebuild the website when changing this field.',
              },
            }
          }
          return field
        })
      },
      hooks: {
        afterChange: [revalidateRedirects],
      },
    },
  }),
  nestedDocsPlugin({
    collections: ['categories'],
    generateURL: (docs) => docs.reduce((url, doc) => `${url}/${doc.slug}`, ''),
  }),
  seoPlugin({
    generateTitle,
    generateURL,

    fields: ({ defaultFields }) => [
      ...defaultFields,
      {
        name: 'excludeFromIndex',
        type: 'checkbox',
        label: 'Exclude from AI Index',
        defaultValue: false,
        admin: {
          description:
            'Exclude this content from the OD LABS AI knowledgebase. This setting does not control search-engine indexing.',
        },
      },
    ],
  }),
  formBuilderPlugin({
    fields: {
      payment: false,
    },
    beforeEmail: (emailsToSend, { doc }: any) =>
      emailsToSend.map((email) => {
        let bodyHtml = email.html || ''

        // Resolve Form Submission ID
        const submissionID = String(doc.id || '')

        // Resolve Form ID safely
        const formID = String(
          typeof doc.form === 'object' && doc.form !== null
            ? doc.form.id
            : doc.form || '',
        )

        // Perform replacements
        if (bodyHtml) {
          bodyHtml = bodyHtml
            // Handles {{formSubmissionID}}
            .replace(/{{formSubmissionID}}/g, submissionID)
        }

        return {
          ...email,
          html: wrapEmailHtml({
            title: email.subject,
            bodyHtml,
          }),
        }
      }),
    formOverrides: {
      fields: ({ defaultFields }) => {
        return defaultFields.map((field) => {
          if ('name' in field && field.name === 'confirmationMessage') {
            return {
              ...field,
              editor: lexicalEditor({
                features: ({ rootFeatures }) => {
                  return [
                    ...rootFeatures,
                    FixedToolbarFeature(),
                    HeadingFeature({
                      enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'],
                    }),
                  ]
                },
              }),
            }
          }
          return field
        })
      },
    },
  }),
  searchPlugin({
    collections: ['posts'],
    beforeSync: beforeSyncWithSearch,
    searchOverrides: {
      fields: ({ defaultFields }) => {
        return [...defaultFields, ...searchFields]
      },
    },
  }),

  payloadVectorize({
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
          'test-documents': {
            toKnowledgePool: testDocumentsToKnowledgePool,
          },

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
  }),

  // The plugin skips ingestion when shouldEmbedFn returns false, but it does
  // not remove existing chunks when a published document is explicitly excluded.
  // Only clean up on the explicit exclusion flag: draft saves can have draft
  // status while the previously published version remains publicly available.
  (config) => {
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
  },

  // The Vectorize plugin generates these collections internally, so group them
  // after it has registered them instead of maintaining custom collection configs.
  (config) => {
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
  },

  s3Storage({
    enabled: Boolean(process.env.AWS_S3_BUCKET),
    collections: {
      media: true,
    },
    bucket: process.env.AWS_S3_BUCKET!,
    config: {
      endpoint: process.env.AWS_ENDPOINT_URL_S3,
      region: process.env.AWS_REGION,
      forcePathStyle: true,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
    },
  }),
]
