import React from 'react'

import type { ArtifactPresentation, CodeSnippetArtifactData } from '../../types'

type Props = {
  data: CodeSnippetArtifactData

  presentation?: ArtifactPresentation
}

export const CodeSnippetArtifact: React.FC<Props> = ({ data, presentation }) => {
  const { showContainer = true, theme = 'dark' } = presentation || {}

  const content = (
    <pre className="overflow-x-auto font-mono text-sm">
      <code>{data?.code}</code>
    </pre>
  )

  if (!showContainer) {
    return content
  }

  return (
    <div
      className={[
        'p-6 rounded border',
        theme === 'dark'
          ? 'bg-[#1a1c1c] border-[#2f3131] text-primary-fixed/80'
          : 'bg-muted border-border text-foreground',
      ].join(' ')}
    >
      {content}
    </div>
  )
}
