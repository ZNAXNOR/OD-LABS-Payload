import type { Block } from 'payload'
import { stat, Type as StatType } from '@/fields/stat'
import type { Media } from '@/payload-types'

export type Image = {
  image: Media | string
}

export type Type = {
  images: Image[]
  stats: StatType[]
}

export const MediaStatCollage: Block = {
  slug: 'media-stat-collage',
  interfaceName: 'MediaStatCollageBlock',
  labels: {
    singular: 'Media Stat Collage',
    plural: 'Media Stat Collages',
  },
  fields: [
    {
      name: 'stats',
      label: 'Statistics',
      type: 'array',
      minRows: 1,
      maxRows: 3,
      fields: [stat],
    },
    {
      name: 'images',
      label: 'Images',
      type: 'array',
      minRows: 3,
      maxRows: 6,
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
