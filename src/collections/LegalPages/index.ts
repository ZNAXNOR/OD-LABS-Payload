import type { CollectionConfig } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  HorizontalRuleFeature,
  InlineToolbarFeature,
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
                  name: 'scriptURL',
                  label: 'Script URL',
                  type: 'text',
                  required: true,
                  validate: (value) => {
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
                  name: 'scriptID',
                  label: 'Script ID',
                  type: 'text',
                  admin: {
                    description: 'Optional HTML id for the script element.',
                  },
                },
                {
                  name: 'scriptAttributes',
                  type: 'array',
                  admin: {
                    description:
                      'Optional script attributes. Use data-* attributes, async, defer, type, or crossorigin. Do not include src or event-handler attributes.',
                    initCollapsed: true,
                  },
                  fields: [
                    {
                      name: 'name',
                      type: 'text',
                      required: true,
                      admin: {
                        width: '50%',
                      },
                      validate: (value) =>
                        value && /^(data-[a-z0-9_-]+|async|defer|type|crossorigin)$/i.test(value)
                          ? true
                          : 'Use a data-* attribute, async, defer, type, or crossorigin.',
                    },
                    {
                      name: 'value',
                      type: 'text',
                      admin: {
                        width: '50%',
                        description: 'For boolean attributes such as async, use true.',
                      },
                    },
                  ],
                },
                {
                  name: 'containerID',
                  label: 'Container ID',
                  type: 'text',
                },
                {
                  name: 'containerClass',
                  label: 'Container CSS Class',
                  type: 'text',
                  admin: {
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
