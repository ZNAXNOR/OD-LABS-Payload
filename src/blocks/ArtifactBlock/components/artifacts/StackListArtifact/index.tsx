import React from 'react'

import type { StackListArtifact as StackListArtifactType } from '../../../types'

type Props = {
  data?: StackListArtifactType
  dark?: boolean
}

export const StackListArtifact: React.FC<Props> = ({
  data,
  dark = false,
}) => {
  return (
    <div
      className={[
        'p-6 rounded border font-mono text-sm',
        dark
          ? 'bg-[#1a1c1c] border-[#2f3131] text-surface-dim'
          : 'bg-muted border-border text-muted-foreground',
      ].join(' ')}
    >
      <ul className="space-y-4">
        {data?.rows?.map((row, index) => (
          <li
            key={row.id || index}
            className={`flex justify-between border-current/10 pt-3 ${index > 0 ? 'border-t' : ''}`}
          >
            <span>{row.label}</span>

            <span
              className={
                dark
                  ? 'text-primary-fixed'
                  : 'text-primary'
              }
            >
              {row.value}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
