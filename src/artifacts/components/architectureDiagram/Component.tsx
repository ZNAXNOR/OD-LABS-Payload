import React from 'react'

import { ArrowDown } from 'lucide-react'

import { getSectionStyles } from './variants'
import { renderRow } from './fields/renderRow'
import { renderColumns } from './fields/renderColumns'
import { renderSplit } from './fields/renderSplit'

import type {
  ArtifactPresentation,
  ArchitectureDiagramArtifactData,
  ArchitectureDiagramSection,
  ArchitectureDiagramLayout,
} from '../../types'

/* ------------------------------------------------------------------ */
/*  Layout dispatch                                                    */
/* ------------------------------------------------------------------ */

const layoutRenderers: Record<
  ArchitectureDiagramLayout,
  (section: ArchitectureDiagramSection, styles: { item: string }) => React.ReactNode
> = {
  row: renderRow,
  columns: renderColumns,
  split: renderSplit,
}

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */

type Props = {
  data: ArchitectureDiagramArtifactData

  presentation?: ArtifactPresentation
}

export const ArchitectureDiagramArtifact: React.FC<Props> = ({ data, presentation }) => {
  const { showContainer = true, showTitle = true, theme = 'dark' } = presentation || {}

  const isDark = theme === 'dark'

  const content = (
    <div className="space-y-6">
      {showTitle && data.title && (
        <div className="flex items-center gap-3 pb-4 border-b border-current/10">
          <span className="font-mono text-xs uppercase tracking-widest font-bold">
            {data.title}
          </span>
        </div>
      )}

      <div className="space-y-6">
        {data.sections?.map((section, sectionIndex) => {
          const layout = section.layout
          const variant = section.variant ?? 'secondary'

          const styles = getSectionStyles(layout, variant, isDark)

          const renderer = layoutRenderers[layout]

          return (
            <React.Fragment key={section.id || sectionIndex}>
              {renderer(section, styles)}

              {sectionIndex < (data.sections?.length || 0) - 1 && (
                <div className="flex justify-center py-2 opacity-50">
                  <ArrowDown className="w-6 h-6 font-black" />
                </div>
              )}
            </React.Fragment>
          )
        })}
      </div>
    </div>
  )

  if (!showContainer) {
    return content
  }

  return (
    <div
      className={[
        'rounded border p-8',

        isDark
          ? 'bg-[#111111] border-[#2f3131] text-white'
          : 'bg-background border-border text-foreground',
      ].join(' ')}
    >
      {content}
    </div>
  )
}
