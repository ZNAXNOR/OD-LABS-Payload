import type { Block } from 'payload'

export const ProcessStepsBlock: Block = {
  slug: 'processSteps',
  dbName: 'process_steps', // Root level optimization
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
      maxLength: 120,
      admin: {
        description: 'Optional heading for the process section',
        placeholder: 'Our Process',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      maxLength: 300,
      admin: {
        description: 'Optional description text',
        placeholder: 'How we work with you',
      },
    },
    {
      name: 'layout',
      type: 'select',
      defaultValue: 'vertical',
      options: [
        {
          label: 'Vertical',
          value: 'vertical',
        },
        {
          label: 'Horizontal',
          value: 'horizontal',
        },
        {
          label: 'Grid',
          value: 'grid',
        },
      ],
      required: true,
      admin: {
        description: 'How to display the process steps',
      },
    },
    {
      name: 'style',
      type: 'select',
      defaultValue: 'numbered',
      options: [
        {
          label: 'Numbered',
          value: 'numbered',
        },
        {
          label: 'Icons',
          value: 'icons',
        },
        {
          label: 'Timeline',
          value: 'timeline',
        },
      ],
      required: true,
      admin: {
        description: 'Visual style of the steps',
      },
    },
    {
      name: 'steps',
      type: 'array',
      dbName: 'steps', // Keep short names as-is
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
          maxLength: 50,
          admin: {
            description: 'Lucide icon name (used when style is "icons")',
            placeholder: 'CheckCircle',
            condition: () => {
              // Always show, but note in description when it's used
              return true
            },
          },
        },
        {
          name: 'title',
          type: 'text',
          required: true,
          maxLength: 100,
          validate: (value: any) => {
            if (!value || value.trim().length === 0) {
              return 'Step title is required'
            }
            return true
          },
          admin: {
            description: 'Step title',
            placeholder: 'Discovery & Planning',
          },
        },
        {
          name: 'description',
          type: 'textarea',
          required: true,
          maxLength: 300,
          validate: (value) => {
            if (!value || value.trim().length === 0) {
              return 'Step description is required'
            }
            return true
          },
          admin: {
            description: 'Step description',
            placeholder: 'We start by understanding your goals and requirements',
          },
        },
        {
          name: 'duration',
          type: 'text',
          maxLength: 50,
          admin: {
            description: 'Optional duration for this step',
            placeholder: '1-2 weeks',
          },
        },
        {
          name: 'details',
          type: 'textarea',
          maxLength: 200,
          admin: {
            description: 'Optional additional details',
            placeholder: 'Key activities, deliverables, etc.',
          },
        },
      ],
      admin: {
        description: 'Add process steps',
        components: {
          RowLabel: '@/blocks/services/ProcessSteps/RowLabel#StepRowLabel',
        },
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
