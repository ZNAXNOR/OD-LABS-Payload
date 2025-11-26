import type { Block } from 'payload'
import { backgroundColor, Type as BackgroundColorType } from '@/fields/backgroundColor'
import type { Media } from '@/payload-types'

export type Image = {
  image: Media | string
  content?: string
}

export type Type = {
  backgroundColor: BackgroundColorType
  content?: unknown
  images: Image[]
}

export const MediaGrid: Block = {
  slug: 'media-grid',
  labels: {
    singular: 'Media Grid',
    plural: 'Media Grids',
  },
  fields: [
    backgroundColor,
    {
      name: 'content',
      label: 'Content',
      type: 'richText',
    },
    {
      name: 'images',
      label: 'Images',
      type: 'array',
      minRows: 3,
      maxRows: 12,
      fields: [
        {
          type: 'upload',
          name: 'image',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'content',
          label: 'Content',
          type: 'textarea',
        },
      ],
    },
  ],
}
