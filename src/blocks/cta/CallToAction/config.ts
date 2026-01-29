import type { Block } from 'payload'

import { linkGroup } from '@/fields/linkGroup'
import { contentOnlyRichText } from '@/fields/richTextFeatures'

export const CallToActionBlock: Block = {
  slug: 'cta',
  dbName: 'cta_block', // Root level optimization
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
        description:
          'Layout style: Centered (content in center), Split (content and media side-by-side), Banner (full-width with background), Card (contained with border)',
      },
    },
    {
      name: 'heading',
      type: 'text',
      required: true,
      maxLength: 120,
      validate: (value: unknown) => {
        if (!value || typeof value !== 'string' || value.trim().length === 0) {
          return 'Heading is required and cannot be empty'
        }
        if (value.trim().length < 3) {
          return 'Heading must be at least 3 characters long'
        }
        return true
      },
      admin: {
        description: 'Main heading for the CTA',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      maxLength: 300,
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
      dbName: 'bg_color', // Abbreviation + snake case
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
        description:
          'Background color scheme: Default (neutral), Primary (brand color), Dark (dark theme), Light (light theme)',
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
        description:
          'Background pattern overlay: None (solid background), Dots (dotted pattern), Grid (grid lines), Waves (wave pattern)',
      },
    },
  ],
}
