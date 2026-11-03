import * as Sentry from '@sentry/nextjs'
import { sentryPlugin } from '@payloadcms/plugin-sentry'
import { nestedDocsPlugin } from '@payloadcms/plugin-nested-docs'
import { redirectsPlugin } from '@payloadcms/plugin-redirects'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { searchPlugin } from '@payloadcms/plugin-search'
import { s3Storage } from '@payloadcms/storage-s3'
import type { Plugin } from 'payload'
import { revalidateRedirects } from '@/hooks/revalidateRedirects'
import type { GenerateTitle, GenerateURL } from '@payloadcms/plugin-seo/types'
import { searchFields } from '@/search/fieldOverrides'
import { beforeSyncWithSearch } from '@/search/beforeSync'

import type { Page, Post } from '@/payload-types'
import { getServerSideURL } from '@/utilities/getURL'

import { formBuilder } from './formBuilder'
import { vectorizePlugins } from './vectorize'

const generateTitle: GenerateTitle<Post | Page> = ({ doc }) => {
  return doc?.title ? `${doc.title} | OD LABS` : 'OD LABS'
}

const generateURL: GenerateURL<Post | Page> = ({ doc }) => {
  const url = getServerSideURL()

  return doc?.slug ? `${url}/${doc.slug}` : url
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
  formBuilder,
  searchPlugin({
    collections: ['posts'],
    beforeSync: beforeSyncWithSearch,
    searchOverrides: {
      fields: ({ defaultFields }) => {
        return [...defaultFields, ...searchFields]
      },
    },
  }),
  ...vectorizePlugins,
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

export { formBuilder, formBuilderPluginConfig } from './formBuilder'
export {
  vectorizePlugin,
  vectorizeHooksPlugin,
  vectorizeAdminEndpointsPlugin,
  vectorizePlugins,
} from './vectorize'
