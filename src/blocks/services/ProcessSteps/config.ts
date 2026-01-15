import type { Block } from 'payload'

export const ProcessStepsBlock: Block = {
  slug: 'processSteps',
  interfaceName: 'ProcessStepsBlock',
  labels: {
    singular: 'Process Steps Block',
    plural: 'Process Steps Blocks',
  },
  admin: {
    group: 'Services',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      admin: {
        description: 'Optional heading for the process section',
        placeholder: 'Our Process',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        description: 'Optional description text',
        placeholder: 'How we work with you',
      },
    },
    {
      name: 'layout',
      type: 'select',
      options: [
        { label: 'Vertical', value: 'vertical' },
        { label: 'Horizontal', value: 'horizontal' },
        { label: 'Grid', value: 'grid' },
      ],
      defaultValue: 'vertical',
      required: true,
      admin: {
        description: 'How to display the process steps',
      },
    },
    {
      name: 'style',
      type: 'select',
      options: [
        { label: 'Numbered', value: 'numbered' },
        { label: 'Icons', value: 'icons' },
        { label: 'Timeline', value: 'timeline' },
      ],
      defaultValue: 'numbered',
      required: true,
      admin: {
        description: 'Visual style of the steps',
      },
    },
    {
      name: 'steps',
      type: 'array',
      minRows: 2,
      maxRows: 12,
      labels: {
        singular: 'Step',
        plural: 'Steps',
      },
      fields: [
        {
          name: 'icon',
          type: 'text',
          admin: {
            description: 'Lucide icon name (used when style is "icons")',
            placeholder: 'CheckCircle',
            condition: (data, siblingData, { user }) => {
              // Access parent data through the form context
              return true // Always show, but note in description when it's used
            },
          },
        },
        {
          name: 'title',
          type: 'text',
          required: true,
          admin: {
            description: 'Step title',
            placeholder: 'Discovery & Planning',
          },
        },
        {
          name: 'description',
          type: 'textarea',
          required: true,
          admin: {
            description: 'Step description',
            placeholder: 'We start by understanding your goals and requirements',
          },
        },
        {
          name: 'duration',
          type: 'text',
          admin: {
            description: 'Optional duration for this step',
            placeholder: '1-2 weeks',
          },
        },
        {
          name: 'details',
          type: 'textarea',
          admin: {
            description: 'Optional additional details',
            placeholder: 'Key activities, deliverables, etc.',
          },
        },
      ],
      admin: {
        description: 'Add process steps',
      },
    },
    {
      name: 'showConnectors',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Show connecting lines between steps (for timeline style)',
      },
    },
  ],
}
