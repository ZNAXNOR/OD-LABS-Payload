import type { Block } from 'payload'

export const TelephoneBlock: Block = {
  slug: 'telephone',
  labels: {
    singular: 'Telephone',
    plural: 'Telephones',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Name (lowercase, no special characters)',
      required: true,
    },
    {
      name: 'label',
      type: 'text',
      label: 'Label',
      localized: true,
    },
    {
      name: 'width',
      type: 'number',
      label: 'Field Width (percentage)',
    },
    {
      name: 'required',
      type: 'checkbox',
      label: 'Required',
    },
    {
      name: 'defaultValue',
      type: 'text',
      label: 'Default Value',
    },
  ],
}
