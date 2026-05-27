import React from 'react'
import { Layers3, Workflow, Boxes } from 'lucide-react'

import type { ServiceShowcaseItem } from '../types'
import { CMSLink } from '@/components/Link'

const iconMap = {
  architecture: Layers3,
  workflow: Workflow,
  systems: Boxes,
}

type Props = {
  item: ServiceShowcaseItem
}

export const StickyRail: React.FC<Props> = ({ item }) => {
  const Icon = iconMap[item.tag.icon as keyof typeof iconMap]

  return (
    <aside className="lg:sticky lg:top-32">
      <div className="flex items-center gap-6 mb-8">
        {item.number && (
          <span className="font-mono text-6xl font-semibold text-black/20 text-on-surface-variant/30 leading-none">
            {item.number}
          </span>
        )}

        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-surface-container text-on-surface-variant rounded text-xs font-mono font-bold uppercase tracking-widest border border-outline-variant">
          {Icon && <Icon className="w-4 h-4" />}
          <span>{item.tag.text}</span>
        </div>
      </div>

      <h2 className="text-5xl font-extrabold tracking-tight mb-8">
        {item.title}
      </h2>

      <div className="bg-surface p-8 border border-outline-variant rounded shadow-sm">
        <div className="mb-8">
          <p className="text-xs text-on-surface-variant uppercase font-bold mb-2 tracking-widest font-mono">
            Timeline
          </p>
          <p className="text-xl font-medium text-on-surface">
            {item.timeline}
          </p>
        </div>

        {!!item.deliverables?.length && (
          <div className="mb-10">
            <p className="text-xs text-on-surface-variant uppercase font-bold mb-2 tracking-widest font-mono">
              Deliverables
            </p>
            <p className="text-base text-on-surface-variant leading-relaxed">
              {item.deliverables.join(', ')}.
            </p>
          </div>
        )}

        {item.cta && (
          <CMSLink
            {...item.cta}
            className="block w-full bg-surface-container-lowest border border-black text-on-surface hover:bg-black hover:text-white transition-colors py-4 rounded font-bold text-base text-center"
          />
        )}
      </div>
    </aside>
  )
}
