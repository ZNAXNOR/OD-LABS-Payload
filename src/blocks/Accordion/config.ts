import type { Block } from 'payload'

export const Accordion: Block = {
  slug: 'accordion',
  interfaceName: 'AccordionBlock',
  fields: [
    {
      name: 'heading',
      type: 'text',
      required: true,
    },
    {
      name: 'items',
      type: 'array',
      fields: [
        {
          name: 'question',
          type: 'text',
          required: true,
        },
        {
          name: 'answer',
          type: 'textarea',
          required: true,
        },
      ],
      required: true,
    },
  ],
}
