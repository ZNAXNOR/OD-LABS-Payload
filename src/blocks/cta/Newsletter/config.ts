import type { Block } from 'payload'

export const NewsletterBlock: Block = {
  slug: 'newsletter',
  interfaceName: 'NewsletterBlock',
  fields: [
    {
      name: 'heading',
      type: 'text',
      required: true,
      admin: {
        description: 'Main heading for the newsletter signup',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        description: 'Optional description text',
      },
    },
    {
      name: 'placeholder',
      type: 'text',
      defaultValue: 'Enter your email',
      admin: {
        description: 'Placeholder text for the email input',
      },
    },
    {
      name: 'buttonText',
      type: 'text',
      defaultValue: 'Subscribe',
      required: true,
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
        description: 'Visual style of the newsletter signup',
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
        description: 'Email service provider integration',
      },
    },
  ],
  labels: {
    plural: 'Newsletter Signups',
    singular: 'Newsletter Signup',
  },
}
