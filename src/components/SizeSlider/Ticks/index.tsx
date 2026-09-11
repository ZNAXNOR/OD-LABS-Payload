import React from 'react'
import { ContentColumnSize, CANONICAL_POINTS } from '../utils'

interface SizeSliderTicksProps {
  visiblePoints: ContentColumnSize[]
  currentValueKey: ContentColumnSize | null
  labelsMap: Record<ContentColumnSize, string>
  onSelectPoint: (pointKey: ContentColumnSize) => void
}

export const SizeSliderTicks: React.FC<SizeSliderTicksProps> = ({
  visiblePoints,
  currentValueKey,
  labelsMap,
  onSelectPoint,
}) => {
  if (!visiblePoints || visiblePoints.length === 0) return null

  return (
    <div className="size-slider-field__ticks">
      {visiblePoints.map((pointKey) => {
        const point = CANONICAL_POINTS[pointKey]
        const label = labelsMap[pointKey] || pointKey
        const isSelected = pointKey === currentValueKey

        return (
          <button
            key={pointKey}
            type="button"
            className={[
              'size-slider-field__tick',
              isSelected ? 'size-slider-field__tick--selected' : '',
              point.percent === 0 ? 'size-slider-field__tick--first' : '',
              point.percent === 100 ? 'size-slider-field__tick--last' : '',
            ]
              .filter(Boolean)
              .join(' ')}
            style={{ left: `${point.percent}%` }}
            onClick={() => onSelectPoint(pointKey)}
            title={`${label} (${point.cols}/12 cols)`}
          >
            <span className="size-slider-field__tick-mark" />
            <span className="size-slider-field__tick-label">{label}</span>
          </button>
        )
      })}
    </div>
  )
}
