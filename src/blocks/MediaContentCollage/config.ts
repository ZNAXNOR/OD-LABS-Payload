import type { Block } from 'payload'
import { backgroundColor, Type as BackgroundColorType } from '@/fields/backgroundColor'
import { link } from '@/fields/link'
import type { Media } from '@/payload-types'

export type Image = {
  image: Media | string
}

export type Type = {
  backgroundColor: BackgroundColorType
  content: unknown
  enableCTA: boolean
  link: {
    type?: 'reference' | 'custom'
    newTab?: boolean
    reference?: {
      relationTo: 'pages' | 'posts'
      value: string | Record<string, any>
    }
    url?: string
    label?: string
    appearance?: 'default' | 'outline'
  }
  images: Image[]
}

export const MediaContentCollage: Block = {
  slug: 'media-content-collage',
  labels: {
    singular: 'Media Content Collage',
    plural: 'Media Content Collages',
  },
  fields: [
    backgroundColor,
    {
      name: 'content',
      type: 'richText',
      label: 'Content',
      required: true,
    },
    {
      name: 'enableCTA',
      label: 'Enable Call to Action',
      type: 'checkbox',
    },
    link({
      appearances: false,
      overrides: {
        admin: {
          condition: (_, siblingData) => siblingData.enableCTA,
        },
      },
    }),
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
