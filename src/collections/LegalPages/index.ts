import type { CollectionConfig } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  HorizontalRuleFeature,
  InlineToolbarFeature,
  UnorderedListFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { authenticated } from '../../access/authenticated'
import { authenticatedOrPublished } from '../../access/authenticatedOrPublished'
import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'
import { slugField } from 'payload'
import { generatePreviewPath } from '../../utilities/generatePreviewPath'
import { revalidateDelete, revalidateLegalPage } from './hooks/revalidateLegalPage'

export const LegalPages: CollectionConfig<'legal-pages'> = {
  slug: 'legal-pages',
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  defaultPopulate: {
    title: true,
    slug: true,
    meta: {
      title: true,
      description: true,
    },
  },
  admin: {
    defaultColumns: ['title', 'slug', 'contentMode', 'updatedAt'],
    livePreview: {
      url: ({ data, req }) =>
        generatePreviewPath({
          slug: data?.slug,
          collection: 'legal-pages',
          req,
        }),
    },
    preview: (data, { req }) =>
      generatePreviewPath({
        slug: data?.slug as string,
        collection: 'legal-pages',
        req,
      }),
    useAsTitle: 'title',
    group: 'Content',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      type: 'tabs',
      tabs: [
        {
          fields: [
            {
              name: 'contentMode',
              type: 'radio',
              required: true,
              defaultValue: 'richText',
              options: [
                { label: 'Rich Text', value: 'richText' },
                { label: 'External Embed', value: 'externalEmbed' },
              ],
              admin: {
                layout: 'horizontal',
              },
            },
            {
              name: 'content',
              type: 'richText',
              editor: lexicalEditor({
                features: ({ rootFeatures }) => [
                  ...rootFeatures,
                  HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
                  UnorderedListFeature(),
                  FixedToolbarFeature(),
                  InlineToolbarFeature(),
                  HorizontalRuleFeature(),
                ],
              }),
              admin: {
                condition: (_, siblingData) => siblingData?.contentMode === 'richText',
              },
            },
            {
              name: 'embed',
              type: 'group',
              admin: {
                condition: (_, siblingData) => siblingData?.contentMode === 'externalEmbed',
              },
              fields: [
                {
                  name: 'preset',
                  label: 'Embed Preset',
                  type: 'select',
                  defaultValue: 'custom',
                  options: [
                    { label: 'Cookiebot (UC + Declaration)', value: 'cookiebot' },
                    { label: 'Usercentrics Privacy Policy', value: 'usercentrics' },
                    { label: 'Custom Scripts & Container', value: 'custom' },
                  ],
                },
                // Cookiebot Preset Fields
                {
                  name: 'cookiebotDomainGroupID',
                  label: 'Cookiebot Domain Group ID (CBID)',
                  type: 'text',
                  admin: {
                    condition: (_, siblingData) => siblingData?.preset === 'cookiebot',
                    description: 'e.g. a6dbdbc7-4e29-4581-8033-e195c7bb3d0b',
                  },
                },
                {
                  name: 'cookiebotBlockingMode',
                  label: 'Blocking Mode',
                  type: 'select',
                  defaultValue: 'auto',
                  options: [
                    { label: 'Auto', value: 'auto' },
                    { label: 'Manual', value: 'manual' },
                  ],
                  admin: {
                    condition: (_, siblingData) => siblingData?.preset === 'cookiebot',
                  },
                },
                // Usercentrics Preset Fields
                {
                  name: 'usercentricsPrivacyPolicyID',
                  label: 'Privacy Policy ID',
                  type: 'text',
                  admin: {
                    condition: (_, siblingData) => siblingData?.preset === 'usercentrics',
                    description: 'e.g. bb7dc8b9-fa9a-4ce5-8af5-646cff58b79a',
                  },
                },
                {
                  name: 'usercentricsLanguage',
                  label: 'Language',
                  type: 'text',
                  defaultValue: 'en',
                  admin: {
                    condition: (_, siblingData) => siblingData?.preset === 'usercentrics',
                    description: 'e.g. en, de, fr',
                  },
                },
                // Custom Embed Fields
                {
                  name: 'scripts',
                  label: 'Scripts',
                  type: 'array',
                  labels: {
                    singular: 'Script',
                    plural: 'Scripts',
                  },
                  admin: {
                    condition: (_, siblingData) => siblingData?.preset === 'custom',
                    initCollapsed: false,
                  },
                  fields: [
                    {
                      name: 'src',
                      label: 'Script URL (src)',
                      type: 'text',
                      required: true,
                      validate: (value: any) => {
                        if (!value) return 'A script URL is required.'
                        try {
                          const url = new URL(value)
                          return url.protocol === 'https:' || 'Use an HTTPS script URL.'
                        } catch {
                          return 'Enter a valid script URL.'
                        }
                      },
                    },
                    {
                      name: 'id',
                      label: 'Script ID',
                      type: 'text',
                      admin: {
                        description: 'Optional HTML id attribute for the script tag.',
                      },
                    },
                    {
                      name: 'attributes',
                      label: 'Script Attributes',
                      type: 'array',
                      admin: {
                        description: 'Key-value attributes (e.g. data-cbid, privacy-policy-id, async, type).',
                        initCollapsed: true,
                      },
                      fields: [
                        {
                          name: 'name',
                          label: 'Attribute Name',
                          type: 'text',
                          required: true,
                          admin: {
                            width: '50%',
                          },
                          validate: (value: any) => {
                            if (!value) return 'Attribute name is required.'
                            const trimmed = value.trim()
                            if (/^on[a-z]+/i.test(trimmed)) {
                              return 'Event handler attributes (on*) are not allowed for security.'
                            }
                            if (!/^[a-zA-Z0-9_\-:]+$/i.test(trimmed)) {
                              return 'Enter a valid HTML attribute name.'
                            }
                            return true
                          },
                        },
                        {
                          name: 'value',
                          label: 'Attribute Value',
                          type: 'text',
                          admin: {
                            width: '50%',
                            description: 'Value for attribute, or "true" / blank for boolean flags.',
                          },
                        },
                      ],
                    },
                  ],
                },
                {
                  name: 'containerID',
                  label: 'Container ID',
                  type: 'text',
                  admin: {
                    condition: (_, siblingData) => siblingData?.preset === 'custom',
                  },
                },
                {
                  name: 'containerClass',
                  label: 'Container CSS Class',
                  type: 'text',
                  admin: {
                    condition: (_, siblingData) => siblingData?.preset === 'custom',
                    description: 'For example: uc-privacy-policy',
                  },
                },
              ],
            },
          ],
          label: 'Content',
        },
        {
          name: 'meta',
          label: 'SEO',
          fields: [
            OverviewField({
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
              imagePath: 'meta.image',
            }),
            MetaTitleField({ hasGenerateFn: true }),
            MetaImageField({ relationTo: 'media' }),
            MetaDescriptionField({}),
            PreviewField({
              hasGenerateFn: true,
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
            }),
          ],
        },
      ],
    },
    slugField(),
    {
      name: 'scriptPreview',
      type: 'ui',
      admin: {
        position: 'sidebar',
        components: {
          Field: '@/components/LegalScriptPreview',
        },
      },
    },
  ],
  hooks: {
    afterChange: [revalidateLegalPage],
    afterDelete: [revalidateDelete],
  },
  versions: {
    drafts: {
      autosave: {
        interval: 100,
      },
      schedulePublish: true,
    },
    maxPerDoc: 50,
  },
}
