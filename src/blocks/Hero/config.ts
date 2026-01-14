import type { Block } from 'payload'
import { link } from '@/fields/link'

export const HeroBlock: Block = {
  slug: 'hero',
  interfaceName: 'HeroBlock',
  fields: [
    {
      name: 'type',
      type: 'select',
      options: [
        {
          label: 'Default',
          value: 'default',
        },
        {
          label: 'Centered',
          value: 'centered',
        },
        {
          label: 'Minimal',
          value: 'minimal',
        },
      ],
      defaultValue: 'default',
      required: true,
    },
    {
      name: 'richText',
      type: 'richText',
      required: true,
    },
    {
      name: 'media',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'links',
      type: 'array',
      fields: [link()],
    },
  ],
}
