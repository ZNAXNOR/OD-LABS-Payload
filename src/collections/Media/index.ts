import type { CollectionConfig } from 'payload'
import { collectionTemplates } from '../templates'
import { access } from './access'
import { fields } from './fields'
import { hooks } from './hooks'

export const Media: CollectionConfig = collectionTemplates.createMediaCollection({
  slug: 'media',
  dbName: 'media', // Explicit database naming
  labels: {
    singular: 'Media',
    plural: 'Media',
  },
  fields,
  access,
  hooks,
  admin: {
    description: 'Manage images, videos, and other media files',
  },
  upload: {
    // Upload to the public/media directory in Next.js making them publicly accessible even outside of Payload
    staticDir: '@/../public/media',
    adminThumbnail: 'thumbnail',
    focalPoint: true,
    crop: true,
    formatOptions: {
      format: 'webp',
      options: {
        quality: 85,
      },
    },
    imageSizes: [
      {
        name: 'thumbnail',
        width: 300,
        height: 300,
        position: 'centre',
        formatOptions: {
          format: 'webp',
          options: { quality: 80 },
        },
      },
      {
        name: 'card',
        width: 400,
        height: 300,
        position: 'centre',
        formatOptions: {
          format: 'webp',
          options: { quality: 85 },
        },
      },
      {
        name: 'feature',
        width: 800,
        height: 600,
        position: 'centre',
        formatOptions: {
          format: 'webp',
          options: { quality: 90 },
        },
      },
      {
        name: 'hero',
        width: 1200,
        height: 630,
        position: 'centre',
        formatOptions: {
          format: 'webp',
          options: { quality: 90 },
        },
      },
      {
        name: 'og',
        width: 1200,
        height: 630,
        crop: 'center',
        formatOptions: {
          format: 'jpeg',
          options: { quality: 90 },
        },
      },
    ],
  },
})
