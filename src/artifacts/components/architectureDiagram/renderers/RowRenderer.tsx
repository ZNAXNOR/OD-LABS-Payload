import React from 'react'

import type { ArchitectureDiagramRowSection } from '../../../types'
import { getVariantStyles } from '../utils/getVariantStyles'

export function RowRenderer({
  section,
  isDark,
}: {
  section: ArchitectureDiagramRowSection
  isDark: boolean
}) {
  const styles = getVariantStyles(section.variant, isDark)

  return (
    <div className="grid grid-cols-1 gap-4">
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
