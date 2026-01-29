import type { Block } from 'payload'

import { contentOnlyRichText } from '@/fields/richTextFeatures'

import { linkGroup } from '../../fields/linkGroup'

export const CallToActionBlock: Block = {
  slug: 'cta',
  interfaceName: 'CallToActionBlock',
  labels: {
    plural: 'Calls to Action',
    singular: 'Call to Action',
  },
  admin: {
    group: 'CTA & Conversion',
  },
  fields: [
    {
      name: 'variant',
      type: 'select',
      defaultValue: 'centered',
      options: [
        {
          label: 'Centered',
          value: 'centered',
        },
        {
          label: 'Split',
          value: 'split',
        },
        {
          label: 'Banner',
          value: 'banner',
        },
        {
          label: 'Card',
          value: 'card',
        },
      ],
      admin: {
        description: 'Choose the layout style for the call-to-action',
      },
    },
    {
      name: 'heading',
      type: 'text',
      required: true,
      admin: {
        description: 'Main heading for the CTA',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        description: 'Optional description text',
      },
    },
    {
      name: 'richText',
      type: 'richText',
      editor: contentOnlyRichText,
      label: 'Rich Text Content',
      admin: {
        description: 'Optional rich text content for more complex CTAs',
        condition: (data) => data.variant === 'card',
      },
    },
    linkGroup({
      appearances: ['default', 'outline'],
      overrides: {
        maxRows: 3,
      },
    }),
    {
      name: 'media',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Optional background or side image',
        condition: (data) => ['split', 'banner'].includes(data.variant),
      },
    },
    {
      name: 'backgroundColor',
      type: 'select',
      defaultValue: 'default',
      options: [
        {
          label: 'Default',
          value: 'default',
        },
        {
          label: 'Primary',
          value: 'primary',
        },
        {
          label: 'Dark',
          value: 'dark',
        },
        {
          label: 'Light',
          value: 'light',
        },
      ],
      admin: {
        description: 'Background color scheme',
      },
    },
    {
      name: 'pattern',
      type: 'select',
      defaultValue: 'none',
      options: [
        {
          label: 'None',
          value: 'none',
        },
        {
          label: 'Dots',
          value: 'dots',
        },
        {
          label: 'Grid',
          value: 'grid',
        },
        {
          label: 'Waves',
          value: 'waves',
        },
      ],
      admin: {
        description: 'Optional background pattern',
      },
    },
  ],
}
