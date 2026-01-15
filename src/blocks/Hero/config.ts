import type { Block } from 'payload'
import { link } from '@/fields/link'

export const HeroBlock: Block = {
  slug: 'hero',
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
        description: 'Choose the hero style variant',
      },
    },
    {
      name: 'eyebrow',
      type: 'text',
      admin: {
        description: 'Small text above the heading',
        placeholder: 'e.g., Welcome to',
      },
    },
    {
      name: 'heading',
      type: 'text',
      required: true,
      admin: {
        description: 'Main heading text',
        placeholder: 'e.g., Build Amazing Websites',
      },
    },
    {
      name: 'subheading',
      type: 'textarea',
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
        },
        {
          name: 'code',
          type: 'textarea',
          required: true,
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
          options: [
            { label: 'Left', value: 'left' },
            { label: 'Right', value: 'right' },
          ],
          defaultValue: 'left',
          required: true,
          admin: {
            description: 'Which side should the text content appear on',
          },
        },
        {
          name: 'mediaType',
          type: 'select',
          options: [
            { label: 'Image', value: 'image' },
            { label: 'Video', value: 'video' },
            { label: 'Code', value: 'code' },
          ],
          defaultValue: 'image',
          required: true,
          admin: {
            description: 'Type of media to display on the other side',
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
          minRows: 2,
          maxRows: 4,
          fields: [
            {
              name: 'color',
              type: 'text',
              required: true,
              admin: {
                placeholder: '#FF0000 or rgb(255, 0, 0)',
              },
            },
          ],
          admin: {
            description: 'Gradient colors (2-4 colors)',
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
            description: 'Gradient animation style',
          },
        },
      ],
    },
    {
      name: 'actions',
      type: 'array',
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
            description: 'Button style priority',
          },
        },
      ],
      admin: {
        description: 'Call-to-action buttons (max 3)',
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
            description: 'Text color theme (auto adapts to background)',
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
            description: 'Hero section height',
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
                description: 'Overlay color',
                condition: (_data, siblingData) => siblingData?.enabled === true,
              },
            },
          ],
        },
      ],
    },
  ],
}
