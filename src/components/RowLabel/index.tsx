'use client'
import { useRowLabel } from '@payloadcms/ui'
import React from 'react'

type Props = {
  /**
   * The field path(s) to check for the label text, in order of preference.
   * Supports nested paths like 'link.label'.
   */
  fields?: string[]
  /**
   * Prefix for the fallback label (e.g. "Item" -> "Item 01")
   */
  prefix?: string
  /**
   * Whether to pad the index with leading zeros (default: true)
   */
  padIndex?: boolean
  /**
   * Whether to capitalize the first letter of the label (default: false)
   */
  capitalize?: boolean
}

export const GenericRowLabel: React.FC<Props> = ({
  fields = ['label', 'title', 'name'],
  prefix = 'Item',
  padIndex = true,
  capitalize = false,
}) => {
  const { data, rowNumber } = useRowLabel<any>()

  const index = typeof rowNumber === 'number' ? rowNumber + 1 : 1
  const displayIndex = padIndex ? index.toString().padStart(2, '0') : index.toString()

  let label = ''

  if (data) {
    for (const field of fields) {
      const value = field.split('.').reduce((obj, key) => obj?.[key], data)
      if (value && typeof value === 'string') {
        label = capitalize ? value.charAt(0).toUpperCase() + value.slice(1) : value
        break
      }
    }
  }

  if (!label) {
    label = `${prefix} ${displayIndex}`
  }

  return <div>{label}</div>
}
