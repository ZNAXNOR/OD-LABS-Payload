import type { Block } from 'payload'
import { link } from '@/fields/link'

export const HeroBlock: Block = {
  slug: 'hero',
  interfaceName: 'HeroBlock',
  labels: {
    singular: 'Hero',
    plural: 'Hero Blocks',
  },
  fields: [
    {
      name: 'type',
      type: 'select',
      options: [
        { label: 'Default', value: 'default' },
        { label: 'Centered', value: 'centered' },
        { label: 'Minimal', value: 'minimal' },
        { label: 'Video Background', value: 'video' },
      ],
      defaultValue: 'default',
      required: true,
      admin: {
        description: 'Choose the hero layout style',
      },
    },
    {
      name: 'eyebrow',
      type: 'text',
      admin: {
        description: 'Small text above the main heading',
        placeholder: 'e.g., "New Feature" or "Announcement"',
      },
    },
    {
      name: 'heading',
      type: 'text',
      required: true,
      admin: {
        description: 'Main hero heading - keep it impactful and concise',
        placeholder: 'Your compelling headline here',
      },
      validate: (value: string | null | undefined) => {
        if (!value) return 'Heading is required'
        if (value.length > 120)
          return 'Heading should be under 120 characters for better readability'
        return true
      },
    },
    {
      name: 'subheading',
      type: 'textarea',
      admin: {
        description: 'Supporting text below the heading',
        placeholder: 'Provide more context about your offering...',
        rows: 3,
      },
      validate: (value: string | null | undefined) => {
        if (value && value.length > 300) return 'Subheading should be under 300 characters'
        return true
      },
    },
    {
      name: 'media',
      type: 'upload',
      relationTo: 'media',
      admin: {
        condition: (data) => data.type !== 'minimal',
        description: 'Background image or featured media',
      },
      filterOptions: {
        mimeType: { contains: 'image' },
      },
    },
    {
      name: 'videoUrl',
      type: 'text',
      admin: {
        condition: (data) => data.type === 'video',
        description: 'URL for background video (MP4 format recommended for best compatibility)',
        placeholder: 'https://example.com/video.mp4',
      },
      validate: (value: string | null | undefined, { siblingData }: { siblingData: any }) => {
        if (siblingData?.type === 'video' && !value) {
          return 'Video URL is required when using video background type'
        }
        if (value && !value.match(/^https?:\/\/.+\.(mp4|webm|ogg)$/i)) {
          return 'Please provide a valid video URL (MP4, WebM, or OGG format)'
        }
        return true
      },
    },
    {
      name: 'actions',
      type: 'array',
      maxRows: 3,
      admin: {
        description: 'Call-to-action buttons (maximum 3 for optimal UX)',
      },
      fields: [
        link({
          appearances: ['default', 'secondary', 'outline'],
          overrides: {
            admin: {
              description: 'Configure the action button',
            },
          },
        }),
        {
          name: 'priority',
          type: 'select',
          options: [
            { label: 'Primary', value: 'primary' },
            { label: 'Secondary', value: 'secondary' },
          ],
          defaultValue: 'secondary',
          admin: {
            description: 'Button priority affects styling and placement',
          },
        },
      ],
    },
    {
      name: 'settings',
      type: 'group',
      label: 'Display Settings',
      admin: {
        description: 'Customize the appearance and behavior of the hero section',
      },
      fields: [
        {
          name: 'theme',
          type: 'select',
          options: [
            { label: 'Light', value: 'light' },
            { label: 'Dark', value: 'dark' },
            { label: 'Auto (based on background)', value: 'auto' },
          ],
          defaultValue: 'auto',
          admin: {
            description: 'Text color theme - auto will adapt based on background',
          },
        },
        {
          name: 'height',
          type: 'select',
          options: [
            { label: 'Small (50vh)', value: 'small' },
            { label: 'Medium (75vh)', value: 'medium' },
            { label: 'Large (100vh)', value: 'large' },
            { label: 'Auto (content-based)', value: 'auto' },
          ],
          defaultValue: 'large',
          admin: {
            description: 'Hero section height - auto adjusts to content',
          },
        },
        {
          name: 'enableParallax',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Enable parallax scrolling effect for background media',
            condition: (_data, siblingData) => {
              return siblingData?.parent?.media || siblingData?.parent?.videoUrl
            },
          },
        },
        {
          name: 'overlay',
          type: 'group',
          label: 'Background Overlay',
          admin: {
            description: 'Add overlay to improve text readability over background media',
            condition: (_data, siblingData) => {
              return siblingData?.parent?.media || siblingData?.parent?.videoUrl
            },
          },
          fields: [
            {
              name: 'enabled',
              type: 'checkbox',
              defaultValue: true,
              label: 'Enable overlay',
            },
            {
              name: 'opacity',
              type: 'number',
              min: 0,
              max: 100,
              defaultValue: 40,
              admin: {
                description: 'Overlay opacity (0-100%)',
                condition: (data) => data.enabled,
                step: 5,
              },
            },
            {
              name: 'color',
              type: 'select',
              options: [
                { label: 'Black', value: 'black' },
                { label: 'White', value: 'white' },
                { label: 'Primary Color', value: 'primary' },
              ],
              defaultValue: 'black',
              admin: {
                condition: (data) => data.enabled,
              },
            },
          ],
        },
      ],
    },
  ],
}
