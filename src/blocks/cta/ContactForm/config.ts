import type { Block } from 'payload'

export const ContactFormBlock: Block = {
  slug: 'contactForm',
  dbName: 'contact_form', // Root level optimization
  interfaceName: 'ContactFormBlock',
  labels: {
    singular: 'Contact Form Block',
    plural: 'Contact Form Blocks',
  },
  admin: {
    group: 'CTA & Conversion',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      maxLength: 120,
      admin: {
        description: 'Main heading for the contact form section',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      maxLength: 300,
      admin: {
        description: 'Optional description text above the form',
      },
    },
    {
      name: 'layout',
      type: 'select',
      defaultValue: 'single',
      options: [
        {
          label: 'Single Column',
          value: 'single',
        },
        {
          label: 'Split (Form + Contact Info)',
          value: 'split',
        },
      ],
      admin: {
        description:
          'Layout style: Single Column (form only), Split (form with contact information sidebar)',
      },
    },
    {
      name: 'form',
      type: 'relationship',
      relationTo: 'forms',
      admin: {
        description: 'Select the form to display (requires Form Builder plugin)',
      },
    },
    {
      name: 'showContactInfo',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Display contact information alongside the form',
      },
    },
    {
      name: 'contactInfo',
      type: 'group',
      admin: {
        condition: (data) => data.showContactInfo === true,
      },
      fields: [
        {
          name: 'email',
          type: 'email',
          admin: {
            description: 'Contact email address',
          },
        },
        {
          name: 'phone',
          type: 'text',
          maxLength: 50,
          admin: {
            description: 'Contact phone number',
          },
        },
        {
          name: 'address',
          type: 'textarea',
          maxLength: 200,
          admin: {
            description: 'Physical address',
          },
        },
        {
          name: 'hours',
          type: 'text',
          maxLength: 100,
          admin: {
            description: 'Business hours',
            placeholder: 'Mon-Fri: 9am-5pm',
          },
        },
      ],
    },
  ],
}
