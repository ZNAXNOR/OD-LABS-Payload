import { standardRichText } from '@/fields/richTextFeatures'
import type { Block } from 'payload'

export const FAQAccordionBlock: Block = {
  slug: 'faqAccordion',
  dbName: 'faq_accordion', // Root level optimization
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
      maxLength: 120,
      admin: {
        description: 'Optional heading for the FAQ section',
        placeholder: 'Frequently Asked Questions',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      maxLength: 300,
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
      maxLength: 50,
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
      dbName: 'faqs', // Keep short names as-is
      required: true,
      minRows: 1,
      maxRows: 50,
      fields: [
        {
          name: 'question',
          type: 'text',
          required: true,
          maxLength: 200,
          validate: (value: any) => {
            if (!value || value.trim().length === 0) {
              return 'Question is required'
            }
            if (!value.trim().endsWith('?')) {
              return 'Question should end with a question mark'
            }
            return true
          },
          admin: {
            placeholder: 'What is your question?',
          },
        },
        {
          name: 'answer',
          type: 'richText',
          required: true,
          admin: {
            description: 'Answer with rich text formatting and enhanced features',
          },
          editor: standardRichText,
        },
        {
          name: 'category',
          type: 'text',
          maxLength: 50,
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
      admin: {
        components: {
          RowLabel: '@/blocks/technical/FAQAccordion/RowLabel#FAQRowLabel',
        },
      },
    },
  ],
}
