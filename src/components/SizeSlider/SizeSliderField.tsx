'use client'

import React, { useId, useMemo } from 'react'
import { useField } from '@payloadcms/ui'
import type { SelectFieldClientProps } from 'payload'

import {
  ContentColumnSize,
  ContentColumnSizeConfig,
  CANONICAL_POINTS,
  getVisiblePoints,
  normalizeValue,
} from './utils'
import { SizeSliderPreview } from './Preview'
import { SizeSlider } from './Slider'
import { SizeSliderTicks } from './Ticks'

import './index.scss'

type CustomClientProps = SelectFieldClientProps & {
  fieldProps?: ContentColumnSizeConfig
}

export const SizeSliderField: React.FC<CustomClientProps> = (props) => {
  const { path, field, fieldProps } = props
  const { value, setValue } = useField<ContentColumnSize>({ path: path || field.name })
  const fieldId = useId()

  // Extract value -> label map from Payload select field options config
  const labelsMap = useMemo(() => {
    const map: Record<ContentColumnSize, string> = {
      zero: 'Zero (Hidden)',
      oneThird: 'One Third',
      half: 'Half',
      twoThirds: 'Two Thirds',
      full: 'Full',
    }

    if (field && 'options' in field && Array.isArray(field.options)) {
      field.options.forEach((opt) => {
        if (typeof opt === 'object' && opt !== null && 'value' in opt && 'label' in opt) {
          const optValue = opt.value as ContentColumnSize
          const optLabel = typeof opt.label === 'string' ? opt.label : String(opt.label)
          map[optValue] = optLabel
        }
      })
    }

    return map
  }, [field])

  // Calculate visible points based on snapPoints and min/max
  const visiblePoints = getVisiblePoints(fieldProps)

  // Normalize initial / current value against visible points
  const currentValueKey = normalizeValue(value, visiblePoints)
  const currentCols = currentValueKey ? CANONICAL_POINTS[currentValueKey].cols : 0
  const currentLabel = currentValueKey ? labelsMap[currentValueKey] : 'None'

  const handleSelectPoint = (pointKey: ContentColumnSize) => {
    if (visiblePoints.includes(pointKey)) {
      setValue(pointKey)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!currentValueKey || visiblePoints.length === 0) return

    const currentIndex = visiblePoints.indexOf(currentValueKey)

    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
      e.preventDefault()
      if (currentIndex >= 0 && currentIndex < visiblePoints.length - 1) {
        setValue(visiblePoints[currentIndex + 1])
      }
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
      e.preventDefault()
      if (currentIndex > 0) {
        setValue(visiblePoints[currentIndex - 1])
      }
    } else if (e.key === 'Home') {
      e.preventDefault()
      if (visiblePoints.length > 0) {
        setValue(visiblePoints[0])
      }
    } else if (e.key === 'End') {
      e.preventDefault()
      if (visiblePoints.length > 0) {
        setValue(visiblePoints[visiblePoints.length - 1])
      }
    }
  }

  return (
    <div className="size-slider-field">
      {/* Header Label & Badge */}
      <div className="size-slider-field__header">
        <label htmlFor={fieldId} className="size-slider-field__label">
          {field.label
            ? typeof field.label === 'string'
              ? field.label
              : 'Column Width'
            : 'Column Width'}
        </label>
        <span className="size-slider-field__badge">
          {currentLabel} ({currentCols}/12)
        </span>
      </div>

      {/* Visual Layout Preview Component */}
      <SizeSliderPreview currentValueKey={currentValueKey} currentLabel={currentLabel} />

      {/* Range Slider Component (Real 0-12 spatial coordinates with discrete snapping) */}
      <SizeSlider
        id={fieldId}
        currentValueKey={currentValueKey}
        visiblePoints={visiblePoints}
        currentLabel={currentLabel}
        onChange={handleSelectPoint}
        onKeyDown={handleKeyDown}
      />

      {/* Spatially Accurate Snap Points & Ticks Component */}
      <SizeSliderTicks
        visiblePoints={visiblePoints}
        currentValueKey={currentValueKey}
        labelsMap={labelsMap}
        onSelectPoint={handleSelectPoint}
      />
    </div>
  )
}

export { SizeSliderField as SizeSliderComponent }
export default SizeSliderField
