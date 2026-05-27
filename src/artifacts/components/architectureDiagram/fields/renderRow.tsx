import React from 'react'

import type { ArchitectureDiagramSection } from '../../../types'

export function renderRow(
  section: ArchitectureDiagramSection,
  styles: { item: string },
) {
  return (
    <div className="grid grid-cols-1 gap-4">
      {section.items?.map((item, i) => (
        <div key={item.id || i} className={styles.item}>
          {item.label}
        </div>
      ))}
    </div>
  )
}
