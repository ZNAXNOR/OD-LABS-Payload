import type { Block } from 'payload'

/**
 * SpacerBlock - A responsive spacing block for layout control
 *
 * This block provides customizable vertical spacing with responsive breakpoints:
 * - Separate height controls for mobile, tablet, and desktop
 * - Precise spacing control using rem units
 * - Responsive design support for optimal spacing across devices
 * - Validation to ensure reasonable spacing values
 *
 * Use cases:
 * - Adding consistent vertical spacing between content sections
 * - Creating responsive layouts with device-specific spacing
 * - Fine-tuning page rhythm and visual hierarchy
 * - Providing breathing room in dense content layouts
 */
export const SpacerBlock: Block = {
  slug: 'spacer',
  dbName: 'spacer', // Root level optimization
  interfaceName: 'SpacerBlock',
  labels: {
    singular: 'Spacer Block',
    plural: 'Spacer Blocks',
  },
  admin: {
    group: 'Layout',
  },
  fields: [
    // Responsive Heights Section
    {
      type: 'group',
      name: 'heights',
      label: 'Responsive Heights',
      admin: {
        description: 'Configure spacing heights for different device sizes (1rem = 16px)',
      },
      fields: [
        {
          name: 'heightMobile',
          type: 'number',
          label: 'Mobile Height (rem)',
          required: true,
          defaultValue: 2,
          min: 0,
          max: 20,
          admin: {
            description:
              'Height in rem units for mobile devices (up to 767px). Recommended: 1-4rem for mobile.',
            placeholder: '2',
            step: 0.5,
          },
        },
        {
          name: 'heightTablet',
          type: 'number',
          label: 'Tablet Height (rem)',
          required: true,
          defaultValue: 4,
          min: 0,
          max: 20,
          admin: {
            description:
              'Height in rem units for tablet devices (768px - 1023px). Recommended: 2-6rem for tablets.',
            placeholder: '4',
            step: 0.5,
          },
        },
        {
          name: 'heightDesktop',
          type: 'number',
          label: 'Desktop Height (rem)',
          required: true,
          defaultValue: 6,
          min: 0,
          max: 20,
          admin: {
            description:
              'Height in rem units for desktop devices (1024px+). Recommended: 3-8rem for desktop.',
            placeholder: '6',
            step: 0.5,
          },
        },
      ],
    },

    // Quick Presets Section
    {
      type: 'group',
      name: 'presets',
      label: 'Quick Presets',
      admin: {
        description: 'Apply common spacing presets (will override individual height settings)',
      },
      fields: [
        {
          name: 'usePreset',
          type: 'checkbox',
          label: 'Use Preset',
          defaultValue: false,
          admin: {
            description: 'Enable to use a predefined spacing preset instead of custom heights',
          },
        },
        {
          name: 'presetSize',
          type: 'select',
          label: 'Preset Size',
          options: [
            {
              label: 'Extra Small (1rem, 1.5rem, 2rem)',
              value: 'xs',
            },
            {
              label: 'Small (1.5rem, 2rem, 3rem)',
              value: 'sm',
            },
            {
              label: 'Medium (2rem, 4rem, 6rem)',
              value: 'md',
            },
            {
              label: 'Large (3rem, 6rem, 8rem)',
              value: 'lg',
            },
            {
              label: 'Extra Large (4rem, 8rem, 12rem)',
              value: 'xl',
            },
          ],
          defaultValue: 'md',
          admin: {
            description: 'Choose a preset spacing size',
            condition: (siblingData) => siblingData?.usePreset,
          },
        },
      ],
    },

    // Advanced Options Section
    {
      type: 'group',
      name: 'advanced',
      label: 'Advanced Options',
      admin: {
        description: 'Additional spacing controls and visual aids',
      },
      fields: [
        {
          name: 'showInEditor',
          type: 'checkbox',
          label: 'Show Visual Guide in Editor',
          defaultValue: true,
          admin: {
            description: 'Display a visual guide in the admin editor to show the spacer height',
          },
        },
        {
          name: 'label',
          type: 'text',
          label: 'Internal Label',
          maxLength: 50,
          admin: {
            description:
              'Optional label for identifying this spacer in the admin (not displayed on frontend)',
            placeholder: 'e.g., "Section break after hero"',
          },
        },
      ],
    },
  ],
}
