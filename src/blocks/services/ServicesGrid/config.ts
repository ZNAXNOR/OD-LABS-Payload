import { link } from '@/fields/link'
import type { Block } from 'payload'

export const ServicesGridBlock: Block = {
  slug: 'servicesGrid',
  interfaceName: 'ServicesGridBlock',
  // dbName: 'svc_grid', // Temporarily removed to fix relation inference issue
  labels: {
    singular: 'Services Grid Block',
    plural: 'Services Grid Blocks',
  },
  admin: {
    group: 'Services',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      admin: {
        description: 'Optional heading for the services section',
        placeholder: 'Our Services',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        description: 'Optional description text',
        placeholder: 'Discover what we can do for you',
      },
    },
    {
      name: 'columns',
      type: 'select',
      options: [
        { label: '2 Columns', value: '2' },
        { label: '3 Columns', value: '3' },
        { label: '4 Columns', value: '4' },
      ],
      defaultValue: '3',
      required: true,
      admin: {
        description: 'Number of columns in the grid',
      },
    },
    {
      name: 'services',
      type: 'array',
      dbName: 'services', // Keep semantic meaning - 'services' is already concise
      minRows: 1,
      maxRows: 12,
      labels: {
        singular: 'Service',
        plural: 'Services',
      },
      fields: [
        {
          name: 'icon',
          type: 'text',
          admin: {
            description: 'Lucide icon name (e.g., Code, Palette, Rocket)',
            placeholder: 'Code',
          },
        },
        {
          name: 'title',
          type: 'text',
          required: true,
          admin: {
            description: 'Service title',
            placeholder: 'Web Development',
          },
        },
        {
          name: 'description',
          type: 'textarea',
          required: true,
          admin: {
            description: 'Service description',
            placeholder: 'Build modern, responsive websites',
          },
        },
        {
          name: 'features',
          type: 'array',
          dbName: 'features', // Keep semantic meaning - prevents redundant 'service' prefix
          maxRows: 8,
          labels: {
            singular: 'Feature',
            plural: 'Features',
          },
          fields: [
            {
              name: 'feature',
              type: 'text',
              required: true,
              admin: {
                placeholder: 'Responsive design',
              },
            },
          ],
          admin: {
            description: 'List of key features for this service',
          },
        },
        {
          name: 'link',
          type: 'group',
          fields: [link({ disableLabel: false })].flat(),
          admin: {
            description: 'Optional link to service details page',
          },
        },
        {
          name: 'highlighted',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Highlight this service card',
          },
        },
      ],
      admin: {
        description: 'Add service cards to display',
      },
    },
    {
      name: 'style',
      type: 'select',
      options: [
        { label: 'Cards', value: 'cards' },
        { label: 'Minimal', value: 'minimal' },
        { label: 'Bordered', value: 'bordered' },
      ],
      defaultValue: 'cards',
      required: true,
      admin: {
        description: 'Visual style of the service cards',
      },
    },
    {
      name: 'showIcons',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Display icons on service cards',
      },
    },
    {
      name: 'ctaText',
      type: 'text',
      admin: {
        description: 'Optional call-to-action button text',
        placeholder: 'View All Services',
      },
    },
    {
      name: 'ctaLink',
      type: 'group',
      fields: [link({ disableLabel: true })].flat(),
      admin: {
        description: 'Link for the call-to-action button',
        condition: (data) => Boolean(data.ctaText),
      },
    },
  ],
}
