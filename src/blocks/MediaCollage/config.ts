import type { Block } from 'payload'

export const MediaCollage: Block = {
  slug: 'media-collage',
  interfaceName: 'MediaCollageBlock',
  labels: {
    singular: 'Media Collage',
    plural: 'Media Collages',
  },
  fields: [
    {
      name: 'media',
      label: 'Media',
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
