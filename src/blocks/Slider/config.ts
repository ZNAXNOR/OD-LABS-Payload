import type { Block } from 'payload'
import { backgroundColor, Type as BackgroundColorType } from '@/fields/backgroundColor'
import type { Media } from '@/payload-types'

export type Image = {
  image: Media | string
}

export type Type = {
  backgroundColor: BackgroundColorType
  images: Image[]
}

export const Slider: Block = {
  slug: 'slider',
  labels: {
    singular: 'Slider',
    plural: 'Sliders',
  },
  fields: [
    backgroundColor,
    {
      name: 'images',
      label: 'Images',
      type: 'array',
      minRows: 3,
      maxRows: 9,
      fields: [
        {
          type: 'upload',
          name: 'image',
          relationTo: 'media',
          required: true,
        },
      ],
    },
  ],
}
