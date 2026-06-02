import React from 'react'

import type { ArchitectureDiagramColumnsSection } from '../../../types'
import { getVariantStyles } from '../utils/getVariantStyles'

export function ColumnsRenderer({
  section,
  isDark,
}: {
  section: ArchitectureDiagramColumnsSection
  isDark: boolean
}) {
  const styles = getVariantStyles(section.variant, isDark)

  const gridMap = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
  }

  const cols =
    gridMap[
      Math.min(
        section.items.length,
        3,
      ) as 1 | 2 | 3
    ]

  return (
    <div className={`grid ${cols} gap-4`}>
      {section.items.map((item, i) => (
        <div
          key={item.id || i}
          className={`rounded border p-4 text-center text-sm ${styles}`}
        >
          {item.label}
        </div>
      ))}
    </div>
  )
}
