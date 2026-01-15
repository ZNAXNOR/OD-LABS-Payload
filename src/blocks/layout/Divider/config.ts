import type { Block } from 'payload'

export const DividerBlock: Block = {
  slug: 'divider',
  interfaceName: 'DividerBlock',
  labels: {
    singular: 'Divider Block',
    plural: 'Divider Blocks',
  },
  admin: {
    group: 'Layout',
  },
  fields: [
    {
      name: 'style',
      type: 'select',
      options: [
        { label: 'Solid', value: 'solid' },
        { label: 'Dashed', value: 'dashed' },
        { label: 'Dotted', value: 'dotted' },
        { label: 'Gradient', value: 'gradient' },
      ],
      defaultValue: 'solid',
      required: true,
      admin: {
        description: 'Style of the divider line',
      },
    },
    {
      name: 'thickness',
      type: 'select',
      options: [
        { label: '1px', value: '1' },
        { label: '2px', value: '2' },
        { label: '3px', value: '3' },
        { label: '4px', value: '4' },
      ],
      defaultValue: '1',
      required: true,
      admin: {
        description: 'Thickness of the divider',
      },
    },
    {
      name: 'color',
      type: 'select',
      options: [
        { label: 'Zinc 200', value: 'zinc-200' },
        { label: 'Zinc 300', value: 'zinc-300' },
        { label: 'Zinc 400', value: 'zinc-400' },
        { label: 'Zinc 800', value: 'zinc-800' },
        { label: 'Brand Primary', value: 'brand-primary' },
      ],
      defaultValue: 'zinc-200',
      admin: {
        description: 'Color of the divider',
        condition: (data) => data.style !== 'gradient',
      },
    },
    {
      name: 'width',
      type: 'select',
      options: [
        { label: 'Full Width', value: 'full' },
        { label: 'Half Width', value: 'half' },
        { label: 'Quarter Width', value: 'quarter' },
      ],
      defaultValue: 'full',
      required: true,
      admin: {
        description: 'Width of the divider',
      },
    },
    {
      name: 'alignment',
      type: 'select',
      options: [
        { label: 'Left', value: 'left' },
        { label: 'Center', value: 'center' },
        { label: 'Right', value: 'right' },
      ],
      defaultValue: 'center',
      required: true,
      admin: {
        description: 'Horizontal alignment',
        condition: (data) => data.width !== 'full',
      },
    },
    {
      name: 'spacingTop',
      type: 'select',
      options: [
        { label: 'None', value: 'none' },
        { label: 'Small', value: 'sm' },
        { label: 'Medium', value: 'md' },
        { label: 'Large', value: 'lg' },
        { label: 'Extra Large', value: 'xl' },
      ],
      defaultValue: 'md',
      required: true,
      admin: {
        description: 'Space above the divider',
      },
    },
    {
      name: 'spacingBottom',
      type: 'select',
      options: [
        { label: 'None', value: 'none' },
        { label: 'Small', value: 'sm' },
        { label: 'Medium', value: 'md' },
        { label: 'Large', value: 'lg' },
        { label: 'Extra Large', value: 'xl' },
      ],
      defaultValue: 'md',
      required: true,
      admin: {
        description: 'Space below the divider',
      },
    },
  ],
}
