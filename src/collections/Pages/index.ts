import type { CollectionConfig } from 'payload'

// Import only the blocks that definitely exist
import { CallToActionBlock } from '../../blocks/CallToAction/config'
import { Code } from '../../blocks/Code/config'
import { HeroBlock } from '../../blocks/Hero/config'

// Import hooks
import { createAuditTrailHook } from '../../pages/shared/hooks/createAuditTrailHook'
import { createRevalidateHook } from '../../pages/shared/hooks/createRevalidateHook'
import { createSlugGenerationHook, validateSlugFormat } from '../../utilities/slugGeneration'
import { generatePageUrl, regenerateChildUrls } from './hooks/generatePageUrl'
import { populateBreadcrumbs } from './hooks/populateBreadcrumbs'

// Import shared fields
import { auditFields } from '../../pages/shared/fields/auditFields'

// Import validation
import { createCircularReferenceValidator } from '../../pages/shared/validation/circularReference'
import {
  validateDateField,
  validateFormRelations,
  validateNotificationSettings,
  validatePricingConfiguration,
  validateSlugUniqueness,
  validateTextLength,
} from '../../pages/shared/validation/fieldValidation'
import {
  validateBlogRequiredFields,
  validateBlogTags,
  validateContactRequiredFields,
  validateLegalRequiredFields,
  validatePageContentCompleteness,
  validatePageTypeBlocks,
  validatePageTypeHierarchy,
  validatePublishDateConsistency,
  validateServiceRequiredFields,
} from '../../pages/shared/validation/pageTypeValidation'

// Import access control functions
import { authenticatedOrPublished } from '../../access/authenticatedOrPublished'
import { adminAccess, authorAccess, ownerOrAdminAccess } from '../../access/collections/shared'

// Import live preview utilities
import {
  generateContextualPreviewUrl,
  generateHierarchicalPreviewUrl,
  generatePageTypePreviewUrl,
} from '../../utilities/livePreview'

// Import preview configuration manager
import { getConsolidatedBreakpoints } from '../../utilities/previewConfigManager'

export const Pages: CollectionConfig = {
  slug: 'pages',
  typescript: {
    interface: 'Page',
  },
  labels: {
    singular: 'Page',
    plural: 'Pages',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'pageType', 'slug', '_status', 'updatedAt'],
    group: 'Content',
    description:
      'Unified collection for all page types including blogs, services, legal documents, and contact pages',
    // Custom list view components
    components: {
      beforeList: ['@/components/admin/PageTypeFilter'],
      edit: {
        SaveButton: '@/components/admin/PagesSaveButton',
        PreviewButton: '@/components/admin/PagesPreviewButton',
      },
    },
    // Enhanced pagination for large datasets
    pagination: {
      defaultLimit: 25,
      limits: [10, 25, 50, 100],
    },
    // Custom sorting options
    listSearchableFields: ['title', 'slug', 'pageType'],
    livePreview: {
      url: async ({ data, locale, req }) => {
        // Enhanced preview URL generation with hierarchical support
        const token = req?.user ? `user_${req.user.id}_${Date.now()}` : undefined

        // Use hierarchical URL generation for nested pages
        try {
          const hierarchicalUrl = await generateHierarchicalPreviewUrl(
            data,
            (locale as unknown as string) || 'en',
            req?.payload,
          )

          // Add authentication and context for draft content
          if (data?._status === 'draft' || token) {
            return generateContextualPreviewUrl(data, (locale as unknown as string) || 'en', {
              user: req?.user,
              collection: 'pages',
              operation: 'preview',
            })
          }

          return hierarchicalUrl
        } catch (error) {
          console.warn('[Pages livePreview] Fallback to page type URL generation:', error)

          // Fallback to page type-specific URL generation
          return generatePageTypePreviewUrl(
            data,
            data?.pageType || 'page',
            (locale as unknown as string) || 'en',
            {
              token,
              requireAuth: data?._status === 'draft',
              customParams: {
                collection: 'pages',
                timestamp: Date.now().toString(),
              },
            },
          )
        }
      },
      // Enable live preview for all page types with consolidated breakpoints
      breakpoints: getConsolidatedBreakpoints(),
    },
  },
  access: {
    // Create: Authors and above can create pages
    create: authorAccess,

    // Read: Authenticated users see all, public sees only published
    read: authenticatedOrPublished,

    // Update: Admins can update all, authors can update their own content
    update: ownerOrAdminAccess,

    // Delete: Only admins can delete pages (to prevent accidental data loss)
    delete: adminAccess,

    // Admin panel visibility: Authors and above can see the collection
    admin: ({ req: { user } }) => {
      return (
        user?.roles?.some((role) => ['author', 'editor', 'admin', 'super-admin'].includes(role)) ||
        false
      )
    },
  },
  timestamps: true,
  versions: {
    drafts: {
      autosave: true,
      schedulePublish: true,
      validate: false,
    },
    maxPerDoc: 100,
  },
  hooks: {
    beforeValidate: [
      createSlugGenerationHook('pages', {
        sourceField: 'title',
        enforceUniqueness: true,
        maxLength: 100,
        reservedSlugs: ['home', 'index'],
      }),
    ],
    beforeChange: [
      createAuditTrailHook(),
      populateBreadcrumbs,
      // Skip URL generation if context flag is set (prevents infinite recursion)
      async (args) => {
        if (args.req.context?.skipUrlGeneration) {
          return args.data
        }
        return await generatePageUrl(args)
      },
      // Skip child URL regeneration if context flag is set
      async (args) => {
        if (args.req.context?.skipChildUrlRegeneration) {
          return args.data
        }
        return await regenerateChildUrls(args)
      },
    ],
    afterChange: [
      createRevalidateHook('pages', {
        getRevalidationPaths: (doc) => {
          const paths = [doc.url || `/${doc.slug}`]

          // Add pageType-specific paths
          switch (doc.pageType) {
            case 'blog':
              paths.push('/blog', `/blog/${doc.slug}`)
              break
            case 'service':
              paths.push('/services', `/services/${doc.slug}`)
              break
            case 'legal':
              paths.push('/legal', `/legal/${doc.slug}`)
              break
            case 'contact':
              paths.push('/contact', `/contact/${doc.slug}`)
              break
            default:
              // Regular page - just the slug path
              break
          }

          return paths
        },
      }),
    ],
  },
  fields: [
    // Core discriminator field - must be first for proper conditional rendering
    {
      name: 'pageType',
      type: 'select',
      options: [
        {
          label: 'Page',
          value: 'page',
        },
        {
          label: 'Blog Post',
          value: 'blog',
        },
        {
          label: 'Service',
          value: 'service',
        },
        {
          label: 'Legal Document',
          value: 'legal',
        },
        {
          label: 'Contact Page',
          value: 'contact',
        },
      ],
      defaultValue: 'page',
      required: true,
      admin: {
        position: 'sidebar',
        description:
          'Select the type of page you want to create. This determines which fields are available and how the page behaves on your website. Choose "Page" for general content, "Blog Post" for articles, "Service" for service descriptions, "Legal Document" for policies and terms, or "Contact Page" for contact forms and information.',
        components: {
          Field: '@/components/admin/PageTypeSelector',
          Cell: '@/components/admin/SafeSelectCell',
        },
      },
      access: {
        // Only editors and above can change page types after creation
        update: ({ req: { user } }) => {
          return (
            user?.roles?.some((role) => ['editor', 'admin', 'super-admin'].includes(role)) || false
          )
        },
      },
    },

    // Universal title field
    {
      name: 'title',
      type: 'text',
      required: true,
      minLength: 1,
      maxLength: 200,
      admin: {
        description: 'The main title of the page (1-200 characters)',
      },
      validate: validateTextLength('Title', {
        minLength: 1,
        maxLength: 200,
        required: true,
        allowEmpty: false,
      }),
    },

    // Tab structure for content organization
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          description: 'Main page content and layout blocks',
          fields: [
            {
              name: 'layout',
              type: 'blocks',
              label: 'Page Layout',
              blocks: [
                // Only include blocks that definitely exist
                HeroBlock,
                CallToActionBlock,
                Code,
              ],
              admin: {
                description:
                  'Build your page layout using content blocks. Each block serves a specific purpose and can be customized with its own content and styling options.',
              },
              validate: (value, options) => {
                const blockValidation = validatePageTypeBlocks(value, options)
                if (blockValidation !== true) return blockValidation

                const contentValidation = validatePageContentCompleteness(value, options)
                if (contentValidation !== true) return contentValidation

                return true
              },
            },
          ],
        },
        {
          label: 'Configuration',
          description: 'Page-type specific configuration fields',
          fields: [
            // Blog-specific configuration
            {
              type: 'group',
              name: 'blogConfig',
              label: 'Blog Configuration',
              admin: {
                condition: (data) => data.pageType === 'blog',
                description:
                  'Configuration specific to blog posts. These fields help organize and display your blog content effectively.',
              },
              validate: validateBlogRequiredFields,
              fields: [
                {
                  name: 'author',
                  type: 'relationship',
                  relationTo: 'users',
                  index: true,
                  label: 'Blog Author',
                  admin: {
                    description:
                      'Select the author of this blog post. If not specified, the current user will be automatically assigned as the author. Only administrators can change the author after creation.',
                  },
                  access: {
                    // Only admins can change the author field, others get auto-assigned
                    update: ({ req: { user } }) => {
                      return (
                        user?.roles?.some((role) => ['admin', 'super-admin'].includes(role)) ||
                        false
                      )
                    },
                  },
                  hooks: {
                    beforeChange: [
                      ({ value, req, operation }) => {
                        if (operation === 'create' && !value && req.user) {
                          return req.user.id
                        }
                        return value
                      },
                    ],
                  },
                },
                {
                  name: 'tags',
                  type: 'array',
                  label: 'Blog Tags',
                  admin: {
                    description:
                      'Add tags to categorize this blog post. Tags help readers find related content and improve SEO. Each tag should be 1-50 characters long.',
                  },
                  validate: validateBlogTags,
                  fields: [
                    {
                      name: 'tag',
                      type: 'text',
                      required: true,
                      label: 'Tag Name',
                      admin: {
                        placeholder: 'Enter a tag (e.g., "JavaScript", "Tutorial", "News")',
                        description: 'A single tag for categorizing this blog post',
                      },
                      validate: validateTextLength('Tag', {
                        minLength: 1,
                        maxLength: 50,
                        required: true,
                        allowEmpty: false,
                      }),
                    },
                  ],
                },
                {
                  name: 'publishedDate',
                  type: 'date',
                  index: true,
                  label: 'Published Date',
                  admin: {
                    description:
                      'The date this blog post was first published. This will be automatically set when you publish the post for the first time. You can manually adjust it if needed.',
                    date: {
                      pickerAppearance: 'dayAndTime',
                    },
                  },
                  validate: (value, options) => {
                    const dateValidation = validateDateField('Published Date', {
                      allowFuture: false,
                      required: false,
                    })(value, options)
                    if (dateValidation !== true) return dateValidation

                    const consistencyValidation = validatePublishDateConsistency(value, options)
                    if (consistencyValidation !== true) return consistencyValidation

                    return true
                  },
                  hooks: {
                    beforeChange: [
                      ({ value, siblingData, operation }) => {
                        if (
                          operation === 'update' &&
                          siblingData._status === 'published' &&
                          !value
                        ) {
                          return new Date()
                        }
                        return value
                      },
                    ],
                  },
                },
                {
                  name: 'excerpt',
                  type: 'textarea',
                  maxLength: 300,
                  label: 'Blog Excerpt',
                  admin: {
                    description:
                      'A brief summary of the blog post content. This appears in blog listings, search results, and social media previews. Keep it engaging and informative (maximum 300 characters).',
                    placeholder: 'Write a compelling summary of your blog post...',
                  },
                  validate: validateTextLength('Excerpt', {
                    maxLength: 300,
                    required: false,
                  }),
                },
              ],
            },

            // Service-specific configuration
            {
              type: 'group',
              name: 'serviceConfig',
              label: 'Service Configuration',
              admin: {
                condition: (data) => data.pageType === 'service',
                description:
                  'Configuration specific to service pages. These settings help showcase your services with pricing, categorization, and promotional features.',
              },
              validate: validateServiceRequiredFields,
              fields: [
                {
                  name: 'pricing',
                  type: 'group',
                  label: 'Pricing Information',
                  admin: {
                    description:
                      'Set up pricing details for this service. This information will be displayed to potential clients and can be used for filtering and sorting services.',
                  },
                  validate: validatePricingConfiguration,
                  access: {
                    // Only editors and above can modify pricing information
                    update: ({ req: { user } }) => {
                      return (
                        user?.roles?.some((role) =>
                          ['editor', 'admin', 'super-admin'].includes(role),
                        ) || false
                      )
                    },
                  },
                  fields: [
                    {
                      name: 'amount',
                      type: 'number',
                      label: 'Starting Price',
                      admin: {
                        description:
                          'The starting price for this service. Leave empty if pricing is custom or varies significantly.',
                        placeholder: 'Enter amount (e.g., 1500)',
                      },
                      validate: (value: unknown) => {
                        if (value !== undefined && value !== null) {
                          if (typeof value !== 'number') {
                            return 'Amount must be a number'
                          }
                          if (value < 0) {
                            return 'Amount cannot be negative'
                          }
                          if (value > 1000000) {
                            return 'Amount cannot exceed 1,000,000'
                          }
                        }
                        return true
                      },
                    },
                    {
                      name: 'currency',
                      type: 'select',
                      label: 'Currency',
                      options: [
                        { label: 'USD ($)', value: 'USD' },
                        { label: 'EUR (€)', value: 'EUR' },
                        { label: 'GBP (£)', value: 'GBP' },
                        { label: 'INR (₹)', value: 'INR' },
                      ],
                      defaultValue: 'USD',
                      admin: {
                        description: 'Select the currency for pricing display',
                        components: {
                          Cell: '@/components/admin/SafeSelectCell',
                        },
                      },
                    },
                    {
                      name: 'period',
                      type: 'select',
                      label: 'Pricing Model',
                      options: [
                        { label: 'Fixed Price', value: 'fixed' },
                        { label: 'Hourly Rate', value: 'hourly' },
                        { label: 'Monthly Retainer', value: 'monthly' },
                        { label: 'Custom Quote', value: 'custom' },
                      ],
                      defaultValue: 'custom',
                      admin: {
                        description:
                          'How is this service priced? Choose the model that best fits your service offering.',
                        components: {
                          Cell: '@/components/admin/SafeSelectCell',
                        },
                      },
                    },
                  ],
                },
                {
                  name: 'serviceType',
                  type: 'select',
                  label: 'Service Category',
                  options: [
                    { label: 'Web Development', value: 'web-dev' },
                    { label: 'Mobile Development', value: 'mobile-dev' },
                    { label: 'UI/UX Design', value: 'design' },
                    { label: 'Consulting', value: 'consulting' },
                    { label: 'Maintenance & Support', value: 'support' },
                    { label: 'Digital Marketing', value: 'marketing' },
                    { label: 'Other', value: 'other' },
                  ],
                  index: true,
                  admin: {
                    description:
                      'Categorize this service to help clients find what they need. This affects how the service appears in filtered lists and search results.',
                    components: {
                      Cell: '@/components/admin/SafeSelectCell',
                    },
                  },
                },
                {
                  name: 'featured',
                  type: 'checkbox',
                  defaultValue: false,
                  index: true,
                  label: 'Featured Service',
                  admin: {
                    description:
                      'Mark this service as featured to highlight it on the homepage and in service listings. Only editors and administrators can set featured status.',
                  },
                  access: {
                    // Only editors and above can mark services as featured
                    update: ({ req: { user } }) => {
                      return (
                        user?.roles?.some((role) =>
                          ['editor', 'admin', 'super-admin'].includes(role),
                        ) || false
                      )
                    },
                  },
                },
              ],
            },

            // Legal-specific configuration
            {
              type: 'group',
              name: 'legalConfig',
              label: 'Legal Document Configuration',
              admin: {
                condition: (data) => data.pageType === 'legal',
                description:
                  'Configuration specific to legal documents. These settings help manage compliance, versioning, and notifications for legal content.',
              },
              validate: validateLegalRequiredFields,
              fields: [
                {
                  name: 'documentType',
                  type: 'select',
                  label: 'Document Type',
                  options: [
                    { label: 'Privacy Policy', value: 'privacy' },
                    { label: 'Terms of Service', value: 'terms' },
                    { label: 'Cookie Policy', value: 'cookies' },
                    { label: 'GDPR Compliance', value: 'gdpr' },
                    { label: 'Disclaimer', value: 'disclaimer' },
                    { label: 'License Agreement', value: 'license' },
                    { label: 'Other', value: 'other' },
                  ],
                  index: true,
                  admin: {
                    description:
                      'Select the type of legal document. This helps organize your legal content and may affect how the document is displayed or linked on your website.',
                    components: {
                      Cell: '@/components/admin/SafeSelectCell',
                    },
                  },
                },
                {
                  name: 'effectiveDate',
                  type: 'date',
                  label: 'Effective Date',
                  admin: {
                    description:
                      'The date when this legal document becomes effective. This can be in the future for scheduled policy changes. Only editors and administrators can modify effective dates.',
                    date: {
                      pickerAppearance: 'dayAndTime',
                    },
                  },
                  validate: validateDateField('Effective Date', {
                    allowFuture: true,
                    allowPast: true,
                    required: false,
                  }),
                  access: {
                    // Only editors and above can set effective dates for legal documents
                    update: ({ req: { user } }) => {
                      return (
                        user?.roles?.some((role) =>
                          ['editor', 'admin', 'super-admin'].includes(role),
                        ) || false
                      )
                    },
                  },
                },
                {
                  name: 'lastUpdated',
                  type: 'date',
                  label: 'Last Updated',
                  admin: {
                    description:
                      'The date this document was last modified. This is automatically updated whenever you save changes to the document.',
                    readOnly: true,
                    date: {
                      pickerAppearance: 'dayAndTime',
                    },
                  },
                  validate: validateDateField('Last Updated', {
                    allowFuture: false,
                    allowPast: true,
                    required: false,
                  }),
                  hooks: {
                    beforeChange: [
                      ({ operation }) => {
                        if (operation === 'update') {
                          return new Date()
                        }
                        return undefined
                      },
                    ],
                  },
                },
                {
                  name: 'notifyOnChange',
                  type: 'checkbox',
                  defaultValue: false,
                  label: 'Enable Notifications',
                  admin: {
                    description:
                      'Send email notifications to specified recipients when this document is updated. Useful for compliance and stakeholder communication.',
                  },
                  access: {
                    // Only admins can configure notification settings for legal documents
                    update: ({ req: { user } }) => {
                      return (
                        user?.roles?.some((role) => ['admin', 'super-admin'].includes(role)) ||
                        false
                      )
                    },
                  },
                },
                {
                  name: 'notificationRecipients',
                  type: 'array',
                  label: 'Notification Recipients',
                  admin: {
                    condition: (data) => data.legalConfig?.notifyOnChange,
                    description:
                      'Email addresses that will receive notifications when this document is updated. Maximum 20 recipients allowed.',
                  },
                  validate: validateNotificationSettings,
                  access: {
                    // Only admins can configure notification settings for legal documents
                    update: ({ req: { user } }) => {
                      return (
                        user?.roles?.some((role) => ['admin', 'super-admin'].includes(role)) ||
                        false
                      )
                    },
                  },
                  fields: [
                    {
                      name: 'email',
                      type: 'email',
                      required: true,
                      label: 'Email Address',
                      admin: {
                        placeholder: 'Enter email address',
                        description: 'A valid email address for notifications',
                      },
                    },
                  ],
                },
              ],
            },

            // Contact-specific configuration
            {
              type: 'group',
              name: 'contactConfig',
              label: 'Contact Page Configuration',
              admin: {
                condition: (data) => data.pageType === 'contact',
                description:
                  'Configuration specific to contact pages. These settings help organize contact forms and display appropriate contact information.',
              },
              validate: validateContactRequiredFields,
              fields: [
                {
                  name: 'purpose',
                  type: 'select',
                  label: 'Contact Purpose',
                  options: [
                    { label: 'General Inquiry', value: 'general' },
                    { label: 'Technical Support', value: 'technical' },
                    { label: 'Bug Report', value: 'bug' },
                    { label: 'Feature Request', value: 'feature' },
                    { label: 'Feedback', value: 'feedback' },
                    { label: 'Sales Inquiry', value: 'sales' },
                    { label: 'Partnership/Collaboration', value: 'partnership' },
                    { label: 'Media/Press', value: 'media' },
                    { label: 'Careers', value: 'careers' },
                    { label: 'Custom', value: 'custom' },
                  ],
                  required: true,
                  admin: {
                    description:
                      'Select the primary purpose of this contact page. This helps organize different types of inquiries and may affect form routing or display.',
                    components: {
                      Cell: '@/components/admin/SafeSelectCell',
                    },
                  },
                },
                {
                  name: 'formRelations',
                  type: 'array',
                  label: 'Related Forms',
                  admin: {
                    description:
                      "Link contact forms to this page. These forms will be available for visitors to submit inquiries related to this contact page's purpose.",
                  },
                  validate: validateFormRelations,
                  fields: [
                    {
                      name: 'form',
                      type: 'relationship',
                      relationTo: 'forms',
                      required: true,
                      label: 'Contact Form',
                      admin: {
                        description: 'Select a form to associate with this contact page',
                      },
                    },
                  ],
                },
              ],
            },
          ],
        },
        // SEO tab will be automatically added by the SEO plugin
      ],
    },

    // Sidebar fields
    {
      name: 'slug',
      type: 'text',
      unique: true,
      index: true,
      maxLength: 100,
      label: 'URL Slug',
      admin: {
        position: 'sidebar',
        description:
          'The URL-friendly identifier for this page (e.g., "about-us", "contact"). This is automatically generated from the title but can be customized. Must be unique and contain only letters, numbers, and hyphens. Maximum 100 characters.',
        placeholder: 'auto-generated-from-title',
      },
      validate: (value: unknown, options: any) => {
        if (!value) return true

        if (typeof value !== 'string') {
          return 'Slug must be a string'
        }

        if (value.length > 100) {
          return 'Slug must be 100 characters or less'
        }

        const validation = validateSlugFormat(value)
        if (!validation.isValid) {
          return validation.errors.join(', ')
        }

        const uniquenessValidation = validateSlugUniqueness(value, options)
        if (uniquenessValidation !== true) return uniquenessValidation

        return true
      },
    },

    // Generated URL field (read-only, computed from hierarchy and pageType)
    {
      name: 'url',
      type: 'text',
      index: true,
      label: 'Full URL Path',
      admin: {
        position: 'sidebar',
        readOnly: true,
        description:
          'The complete URL path for this page, automatically generated based on the page hierarchy and type. This shows how the page will appear in the browser address bar.',
      },
      access: {
        // URL field is read-only for all users - it's auto-generated
        update: () => false,
      },
    },

    // Hierarchical relationship field
    {
      name: 'parent',
      type: 'relationship',
      relationTo: 'pages',
      label: 'Parent Page',
      admin: {
        position: 'sidebar',
        description:
          'Select a parent page to create a hierarchical structure (e.g., "About" > "Our Team"). This affects the URL structure and breadcrumb navigation. Leave empty for top-level pages.',
      },
      validate: (value: unknown, options: any) => {
        const circularValidation = createCircularReferenceValidator('pages')(value, options)
        if (circularValidation !== true) return circularValidation

        const hierarchyValidation = validatePageTypeHierarchy(value, options)
        if (hierarchyValidation !== true) return hierarchyValidation

        return true
      },
      filterOptions: ({ id }) => {
        const filters: any = {}

        if (id) {
          filters.id = { not_equals: id }
        }

        return filters
      },
    },

    // Auto-generated breadcrumbs
    {
      name: 'breadcrumbs',
      type: 'array',
      label: 'Breadcrumb Navigation',
      admin: {
        position: 'sidebar',
        readOnly: true,
        description:
          'Automatically generated breadcrumb trail showing the path from the homepage to this page. This is based on the page hierarchy and cannot be edited manually.',
        components: {
          Cell: '@/components/BreadcrumbCell',
        },
      },
      access: {
        // Breadcrumbs are read-only for all users - they're auto-generated
        update: () => false,
      },
      fields: [
        {
          name: 'doc',
          type: 'relationship',
          relationTo: 'pages',
          admin: {
            readOnly: true,
          },
          access: {
            update: () => false,
          },
        },
        {
          name: 'url',
          type: 'text',
          admin: {
            readOnly: true,
          },
          access: {
            update: () => false,
          },
        },
        {
          name: 'label',
          type: 'text',
          admin: {
            readOnly: true,
          },
          access: {
            update: () => false,
          },
        },
      ],
    },

    // Audit trail fields
    ...auditFields,
  ],
}
