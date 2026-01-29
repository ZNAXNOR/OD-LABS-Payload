import type { Block } from 'payload'

export const NewsletterBlock: Block = {
  slug: 'newsletter',
  dbName: 'newsletter', // Root level optimization
  interfaceName: 'NewsletterBlock',
  labels: {
    singular: 'Newsletter Block',
    plural: 'Newsletter Blocks',
  },
  admin: {
    group: 'CTA & Conversion',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      required: true,
      maxLength: 120,
      validate: (value: unknown) => {
        if (!value || typeof value !== 'string' || value.trim().length === 0) {
          return 'Heading is required and cannot be empty'
        }
        return true
      },
      admin: {
        description: 'Main heading for the newsletter signup',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      maxLength: 300,
      admin: {
        description: 'Optional description text',
      },
    },
    {
      name: 'placeholder',
      type: 'text',
      defaultValue: 'Enter your email',
      maxLength: 50,
      admin: {
        description: 'Placeholder text for the email input',
      },
    },
    {
      name: 'buttonText',
      type: 'text',
      defaultValue: 'Subscribe',
      required: true,
      maxLength: 30,
      validate: (value: unknown) => {
        if (!value || typeof value !== 'string' || value.trim().length === 0) {
          return 'Button text is required'
        }
        return true
      },
      admin: {
        description: 'Text for the submit button',
      },
    },
    {
      name: 'style',
      type: 'select',
      defaultValue: 'inline',
      options: [
        {
          label: 'Inline',
          value: 'inline',
        },
        {
          label: 'Card',
          value: 'card',
        },
        {
          label: 'Minimal',
          value: 'minimal',
        },
      ],
      admin: {
        description:
          'Visual style: Inline (horizontal layout), Card (contained with background), Minimal (clean text-only)',
      },
    },
    {
      name: 'showPrivacyNote',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Display privacy note below the form',
      },
    },
    {
      name: 'privacyText',
      type: 'text',
      defaultValue: 'We respect your privacy. Unsubscribe at any time.',
      maxLength: 200,
      admin: {
        description: 'Privacy note text',
        condition: (data) => data.showPrivacyNote === true,
      },
    },
    {
      name: 'successMessage',
      type: 'text',
      defaultValue: 'Thanks for subscribing!',
      required: true,
      maxLength: 100,
      validate: (value: unknown) => {
        if (!value || typeof value !== 'string' || value.trim().length === 0) {
          return 'Success message is required'
        }
        return true
      },
      admin: {
        description: 'Message shown after successful subscription',
      },
    },
    {
      name: 'provider',
      type: 'select',
      defaultValue: 'custom',
      options: [
        {
          label: 'Custom',
          value: 'custom',
        },
        {
          label: 'Mailchimp',
          value: 'mailchimp',
        },
        {
          label: 'ConvertKit',
          value: 'convertkit',
        },
      ],
      admin: {
        description:
          'Email service provider: Custom (manual integration), Mailchimp (automated integration), ConvertKit (automated integration)',
      },
    },
  ],
}
