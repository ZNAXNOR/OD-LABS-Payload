import {
  BoldFeature,
  ItalicFeature,
  lexicalEditor,
  LinkFeature,
  ParagraphFeature,
  UnderlineFeature,
  type LinkFields,
} from '@payloadcms/richtext-lexical'
import type { TextFieldSingleValidation } from 'payload'
import { relOptions } from './link'
import {
  advancedRichText,
  basicRichText,
  comprehensiveRichText,
  richTextWithBasicBlocks,
  richTextWithContentBlocks,
  standardRichText,
} from './richTextFeatures'

export const defaultLexical = lexicalEditor({
  features: [
    ParagraphFeature(),
    UnderlineFeature(),
    BoldFeature(),
    ItalicFeature(),
    LinkFeature({
      enabledCollections: ['pages'],
      fields: ({ defaultFields }) => {
        const defaultFieldsWithoutUrl = defaultFields.filter((field) => {
          if ('name' in field && field.name === 'url') return false
          return true
        })

        return [
          ...defaultFieldsWithoutUrl,
          {
            name: 'url',
            type: 'text',
            admin: {
              condition: (_data, siblingData) => siblingData?.linkType !== 'internal',
            },
            label: ({ t }) => t('fields:enterURL'),
            required: true,
            validate: ((value, options) => {
              if ((options?.siblingData as LinkFields)?.linkType === 'internal') {
                return true // no validation needed, as no url should exist for internal links
              }
              if (!value) return 'URL is required'

              // Basic URL validation
              try {
                new URL(value)
                return true
              } catch {
                // Check if it's a relative URL
                if (value.startsWith('/') || value.startsWith('#')) {
                  return true
                }
                return 'Please enter a valid URL (e.g., https://example.com or /page)'
              }
            }) as TextFieldSingleValidation,
          },
          // Enhanced link options
          {
            name: 'openInNewTab',
            type: 'checkbox',
            label: 'Open in new tab',
            admin: {
              condition: (_data, siblingData) => siblingData?.linkType !== 'internal',
            },
          },
          {
            name: 'rel',
            type: 'select',
            hasMany: true,
            label: 'Link Attributes',
            options: relOptions,
            admin: {
              condition: (_data, siblingData) => siblingData?.linkType !== 'internal',
              description: 'Relationship attributes for the link (SEO and security)',
            },
          },
          {
            name: 'title',
            type: 'text',
            label: 'Title (Tooltip)',
            admin: {
              description: 'Tooltip text that appears on hover',
            },
          },
        ]
      },
    }),
  ],
})

// Enhanced lexical editor with more features - now using the comprehensive configuration
export const enhancedLexical = comprehensiveRichText

// Export additional preset configurations
export {
  advancedRichText,
  basicRichText,
  richTextWithBasicBlocks,
  richTextWithContentBlocks,
  standardRichText,
}
