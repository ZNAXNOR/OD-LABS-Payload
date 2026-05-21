import React from 'react'

import type { CodeSnippetArtifact as CodeSnippetArtifactType } from '../../../types'

type Props = {
  data?: CodeSnippetArtifactType
  dark?: boolean
}

export const CodeSnippetArtifact: React.FC<Props> = ({
  data,
  dark = false,
}) => {
  return (
    <div
      className={[
        'p-6 rounded border font-mono text-sm overflow-x-auto',
        dark
          ? 'bg-[#1a1c1c] border-[#2f3131] text-primary-fixed/80'
          : 'bg-muted border-border text-foreground',
      ].join(' ')}
    >
      <pre>
        <code>{data?.code}</code>
      </pre>
    </div>
  )
}
