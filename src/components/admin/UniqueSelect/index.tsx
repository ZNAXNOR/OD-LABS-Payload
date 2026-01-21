'use client'
import React, { useMemo } from 'react'
import { useField, useFormFields, SelectInput } from '@payloadcms/ui'
import { SelectFieldClientComponent } from 'payload'

const UniqueSelect: SelectFieldClientComponent = (props) => {
  const { field, path } = props
  const { value, setValue, showError, errorMessage } = useField<string>({ path }) as any

  const allRowValues = useFormFields<any>(([fields]) => {
    const values: string[] = []
    const pathParts = path.split('.')
    const fieldName = pathParts.pop()
    pathParts.pop()
    const siblingPrefix = pathParts.join('.')

    Object.keys(fields).forEach((key) => {
      const keyParts = key.split('.')
      const keyFieldName = keyParts.pop()
      keyParts.pop()
      const keyPrefix = keyParts.join('.')
      if (keyPrefix === siblingPrefix && keyFieldName === fieldName) {
        const field = fields[key]
        if (field) {
          const val = field.value as string
          if (val) values.push(val)
        }
      }
    })
    return values
  })

  const filteredOptions = useMemo(() => {
    if (!field.options) return []
    const options = field.options.map((option: any) => {
      if (typeof option === 'string') return { label: option, value: option }
      return option
    })
    return options.filter((option: any) => {
      if (option.value === value) return true
      return !allRowValues.includes(option.value)
    })
  }, [field.options, allRowValues, value])

  const selectProps: any = {
    path,
    name: field.name,
    label: field.label,
    value,
    onChange: (incomingValue: any) => {
      // Ensure we only save the string value, not the option object
      const newValue =
        typeof incomingValue === 'object' && incomingValue !== null
          ? incomingValue.value
          : incomingValue
      setValue(newValue)
    },
    options: filteredOptions,
    showError,
    errorMessage,
    required: field.required,
    style: {
      width: field.admin?.width || '100%',
    },
  }

  return <SelectInput {...selectProps} />
}

export default UniqueSelect
