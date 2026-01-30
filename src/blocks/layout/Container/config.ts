import { standardRichText } from '@/fields/richTextFeatures'
import type { Block } from 'payload'

/**
 * ContainerBlock - A layout container block for wrapping and styling content
 *
 * This block provides a flexible container with comprehensive styling options:
 * - Maximum width constraints with responsive breakpoints
 * - Background colors and images with overlay support
 * - Comprehensive padding and margin controls
 * - Content alignment and spacing options
 *
 * The Container block is designed as a layout wrapper that can contain rich text content
 * and provides visual styling without interfering with content structure. It serves as
 * a foundational layout element for creating visually distinct sections.
 *
 * Use cases:
 * - Creating visually distinct sections with different backgrounds
 * - Controlling content width and alignment within page layouts
 * - Adding consistent spacing between content sections
 * - Providing branded styling containers for marketing content
 */
export const ContainerBlock: Block = {
  slug: 'container',
  dbName: 'container', // Root level optimization
  interfaceName: 'ContainerBlock',
  labels: {
    singular: 'Container Block',
    plural: 'Container Blocks',
  },
  admin: {
    group: 'Layout',
  },
  fields: [
    // Content Section
    {
      type: 'group',
      name: 'content',
      label: 'Content',
      admin: {
        description: 'Content and layout settings for the container',
      },
      fields: [
        {
          name: 'richText',
          type: 'richText',
          label: 'Content',
          admin: {
            description: 'Rich text content to display inside the container',
          },
          editor: standardRichText,
        },
        {
          name: 'textAlignment',
          type: 'select',
          label: 'Text Alignment',
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
            {
              label: 'Justify',
              value: 'justify',
            },
          ],
          defaultValue: 'left',
          admin: {
            description: 'Text alignment within the container',
          },
        },
      ],
    },

    // Layout Section
    {
      type: 'group',
      name: 'layout',
      label: 'Layout & Sizing',
      admin: {
        description: 'Container width, alignment, and positioning controls',
      },
      fields: [
        {
          name: 'maxWidth',
          type: 'select',
          label: 'Maximum Width',
          dbName: 'max_width', // Snake case conversion
          options: [
            {
              label: 'Small (640px)',
              value: 'sm',
            },
            {
              label: 'Medium (768px)',
              value: 'md',
            },
            {
              label: 'Large (1024px)',
              value: 'lg',
            },
            {
              label: 'Extra Large (1280px)',
              value: 'xl',
            },
            {
              label: '2XL (1536px)',
              value: '2xl',
            },
            {
              label: 'Full Width',
              value: 'full',
            },
          ],
          defaultValue: 'xl',
          required: true,
          admin: {
            description: 'Maximum width constraint for the container',
          },
        },
        {
          name: 'containerAlignment',
          type: 'select',
          label: 'Container Alignment',
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
            description: 'Horizontal alignment of the container within its parent',
            condition: (siblingData) => siblingData?.maxWidth !== 'full',
          },
        },
        {
          name: 'minHeight',
          type: 'select',
          label: 'Minimum Height',
          options: [
            {
              label: 'Auto',
              value: 'auto',
            },
            {
              label: 'Small (200px)',
              value: 'sm',
            },
            {
              label: 'Medium (400px)',
              value: 'md',
            },
            {
              label: 'Large (600px)',
              value: 'lg',
            },
            {
              label: 'Screen Height',
              value: 'screen',
            },
          ],
          defaultValue: 'auto',
          admin: {
            description: 'Minimum height for the container',
          },
        },
      ],
    },

    // Styling Section
    {
      type: 'group',
      name: 'styling',
      label: 'Background & Styling',
      admin: {
        description: 'Visual styling options including backgrounds and borders',
      },
      fields: [
        {
          name: 'backgroundColor',
          type: 'select',
          label: 'Background Color',
          dbName: 'bg_color', // Abbreviation + snake case
          options: [
            {
              label: 'None (Transparent)',
              value: 'none',
            },
            {
              label: 'White',
              value: 'white',
            },
            {
              label: 'Zinc 50 (Very Light Gray)',
              value: 'zinc-50',
            },
            {
              label: 'Zinc 100 (Light Gray)',
              value: 'zinc-100',
            },
            {
              label: 'Zinc 900 (Dark Gray)',
              value: 'zinc-900',
            },
            {
              label: 'Brand Primary',
              value: 'brand-primary',
            },
          ],
          defaultValue: 'none',
          admin: {
            description: 'Background color for the container',
          },
        },
        {
          name: 'backgroundImage',
          type: 'upload',
          label: 'Background Image',
          relationTo: 'media',
          admin: {
            description: 'Optional background image (will overlay on background color)',
          },
        },
        {
          name: 'backgroundImageSettings',
          type: 'group',
          label: 'Background Image Settings',
          admin: {
            description: 'Control how the background image is displayed',
            condition: (siblingData) => Boolean(siblingData?.backgroundImage),
          },
          fields: [
            {
              name: 'size',
              type: 'select',
              label: 'Background Size',
              options: [
                {
                  label: 'Cover',
                  value: 'cover',
                },
                {
                  label: 'Contain',
                  value: 'contain',
                },
                {
                  label: 'Auto',
                  value: 'auto',
                },
              ],
              defaultValue: 'cover',
            },
            {
              name: 'position',
              type: 'select',
              label: 'Background Position',
              options: [
                {
                  label: 'Center',
                  value: 'center',
                },
                {
                  label: 'Top',
                  value: 'top',
                },
                {
                  label: 'Bottom',
                  value: 'bottom',
                },
                {
                  label: 'Left',
                  value: 'left',
                },
                {
                  label: 'Right',
                  value: 'right',
                },
              ],
              defaultValue: 'center',
            },
            {
              name: 'overlay',
              type: 'group',
              label: 'Background Overlay',
              admin: {
                description: 'Add a color overlay on top of the background image',
              },
              fields: [
                {
                  name: 'enabled',
                  type: 'checkbox',
                  label: 'Enable Overlay',
                  defaultValue: false,
                },
                {
                  name: 'color',
                  type: 'select',
                  label: 'Overlay Color',
                  dbName: 'overlay_color',
                  options: [
                    {
                      label: 'Black',
                      value: 'black',
                    },
                    {
                      label: 'White',
                      value: 'white',
                    },
                    {
                      label: 'Brand Primary',
                      value: 'brand-primary',
                    },
                  ],
                  defaultValue: 'black',
                  admin: {
                    condition: (siblingData) => siblingData?.enabled,
                  },
                },
                {
                  name: 'opacity',
                  type: 'number',
                  label: 'Overlay Opacity',
                  min: 0,
                  max: 100,
                  defaultValue: 50,
                  admin: {
                    description: 'Overlay opacity percentage (0-100)',
                    condition: (siblingData) => siblingData?.enabled,
                  },
                },
              ],
            },
          ],
        },
        {
          name: 'border',
          type: 'group',
          label: 'Border Settings',
          admin: {
            description: 'Add borders to the container',
          },
          fields: [
            {
              name: 'enabled',
              type: 'checkbox',
              label: 'Enable Border',
              defaultValue: false,
            },
            {
              name: 'style',
              type: 'select',
              label: 'Border Style',
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
              ],
              defaultValue: 'solid',
              admin: {
                condition: (siblingData) => siblingData?.enabled,
              },
            },
            {
              name: 'width',
              type: 'select',
              label: 'Border Width',
              options: [
                {
                  label: '1px',
                  value: '1',
                },
                {
                  label: '2px',
                  value: '2',
                },
                {
                  label: '4px',
                  value: '4',
                },
              ],
              defaultValue: '1',
              admin: {
                condition: (siblingData) => siblingData?.enabled,
              },
            },
            {
              name: 'color',
              type: 'select',
              label: 'Border Color',
              options: [
                {
                  label: 'Zinc 200 (Light)',
                  value: 'zinc-200',
                },
                {
                  label: 'Zinc 400 (Medium)',
                  value: 'zinc-400',
                },
                {
                  label: 'Zinc 800 (Dark)',
                  value: 'zinc-800',
                },
                {
                  label: 'Brand Primary',
                  value: 'brand-primary',
                },
              ],
              defaultValue: 'zinc-200',
              admin: {
                condition: (siblingData) => siblingData?.enabled,
              },
            },
            {
              name: 'radius',
              type: 'select',
              label: 'Border Radius',
              options: [
                {
                  label: 'None',
                  value: 'none',
                },
                {
                  label: 'Small',
                  value: 'sm',
                },
                {
                  label: 'Medium',
                  value: 'md',
                },
                {
                  label: 'Large',
                  value: 'lg',
                },
                {
                  label: 'Full',
                  value: 'full',
                },
              ],
              defaultValue: 'none',
              admin: {
                condition: (siblingData) => siblingData?.enabled,
              },
            },
          ],
        },
      ],
    },

    // Spacing Section
    {
      type: 'group',
      name: 'spacing',
      label: 'Spacing & Margins',
      admin: {
        description: 'Control internal padding and external margins',
      },
      fields: [
        {
          name: 'paddingTop',
          type: 'select',
          label: 'Top Padding',
          dbName: 'padding_top', // Snake case conversion
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
            description: 'Internal padding at the top of the container',
          },
        },
        {
          name: 'paddingBottom',
          type: 'select',
          label: 'Bottom Padding',
          dbName: 'padding_bottom', // Snake case conversion
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
            description: 'Internal padding at the bottom of the container',
          },
        },
        {
          name: 'paddingX',
          type: 'select',
          label: 'Horizontal Padding',
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
          ],
          defaultValue: 'md',
          required: true,
          admin: {
            description: 'Internal padding on left and right sides',
          },
        },
        {
          name: 'marginTop',
          type: 'select',
          label: 'Top Margin',
          dbName: 'margin_top', // Snake case conversion
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
          defaultValue: 'none',
          required: true,
          admin: {
            description: 'External margin above the container',
          },
        },
        {
          name: 'marginBottom',
          type: 'select',
          label: 'Bottom Margin',
          dbName: 'margin_bottom', // Snake case conversion
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
          defaultValue: 'none',
          required: true,
          admin: {
            description: 'External margin below the container',
          },
        },
      ],
    },
  ],
}
