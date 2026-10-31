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

import payloadVectorize from 'payloadcms-vectorize'

import { ToKnowledgePoolFn } from 'payloadcms-vectorize'
import { vectorIntegration } from '@/vectorize/config'
import { pagesToKnowledgePool } from '@/vectorize/pagesToKnowledgePool'
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
        label: 'Exclude from Index',
        defaultValue: false,
        admin: {
          description:
            'Exclude this page from search engines and the OD LABS AI knowledgebase',
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
        },

        embeddingConfig: {
          version: 'v1.0.0',
          queryFn: embedQuery,
          realTimeIngestionFn: embedDocuments,
        },
      },
    },
  }),

  // The Vectorize plugin generates these collections internally, so group them
  // after it has registered them instead of maintaining custom collection configs.
  (config) => {
    const aiCollectionSlugs = new Set([
      'vector-bulk-embeddings-runs',
      'vector-bulk-embeddings-batches',
      'odlabs_knowledge',
    ])

    config.collections = (config.collections ?? []).map((collection) =>
      aiCollectionSlugs.has(collection.slug)
        ? {
            ...collection,
            admin: {
              ...collection.admin,
              group: 'AI',
            },
          }
        : collection,
    )

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
