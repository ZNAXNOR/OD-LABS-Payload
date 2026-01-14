import { formBuilderPlugin } from '@payloadcms/plugin-form-builder'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { Plugin } from 'payload'
import { GenerateTitle, GenerateURL } from '@payloadcms/plugin-seo/types'
import { FixedToolbarFeature, HeadingFeature, lexicalEditor } from '@payloadcms/richtext-lexical'

import { Page, BlogPage, ServicePage, LegalPage, ContactPage } from '@/payload-types'
import { getServerSideURL } from '@/utilities/getURL'

// Enhanced title generation with collection-specific logic
const generateTitle: GenerateTitle<Page | BlogPage | ServicePage | LegalPage | ContactPage> = ({
  doc,
}) => {
  const baseTitle = 'OD LABS'
  const siteName = 'OD LABS Website'

  if (!doc?.title) {
    return siteName
  }

  // Collection-specific title formatting
  let prefix = ''

  // Type guard to check if doc has a specific collection type
  if ('serviceType' in doc && doc.serviceType) {
    prefix = 'Services - '
  } else if ('documentType' in doc && doc.documentType) {
    prefix = 'Legal - '
  } else if ('purpose' in doc && doc.purpose) {
    prefix = 'Contact - '
  } else if ('publishedDate' in doc) {
    prefix = 'Blog - '
  }

  return `${prefix}${doc.title} | ${baseTitle}`
}

// Enhanced URL generation with collection-specific routing
const generateURL: GenerateURL<Page | BlogPage | ServicePage | LegalPage | ContactPage> = ({
  doc,
}) => {
  const baseURL = getServerSideURL()

  if (!doc?.slug) {
    return baseURL
  }

  // Collection-specific URL routing
  let collectionPath = ''

  // Determine collection path based on document properties
  if ('serviceType' in doc) {
    collectionPath = '/services'
  } else if ('documentType' in doc) {
    collectionPath = '/legal'
  } else if ('purpose' in doc) {
    collectionPath = '/contacts'
  } else if ('publishedDate' in doc) {
    collectionPath = '/blogs'
  }
  // Pages collection uses root path

  const fullPath = collectionPath ? `${collectionPath}/${doc.slug}` : `/${doc.slug}`
  return `${baseURL}${fullPath}`
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
    collections: ['pages', 'blogs', 'services', 'legal', 'contacts'],
    globals: ['header', 'footer'],
    uploadsCollection: 'media',
    tabbedUI: true,
    fields: ({ defaultFields }) => [
      ...defaultFields,
      {
        name: 'keywords',
        type: 'text',
        admin: {
          placeholder: 'keyword1, keyword2, keyword3',
          description: 'Comma-separated keywords relevant to this content',
        },
      },
      {
        name: 'robots',
        type: 'group',
        label: 'Search Engine Settings',
        fields: [
          {
            name: 'noIndex',
            type: 'checkbox',
            label: 'Prevent indexing',
            admin: {
              description: 'Check this to prevent search engines from indexing this page',
            },
          },
          {
            name: 'noFollow',
            type: 'checkbox',
            label: 'No follow links',
            admin: {
              description: 'Check this to tell search engines not to follow links on this page',
            },
          },
          {
            name: 'noArchive',
            type: 'checkbox',
            label: 'No archive',
            admin: {
              description: 'Prevent search engines from showing cached versions of this page',
            },
          },
          {
            name: 'noSnippet',
            type: 'checkbox',
            label: 'No snippet',
            admin: {
              description: 'Prevent search engines from showing text snippets in search results',
            },
          },
        ],
      },
      {
        name: 'canonical',
        type: 'text',
        label: 'Canonical URL',
        admin: {
          placeholder: 'https://example.com/canonical-url',
          description: 'The canonical URL for this page (leave empty to use the page URL)',
        },
        validate: (value: string | null | undefined) => {
          if (value && !value.startsWith('http')) {
            return 'Canonical URL must be a complete URL starting with http:// or https://'
          }
          return true
        },
      },
      {
        name: 'structured',
        type: 'group',
        label: 'Structured Data',
        fields: [
          {
            name: 'type',
            type: 'select',
            label: 'Schema Type',
            options: [
              { label: 'Article', value: 'Article' },
              { label: 'BlogPosting', value: 'BlogPosting' },
              { label: 'WebPage', value: 'WebPage' },
              { label: 'Organization', value: 'Organization' },
              { label: 'Service', value: 'Service' },
              { label: 'LocalBusiness', value: 'LocalBusiness' },
              { label: 'FAQ', value: 'FAQPage' },
              { label: 'Contact', value: 'ContactPage' },
              { label: 'About', value: 'AboutPage' },
              { label: 'Custom', value: 'custom' },
            ],
            admin: {
              description: 'Select the most appropriate schema type for this content',
            },
          },
          {
            name: 'customSchema',
            type: 'code',
            label: 'Custom Schema JSON',
            admin: {
              language: 'json',
              condition: (_: any, siblingData: any) => siblingData?.type === 'custom',
              description: 'Enter custom JSON-LD structured data',
            },
          },
          {
            name: 'author',
            type: 'relationship',
            relationTo: 'users',
            admin: {
              condition: (_: any, siblingData: any) =>
                ['Article', 'BlogPosting'].includes(siblingData?.type),
              description: 'Author of this content (for articles and blog posts)',
            },
          },
          {
            name: 'datePublished',
            type: 'date',
            admin: {
              condition: (_: any, siblingData: any) =>
                ['Article', 'BlogPosting'].includes(siblingData?.type),
              description: 'Publication date (for articles and blog posts)',
            },
          },
          {
            name: 'dateModified',
            type: 'date',
            admin: {
              condition: (_: any, siblingData: any) =>
                ['Article', 'BlogPosting'].includes(siblingData?.type),
              description: 'Last modification date (for articles and blog posts)',
            },
          },
        ],
      },
      {
        name: 'social',
        type: 'group',
        label: 'Social Media',
        fields: [
          {
            name: 'twitter',
            type: 'group',
            label: 'Twitter/X Settings',
            fields: [
              {
                name: 'card',
                type: 'select',
                options: [
                  { label: 'Summary', value: 'summary' },
                  { label: 'Summary Large Image', value: 'summary_large_image' },
                  { label: 'App', value: 'app' },
                  { label: 'Player', value: 'player' },
                ],
                defaultValue: 'summary_large_image',
              },
              {
                name: 'site',
                type: 'text',
                admin: {
                  placeholder: '@odlabs',
                  description: 'Twitter username for the website',
                },
              },
              {
                name: 'creator',
                type: 'text',
                admin: {
                  placeholder: '@author',
                  description: 'Twitter username for the content creator',
                },
              },
            ],
          },
          {
            name: 'facebook',
            type: 'group',
            label: 'Facebook Settings',
            fields: [
              {
                name: 'appId',
                type: 'text',
                admin: {
                  description: 'Facebook App ID for analytics',
                },
              },
            ],
          },
        ],
      },
    ],
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
