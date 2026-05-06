'use client'

import { useField, CheckboxField, useFormFields } from '@payloadcms/ui'
import type { CheckboxFieldClientComponent } from 'payload'

export const ExclusiveCheckbox: CheckboxFieldClientComponent = (props) => {
  const { path } = props
  const { value } = useField<boolean>({ path })

  // Find all form fields
  const allFields = useFormFields(([fields]) => fields)

  if (!path) return <CheckboxField {...props} />

  const pathParts = path.split('.')
  const fieldName = pathParts[pathParts.length - 1]
  const arrayPath = pathParts.slice(0, -2).join('.')

  // Check if ANY other field in this array has a true value
  const isAnotherChecked = Object.keys(allFields).some((fieldPath) => {
    return (
      fieldPath.startsWith(arrayPath) &&
      fieldPath.endsWith('.' + fieldName) &&
      fieldPath !== path &&
      allFields[fieldPath]?.value === true
    )
  })

  // If another checkbox is already selected, and THIS is not,
  // we show a disabled message instead of the checkbox.
  if (isAnotherChecked && !value) {
    return (
      <div>
        Another checkbox is currently selected. Uncheck it first to select this one.
      </div>
    )
  }

  // Otherwise return the normal CheckboxField
  return <CheckboxField {...props} />
}
