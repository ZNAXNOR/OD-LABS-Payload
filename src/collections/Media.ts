import type { CollectionConfig } from 'payload'

import {
  FixedToolbarFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import path from 'path'
import { fileURLToPath } from 'url'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export const Media: CollectionConfig = {
  slug: 'media',
  folders: true,
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  hooks: {
    beforeValidate: [
      ({ req }) => {
        const file = req.file
        if (file) {
          const allowedMimeTypes = [
            'image/png',
            'image/jpeg',
            'image/webp',
            'image/gif',
            'image/svg+xml',
          ]
          const maxFileSize = 5 * 1024 * 1024 // 5MB

          if (!allowedMimeTypes.includes(file.mimetype)) {
            throw new Error(
              `Invalid file type: ${file.mimetype}. Only PNG, JPEG, WEBP, GIF, and SVG files are allowed.`,
            )
          }

          if (file.size > maxFileSize) {
            throw new Error(`File size cannot exceed 5MB.`)
          }
        }
      },
    ],
  },
  fields: [
    {
      name: 'isDecorative',
      type: 'checkbox',
      label: 'Is this image decorative?',
      defaultValue: false,
      admin: {
        description:
          'Check this box if the image is purely for decoration and does not convey any information.',
      },
    },
    {
      name: 'alt',
      type: 'text',
      required: ({ data }) => !data?.isDecorative,
      admin: {
        description: 'Essential for accessibility and SEO. Describes the image for screen readers.',
        condition: ({ data }) => !data?.isDecorative,
      },
    },
    {
      name: 'caption',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [...rootFeatures, FixedToolbarFeature(), InlineToolbarFeature()]
        },
      }),
    },
  ],
  upload: {
    // Upload to the public/media directory in Next.js making them publicly accessible even outside of Payload
    staticDir: path.resolve(dirname, '../../public/media'),
    adminThumbnail: 'thumbnail',
    focalPoint: true,
    imageSizes: [
      {
        name: 'thumbnail',
        width: 300,
      },
      {
        name: 'square',
        width: 500,
        height: 500,
      },
      {
        name: 'small',
        width: 600,
      },
      {
        name: 'medium',
        width: 900,
      },
      {
        name: 'large',
        width: 1400,
      },
      {
        name: 'xlarge',
        width: 1920,
      },
      {
        name: 'og',
        width: 1200,
        height: 630,
        crop: 'center',
      },
    ],
  },
}
