import React from 'react'
import { ContentColumnSize, CANONICAL_POINTS, findNearestVisiblePoint } from '../utils'

interface SizeSliderProps {
  id: string
  currentValueKey: ContentColumnSize | null
  visiblePoints: ContentColumnSize[]
  currentLabel: string
  onChange: (value: ContentColumnSize) => void
  onKeyDown: (e: React.KeyboardEvent) => void
}

export const SizeSlider: React.FC<SizeSliderProps> = ({
  id,
  currentValueKey,
  visiblePoints,
  currentLabel,
  onChange,
  onKeyDown,
}) => {
  const currentCols = currentValueKey ? CANONICAL_POINTS[currentValueKey].cols : 0

  if (visiblePoints.length === 0) {
    return (
      <div className="size-slider-field__slider-container">
        <input className="size-slider-field__slider" type="range" disabled min={0} max={12} />
      </div>
    )
  }

  // Handle native range change in global 0-12 coordinate space with immediate snapping
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = parseFloat(e.target.value)
    const nearestPoint = findNearestVisiblePoint(rawVal, visiblePoints)
    if (nearestPoint) {
      onChange(nearestPoint)
    }
  }

  return (
    <div className="size-slider-field__slider-container">
      <input
        id={id}
        className="size-slider-field__slider"
        type="range"
        min={0}
        max={12}
        step={0.1}
        value={currentCols}
        onChange={handleSliderChange}
        onKeyDown={onKeyDown}
        aria-label="Column width slider"
        aria-valuemin={0}
        aria-valuemax={12}
        aria-valuenow={currentCols}
        aria-valuetext={`${currentLabel} (${currentCols} columns)`}
      />
    </div>
  )
}
