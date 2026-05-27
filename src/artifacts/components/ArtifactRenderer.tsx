import React from 'react'

import { artifactRegistry } from '../registry/artifactRegistry'

import type {
  Artifact,
  ArtifactPresentation,
} from '../types'

type Props = {
  artifact: Artifact

  presentation?: ArtifactPresentation
}

export const ArtifactRenderer: React.FC<Props> = ({
  artifact,
  presentation = {},
}) => {
  const registryItem =
    artifactRegistry[artifact.type]

  if (!registryItem) {
    return null
  }

  const Component = registryItem.component

  const data = (artifact as any)[artifact.type] ?? artifact.data

  return (
    <Component
      data={data as any}
      presentation={presentation}
    />
  )
}
