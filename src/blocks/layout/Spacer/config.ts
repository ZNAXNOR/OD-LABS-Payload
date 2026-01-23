import type { Block } from 'payload'

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
    {
      name: 'heightMobile',
      type: 'number',
      required: true,
      defaultValue: 2,
      min: 0,
      max: 20,
      admin: {
        description: 'Height in rem units for mobile devices (1rem = 16px)',
        placeholder: '2',
      },
    },
    {
      name: 'heightTablet',
      type: 'number',
      required: true,
      defaultValue: 4,
      min: 0,
      max: 20,
      admin: {
        description: 'Height in rem units for tablet devices (768px+)',
        placeholder: '4',
      },
    },
    {
      name: 'heightDesktop',
      type: 'number',
      required: true,
      defaultValue: 6,
      min: 0,
      max: 20,
      admin: {
        description: 'Height in rem units for desktop devices (1024px+)',
        placeholder: '6',
      },
    },
  ],
}
