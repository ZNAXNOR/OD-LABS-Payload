import { formBuilderPlugin } from '@payloadcms/plugin-form-builder'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { Plugin } from 'payload'
import { GenerateTitle, GenerateURL } from '@payloadcms/plugin-seo/types'
import { FixedToolbarFeature, HeadingFeature, lexicalEditor } from '@payloadcms/richtext-lexical'

import { Page, BlogPage, ServicePage, LegalPage, ContactPage } from '@/payload-types'
import { getServerSideURL } from '@/utilities/getURL'

const generateTitle: GenerateTitle<Page | BlogPage | ServicePage | LegalPage | ContactPage> = ({
  doc,
}) => {
  return doc?.title ? `${doc.title} | OD LABS Website` : 'OD LABS Website'
}

const generateURL: GenerateURL<Page | BlogPage | ServicePage | LegalPage | ContactPage> = ({
  doc,
}) => {
  const url = getServerSideURL()

  return doc?.slug ? `${url}/${doc.slug}` : url
}

import { dashboardAnalytics } from 'payload-dashboard-analytics'
import path from 'path'

export const plugins: Plugin[] = [
  dashboardAnalytics({
    provider: {
      source: 'google',
      propertyId: process.env.GA_PROPERTY_ID || '',
      credentials: path.resolve(process.cwd(), process.env.GA_CREDENTIALS_PATH || ''),
    },
    cache: true,
  }),
  seoPlugin({
    generateTitle,
    generateURL,
  }),
  formBuilderPlugin({
    fields: {
      payment: false,
    },
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
                    HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }),
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
]
