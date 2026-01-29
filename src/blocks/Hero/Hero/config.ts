import { link } from '@/fields/link'
import type { Block } from 'payload'

export const HeroBlock: Block = {
  slug: 'hero',
  dbName: 'hero_block', // Root level optimization
  interfaceName: 'HeroBlock',
  labels: {
    singular: 'Hero Block',
    plural: 'Hero Blocks',
  },
  admin: {
    group: 'Hero',
  },
  fields: [
    {
      name: 'variant',
      type: 'select',
      options: [
        {
          label: 'Default',
          value: 'default',
        },
        {
          label: 'Centered',
          value: 'centered',
        },
        {
          label: 'Minimal',
          value: 'minimal',
        },
        {
          label: 'Split',
          value: 'split',
        },
        {
          label: 'Gradient',
          value: 'gradient',
        },
        {
          label: 'Code Terminal',
          value: 'codeTerminal',
        },
      ],
      defaultValue: 'default',
      required: true,
      admin: {
        description:
          'Choose the hero style variant. Default: standard layout with background, Centered: content centered with overlay, Minimal: clean text-only design, Split: content and media side-by-side, Gradient: animated gradient background, Code Terminal: displays code snippet',
      },
    },
    {
      name: 'eyebrow',
      type: 'text',
      maxLength: 50,
      admin: {
        description: 'Small text above the heading',
        placeholder: 'e.g., Welcome to',
      },
    },
    {
      name: 'heading',
      type: 'text',
      required: true,
      maxLength: 120,
      validate: (value: unknown) => {
        if (!value || typeof value !== 'string' || value.trim().length === 0) {
          return 'Heading is required and cannot be empty'
        }
        if (value.trim().length < 3) {
          return 'Heading must be at least 3 characters long'
        }
        return true
      },
      admin: {
        description: 'Main heading text',
        placeholder: 'e.g., Build Amazing Websites',
      },
    },
    {
      name: 'subheading',
      type: 'textarea',
      maxLength: 300,
      admin: {
        description: 'Supporting text below the heading',
        placeholder: 'e.g., Create stunning websites with our powerful tools',
      },
    },
    {
      name: 'media',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Background image or media',
        condition: (data) => {
          return ['default', 'centered', 'split'].includes(data.variant)
        },
      },
    },
    {
      name: 'videoUrl',
      type: 'text',
      maxLength: 500,
      validate: (value: unknown) => {
        if (!value) return true // Optional field
        if (typeof value !== 'string') return 'Please enter a valid URL'
        try {
          new URL(value)
          return true
        } catch {
          return 'Please enter a valid URL (e.g., https://example.com/video.mp4)'
        }
      },
      admin: {
        description: 'Video URL for background (MP4 format recommended)',
        placeholder: 'https://example.com/video.mp4',
        condition: (data) => {
          return ['default', 'centered'].includes(data.variant)
        },
      },
    },
    {
      name: 'codeSnippet',
      type: 'group',
      admin: {
        condition: (data) => data.variant === 'codeTerminal',
        description: 'Code snippet configuration for terminal variant',
      },
      fields: [
        {
          name: 'language',
          type: 'select',
          options: [
            { label: 'JavaScript', value: 'javascript' },
            { label: 'TypeScript', value: 'typescript' },
            { label: 'Python', value: 'python' },
            { label: 'Bash', value: 'bash' },
            { label: 'JSON', value: 'json' },
          ],
          defaultValue: 'javascript',
          required: true,
          admin: {
            description: 'Programming language for syntax highlighting',
          },
        },
        {
          name: 'code',
          type: 'textarea',
          required: true,
          maxLength: 2000,
          validate: (value) => {
            if (!value || value.trim().length === 0) {
              return 'Code snippet is required'
            }
            if (value.trim().length < 5) {
              return 'Code snippet must be at least 5 characters long'
            }
            return true
          },
          admin: {
            placeholder: 'Enter your code here...',
          },
        },
        {
          name: 'theme',
          type: 'select',
          options: [
            { label: 'Dark', value: 'dark' },
            { label: 'Light', value: 'light' },
          ],
          defaultValue: 'dark',
          admin: {
            description: 'Color theme for the code display',
          },
        },
      ],
    },
    {
      name: 'splitLayout',
      type: 'group',
      admin: {
        condition: (data) => data.variant === 'split',
        description: 'Split layout configuration',
      },
      fields: [
        {
          name: 'contentSide',
          type: 'select',
          dbName: 'content_side', // Snake case conversion
          options: [
            { label: 'Left', value: 'left' },
            { label: 'Right', value: 'right' },
          ],
          defaultValue: 'left',
          required: true,
          admin: {
            description: 'Which side should the text content appear on (left or right)',
          },
        },
        {
          name: 'mediaType',
          type: 'select',
          dbName: 'media_type', // Snake case conversion
          options: [
            { label: 'Image', value: 'image' },
            { label: 'Video', value: 'video' },
            { label: 'Code', value: 'code' },
          ],
          defaultValue: 'image',
          required: true,
          admin: {
            description:
              'Type of media to display: Image (static image), Video (background video), Code (syntax-highlighted code snippet)',
          },
        },
      ],
    },
    {
      name: 'gradientConfig',
      type: 'group',
      admin: {
        condition: (data) => data.variant === 'gradient',
        description: 'Gradient background configuration',
      },
      fields: [
        {
          name: 'colors',
          type: 'array',
          dbName: 'colors', // Keep short names as-is
          minRows: 2,
          maxRows: 4,
          fields: [
            {
              name: 'color',
              type: 'text',
              required: true,
              maxLength: 50,
              validate: (value: unknown) => {
                if (!value || typeof value !== 'string' || value.trim().length === 0) {
                  return 'Color value is required'
                }
                // Basic validation for hex colors, rgb, rgba, hsl, or CSS color names
                const colorRegex =
                  /^(#[0-9A-Fa-f]{3,8}|rgb\(.*\)|rgba\(.*\)|hsl\(.*\)|hsla\(.*\)|[a-zA-Z]+)$/
                if (!colorRegex.test(value.trim())) {
                  return 'Please enter a valid color (hex, rgb, hsl, or color name)'
                }
                return true
              },
              admin: {
                placeholder: '#FF0000 or rgb(255, 0, 0)',
              },
            },
          ],
          admin: {
            description: 'Gradient colors (2-4 colors)',
            components: {
              RowLabel: '@/blocks/Hero/Hero/RowLabel#ColorRowLabel',
            },
          },
        },
        {
          name: 'animation',
          type: 'select',
          options: [
            { label: 'Wave', value: 'wave' },
            { label: 'Pulse', value: 'pulse' },
            { label: 'Rotate', value: 'rotate' },
          ],
          defaultValue: 'wave',
          admin: {
            description:
              'Animation style for the gradient background: Wave (flowing motion), Pulse (breathing effect), Rotate (spinning motion)',
          },
        },
      ],
    },
    {
      name: 'actions',
      type: 'array',
      dbName: 'actions', // Keep short names as-is
      maxRows: 3,
      fields: [
        {
          name: 'link',
          type: 'group',
          fields: [link()].flat(),
        },
        {
          name: 'priority',
          type: 'select',
          options: [
            { label: 'Primary', value: 'primary' },
            { label: 'Secondary', value: 'secondary' },
          ],
          defaultValue: 'primary',
          admin: {
            description:
              'Button style priority: Primary (filled button), Secondary (outline button)',
          },
        },
      ],
      admin: {
        description: 'Call-to-action buttons (max 3)',
        components: {
          RowLabel: '@/blocks/Hero/Hero/RowLabel#ActionRowLabel',
        },
      },
    },
    {
      name: 'settings',
      type: 'group',
      label: 'Settings',
      fields: [
        {
          name: 'theme',
          type: 'select',
          options: [
            { label: 'Light', value: 'light' },
            { label: 'Dark', value: 'dark' },
            { label: 'Auto', value: 'auto' },
          ],
          defaultValue: 'auto',
          admin: {
            description:
              'Text color theme: Light (white text), Dark (dark text), Auto (adapts to background)',
          },
        },
        {
          name: 'height',
          type: 'select',
          options: [
            { label: 'Small', value: 'small' },
            { label: 'Medium', value: 'medium' },
            { label: 'Large', value: 'large' },
            { label: 'Auto', value: 'auto' },
          ],
          defaultValue: 'large',
          admin: {
            description:
              'Hero section height: Small (400px), Medium (500px), Large (600px), Auto (content-based)',
          },
        },
        {
          name: 'enableParallax',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Enable parallax scrolling effect for background',
          },
        },
        {
          name: 'overlay',
          type: 'group',
          fields: [
            {
              name: 'enabled',
              type: 'checkbox',
              defaultValue: false,
              admin: {
                description: 'Add overlay to background media',
              },
            },
            {
              name: 'opacity',
              type: 'number',
              min: 0,
              max: 100,
              defaultValue: 40,
              admin: {
                description: 'Overlay opacity (0-100)',
                condition: (_data, siblingData) => siblingData?.enabled === true,
              },
            },
            {
              name: 'color',
              type: 'select',
              options: [
                { label: 'Black', value: 'black' },
                { label: 'White', value: 'white' },
                { label: 'Primary', value: 'primary' },
              ],
              defaultValue: 'black',
              admin: {
                description:
                  'Overlay color: Black (dark overlay), White (light overlay), Primary (brand color overlay)',
                condition: (_data, siblingData) => siblingData?.enabled === true,
              },
            },
          ],
        },
      ],
    },
  ],
}
