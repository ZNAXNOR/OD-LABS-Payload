import type { Field } from 'payload'

import { artifactRegistry } from '../registry/artifactRegistry'

type Args = {
  allowedArtifacts?: string[]
}

export const createArtifactField = ({ allowedArtifacts }: Args = {}): Field => {
  const artifactEntries = Object.entries(artifactRegistry)

  const filteredArtifacts = allowedArtifacts?.length
    ? artifactEntries.filter(([key]) => allowedArtifacts.includes(key))
    : artifactEntries

  return {
    name: 'artifact',
    type: 'group',
    fields: [
      {
        name: 'type',
        type: 'select',
        dbName: 'art_sel',
        required: true,
        options: filteredArtifacts.map(([key, value]) => ({
          label: value.label,
          value: key,
        })),
      },
      ...filteredArtifacts.map(([key, value]) => ({
        name: key,
        label: value.label,
        type: 'group',
        admin: {
          condition: (_, siblingData) => siblingData?.type === key,
        },
        fields: value.fields,
      }) as Field),
    ],
  }
}
