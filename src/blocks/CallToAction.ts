import type { Block } from 'payload'
import { link } from '@/fields/link'

export const CallToAction: Block = {
  slug: 'cta',
  interfaceName: 'CallToActionBlock',
  fields: [
    {
      name: 'richText',
      type: 'richText',
      required: true,
    },
    {
      name: 'links',
      type: 'array',
      fields: [link()],
    },
  ],
}
