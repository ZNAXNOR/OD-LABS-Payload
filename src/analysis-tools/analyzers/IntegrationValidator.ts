/**
 * Integration Validator
 * Validates that block configurations properly integrate with their React components
 * Checks field-prop mapping, naming conventions, preview components, and nested data flow
 */

import type {
  Block,
  Component,
  Field,
  PropDefinition,
  IntegrationResult,
  MappingIssue,
  NamingIssue,
  PreviewIssue,
  IntegrationIssue,
} from '../types'
import * as fs from 'fs'

export class IntegrationValidator {
  /**
   * Validate integration between a block and its component
   */
  validateIntegration(block: Block, component: Component): IntegrationResult {
    const issues: IntegrationIssue[] = []
    const suggestions: string[] = []

    // 1. Validate field-to-prop mapping
    const mappingIssues = this.validateFieldMapping(block.fields, component.props)
    issues.push(...mappingIssues)

    // 2. Validate naming conventions
    const namingIssues = this.validateNaming(block, component)
    issues.push(...namingIssues)

    // 3. Validate preview component (if configured)
    const previewIssues = this.validatePreview(block)
    issues.push(...previewIssues)

    // 4. Validate nested field data flow
    const nestedIssues = this.validateNestedFieldDataFlow(block, component)
    issues.push(...nestedIssues)

    // Generate suggestions based on issues
    if (mappingIssues.length > 0) {
      suggestions.push(
        'Ensure all block fields have corresponding component props with matching types',
      )
    }

    if (namingIssues.length > 0) {
      suggestions.push('Follow consistent naming conventions between blocks and components')
    }

    if (previewIssues.length > 0) {
      suggestions.push('Verify preview component exists and accepts correct props')
    }

    const isValid = issues.length === 0

    return {
      blockSlug: block.slug,
      componentName: component.name,
      isValid,
      issues,
      suggestions,
    }
  }

  /**
   * Validate field-to-prop mapping
   * Compares block fields with component props to ensure they match
   */
  validateFieldMapping(blockFields: Field[], componentProps: PropDefinition[]): MappingIssue[] {
    const issues: MappingIssue[] = []

    // Extract all field names (including nested fields)
    const fieldNames = this.extractAllFieldNames(blockFields)
    const propNames = componentProps.map((prop) => prop.name)

    // Create maps for quick lookup
    const fieldMap = new Map<string, Field>()
    this.buildFieldMap(blockFields, fieldMap)

    const propMap = new Map<string, PropDefinition>()
    componentProps.forEach((prop) => propMap.set(prop.name, prop))

    // Check for missing props (fields without corresponding props)
    fieldNames.forEach((fieldName) => {
      if (!propNames.includes(fieldName)) {
        const field = fieldMap.get(fieldName)
        issues.push({
          type: 'missing-prop',
          fieldName,
          expected: `Prop '${fieldName}' in component`,
          actual: 'Prop not found',
          severity: field?.required ? 'critical' : 'high',
        })
      }
    })

    // Check for extra props (props without corresponding fields)
    propNames.forEach((propName) => {
      if (!fieldNames.includes(propName)) {
        const prop = propMap.get(propName)
        // Skip common React props and internal props
        if (this.isCommonProp(propName)) {
          return
        }

        issues.push({
          type: 'extra-prop',
          fieldName: propName,
          expected: `Field '${propName}' in block config`,
          actual: 'Field not found',
          severity: prop?.required ? 'high' : 'medium',
        })
      }
    })

    // Check for type mismatches
    fieldNames.forEach((fieldName) => {
      if (propNames.includes(fieldName)) {
        const field = fieldMap.get(fieldName)
        const prop = propMap.get(fieldName)

        if (field && prop) {
          const typeCompatible = this.checkTypeCompatibility(field, prop)
          if (!typeCompatible) {
            issues.push({
              type: 'type-mismatch',
              fieldName,
              expected: this.getExpectedPropType(field),
              actual: prop.type,
              severity: 'high',
            })
          }
        }
      }
    })

    return issues
  }

  /**
   * Validate naming conventions
   */
  validateNaming(block: Block, component: Component): NamingIssue[] {
    const issues: NamingIssue[] = []

    // 1. Check if block slug matches component file name
    const expectedComponentName = this.slugToComponentName(block.slug)
    if (component.name !== expectedComponentName) {
      issues.push({
        type: 'file-name-mismatch',
        expected: expectedComponentName,
        actual: component.name,
      })
    }

    // 2. Check if interfaceName matches component prop interface
    if (block.interfaceName) {
      const expectedInterfaceName = `${component.name}Props`
      if (block.interfaceName !== expectedInterfaceName) {
        issues.push({
          type: 'interface-mismatch',
          expected: expectedInterfaceName,
          actual: block.interfaceName,
        })
      }
    }

    // 3. Check slug casing (should be kebab-case)
    if (!this.isKebabCase(block.slug)) {
      issues.push({
        type: 'slug-mismatch',
        expected: 'kebab-case format',
        actual: block.slug,
      })
    }

    return issues
  }

  /**
   * Validate preview component
   */
  validatePreview(block: Block): PreviewIssue[] {
    const issues: PreviewIssue[] = []

    // Check if block has preview configured (if preview property exists)
    const adminConfig = block.admin as any
    if (adminConfig?.preview) {
      const previewPath = adminConfig.preview as string

      // Check if preview file exists
      if (!this.fileExists(previewPath)) {
        issues.push({
          type: 'missing-preview-file',
          description: `Preview component file not found: ${previewPath}`,
          remediation: `Create the preview component at ${previewPath} or remove the preview configuration`,
        })
      }
    }

    return issues
  }

  /**
   * Validate nested field data flow
   * Ensures component correctly accesses nested data structures
   */
  private validateNestedFieldDataFlow(block: Block, component: Component): PreviewIssue[] {
    const issues: PreviewIssue[] = []

    // Find nested fields (groups, arrays, blocks)
    const nestedFields = this.findNestedFields(block.fields)

    if (nestedFields.length > 0) {
      // Check if component has proper null/undefined handling
      // This is a heuristic check - we look for optional chaining or null checks
      const hasNullHandling = this.checkNullHandling(component)

      if (!hasNullHandling) {
        issues.push({
          type: 'preview-error',
          description: 'Component may not handle nested data null/undefined values properly',
          remediation: 'Add optional chaining (?.) or null checks when accessing nested field data',
        })
      }

      // Check for type safety in nested structures
      nestedFields.forEach((field) => {
        const propExists = component.props.some((prop) => prop.name === field.name)
        if (!propExists) {
          issues.push({
            type: 'invalid-preview-props',
            description: `Nested field '${field.name}' has no corresponding prop in component`,
            remediation: `Add prop '${field.name}' to component with proper nested type definition`,
          })
        }
      })
    }

    return issues
  }

  /**
   * Extract all field names including nested fields
   */
  private extractAllFieldNames(fields: Field[], prefix: string = ''): string[] {
    const names: string[] = []

    fields.forEach((field) => {
      // Skip UI-only fields
      if (field.type === 'ui') {
        return
      }

      const fieldName = prefix ? `${prefix}.${field.name}` : field.name

      // Add the field name
      if (field.name) {
        names.push(field.name) // Use simple name for top-level matching
      }

      // Recursively extract nested field names
      if (this.hasSubFields(field)) {
        const subFields = this.getSubFields(field)
        const nestedNames = this.extractAllFieldNames(subFields, fieldName)
        names.push(...nestedNames)
      }
    })

    return names
  }

  /**
   * Build a map of field names to field objects
   */
  private buildFieldMap(fields: Field[], map: Map<string, Field>, prefix: string = ''): void {
    fields.forEach((field) => {
      if (field.type === 'ui') {
        return
      }

      const fieldName = prefix ? `${prefix}.${field.name}` : field.name

      if (field.name) {
        map.set(field.name, field)
      }

      if (this.hasSubFields(field)) {
        const subFields = this.getSubFields(field)
        this.buildFieldMap(subFields, map, fieldName)
      }
    })
  }

  /**
   * Check if field has sub-fields
   */
  private hasSubFields(field: Field): boolean {
    return (
      field.type === 'group' ||
      field.type === 'array' ||
      field.type === 'blocks' ||
      field.type === 'row' ||
      field.type === 'collapsible'
    )
  }

  /**
   * Get sub-fields from a field
   */
  private getSubFields(field: Field): Field[] {
    if (field.type === 'group' || field.type === 'array' || field.type === 'row') {
      return (field as any).fields || []
    }
    if (field.type === 'blocks') {
      // Blocks field contains multiple block types
      const blocks = (field as any).blocks || []
      const allFields: Field[] = []
      blocks.forEach((block: any) => {
        if (block.fields) {
          allFields.push(...block.fields)
        }
      })
      return allFields
    }
    if (field.type === 'collapsible') {
      return (field as any).fields || []
    }
    return []
  }

  /**
   * Check if prop name is a common React prop that shouldn't be validated
   */
  private isCommonProp(propName: string): boolean {
    const commonProps = [
      'children',
      'className',
      'style',
      'key',
      'ref',
      'id',
      'data-testid',
      'aria-label',
      'aria-labelledby',
      'aria-describedby',
      'role',
    ]
    return (
      commonProps.includes(propName) || propName.startsWith('aria-') || propName.startsWith('data-')
    )
  }

  /**
   * Check type compatibility between field and prop
   */
  private checkTypeCompatibility(field: Field, prop: PropDefinition): boolean {
    const expectedType = this.getExpectedPropType(field)
    const actualType = prop.type

    // Simple type matching (can be enhanced)
    if (expectedType === actualType) {
      return true
    }

    // Check for compatible types
    const compatibleTypes: Record<string, string[]> = {
      string: ['text', 'textarea', 'email', 'select', 'radio'],
      number: ['number'],
      boolean: ['checkbox'],
      'string | number': ['text', 'number'],
      any: ['richText', 'json', 'code'],
    }

    for (const [propType, fieldTypes] of Object.entries(compatibleTypes)) {
      if (actualType.includes(propType) && fieldTypes.includes(field.type)) {
        return true
      }
    }

    return false
  }

  /**
   * Get expected prop type for a field
   */
  private getExpectedPropType(field: Field): string {
    const typeMap: Record<string, string> = {
      text: 'string',
      textarea: 'string',
      email: 'string',
      number: 'number',
      date: 'string | Date',
      checkbox: 'boolean',
      select: 'string',
      radio: 'string',
      relationship: 'string | object',
      upload: 'string | object',
      richText: 'any',
      array: 'any[]',
      group: 'object',
      blocks: 'any[]',
      json: 'any',
      code: 'string',
    }

    return typeMap[field.type] || 'any'
  }

  /**
   * Convert slug to component name (kebab-case to PascalCase)
   */
  private slugToComponentName(slug: string): string {
    return slug
      .split('-')
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join('')
  }

  /**
   * Check if string is in kebab-case
   */
  private isKebabCase(str: string): boolean {
    return /^[a-z]+(-[a-z]+)*$/.test(str)
  }

  /**
   * Check if file exists
   */
  private fileExists(filePath: string): boolean {
    try {
      return fs.existsSync(filePath)
    } catch {
      return false
    }
  }

  /**
   * Find nested fields in block
   */
  private findNestedFields(fields: Field[]): Field[] {
    const nested: Field[] = []

    fields.forEach((field) => {
      if (this.hasSubFields(field)) {
        nested.push(field)
        const subFields = this.getSubFields(field)
        nested.push(...this.findNestedFields(subFields))
      }
    })

    return nested
  }

  /**
   * Check if component has null/undefined handling
   * This is a heuristic check looking for optional chaining or null checks
   */
  private checkNullHandling(component: Component): boolean {
    // Check if component uses optional chaining or has null checks
    // This is a simplified check - in a real implementation, we'd analyze the AST
    if (component.ast) {
      const sourceText = component.ast.getFullText()
      // Look for optional chaining (?.) or null checks
      return (
        sourceText.includes('?.') ||
        sourceText.includes('== null') ||
        sourceText.includes('=== null')
      )
    }
    return false
  }
}
