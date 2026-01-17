/**
 * Field Validator
 * Recursively extracts and validates fields from block configurations
 */

import type { Block, Field, FieldValidationResult, FieldType } from '../types'

export interface ExtractedField {
  field: Field
  path: string
  depth: number
  parent?: string
}

export class FieldValidator {
  /**
   * Recursively extract all fields from a block configuration
   */
  extractAllFields(block: Block): ExtractedField[] {
    const fields: ExtractedField[] = []
    // Guard against undefined or null fields
    if (!block.fields || !Array.isArray(block.fields)) {
      return fields
    }
    this.extractFieldsRecursive(block.fields, '', 0, fields)
    return fields
  }

  /**
   * Recursively extract fields including nested ones
   */
  private extractFieldsRecursive(
    fields: Field[],
    parentPath: string,
    depth: number,
    result: ExtractedField[],
  ): void {
    // Guard against undefined or null fields
    if (!fields || !Array.isArray(fields)) {
      return
    }

    fields.forEach((field) => {
      const fieldPath = parentPath ? `${parentPath}.${field.name}` : field.name

      // Add current field
      result.push({
        field,
        path: fieldPath,
        depth,
        parent: parentPath || undefined,
      })

      // Check for nested fields based on field type
      if (this.hasNestedFields(field)) {
        const nestedFields = this.getNestedFields(field)
        if (nestedFields && nestedFields.length > 0) {
          this.extractFieldsRecursive(nestedFields, fieldPath, depth + 1, result)
        }
      }
    })
  }

  /**
   * Check if a field type can have nested fields
   */
  private hasNestedFields(field: Field): boolean {
    const nestedTypes: FieldType[] = ['group', 'array', 'blocks', 'row', 'collapsible', 'tabs']
    return nestedTypes.includes(field.type)
  }

  /**
   * Get nested fields from a field
   */
  private getNestedFields(field: Field): Field[] | null {
    switch (field.type) {
      case 'group':
      case 'array':
      case 'row':
      case 'collapsible':
        return (field as any).fields || null

      case 'blocks':
        // Blocks contain multiple block definitions, each with fields
        const blocks = (field as any).blocks || []
        const allBlockFields: Field[] = []
        blocks.forEach((block: any) => {
          if (block.fields) {
            allBlockFields.push(...block.fields)
          }
        })
        return allBlockFields.length > 0 ? allBlockFields : null

      case 'tabs':
        // Tabs contain multiple tab definitions, each with fields
        const tabs = (field as any).tabs || []
        const allTabFields: Field[] = []
        tabs.forEach((tab: any) => {
          if (tab.fields) {
            allTabFields.push(...tab.fields)
          }
        })
        return allTabFields.length > 0 ? allTabFields : null

      default:
        return null
    }
  }

  /**
   * Validate fields and detect missing validations
   */
  validateFields(block: Block): FieldValidationResult[] {
    const extractedFields = this.extractAllFields(block)
    const results: FieldValidationResult[] = []

    extractedFields.forEach(({ field, path }) => {
      const validationResult = this.validateField(field, path)
      results.push(validationResult)
    })

    return results
  }

  /**
   * Validate a single field
   */
  private validateField(field: Field, fieldPath: string): FieldValidationResult {
    const missingValidations: string[] = []
    let hasValidation = false

    // Check for validation function
    if (field.validate) {
      hasValidation = true
    }

    // Check for required validation
    if (!field.required && this.shouldBeRequired(field)) {
      missingValidations.push('required')
    } else if (field.required) {
      hasValidation = true
    }

    // Check for unique validation
    if (this.shouldHaveUnique(field) && !field.unique) {
      missingValidations.push('unique')
    } else if (field.unique) {
      hasValidation = true
    }

    // Check for type-specific validations
    const typeSpecificValidations = this.getTypeSpecificValidations(field)
    typeSpecificValidations.forEach((validation) => {
      if (!this.hasValidation(field, validation)) {
        missingValidations.push(validation)
      } else {
        hasValidation = true
      }
    })

    // Determine severity
    const severity = this.determineSeverity(field, missingValidations)

    return {
      fieldPath,
      hasValidation,
      missingValidations,
      severity,
    }
  }

  /**
   * Check if field should be required based on its type and usage
   */
  private shouldBeRequired(field: Field): boolean {
    // Fields that typically should be required
    const criticalTypes: FieldType[] = ['email', 'relationship']

    // Check if field name suggests it should be required
    const criticalNames = ['email', 'username', 'title', 'name', 'slug']

    return (
      criticalTypes.includes(field.type) ||
      criticalNames.some((name) => field.name.toLowerCase().includes(name))
    )
  }

  /**
   * Check if field should have unique constraint
   */
  private shouldHaveUnique(field: Field): boolean {
    // Fields that typically should be unique
    const uniqueNames = ['slug', 'email', 'username', 'handle']

    return uniqueNames.some((name) => field.name.toLowerCase().includes(name))
  }

  /**
   * Get type-specific validations that should be present
   */
  private getTypeSpecificValidations(field: Field): string[] {
    const validations: string[] = []

    switch (field.type) {
      case 'text':
      case 'textarea':
        if (!this.hasValidation(field, 'minLength')) {
          validations.push('minLength')
        }
        if (!this.hasValidation(field, 'maxLength')) {
          validations.push('maxLength')
        }
        break

      case 'number':
        if (!this.hasValidation(field, 'min')) {
          validations.push('min')
        }
        if (!this.hasValidation(field, 'max')) {
          validations.push('max')
        }
        break

      case 'array':
        if (!this.hasValidation(field, 'minRows')) {
          validations.push('minRows')
        }
        if (!this.hasValidation(field, 'maxRows')) {
          validations.push('maxRows')
        }
        break

      case 'upload':
        // Check for file type validation
        const uploadField = field as any
        if (!uploadField.filterOptions && !uploadField.mimeTypes) {
          validations.push('mimeTypes or filterOptions')
        }
        break

      case 'select':
      case 'radio':
        // Check for options
        const selectField = field as any
        if (!selectField.options || selectField.options.length === 0) {
          validations.push('options')
        }
        break

      case 'relationship':
        // Check for relationTo
        const relationField = field as any
        if (!relationField.relationTo) {
          validations.push('relationTo')
        }
        break
    }

    return validations
  }

  /**
   * Check if field has a specific validation
   */
  private hasValidation(field: Field, validationType: string): boolean {
    return (field as any)[validationType] !== undefined
  }

  /**
   * Determine severity level for missing validations
   */
  private determineSeverity(
    field: Field,
    missingValidations: string[],
  ): 'critical' | 'high' | 'medium' | 'low' {
    if (missingValidations.length === 0) {
      return 'low'
    }

    // Critical: Missing required or unique on important fields
    if (
      missingValidations.includes('required') &&
      (field.type === 'email' || field.name.toLowerCase().includes('email'))
    ) {
      return 'critical'
    }

    if (
      missingValidations.includes('unique') &&
      (field.name.toLowerCase().includes('slug') || field.name.toLowerCase().includes('email'))
    ) {
      return 'critical'
    }

    // High: Missing relationTo on relationship fields
    if (field.type === 'relationship' && missingValidations.includes('relationTo')) {
      return 'critical'
    }

    // High: Missing options on select/radio fields
    if (
      (field.type === 'select' || field.type === 'radio') &&
      missingValidations.includes('options')
    ) {
      return 'high'
    }

    // High: Missing file type validation on uploads
    if (field.type === 'upload' && missingValidations.includes('mimeTypes or filterOptions')) {
      return 'high'
    }

    // Medium: Missing length constraints on text fields
    if (
      (field.type === 'text' || field.type === 'textarea') &&
      (missingValidations.includes('minLength') || missingValidations.includes('maxLength'))
    ) {
      return 'medium'
    }

    // Medium: Missing bounds on number fields
    if (
      field.type === 'number' &&
      (missingValidations.includes('min') || missingValidations.includes('max'))
    ) {
      return 'medium'
    }

    // Low: Missing array constraints
    if (
      field.type === 'array' &&
      (missingValidations.includes('minRows') || missingValidations.includes('maxRows'))
    ) {
      return 'low'
    }

    return 'low'
  }

  /**
   * Calculate maximum nesting depth
   */
  calculateMaxDepth(block: Block): number {
    const fields = this.extractAllFields(block)
    return fields.reduce((max, { depth }) => Math.max(max, depth), 0)
  }

  /**
   * Count total fields including nested
   */
  countTotalFields(block: Block): number {
    return this.extractAllFields(block).length
  }

  /**
   * Get fields by type
   */
  getFieldsByType(block: Block, fieldType: FieldType): ExtractedField[] {
    const allFields = this.extractAllFields(block)
    return allFields.filter(({ field }) => field.type === fieldType)
  }

  /**
   * Get fields with validation
   */
  getFieldsWithValidation(block: Block): ExtractedField[] {
    const allFields = this.extractAllFields(block)
    return allFields.filter(({ field }) => {
      return (
        field.validate !== undefined ||
        field.required === true ||
        field.unique === true ||
        (field as any).min !== undefined ||
        (field as any).max !== undefined ||
        (field as any).minLength !== undefined ||
        (field as any).maxLength !== undefined ||
        (field as any).minRows !== undefined ||
        (field as any).maxRows !== undefined
      )
    })
  }

  /**
   * Get fields without validation
   */
  getFieldsWithoutValidation(block: Block): ExtractedField[] {
    const allFields = this.extractAllFields(block)
    const withValidation = this.getFieldsWithValidation(block)
    const withValidationPaths = new Set(withValidation.map((f) => f.path))

    return allFields.filter(({ path }) => !withValidationPaths.has(path))
  }
}
