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
import MediaAltDescription from '../components/MediaAltDescription'
import { validateFile } from './Media/hooks/validateFile'

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
    beforeValidate: [validateFile],
  },
  fields: [
    {
      name: 'isDecorative',
      type: 'checkbox',
      label: 'Is this image decorative?',
      defaultValue: false,
      admin: {
        description:
          'Check this box if the image is purely decorative and does not convey any meaningful information. Decorative images will not have alt text.',
      },
    },
    {
      name: 'alt',
      type: 'text',
      required: ({ siblingData }) => {
        if (typeof siblingData?.isDecorative === 'boolean') {
          return !siblingData.isDecorative
        }
        return false // Do not require for existing documents
      },
      validate: (value, { siblingData }) => {
        // For existing documents, this validation should not run until `isDecorative` is a boolean.
        if (typeof siblingData.isDecorative !== 'boolean') {
          return true
        }

        if (siblingData.isDecorative && value) {
          return 'Alt text must be empty for decorative images.'
        }

        if (!siblingData.isDecorative && !value) {
          return 'Alt text is required for meaningful images.'
        }

        return true
      },
      admin: {
        condition: ({ isDecorative }) => !isDecorative,
        components: {
          Description: MediaAltDescription,
        },
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
      validate: (value) => {
        // value is a JSON object from the Lexical editor
        if (!value || !value.root || !value.root.children) {
          return true // No content, so it's valid
        }

        const getTextLength = (nodes: any[]): number => {
          let length = 0
          for (const node of nodes) {
            if (node.type === 'text' && typeof node.text === 'string') {
              length += node.text.length
            }
            if (node.children) {
              length += getTextLength(node.children)
            }
          }
          return length
        }

        const totalLength = getTextLength(value.root.children)

        if (totalLength > 280) {
          return `Caption must be 280 characters or less. You have entered ${totalLength} characters.`
        }

        return true
      },
      admin: {
        description:
          'A brief caption for the image. 280 characters max. This will be displayed below the image.',
      },
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
