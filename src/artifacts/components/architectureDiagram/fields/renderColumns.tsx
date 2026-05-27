import React from 'react'

import { getGridCols } from '../variants'

import type { ArchitectureDiagramSection } from '../../../types'

export function renderColumns(
  section: ArchitectureDiagramSection,
  styles: { item: string },
) {
  const count = Math.min(section.items?.length || 1, 3)
  const gridCols = getGridCols(count)

  return (
    <div className={`grid ${gridCols} gap-4`}>
      {section.items?.map((item, i) => (
        <div key={item.id || i} className={styles.item}>
          {item.label}
        </div>
      ))}
    </div>
  )
}
