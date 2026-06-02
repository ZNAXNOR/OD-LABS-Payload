import React from 'react'

import { ArrowDown } from 'lucide-react'

import { RowRenderer } from './renderers/RowRenderer'
import { ColumnsRenderer } from './renderers/ColumnsRenderer'
import { SplitRenderer } from './renderers/SplitRenderer'

import type { ArtifactPresentation, ArchitectureDiagramArtifactData } from '../../types'

type Props = {
  data: ArchitectureDiagramArtifactData

  presentation?: ArtifactPresentation
}

export const ArchitectureDiagramArtifact: React.FC<Props> = ({ data, presentation }) => {
  const { showTitle = true, theme = 'dark' } = presentation || {}

  const isDark = theme === 'dark'

  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-lg shadow-md p-6 relative z-10 font-mono text-sm">
      {showTitle && data.title && (
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-surface-container">
          <span className="font-bold uppercase tracking-widest text-xs">{data.title}</span>
        </div>
      )}

      <div className="space-y-6">
        {data.sections?.map((section, sectionIndex) => {
          let rendered: React.ReactNode = null

          switch (section.layout) {
            case 'row':
              rendered = <RowRenderer section={section} isDark={isDark} />
              break
            case 'columns':
              rendered = <ColumnsRenderer section={section} isDark={isDark} />
              break
            case 'split':
              rendered = <SplitRenderer section={section} isDark={isDark} />
              break
            default:
              break
          }

          return (
            <React.Fragment key={section.id || sectionIndex}>
              {rendered}

              {sectionIndex < (data.sections?.length || 0) - 1 && (
                <div className="flex justify-center py-2">
                  <ArrowDown className="w-6 h-6 font-black" />
                </div>
              )}
            </React.Fragment>
          )
        })}
      </div>
    </div>
  )
}
