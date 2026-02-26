import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'
import { authenticatedOrPublished } from '../../access/authenticatedOrPublished'
import { hero } from '@/heros/config'
import { slugField } from 'payload'
import { populatePublishedAt } from '../../hooks/populatePublishedAt'
import { generatePreviewPath } from '../../utilities/generatePreviewPath'
import { revalidateDelete, revalidatePage } from './hooks/revalidatePage'

import { standardConfig } from './Standard/config'
import { serviceContentTab, serviceMetaFields } from './Service/config'
import { legalContentTab, legalMetaFields } from './Legal/config'

import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'

export const Pages: CollectionConfig<'pages'> = {
  slug: 'pages',
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  // This config controls what's populated by default when a page is referenced
  // https://payloadcms.com/docs/queries/select#defaultpopulate-collection-config-property
  // Type safe if the collection slug generic is passed to `CollectionConfig` - `CollectionConfig<'pages'>
  defaultPopulate: {
    title: true,
    slug: true,
    meta: {
      image: true,
      description: true,
    },
    pageType: true,
    icon: true,
    shortDescription: true,
    companyInfo: true,
  },
  admin: {
    defaultColumns: ['title', 'slug', 'updatedAt'],
    livePreview: {
      url: async ({ data, req }) => {
        const pageTypeSlug = typeof data?.pageType === 'string' ? data.pageType : 'standard'

        const path = generatePreviewPath({
          slug: typeof data?.slug === 'string' ? data.slug : '',
          collection: 'pages',
          req,
          pageType: pageTypeSlug,
        })

        return path
      },
    },
    preview: async (data, { req }) => {
      const pageTypeSlug = typeof data?.pageType === 'string' ? data.pageType : 'standard'

      return generatePreviewPath({
        slug: typeof data?.slug === 'string' ? data.slug : '',
        collection: 'pages',
        req,
        pageType: pageTypeSlug,
      })
    },
    useAsTitle: 'title',
  },

  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
          admin: {
            width: '55%',
          },
        },
        {
          name: 'pageType',
          label: 'Page Type',
          type: 'select',
          defaultValue: 'standard',
          options: [
            { label: 'Standard', value: 'standard' },
            { label: 'Services', value: 'services' },
            { label: 'Legal', value: 'legal' },
            { label: 'Contact', value: 'contact' },
          ],
          required: true,
          admin: {
            width: '45%',
          },
        },
      ],
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Hero',
          fields: [...hero],
          admin: {
            condition: (data) => data?.pageType === 'standard' || data?.pageType === 'services',
          },
        },
        standardConfig,
        serviceContentTab,
        legalContentTab,
        {
          label: 'Meta',
          fields: [
            {
              name: 'icon',
              type: 'upload',
              relationTo: 'media',
              label: 'Page Icon (for references)',
            },
            {
              name: 'shortDescription',
              type: 'text',
              label: 'Page Reference Description',
              admin: {
                description: 'A short description shown when this page is referenced.',
              },
              minLength: 5,
              maxLength: 60,
            },
            ...(serviceMetaFields as any),
            ...(legalMetaFields as any),
          ],
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
            MetaTitleField({
              hasGenerateFn: true,
            }),
            MetaImageField({
              relationTo: 'media',
            }),

            MetaDescriptionField({}),
            PreviewField({
              // if the `generateUrl` function is configured
              hasGenerateFn: true,

              // field paths to match the target field for data
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
            }),
          ],
        },
      ],
    },

    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
      },
    },
    slugField(),
  ],
  hooks: {
    afterChange: [revalidatePage],
    beforeChange: [populatePublishedAt],
    afterDelete: [revalidateDelete],
  },
  versions: {
    drafts: {
      autosave: {
        interval: 100, // We set this interval for optimal live preview
      },
      schedulePublish: true,
    },
    maxPerDoc: 50,
  },
}
