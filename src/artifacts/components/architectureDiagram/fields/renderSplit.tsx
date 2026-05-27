import React from 'react'

import type { ArchitectureDiagramSection } from '../../../types'

export function renderSplit(
  section: ArchitectureDiagramSection,
  styles: { item: string },
) {
  const leftItems = section.left ?? []
  const rightItems = section.right ?? []

  return (
    <div className="grid grid-cols-3 gap-4">
      {/* Left region — 1 column */}
      <div className="col-span-1 flex flex-col gap-4">
        {leftItems.map((item, i) => (
          <div key={item.id || i} className={[styles.item, 'font-bold'].join(' ')}>
            {item.label}
          </div>
        ))}
      </div>

      {/* Right region — 2 columns */}
      <div className="col-span-2 flex flex-col gap-4">
        {rightItems.map((item, i) => (
          <div key={item.id || i} className={styles.item}>
            {item.label}
          </div>
        ))}
      </div>
    </div>
  )
}
