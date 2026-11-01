import type { Block } from 'payload'

import { CONTENT_SCOPES } from '@/components/AI/contentScopes'

export const AIBlock: Block = {
  slug: 'aiBlock',
  interfaceName: 'AIBlock',
  labels: {
    singular: 'AI Workspace',
    plural: 'AI Workspaces',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      label: 'Introductory heading',
      admin: {
        description: 'Optional. Overrides the default heading on the initial AI screen.',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Introductory description',
      admin: {
        description: 'Optional. Overrides the default description on the initial AI screen.',
      },
    },
    {
      name: 'placeholder',
      type: 'text',
      label: 'Prompt placeholder',
      defaultValue: 'Ask about OD LABS...',
    },
    {
      name: 'defaultScope',
      type: 'select',
      label: 'Default content scope',
      defaultValue: 'all',
      required: true,
      options: CONTENT_SCOPES.map(({ value, label }) => ({ label, value })),
    },
  ],
}
