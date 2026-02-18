import type { Field } from 'payload'

export const servicesHero: Field = {
  name: 'servicesHero',
  type: 'group',
  label: false,
  admin: {
    condition: (_, { pageType } = {}) => pageType === 'services',
  },
  fields: [
    {
      name: 'type',
      type: 'select',
      defaultValue: 'lowImpact',
      label: 'Type',
      options: [
        { label: 'Low Impact', value: 'lowImpact' },
        { label: 'Medium Impact', value: 'mediumImpact' },
        { label: 'High Impact', value: 'highImpact' },
      ],
      required: true,
    },
    {
      name: 'title',
      type: 'text',
      label: 'Header',
      required: true,
    },
    {
      name: 'alignment',
      type: 'radio',
      defaultValue: 'left',
      options: [
        { label: 'Left', value: 'left' },
        { label: 'Center', value: 'center' },
      ],
      admin: {
        layout: 'horizontal',
        condition: (_, { type } = {}) => type === 'lowImpact',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Description',
      admin: {
        condition: (_, { type } = {}) => type === 'lowImpact',
      },
    },
    {
      name: 'icon',
      type: 'upload',
      relationTo: 'media',
      label: 'Icon / Logo',
    },
    {
      name: 'media',
      type: 'upload',
      relationTo: 'media',
      label: 'Background Media',
      admin: {
        condition: (_, { type } = {}) => type === 'highImpact',
      },
    },
  ],
}
