'use client'
import type { SelectFieldCellComponent } from 'payload'
import { renderSelectValue } from '../../utilities/selectFieldUtils'

/**
 * Safe Select Cell Component
 *
 * This component safely renders select field values in list views,
 * preventing the "Objects are not valid as a React child" error
 * that can occur when option objects are rendered directly.
 */
export const SafeSelectCell: SelectFieldCellComponent = ({ cellData, field }) => {
  const displayValue = renderSelectValue(cellData, field.options, true)

  // Apply appropriate CSS classes based on the value
  const isEmpty = displayValue === '-'
  const isMultiple = Array.isArray(cellData)

  const className = [
    'select-cell',
    isEmpty && 'select-cell--empty',
    isMultiple && 'select-cell--multiple',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <span className={className} title={displayValue}>
      {displayValue}
    </span>
  )
}

export default SafeSelectCell
