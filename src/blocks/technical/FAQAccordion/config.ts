import type { Block } from 'payload'

export const FAQAccordionBlock: Block = {
  slug: 'faqAccordion',
  interfaceName: 'FAQAccordionBlock',
  labels: {
    singular: 'FAQ Accordion Block',
    plural: 'FAQ Accordion Blocks',
  },
  admin: {
    group: 'Technical',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      admin: {
        description: 'Optional heading for the FAQ section',
        placeholder: 'Frequently Asked Questions',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        description: 'Optional description text below the heading',
        placeholder: 'Find answers to common questions',
      },
    },
    {
      name: 'allowMultipleOpen',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Allow multiple FAQ items to be open at the same time',
      },
    },
    {
      name: 'defaultOpen',
      type: 'text',
      admin: {
        description: 'Comma-separated indices of items to open by default (e.g., 0,2)',
        placeholder: '0',
      },
    },
    {
      name: 'showSearch',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Show search box to filter FAQs',
      },
    },
    {
      name: 'faqs',
      type: 'array',
      required: true,
      minRows: 1,
      fields: [
        {
          name: 'question',
          type: 'text',
          required: true,
          admin: {
            placeholder: 'What is your question?',
          },
        },
        {
          name: 'answer',
          type: 'richText',
          required: true,
          admin: {
            description: 'Answer with rich text formatting',
          },
        },
        {
          name: 'category',
          type: 'text',
          admin: {
            description: 'Optional category for grouping',
            placeholder: 'General',
          },
        },
      ],
      labels: {
        singular: 'FAQ',
        plural: 'FAQs',
      },
    },
  ],
}
