import React from 'react'

import type { ArchitectureDiagramSplitSection } from '../../../types'
import { getVariantStyles } from '../utils/getVariantStyles'

export function SplitRenderer({
  section,
  isDark,
}: {
  section: ArchitectureDiagramSplitSection
  isDark: boolean
}) {
  // Left uses the user-selected variant; right is always secondary
  const leftStyles = getVariantStyles(section.variant, isDark)
  const rightStyles = getVariantStyles('secondary', isDark)

  // Right side layout chosen by the editor — 'stack' or 'grid'
  const rightContainerClass =
    section.right_layout === 'grid'
      ? 'grid grid-cols-2 gap-2'
      : 'flex flex-col gap-2'

  return (
    <div className="flex gap-6">
      {/* ── Left side (hierarchy applied, density p-3 / font-bold) ── */}
      <div className="w-1/3 flex flex-col gap-4">
        {section.left.map((item, i) => (
          <div
            key={item.id || i}
            className={`rounded border p-3 text-center font-bold ${leftStyles}`}
          >
            {item.label}
          </div>
        ))}
      </div>

      {/* ── Right side (always secondary, density p-2 / text-xs) ── */}
      <div className={`w-2/3 ${rightContainerClass}`}>
        {section.right.map((item, i) => (
          <div
            key={item.id || i}
            className={`rounded border p-2 text-xs ${rightStyles}`}
          >
            {item.label}
          </div>
        ))}
      </div>
    </div>
  )
}
