import type { Tab } from 'payload'

export const ContactInfoTab: Tab = {
  label: 'Contact Information',
  description: 'Configure primary contact details',
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'companyName',
          type: 'text',
          required: true,
          admin: {
            width: '50%',
            description: 'Official company or organization name',
          },
        },
        {
          name: 'tagline',
          type: 'text',
          admin: {
            width: '50%',
            description: 'Company tagline or slogan',
          },
        },
      ],
    },
    {
      name: 'primaryContact',
      type: 'group',
      label: 'Primary Contact',
      admin: {
        description: 'Main contact information displayed publicly',
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'email',
              type: 'email',
              required: true,
              admin: {
                width: '50%',
                description: 'Primary contact email address',
              },
            },
            {
              name: 'phone',
              type: 'text',
              admin: {
                width: '50%',
                description: 'Primary phone number',
              },
              validate: (value: any) => {
                if (value && !/^[\+]?[1-9][\d\s\-\(\)]{7,15}$/.test(value)) {
                  return 'Please enter a valid phone number'
                }
                return true
              },
            },
          ],
        },
        {
          name: 'address',
          type: 'group',
          label: 'Physical Address',
          admin: {
            description: 'Business address information',
          },
          fields: [
            {
              name: 'street',
              type: 'text',
              admin: {
                description: 'Street address',
              },
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'city',
                  type: 'text',
                  admin: {
                    width: '33%',
                    description: 'City',
                  },
                },
                {
                  name: 'state',
                  type: 'text',
                  admin: {
                    width: '33%',
                    description: 'State or province',
                  },
                },
                {
                  name: 'postalCode',
                  type: 'text',
                  admin: {
                    width: '34%',
                    description: 'Postal or ZIP code',
                  },
                },
              ],
            },
            {
              name: 'country',
              type: 'text',
              admin: {
                description: 'Country',
              },
            },
          ],
        },
      ],
    },
    {
      name: 'additionalContacts',
      type: 'array',
      dbName: 'additional_contacts', // Snake case conversion
      label: 'Additional Contacts',
      maxRows: 5,
      admin: {
        description: 'Additional contact methods or departments (max 5)',
      },
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
          admin: {
            description: 'Contact label (e.g., "Sales", "Support", "Media")',
          },
        },
        {
          type: 'row',
          fields: [
            {
              name: 'email',
              type: 'email',
              admin: {
                width: '50%',
                description: 'Contact email',
              },
            },
            {
              name: 'phone',
              type: 'text',
              admin: {
                width: '50%',
                description: 'Contact phone',
              },
            },
          ],
        },
        {
          name: 'description',
          type: 'textarea',
          admin: {
            description: 'Brief description of this contact method',
          },
        },
      ],
    },
  ],
}
