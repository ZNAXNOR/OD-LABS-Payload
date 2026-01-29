import type { Block } from 'payload'

/**
 * DividerBlock - A visual separator block for content sections
 *
 * This block provides customizable divider lines to visually separate content sections:
 * - Multiple line styles (solid, dashed, dotted, gradient)
 * - Configurable thickness and color options
 * - Width and alignment controls for flexible positioning
 * - Comprehensive spacing controls for proper section separation
 *
 * Use cases:
 * - Separating content sections visually
 * - Creating breaks between different topics
 * - Adding decorative elements to page layouts
 * - Providing visual rhythm in long-form content
 */
export const DividerBlock: Block = {
  slug: 'divider',
  dbName: 'divider', // Root level optimization
  interfaceName: 'DividerBlock',
  labels: {
    singular: 'Divider Block',
    plural: 'Divider Blocks',
  },
  admin: {
    group: 'Layout',
  },
  fields: [
    // Appearance Section
    {
      type: 'group',
      name: 'appearance',
      label: 'Divider Appearance',
      admin: {
        description: 'Visual styling options for the divider line',
      },
      fields: [
        {
          name: 'style',
          type: 'select',
          label: 'Line Style',
          options: [
            {
              label: 'Solid',
              value: 'solid',
            },
            {
              label: 'Dashed',
              value: 'dashed',
            },
            {
              label: 'Dotted',
              value: 'dotted',
            },
            {
              label: 'Gradient',
              value: 'gradient',
            },
          ],
          defaultValue: 'solid',
          required: true,
          admin: {
            description: 'Visual style of the divider line',
          },
        },
        {
          name: 'thickness',
          type: 'select',
          label: 'Line Thickness',
          options: [
            {
              label: '1px (Thin)',
              value: '1',
            },
            {
              label: '2px (Medium)',
              value: '2',
            },
            {
              label: '3px (Thick)',
              value: '3',
            },
            {
              label: '4px (Extra Thick)',
              value: '4',
            },
          ],
          defaultValue: '1',
          required: true,
          admin: {
            description: 'Thickness of the divider line in pixels',
          },
        },
        {
          name: 'color',
          type: 'select',
          label: 'Line Color',
          options: [
            {
              label: 'Zinc 200 (Light Gray)',
              value: 'zinc-200',
            },
            {
              label: 'Zinc 300 (Medium Light Gray)',
              value: 'zinc-300',
            },
            {
              label: 'Zinc 400 (Medium Gray)',
              value: 'zinc-400',
            },
            {
              label: 'Zinc 800 (Dark Gray)',
              value: 'zinc-800',
            },
            {
              label: 'Brand Primary',
              value: 'brand-primary',
            },
          ],
          defaultValue: 'zinc-200',
          required: true,
          admin: {
            description: 'Color of the divider line',
            condition: (siblingData) => siblingData?.style !== 'gradient',
          },
        },
      ],
    },

    // Layout Section
    {
      type: 'group',
      name: 'layout',
      label: 'Size & Position',
      admin: {
        description: 'Control the width and alignment of the divider',
      },
      fields: [
        {
          name: 'width',
          type: 'select',
          label: 'Divider Width',
          options: [
            {
              label: 'Full Width (100%)',
              value: 'full',
            },
            {
              label: 'Three Quarters (75%)',
              value: 'three-quarters',
            },
            {
              label: 'Half Width (50%)',
              value: 'half',
            },
            {
              label: 'Quarter Width (25%)',
              value: 'quarter',
            },
            {
              label: 'Small (100px)',
              value: 'small',
            },
          ],
          defaultValue: 'full',
          required: true,
          admin: {
            description: 'Width of the divider relative to its container',
          },
        },
        {
          name: 'alignment',
          type: 'select',
          label: 'Horizontal Alignment',
          options: [
            {
              label: 'Left',
              value: 'left',
            },
            {
              label: 'Center',
              value: 'center',
            },
            {
              label: 'Right',
              value: 'right',
            },
          ],
          defaultValue: 'center',
          required: true,
          admin: {
            description: 'Horizontal alignment of the divider',
            condition: (siblingData) => siblingData?.width !== 'full',
          },
        },
      ],
    },

    // Spacing Section
    {
      type: 'group',
      name: 'spacing',
      label: 'Spacing & Margins',
      admin: {
        description: 'Control the space around the divider',
      },
      fields: [
        {
          name: 'spacingTop',
          type: 'select',
          label: 'Top Spacing',
          dbName: 'spacing_top', // Snake case conversion
          options: [
            {
              label: 'None',
              value: 'none',
            },
            {
              label: 'Small (1rem)',
              value: 'sm',
            },
            {
              label: 'Medium (2rem)',
              value: 'md',
            },
            {
              label: 'Large (3rem)',
              value: 'lg',
            },
            {
              label: 'Extra Large (4rem)',
              value: 'xl',
            },
            {
              label: '2XL (6rem)',
              value: '2xl',
            },
          ],
          defaultValue: 'md',
          required: true,
          admin: {
            description: 'Vertical space above the divider',
          },
        },
        {
          name: 'spacingBottom',
          type: 'select',
          label: 'Bottom Spacing',
          dbName: 'spacing_bottom', // Snake case conversion
          options: [
            {
              label: 'None',
              value: 'none',
            },
            {
              label: 'Small (1rem)',
              value: 'sm',
            },
            {
              label: 'Medium (2rem)',
              value: 'md',
            },
            {
              label: 'Large (3rem)',
              value: 'lg',
            },
            {
              label: 'Extra Large (4rem)',
              value: 'xl',
            },
            {
              label: '2XL (6rem)',
              value: '2xl',
            },
          ],
          defaultValue: 'md',
          required: true,
          admin: {
            description: 'Vertical space below the divider',
          },
        },
      ],
    },
  ],
}
