import React from 'react'

import type { ArtifactPresentation, StackListArtifactData } from '../../types'

type Props = {
  data: StackListArtifactData

  presentation?: ArtifactPresentation
}

export const StackListArtifact: React.FC<Props> = ({ data, presentation }) => {
  const { showContainer = true, theme = 'dark' } = presentation || {}

  const content = (
    <ul className="space-y-4 font-mono text-sm">
      {data?.rows?.map((row, index) => (
        <li
          key={row.id || index}
          className={`flex justify-between border-current/10 pt-3 ${index > 0 ? 'border-t' : ''}`}
        >
          <span>{row.label}</span>

          <span className={theme === 'dark' ? 'text-primary-fixed' : 'text-primary'}>
            {row.value}
          </span>
        </li>
      ))}
    </ul>
  )

  if (!showContainer) {
    return content
  }

  return (
    <div
      className={[
        'p-6 rounded border',
        theme === 'dark'
          ? 'bg-[#1a1c1c] border-[#2f3131] text-surface-dim'
          : 'bg-muted border-border text-muted-foreground',
      ].join(' ')}
    >
      {content}
    </div>
  )
}
