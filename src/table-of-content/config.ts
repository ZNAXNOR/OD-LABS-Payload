import { Field } from 'payload'

export const tableOfContents: Field = {
  name: 'tableOfContents',
  type: 'group',
  fields: [
    {
      name: 'isEnabled',
      type: 'checkbox',
      label: 'Enable Table of Contents',
      defaultValue: true,
    },
  ],
  label: false,
}
