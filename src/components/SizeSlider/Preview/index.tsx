import React from 'react'
import { ContentColumnSize, CANONICAL_POINTS } from '../utils'

interface SizeSliderPreviewProps {
  currentValueKey: ContentColumnSize | null
  currentLabel: string
}

export const SizeSliderPreview: React.FC<SizeSliderPreviewProps> = ({
  currentValueKey,
  currentLabel,
}) => {
  const currentCols = currentValueKey ? CANONICAL_POINTS[currentValueKey].cols : 0
  const currentPercent = currentValueKey ? CANONICAL_POINTS[currentValueKey].percent : 0

  return (
    <div className="size-slider-field__preview">
      {/* 12 Grid Divider lines */}
      <div className="size-slider-field__preview-grid">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="size-slider-field__preview-grid-col" />
        ))}
      </div>

      {/* Filled Layout Area */}
      <div
        style={{ width: `${currentPercent}%` }}
        className={`size-slider-field__preview-bar ${
          currentCols === 0 ? 'size-slider-field__preview-bar--zero' : ''
        }`}
      >
        {currentCols > 0 && currentValueKey && (
          <span className="size-slider-field__preview-label">{currentLabel}</span>
        )}
      </div>

      {/* Empty Area */}
      {currentPercent < 100 && (
        <div
          style={{ width: `${100 - currentPercent}%` }}
          className="size-slider-field__preview-empty"
        >
          {currentCols === 0 ? 'Hidden (0 cols)' : 'empty'}
        </div>
      )}
    </div>
  )
}
