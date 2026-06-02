import type { Field } from 'payload'

import { artifactRegistry } from '../registry/artifactRegistry'

type Args = {
  allowedArtifacts?: string[]
  dbNamePrefix?: string
}

export const createArtifactField = ({ allowedArtifacts, dbNamePrefix }: Args = {}): Field => {
  const prefix = dbNamePrefix ? `${dbNamePrefix}_` : ''
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
        dbName: prefix ? `${prefix}art_sel` : 'art_sel',
        required: true,
        options: filteredArtifacts.map(([key, value]) => ({
          label: value.label,
          value: key,
        })),
      },
      ...filteredArtifacts.map(([key, value]) => {
        const customizedFields = value.fields.map((field) => {
          if (prefix && 'dbName' in field && field.dbName) {
            return {
              ...field,
              dbName: `${prefix}${field.dbName}`,
            }
          }
          return field
        })

        return {
          name: key,
          label: value.label,
          type: 'group',
          admin: {
            condition: (_, siblingData) => siblingData?.type === key,
          },
          fields: customizedFields,
        } as Field
      }),
    ],
  }
}
