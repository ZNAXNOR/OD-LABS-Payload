import {
  AlignFeature,
  BlockquoteFeature,
  BoldFeature,
  ChecklistFeature,
  HeadingFeature,
  HorizontalRuleFeature,
  IndentFeature,
  ItalicFeature,
  // CodeFeature, // Not available in current version
  // CodeBlockFeature, // Not available in current version
  // TableFeature, // Not available in current version
  LinkFeature,
  OrderedListFeature,
  ParagraphFeature,
  StrikethroughFeature,
  SubscriptFeature,
  SuperscriptFeature,
  UnderlineFeature,
  UnorderedListFeature,
  lexicalEditor,
  type LinkFields,
} from '@payloadcms/richtext-lexical'
import type { TextFieldSingleValidation } from 'payload'
import { relOptions } from './link'

// Basic text formatting features
export const basicTextFeatures = [
  BoldFeature(),
  ItalicFeature(),
  UnderlineFeature(),
  StrikethroughFeature(),
  SuperscriptFeature(),
  SubscriptFeature(),
]

// Note: Text color and background color features are not available in the current version
// of @payloadcms/richtext-lexical. These would need to be implemented as custom features
// or plugins if required. For now, we'll use CSS classes for styling.
export const colorFeatures = [
  // FontColorFeature() - Not available in current version
  // BackgroundColorFeature() - Not available in current version
  // These features would need custom implementation
]

// Text alignment features
export const alignmentFeatures = [AlignFeature(), IndentFeature()]

// Custom spacing controls (using IndentFeature for now)
// Note: Advanced spacing controls would require custom implementation
export const spacingFeatures = [
  IndentFeature(), // Provides basic indentation control
  // Custom spacing features would need to be implemented as plugins
  // for more granular control over margins, padding, line height, etc.
]

// Heading features (H1-H6)
export const headingFeatures = [
  HeadingFeature({
    enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
  }),
]

// List features (ordered, unordered, nested)
export const listFeatures = [OrderedListFeature(), UnorderedListFeature(), ChecklistFeature()]

// Structural features
export const structuralFeatures = [ParagraphFeature(), BlockquoteFeature(), HorizontalRuleFeature()]

// Code features
export const codeFeatures = [
  // Note: CodeFeature and CodeBlockFeature are not available in the current version
  // These would need to be implemented as custom features or plugins
  // For now, we'll rely on basic text formatting for code snippets
]

// Table features
export const tableFeatures = [
  // Note: TableFeature is not available in the current version
  // This would need to be implemented as a custom feature or plugin
  // TableFeature({
  //   enableRowHeader: true,
  //   enableColumnHeader: true,
  // }),
]

// Block embedding features - removed to avoid circular dependencies
// Use blockEmbedding.ts directly for block embedding functionality
// Enhanced link feature with all options
export const enhancedLinkFeature = [
  LinkFeature({
    enabledCollections: ['pages', 'blogs', 'services', 'legal', 'contacts'],
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
              return true
            }
            if (!value) return 'URL is required'

            try {
              new URL(value)
              return true
            } catch {
              if (value.startsWith('/') || value.startsWith('#')) {
                return true
              }
              return 'Please enter a valid URL'
            }
          }) as TextFieldSingleValidation,
        },
        // Enhanced options for external links
        {
          type: 'collapsible',
          label: 'Link Options',
          admin: {
            initCollapsed: true,
            condition: (_data, siblingData) => siblingData?.linkType !== 'internal',
          },
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'openInNewTab',
                  type: 'checkbox',
                  label: 'Open in new tab',
                  admin: {
                    width: '50%',
                  },
                },
                {
                  name: 'download',
                  type: 'checkbox',
                  label: 'Download link',
                  admin: {
                    width: '50%',
                    description: 'Prompt user to download the resource',
                  },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'rel',
                  type: 'select',
                  hasMany: true,
                  label: 'Link Attributes',
                  options: relOptions,
                  admin: {
                    width: '50%',
                    description: 'SEO and security attributes',
                  },
                },
                {
                  name: 'hreflang',
                  type: 'text',
                  label: 'Language Code',
                  admin: {
                    width: '50%',
                    description: 'Language of the linked resource (e.g., en, es)',
                  },
                  validate: (value: any) => {
                    if (!value) return true
                    if (!/^[a-z]{2}(-[A-Z]{2})?$/.test(value)) {
                      return 'Please enter a valid language code (e.g., en, es, fr-FR)'
                    }
                    return true
                  },
                },
              ],
            },
            {
              name: 'title',
              type: 'text',
              label: 'Title (Tooltip)',
              admin: {
                description: 'Tooltip text that appears on hover',
              },
            },
          ],
        },
      ]
    },
  }),
]

// Comprehensive rich text editor with all features including blocks
export const comprehensiveRichText = lexicalEditor({
  features: [
    // Basic structure
    ...structuralFeatures,

    // Text formatting
    ...basicTextFeatures,

    // Alignment and indentation
    ...alignmentFeatures,

    // Headings
    ...headingFeatures,

    // Lists
    ...listFeatures,

    // Code
    ...codeFeatures,

    // Tables
    ...tableFeatures,

    // Links
    ...enhancedLinkFeature,

    // Note: Block embedding removed to avoid circular dependencies
    // Use blockEmbedding.ts directly for block embedding functionality
  ],
})

// Preset configurations for different use cases
export const basicRichText = lexicalEditor({
  features: [ParagraphFeature(), ...basicTextFeatures, ...enhancedLinkFeature],
})

export const standardRichText = lexicalEditor({
  features: [
    ...structuralFeatures,
    ...basicTextFeatures,
    ...alignmentFeatures,
    ...headingFeatures,
    ...listFeatures,
    ...enhancedLinkFeature,
  ],
})

export const advancedRichText = lexicalEditor({
  features: [
    ...structuralFeatures,
    ...basicTextFeatures,
    ...alignmentFeatures,
    ...headingFeatures,
    ...listFeatures,
    ...codeFeatures,
    ...tableFeatures,
    ...enhancedLinkFeature,

    // Note: Block embedding removed to avoid circular dependencies
    // Use blockEmbedding.ts directly for block embedding functionality
  ],
})

// Rich text editor with basic block embedding (content-focused blocks only)
// Note: Simplified to avoid circular dependencies
export const richTextWithBasicBlocks = lexicalEditor({
  features: [
    ...structuralFeatures,
    ...basicTextFeatures,
    ...alignmentFeatures,
    ...headingFeatures,
    ...listFeatures,
    ...enhancedLinkFeature,
  ],
})

// Rich text editor with content and technical blocks
// Note: Simplified to avoid circular dependencies
export const richTextWithContentBlocks = lexicalEditor({
  features: [
    ...structuralFeatures,
    ...basicTextFeatures,
    ...alignmentFeatures,
    ...headingFeatures,
    ...listFeatures,
    ...enhancedLinkFeature,
  ],
})

// Export individual feature groups for custom configurations
// (Already exported above as individual const declarations)

// Text formatting shortcuts are built into the Lexical features:
// - Ctrl/Cmd + B: Bold
// - Ctrl/Cmd + I: Italic
// - Ctrl/Cmd + U: Underline
// - Ctrl/Cmd + Shift + S: Strikethrough
// - Ctrl/Cmd + K: Link
// - Ctrl/Cmd + Shift + L: Unordered List
// - Ctrl/Cmd + Shift + 7: Ordered List
// - Ctrl/Cmd + Shift + 8: Blockquote
// - Ctrl/Cmd + Shift + C: Code
// - Ctrl/Cmd + Alt + 1-6: Headings H1-H6
// - Tab: Indent
// - Shift + Tab: Outdent
// - Ctrl/Cmd + Shift + E: Center align
// - Ctrl/Cmd + Shift + R: Right align
// - Ctrl/Cmd + Shift + L: Left align
// - Ctrl/Cmd + Shift + J: Justify align

// Additional keyboard shortcuts documentation
export const keyboardShortcuts = {
  formatting: {
    bold: 'Ctrl/Cmd + B',
    italic: 'Ctrl/Cmd + I',
    underline: 'Ctrl/Cmd + U',
    strikethrough: 'Ctrl/Cmd + Shift + S',
    code: 'Ctrl/Cmd + Shift + C',
    superscript: 'Ctrl/Cmd + .',
    subscript: 'Ctrl/Cmd + ,',
  },
  structure: {
    heading1: 'Ctrl/Cmd + Alt + 1',
    heading2: 'Ctrl/Cmd + Alt + 2',
    heading3: 'Ctrl/Cmd + Alt + 3',
    heading4: 'Ctrl/Cmd + Alt + 4',
    heading5: 'Ctrl/Cmd + Alt + 5',
    heading6: 'Ctrl/Cmd + Alt + 6',
    paragraph: 'Ctrl/Cmd + Alt + 0',
    blockquote: 'Ctrl/Cmd + Shift + .',
    codeBlock: 'Ctrl/Cmd + Alt + C',
    horizontalRule: 'Ctrl/Cmd + Shift + -',
  },
  lists: {
    unorderedList: 'Ctrl/Cmd + Shift + 8',
    orderedList: 'Ctrl/Cmd + Shift + 7',
    checklist: 'Ctrl/Cmd + Shift + 9',
    indent: 'Tab',
    outdent: 'Shift + Tab',
  },
  alignment: {
    left: 'Ctrl/Cmd + Shift + L',
    center: 'Ctrl/Cmd + Shift + E',
    right: 'Ctrl/Cmd + Shift + R',
    justify: 'Ctrl/Cmd + Shift + J',
  },
  links: {
    insertLink: 'Ctrl/Cmd + K',
    removeLink: 'Ctrl/Cmd + Shift + K',
  },
  tables: {
    insertTable: 'Ctrl/Cmd + Alt + T',
    insertRowAbove: 'Ctrl/Cmd + Alt + Up',
    insertRowBelow: 'Ctrl/Cmd + Alt + Down',
    insertColumnLeft: 'Ctrl/Cmd + Alt + Left',
    insertColumnRight: 'Ctrl/Cmd + Alt + Right',
    deleteRow: 'Ctrl/Cmd + Shift + Alt + Up',
    deleteColumn: 'Ctrl/Cmd + Shift + Alt + Right',
  },
  general: {
    undo: 'Ctrl/Cmd + Z',
    redo: 'Ctrl/Cmd + Y / Ctrl/Cmd + Shift + Z',
    selectAll: 'Ctrl/Cmd + A',
    copy: 'Ctrl/Cmd + C',
    paste: 'Ctrl/Cmd + V',
    cut: 'Ctrl/Cmd + X',
  },
}
