import type { Field } from 'payload'

export const processFlowFields: Field[] = [
  {
    name: 'steps',
    dbName: 'art_pf_steps',
    type: 'array',
    fields: [
      {
        name: 'label',
        type: 'text',
        required: true,
      },
      {
        name: 'icon',
        type: 'select',
        options: [
          {
            label: 'None',
            value: 'none',
          },
          {
            label: 'Git Commit',
            value: 'GitCommitHorizontal',
          },
          {
            label: 'Test / Flask',
            value: 'FlaskConical',
          },
          {
            label: 'Deploy / Rocket',
            value: 'Rocket',
          },
        ],
        defaultValue: 'none',
      },
      {
        name: 'highlight',
        type: 'checkbox',
        defaultValue: false,
        admin: {
          components: {
            Field: '@/components/ExclusiveCheckbox#ExclusiveCheckbox',
          },
        },
      },
    ],
  },
]
