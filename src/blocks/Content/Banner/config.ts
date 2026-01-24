import type { Block } from 'payload'
import {
  lexicalEditor,
  FixedToolbarFeature,
  InlineToolbarFeature,
} from '@payloadcms/richtext-lexical'
import {
  structuralFeatures,
  basicTextFeatures,
  alignmentFeatures,
  headingFeatures,
  listFeatures,
  enhancedLinkFeature,
} from '@/fields/richTextFeatures'

// Import rich text features

export const Banner: Block = {
  slug: 'banner',
  dbName: 'banner_block', // Root level optimization
  interfaceName: 'BannerBlock',
  labels: {
    singular: 'Banner Block',
    plural: 'Banner Blocks',
  },
  admin: {
    group: 'Content',
  },
  fields: [
    {
      name: 'style',
      type: 'select',
      defaultValue: 'info',
      options: [
        { label: 'Info', value: 'info' },
        { label: 'Warning', value: 'warning' },
        { label: 'Error', value: 'error' },
        { label: 'Success', value: 'success' },
      ],
      required: true,
    },
    {
      name: 'content',
      type: 'richText',
      label: false,
      required: true,
      admin: {
        description: 'Banner content with enhanced formatting options',
      },
      editor: lexicalEditor({
        features: ({ rootFeatures }: { rootFeatures: any[] }) => [
          FixedToolbarFeature(),
          InlineToolbarFeature(),
          ...rootFeatures,
          ...structuralFeatures,
          ...basicTextFeatures,
          ...alignmentFeatures,
          ...headingFeatures,
          ...listFeatures,
          ...enhancedLinkFeature,
        ],
      }),
      // ✅ Added field-level access control for sensitive content
      access: {
        // Only editors and admins can modify content
        update: ({ req: { user } }) => {
          if (!user) return false
          return user.roles?.some((role) => ['admin', 'editor'].includes(role)) || false
        },
      },
    },
  ],
}
