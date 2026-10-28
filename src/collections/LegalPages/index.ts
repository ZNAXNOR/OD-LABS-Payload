import type { CollectionConfig } from 'payload'

import { authenticated } from '@/access/authenticated'

export const LegalPages: CollectionConfig = {
  slug: 'legal-pages',
  access: {
    create: authenticated,
    delete: authenticated,
    read: () => true,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['title', 'slug', 'contentMode', 'updatedAt'],
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
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        description: 'Optional summary used for search and social metadata.',
      },
    },
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
              validate: (value) =>
                value && /^(data-[a-z0-9_-]+|async|defer|type|crossorigin)$/i.test(value)
                  ? true
                  : 'Use a data-* attribute, async, defer, type, or crossorigin.',
            },
            {
              name: 'value',
              type: 'text',
              admin: {
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
}
