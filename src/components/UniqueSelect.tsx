'use client'

import { useField } from '@payloadcms/ui'
import type { SelectFieldClientComponent } from 'payload'
import React from 'react'

const UniqueSelect: SelectFieldClientComponent = ({ field, path }) => {
  const { value, setValue } = useField({ path })

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setValue(e.target.value)
  }

  return (
    <div className="unique-select-field">
      <label htmlFor={path} style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>
        {typeof field.label === 'string' ? field.label : 'Select'}
      </label>
      <select
        id={path}
        value={(value as string) || ''}
        onChange={handleChange}
        style={{
          width: '100%',
          padding: '8px 12px',
          border: '1px solid #d1d5db',
          borderRadius: '4px',
          fontSize: '14px',
        }}
      >
        <option value="">Select an option...</option>
        {field.options?.map((option) => {
          const optionValue = typeof option === 'string' ? option : option.value
          const optionLabel =
            typeof option === 'string'
              ? option
              : typeof option.label === 'string'
                ? option.label
                : option.value

          return (
            <option key={optionValue} value={optionValue}>
              {optionLabel}
            </option>
          )
        })}
      </select>
      {field.admin?.description && typeof field.admin.description === 'string' && (
        <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#6b7280' }}>
          {field.admin.description}
        </p>
      )}
    </div>
  )
}

export default UniqueSelect
