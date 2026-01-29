import { UploadFeature, type UploadFeatureProps } from '@payloadcms/richtext-lexical'
import type { CollectionSlug } from 'payload'
import { minimalRichText } from '@/fields/richTextFeatures'

// ============================================================================
// MEDIA FEATURE CONFIGURATIONS
// ============================================================================

/**
 * Basic upload feature for images
 */
export const basicImageUploadFeature = UploadFeature({
  collections: {
    media: {
      fields: [
        {
          name: 'alt',
          type: 'text',
          required: true,
          label: 'Alt Text',
        },
        {
          name: 'caption',
          type: 'richText',
          label: 'Caption',
          editor: minimalRichText,
        },
      ],
    },
  },
})

/**
 * Enhanced upload feature with multiple media types
 */
export const enhancedMediaUploadFeature = UploadFeature({
  collections: {
    media: {
      fields: [
        {
          name: 'alt',
          type: 'text',
          required: true,
          label: 'Alt Text',
          admin: {
            description: 'Describe the image for screen readers and SEO',
          },
        },
        {
          name: 'caption',
          type: 'richText',
          label: 'Caption',
          admin: {
            description: 'Optional caption displayed below the image',
          },
          editor: minimalRichText,
        },
        {
          name: 'credit',
          type: 'text',
          label: 'Photo Credit',
          admin: {
            description: 'Attribution for the image source',
          },
        },
        {
          type: 'collapsible',
          label: 'Display Options',
          admin: {
            initCollapsed: true,
          },
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'alignment',
                  type: 'select',
                  label: 'Alignment',
                  options: [
                    { label: 'Left', value: 'left' },
                    { label: 'Center', value: 'center' },
                    { label: 'Right', value: 'right' },
                    { label: 'Full Width', value: 'full' },
                  ],
                  defaultValue: 'center',
                  admin: {
                    width: '50%',
                  },
                },
                {
                  name: 'size',
                  type: 'select',
                  label: 'Size',
                  options: [
                    { label: 'Small', value: 'small' },
                    { label: 'Medium', value: 'medium' },
                    { label: 'Large', value: 'large' },
                    { label: 'Original', value: 'original' },
                  ],
                  defaultValue: 'medium',
                  admin: {
                    width: '50%',
                  },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'enableZoom',
                  type: 'checkbox',
                  label: 'Enable Zoom',
                  admin: {
                    width: '33%',
                    description: 'Allow users to click to zoom',
                  },
                },
                {
                  name: 'enableLightbox',
                  type: 'checkbox',
                  label: 'Enable Lightbox',
                  admin: {
                    width: '33%',
                    description: 'Open in lightbox overlay',
                  },
                },
                {
                  name: 'lazyLoad',
                  type: 'checkbox',
                  label: 'Lazy Load',
                  defaultValue: true,
                  admin: {
                    width: '34%',
                    description: 'Load image when visible',
                  },
                },
              ],
            },
          ],
        },
      ],
    },
  },
})

/**
 * Gallery upload feature for multiple images
 */
export const galleryUploadFeature = UploadFeature({
  collections: {
    media: {
      fields: [
        {
          name: 'alt',
          type: 'text',
          required: true,
          label: 'Alt Text',
        },
        {
          name: 'caption',
          type: 'richText',
          label: 'Caption',
          editor: minimalRichText,
        },
        {
          name: 'gallerySettings',
          type: 'group',
          label: 'Gallery Settings',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'columns',
                  type: 'select',
                  label: 'Columns',
                  options: [
                    { label: '1 Column', value: '1' },
                    { label: '2 Columns', value: '2' },
                    { label: '3 Columns', value: '3' },
                    { label: '4 Columns', value: '4' },
                  ],
                  defaultValue: '3',
                  admin: {
                    width: '50%',
                  },
                },
                {
                  name: 'aspectRatio',
                  type: 'select',
                  label: 'Aspect Ratio',
                  options: [
                    { label: 'Square', value: 'square' },
                    { label: '16:9', value: '16-9' },
                    { label: '4:3', value: '4-3' },
                    { label: 'Original', value: 'original' },
                  ],
                  defaultValue: 'square',
                  admin: {
                    width: '50%',
                  },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'gap',
                  type: 'select',
                  label: 'Gap',
                  options: [
                    { label: 'None', value: 'none' },
                    { label: 'Small', value: 'small' },
                    { label: 'Medium', value: 'medium' },
                    { label: 'Large', value: 'large' },
                  ],
                  defaultValue: 'medium',
                  admin: {
                    width: '50%',
                  },
                },
                {
                  name: 'enableLightbox',
                  type: 'checkbox',
                  label: 'Enable Lightbox',
                  defaultValue: true,
                  admin: {
                    width: '50%',
                  },
                },
              ],
            },
          ],
        },
      ],
    },
  },
})

/**
 * Video upload feature with video-specific options
 */
export const videoUploadFeature = UploadFeature({
  collections: {
    media: {
      fields: [
        {
          name: 'alt',
          type: 'text',
          label: 'Video Description',
          admin: {
            description: 'Describe the video content for accessibility',
          },
        },
        {
          name: 'caption',
          type: 'richText',
          label: 'Caption',
          editor: minimalRichText,
        },
        {
          name: 'videoSettings',
          type: 'group',
          label: 'Video Settings',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'autoplay',
                  type: 'checkbox',
                  label: 'Autoplay',
                  admin: {
                    width: '25%',
                    description: 'Start playing automatically',
                  },
                },
                {
                  name: 'controls',
                  type: 'checkbox',
                  label: 'Show Controls',
                  defaultValue: true,
                  admin: {
                    width: '25%',
                  },
                },
                {
                  name: 'muted',
                  type: 'checkbox',
                  label: 'Muted',
                  admin: {
                    width: '25%',
                    description: 'Start muted (required for autoplay)',
                  },
                },
                {
                  name: 'loop',
                  type: 'checkbox',
                  label: 'Loop',
                  admin: {
                    width: '25%',
                  },
                },
              ],
            },
            {
              name: 'poster',
              type: 'upload',
              relationTo: 'media',
              label: 'Poster Image',
              admin: {
                description: 'Thumbnail image shown before video plays',
              },
              filterOptions: {
                mimeType: { contains: 'image' },
              },
            },
          ],
        },
      ],
    },
  },
})

/**
 * File attachment feature for downloadable files
 */
export const fileAttachmentFeature = UploadFeature({
  collections: {
    media: {
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'File Title',
          admin: {
            description: 'Display name for the file',
          },
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Description',
          admin: {
            description: 'Brief description of the file content',
          },
        },
        {
          name: 'fileSettings',
          type: 'group',
          label: 'File Settings',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'showIcon',
                  type: 'checkbox',
                  label: 'Show File Icon',
                  defaultValue: true,
                  admin: {
                    width: '33%',
                  },
                },
                {
                  name: 'showSize',
                  type: 'checkbox',
                  label: 'Show File Size',
                  defaultValue: true,
                  admin: {
                    width: '33%',
                  },
                },
                {
                  name: 'showType',
                  type: 'checkbox',
                  label: 'Show File Type',
                  defaultValue: true,
                  admin: {
                    width: '34%',
                  },
                },
              ],
            },
            {
              name: 'downloadText',
              type: 'text',
              label: 'Download Button Text',
              defaultValue: 'Download',
            },
          ],
        },
      ],
    },
  },
})

// ============================================================================
// DRAG AND DROP CONFIGURATION
// ============================================================================

/**
 * Drag and drop upload feature with enhanced settings
 */
export const dragDropUploadFeature = UploadFeature({
  collections: {
    media: {
      fields: [
        {
          name: 'alt',
          type: 'text',
          required: true,
          label: 'Alt Text',
        },
        {
          name: 'caption',
          type: 'richText',
          label: 'Caption',
          editor: minimalRichText,
        },
        {
          name: 'uploadSettings',
          type: 'group',
          label: 'Upload Settings',
          admin: {
            condition: () => false, // Hide from UI, used for configuration
          },
          fields: [
            {
              name: 'acceptedTypes',
              type: 'select',
              hasMany: true,
              label: 'Accepted File Types',
              options: [
                { label: 'Images', value: 'image/*' },
                { label: 'Videos', value: 'video/*' },
                { label: 'Audio', value: 'audio/*' },
                { label: 'Documents', value: 'application/pdf' },
                { label: 'Text Files', value: 'text/*' },
              ],
              defaultValue: ['image/*'],
            },
            {
              name: 'maxSize',
              type: 'number',
              label: 'Max File Size (MB)',
              defaultValue: 10,
            },
            {
              name: 'enableDragDrop',
              type: 'checkbox',
              label: 'Enable Drag & Drop',
              defaultValue: true,
            },
          ],
        },
      ],
    },
  },
})

// ============================================================================
// RESPONSIVE MEDIA FEATURES
// ============================================================================

/**
 * Responsive media upload feature with device-specific settings
 */
export const responsiveMediaFeature = UploadFeature({
  collections: {
    media: {
      fields: [
        {
          name: 'alt',
          type: 'text',
          required: true,
          label: 'Alt Text',
        },
        {
          name: 'caption',
          type: 'richText',
          label: 'Caption',
          editor: minimalRichText,
        },
        {
          name: 'responsiveSettings',
          type: 'group',
          label: 'Responsive Settings',
          fields: [
            {
              type: 'collapsible',
              label: 'Mobile Settings',
              admin: {
                initCollapsed: true,
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'mobileSize',
                      type: 'select',
                      label: 'Size',
                      options: [
                        { label: 'Small', value: 'small' },
                        { label: 'Medium', value: 'medium' },
                        { label: 'Large', value: 'large' },
                        { label: 'Full Width', value: 'full' },
                      ],
                      defaultValue: 'full',
                      admin: {
                        width: '50%',
                      },
                    },
                    {
                      name: 'mobileAlignment',
                      type: 'select',
                      label: 'Alignment',
                      options: [
                        { label: 'Left', value: 'left' },
                        { label: 'Center', value: 'center' },
                        { label: 'Right', value: 'right' },
                      ],
                      defaultValue: 'center',
                      admin: {
                        width: '50%',
                      },
                    },
                  ],
                },
              ],
            },
            {
              type: 'collapsible',
              label: 'Tablet Settings',
              admin: {
                initCollapsed: true,
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'tabletSize',
                      type: 'select',
                      label: 'Size',
                      options: [
                        { label: 'Small', value: 'small' },
                        { label: 'Medium', value: 'medium' },
                        { label: 'Large', value: 'large' },
                        { label: 'Full Width', value: 'full' },
                      ],
                      defaultValue: 'large',
                      admin: {
                        width: '50%',
                      },
                    },
                    {
                      name: 'tabletAlignment',
                      type: 'select',
                      label: 'Alignment',
                      options: [
                        { label: 'Left', value: 'left' },
                        { label: 'Center', value: 'center' },
                        { label: 'Right', value: 'right' },
                      ],
                      defaultValue: 'center',
                      admin: {
                        width: '50%',
                      },
                    },
                  ],
                },
              ],
            },
            {
              type: 'collapsible',
              label: 'Desktop Settings',
              admin: {
                initCollapsed: true,
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'desktopSize',
                      type: 'select',
                      label: 'Size',
                      options: [
                        { label: 'Small', value: 'small' },
                        { label: 'Medium', value: 'medium' },
                        { label: 'Large', value: 'large' },
                        { label: 'Full Width', value: 'full' },
                      ],
                      defaultValue: 'large',
                      admin: {
                        width: '50%',
                      },
                    },
                    {
                      name: 'desktopAlignment',
                      type: 'select',
                      label: 'Alignment',
                      options: [
                        { label: 'Left', value: 'left' },
                        { label: 'Center', value: 'center' },
                        { label: 'Right', value: 'right' },
                      ],
                      defaultValue: 'center',
                      admin: {
                        width: '50%',
                      },
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  },
})

// ============================================================================
// FEATURE FACTORY FUNCTIONS
// ============================================================================

/**
 * Create a custom media upload feature with specific collections
 */
export const createMediaUploadFeature = (
  collections: CollectionSlug[],
  config?: Partial<UploadFeatureProps>,
) => {
  const collectionsConfig = collections.reduce(
    (acc, collection) => {
      acc[collection] = {
        fields: [
          {
            name: 'alt',
            type: 'text',
            required: true,
            label: 'Alt Text',
          },
          {
            name: 'caption',
            type: 'richText',
            label: 'Caption',
            editor: minimalRichText,
          },
        ],
      }
      return acc
    },
    {} as Record<string, any>,
  )

  return UploadFeature({
    collections: collectionsConfig,
    ...config,
  })
}

/**
 * Create a media feature with custom field configuration
 */
export const createCustomMediaFeature = (
  collections: CollectionSlug[],
  customFields: any[],
  config?: Partial<UploadFeatureProps>,
) => {
  const collectionsConfig = collections.reduce(
    (acc, collection) => {
      acc[collection] = {
        fields: customFields,
      }
      return acc
    },
    {} as Record<string, any>,
  )

  return UploadFeature({
    collections: collectionsConfig,
    ...config,
  })
}

// ============================================================================
// PRESET CONFIGURATIONS
// ============================================================================

/**
 * Basic media features for simple use cases
 */
export const basicMediaFeatures = [basicImageUploadFeature]

/**
 * Standard media features for most use cases
 */
export const standardMediaFeatures = [enhancedMediaUploadFeature]

/**
 * Advanced media features with all options
 */
export const advancedMediaFeatures = [
  enhancedMediaUploadFeature,
  videoUploadFeature,
  fileAttachmentFeature,
  galleryUploadFeature,
]

/**
 * Complete media features with drag & drop and responsive options
 */
export const completeMediaFeatures = [
  enhancedMediaUploadFeature,
  videoUploadFeature,
  fileAttachmentFeature,
  galleryUploadFeature,
  dragDropUploadFeature,
  responsiveMediaFeature,
]

// ============================================================================
// EXPORTS
// ============================================================================

// Export default configuration
export default standardMediaFeatures
