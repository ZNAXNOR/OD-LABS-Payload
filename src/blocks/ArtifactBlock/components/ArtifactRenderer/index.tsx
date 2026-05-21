import React from 'react'

import type { ArtifactItem } from '../../types'

import { StackListArtifact } from '../artifacts/StackListArtifact'
import { ProcessFlowArtifact } from '../artifacts/ProcessFlowArtifact'
import { CodeSnippetArtifact } from '../artifacts/CodeSnippetArtifact'

type Props = {
  item: ArtifactItem
  dark?: boolean
}

export const ArtifactRenderer: React.FC<Props> = ({
  item,
  dark = false,
}) => {
  switch (item.artifactType) {
    case 'stackList':
      return (
        <StackListArtifact
          data={item.stackList}
          dark={dark}
        />
      )

    case 'processFlow':
      return (
        <ProcessFlowArtifact
          data={item.processFlow}
          dark={dark}
        />
      )

    case 'codeSnippet':
      return (
        <CodeSnippetArtifact
          data={item.codeSnippet}
          dark={dark}
        />
      )

    default:
      return null
  }
}
