/**
 * Utility functions for safely handling select field values
 * to prevent "Objects are not valid as a React child" errors
 */

export interface SelectOption {
  label: string
  value: string
}

/**
 * Safely extracts the display value from a select field option
 * @param option - The option value (can be string or object)
 * @param preferLabel - Whether to prefer label over value for display
 * @returns The safe string value to display
 */
export function getSelectDisplayValue(option: unknown, preferLabel: boolean = true): string {
  // Handle null/undefined
  if (option === null || option === undefined) {
    return ''
  }

  // If it's already a string, return it
  if (typeof option === 'string') {
    return option
  }

  // If it's an object with label/value properties
  if (typeof option === 'object' && option !== null) {
    const obj = option as any

    if (preferLabel && 'label' in obj && typeof obj.label === 'string') {
      return obj.label
    }

    if ('value' in obj && typeof obj.value === 'string') {
      return obj.value
    }

    if ('label' in obj && typeof obj.label === 'string') {
      return obj.label
    }
  }

  // Fallback to string conversion
  return String(option)
}

/**
 * Safely extracts the value from a select field option for form submission
 * @param option - The option value (can be string or object)
 * @returns The value to use for form submission
 */
export function getSelectSubmissionValue(option: unknown): string {
  // Handle null/undefined
  if (option === null || option === undefined) {
    return ''
  }

  // If it's already a string, return it
  if (typeof option === 'string') {
    return option
  }

  // If it's an object with value property
  if (typeof option === 'object' && option !== null) {
    const obj = option as any

    if ('value' in obj && typeof obj.value === 'string') {
      return obj.value
    }

    if ('label' in obj && typeof obj.label === 'string') {
      return obj.label
    }
  }

  // Fallback to string conversion
  return String(option)
}

/**
 * Safely handles multiple select field values (hasMany: true)
 * @param values - Array of option values
 * @param preferLabel - Whether to prefer label over value for display
 * @returns Array of safe string values
 */
export function getMultiSelectDisplayValues(
  values: unknown,
  preferLabel: boolean = true,
): string[] {
  if (!Array.isArray(values)) {
    const singleValue = getSelectDisplayValue(values, preferLabel)
    return singleValue ? [singleValue] : []
  }

  return values
    .map((value) => getSelectDisplayValue(value, preferLabel))
    .filter((value) => value !== '')
}

/**
 * Finds the option object from field options by value
 * @param fieldOptions - The field's options array
 * @param value - The value to find
 * @returns The matching option object or null
 */
export function findSelectOption(fieldOptions: unknown, value: string): SelectOption | null {
  if (!Array.isArray(fieldOptions)) {
    return null
  }

  for (const option of fieldOptions) {
    if (typeof option === 'string') {
      if (option === value) {
        return { label: option, value: option }
      }
    } else if (typeof option === 'object' && option !== null) {
      const obj = option as any
      const optionValue = getSelectSubmissionValue(obj)
      if (optionValue === value) {
        return {
          label: getSelectDisplayValue(obj, true),
          value: optionValue,
        }
      }
    }
  }

  return null
}

/**
 * Safely renders a select field value for display in React components
 * @param cellData - The cell data from Payload
 * @param fieldOptions - The field's options array
 * @param preferLabel - Whether to prefer label over value for display
 * @returns Safe string for React rendering
 */
export function renderSelectValue(
  cellData: unknown,
  fieldOptions?: unknown,
  preferLabel: boolean = true,
): string {
  if (cellData === null || cellData === undefined) {
    return '-'
  }

  // Handle array values (hasMany: true)
  if (Array.isArray(cellData)) {
    const displayValues = getMultiSelectDisplayValues(cellData, preferLabel)
    return displayValues.join(', ')
  }

  // Handle single values
  const displayValue = getSelectDisplayValue(cellData, preferLabel)

  // If we have field options and the current value is just a string,
  // try to find the corresponding label
  if (fieldOptions && typeof cellData === 'string') {
    const option = findSelectOption(fieldOptions, cellData)
    if (option && preferLabel) {
      return option.label
    }
  }

  return displayValue || '-'
}

/**
 * Type guard to check if a value is a valid select option object
 * @param value - The value to check
 * @returns True if the value is a valid select option object
 */
export function isSelectOption(value: unknown): value is SelectOption {
  return (
    typeof value === 'object' &&
    value !== null &&
    'label' in value &&
    'value' in value &&
    typeof (value as any).label === 'string' &&
    typeof (value as any).value === 'string'
  )
}

/**
 * Normalizes select field options to ensure consistent format
 * @param options - Raw options from field configuration
 * @returns Normalized array of SelectOption objects
 */
export function normalizeSelectOptions(options: unknown): SelectOption[] {
  if (!Array.isArray(options)) {
    return []
  }

  return options.map((option) => {
    if (typeof option === 'string') {
      return { label: option, value: option }
    } else if (isSelectOption(option)) {
      return option
    } else if (typeof option === 'object' && option !== null) {
      const obj = option as any
      return {
        label: getSelectDisplayValue(obj, true),
        value: getSelectSubmissionValue(obj),
      }
    } else {
      const stringValue = String(option)
      return { label: stringValue, value: stringValue }
    }
  })
}
