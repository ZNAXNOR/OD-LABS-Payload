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
        return [
          ...defaultFields.map((field) => {
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
          }),
          // Email notification configuration
          {
            name: 'emailNotifications',
            type: 'group',
            label: 'Email Notifications',
            fields: [
              {
                name: 'enabled',
                type: 'checkbox',
                label: 'Enable Email Notifications',
                defaultValue: false,
                admin: {
                  description: 'Send email notifications when forms are submitted',
                },
              },
              {
                name: 'recipients',
                type: 'array',
                label: 'Notification Recipients',
                minRows: 1,
                admin: {
                  condition: (data: any) => data?.emailNotifications?.enabled === true,
                  description: 'Email addresses that will receive form submission notifications',
                },
                fields: [
                  {
                    name: 'email',
                    type: 'email',
                    required: true,
                    validate: (value: string | null | undefined) => {
                      if (!value) return 'Email is required'
                      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
                      if (!emailRegex.test(value)) {
                        return 'Please enter a valid email address'
                      }
                      return true
                    },
                  },
                  {
                    name: 'name',
                    type: 'text',
                    admin: {
                      description: 'Optional name for this recipient',
                    },
                  },
                ],
              },
              {
                name: 'subject',
                type: 'text',
                label: 'Email Subject',
                defaultValue: 'New Form Submission',
                admin: {
                  condition: (data: any) => data?.emailNotifications?.enabled === true,
                  description: 'Subject line for notification emails',
                },
              },
              {
                name: 'replyTo',
                type: 'email',
                label: 'Reply-To Address',
                admin: {
                  condition: (data: any) => data?.emailNotifications?.enabled === true,
                  description: 'Email address for replies (leave empty to use submitter email)',
                },
              },
              {
                name: 'includeSubmissionData',
                type: 'checkbox',
                label: 'Include Submission Data',
                defaultValue: true,
                admin: {
                  condition: (data: any) => data?.emailNotifications?.enabled === true,
                  description: 'Include form submission data in the notification email',
                },
              },
            ],
          },
          // Form validation settings
          {
            name: 'validationSettings',
            type: 'group',
            label: 'Validation Settings',
            fields: [
              {
                name: 'enableHoneypot',
                type: 'checkbox',
                label: 'Enable Honeypot Protection',
                defaultValue: true,
                admin: {
                  description: 'Add hidden field to prevent spam bot submissions',
                },
              },
              {
                name: 'enableRateLimit',
                type: 'checkbox',
                label: 'Enable Rate Limiting',
                defaultValue: true,
                admin: {
                  description: 'Limit number of submissions per IP address',
                },
              },
              {
                name: 'rateLimitWindow',
                type: 'number',
                label: 'Rate Limit Window (minutes)',
                defaultValue: 60,
                min: 1,
                max: 1440,
                admin: {
                  condition: (data: any) => data?.validationSettings?.enableRateLimit === true,
                  description: 'Time window for rate limiting (1-1440 minutes)',
                },
              },
              {
                name: 'maxSubmissionsPerWindow',
                type: 'number',
                label: 'Max Submissions Per Window',
                defaultValue: 5,
                min: 1,
                max: 100,
                admin: {
                  condition: (data: any) => data?.validationSettings?.enableRateLimit === true,
                  description: 'Maximum number of submissions allowed per IP in the time window',
                },
              },
              {
                name: 'requireAuthentication',
                type: 'checkbox',
                label: 'Require Authentication',
                defaultValue: false,
                admin: {
                  description: 'Only allow authenticated users to submit this form',
                },
              },
            ],
          },
          // Success/Error handling
          {
            name: 'responseSettings',
            type: 'group',
            label: 'Response Settings',
            fields: [
              {
                name: 'successMessage',
                type: 'textarea',
                label: 'Success Message',
                defaultValue: 'Thank you for your submission!',
                admin: {
                  description: 'Message shown after successful form submission',
                },
              },
              {
                name: 'errorMessage',
                type: 'textarea',
                label: 'Error Message',
                defaultValue: 'There was an error submitting your form. Please try again.',
                admin: {
                  description: 'Message shown when form submission fails',
                },
              },
              {
                name: 'redirectUrl',
                type: 'text',
                label: 'Redirect URL',
                admin: {
                  description: 'Optional URL to redirect to after successful submission',
                },
                validate: (value: string | null | undefined) => {
                  if (value && !value.startsWith('/') && !value.startsWith('http')) {
                    return 'Redirect URL must start with / or be a complete URL'
                  }
                  return true
                },
              },
            ],
          },
        ] as any
      },
    },
    formSubmissionOverrides: {
      hooks: {
        afterChange: [
          async ({ doc, req, operation }) => {
            // Only process on create (new submissions)
            if (operation !== 'create') return doc

            try {
              // Get the form configuration
              const form = await req.payload.findByID({
                collection: 'forms',
                id: doc.form,
                req,
              })

              // Check if email notifications are enabled
              const emailNotifications = (form as any)?.emailNotifications
              if (emailNotifications?.enabled && emailNotifications?.recipients?.length) {
                // Log notification attempt
                req.payload.logger.info(
                  `Form submission received for form: ${form.title || form.id}`,
                )

                // In a real implementation, you would send emails here
                // This requires an email adapter to be configured in payload.config.ts
                // Example with nodemailer:
                // await req.payload.sendEmail({
                //   to: emailNotifications.recipients.map(r => r.email),
                //   subject: emailNotifications.subject || 'New Form Submission',
                //   html: generateEmailHTML(doc, form),
                // })

                // For now, log the notification details
                req.payload.logger.info(
                  `Email notification would be sent to: ${emailNotifications.recipients.map((r: any) => r.email).join(', ')}`,
                )
              }

              // Rate limiting check (basic implementation)
              const validationSettings = (form as any)?.validationSettings
              if (validationSettings?.enableRateLimit) {
                const rateLimitWindow = validationSettings.rateLimitWindow || 60
                const maxSubmissions = validationSettings.maxSubmissionsPerWindow || 5

                const cutoffTime = new Date()
                cutoffTime.setMinutes(cutoffTime.getMinutes() - rateLimitWindow)

                // Count recent submissions from same IP
                const recentSubmissions = await req.payload.count({
                  collection: 'form-submissions',
                  where: {
                    and: [
                      { form: { equals: doc.form } },
                      { createdAt: { greater_than: cutoffTime.toISOString() } },
                      // Note: IP tracking would need to be added to form-submissions collection
                    ],
                  },
                  req,
                })

                if (recentSubmissions.totalDocs >= maxSubmissions) {
                  req.payload.logger.warn(`Rate limit exceeded for form: ${form.title || form.id}`)
                }
              }
            } catch (error) {
              // Log error but don't fail the submission
              req.payload.logger.error(`Error processing form submission: ${error}`)
            }

            return doc
          },
        ],
      },
    },
  }),
]
