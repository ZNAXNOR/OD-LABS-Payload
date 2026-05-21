import React from 'react'

import {
  ListTree,
  GitMerge,
  Verified,
} from 'lucide-react'

import RichText from '@/components/RichText'

import type { ArtifactItem } from '../../types'

import { ArtifactRenderer } from '../ArtifactRenderer'

const iconMap = {
  architecture: ListTree,
  mediation: GitMerge,
  verified: Verified,
}

type Props = {
  item: ArtifactItem
  dark?: boolean
}

export const ArtifactCard: React.FC<Props> = ({
  item,
  dark = false,
}) => {
  const Icon =
    iconMap[item.icon as keyof typeof iconMap]

  return (
    <div className="flex flex-col h-full">
      <div
        className={[
          'mb-8',
          dark
            ? 'text-primary-fixed'
            : 'text-primary',
        ].join(' ')}
      >
        {Icon && <Icon className="w-10 h-10" />}
      </div>

      <h3
        className={[
          'text-2xl font-bold mb-4 font-mono',
          dark
            ? 'text-surface-container-lowest'
            : 'text-foreground',
        ].join(' ')}
      >
        {item.title}
      </h3>

      {item.description && (
        <RichText
          data={item.description}
          enableGutter={false}
          enableProse={false}
          className={[
            'prose prose-lg max-w-none mb-10',
            dark
              ? 'prose-invert text-surface-dim prose-p:text-surface-dim'
              : 'text-muted-foreground',
          ].join(' ')}
        />
      )}

      <div className="mt-auto">
        <ArtifactRenderer
          item={item}
          dark={dark}
        />
      </div>
    </div>
  )
}
