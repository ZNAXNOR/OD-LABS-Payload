/**
 * Admin Configuration Analyzer
 * Evaluates admin UI configuration completeness and suggests improvements
 */

import type { Block, Field, AdminConfigIssue } from '../types'

export interface AdminConfigReport {
  hasAdminConfig: boolean
  completenessScore: number
  missingConfigurations: string[]
  issues: AdminConfigIssue[]
  suggestions: string[]
}

export class AdminConfigAnalyzer {
  /**
   * Check admin configuration for a block
   */
  checkAdminConfig(block: Block): AdminConfigIssue[] {
    const issues: AdminConfigIssue[] = []

    // Check block-level admin config
    const blockLevelIssues = this.checkBlockLevelAdminConfig(block)
    issues.push(...blockLevelIssues)

    // Check field-level admin config
    const fieldLevelIssues = this.checkFieldLevelAdminConfig(block)
    issues.push(...fieldLevelIssues)

    return issues
  }

  /**
   * Check block-level admin configuration
   */
  private checkBlockLevelAdminConfig(block: Block): AdminConfigIssue[] {
    const issues: AdminConfigIssue[] = []

    if (!block.admin) {
      issues.push({
        type: 'missing-description',
        fieldPath: `Block: ${block.slug}`,
        suggestion:
          `Add admin configuration to improve CMS usability:\n` +
          `admin: {\n` +
          `  useAsTitle: 'title', // Field to use as document title\n` +
          `  defaultColumns: ['title', 'status', 'createdAt'], // Columns in list view\n` +
          `  group: 'Content', // Group in admin sidebar\n` +
          `  description: 'Description of this block type',\n` +
          `}`,
      })
      return issues
    }

    // Check for missing useAsTitle
    if (!block.admin.useAsTitle) {
      issues.push({
        type: 'missing-description',
        fieldPath: `Block: ${block.slug}`,
        suggestion: `Add 'useAsTitle' to admin config to specify which field should be used as the document title in the admin panel.`,
      })
    }

    // Check for missing defaultColumns
    if (!block.admin.defaultColumns || block.admin.defaultColumns.length === 0) {
      issues.push({
        type: 'missing-description',
        fieldPath: `Block: ${block.slug}`,
        suggestion: `Add 'defaultColumns' to admin config to specify which columns should be shown in the list view.`,
      })
    }

    // Check for missing description
    if (!block.admin.description) {
      issues.push({
        type: 'missing-description',
        fieldPath: `Block: ${block.slug}`,
        suggestion: `Add 'description' to admin config to help editors understand the purpose of this block.`,
      })
    }

    return issues
  }

  /**
   * Check field-level admin configuration
   */
  private checkFieldLevelAdminConfig(block: Block): AdminConfigIssue[] {
    const issues: AdminConfigIssue[] = []

    // Get all fields including nested
    const allFields = this.extractAllFields(block.fields, block.slug)

    allFields.forEach(({ field, path }) => {
      const fieldIssues = this.checkFieldAdminConfig(field, path, block.slug)
      issues.push(...fieldIssues)
    })

    return issues
  }

  /**
   * Check admin configuration for a single field
   */
  private checkFieldAdminConfig(
    field: Field,
    fieldPath: string,
    blockSlug: string,
  ): AdminConfigIssue[] {
    const issues: AdminConfigIssue[] = []

    // Skip UI fields (they don't need admin config)
    if (field.type === 'ui') {
      return issues
    }

    // Check for missing description on complex fields
    if (this.isComplexField(field) && !field.admin?.description) {
      issues.push({
        type: 'missing-description',
        fieldPath,
        suggestion:
          `Add description to help editors understand this ${field.type} field:\n` +
          `admin: {\n` +
          `  description: 'Explain what this field is for and how to use it',\n` +
          `}`,
      })
    }

    // Check for missing placeholder on text inputs
    if (this.isTextInputField(field) && !field.admin?.placeholder) {
      issues.push({
        type: 'missing-placeholder',
        fieldPath,
        suggestion:
          `Add placeholder text to guide editors:\n` +
          `admin: {\n` +
          `  placeholder: 'Enter ${field.name}...',\n` +
          `}`,
      })
    }

    // Check for missing condition on conditional fields
    if (this.shouldHaveCondition(field) && !field.admin?.condition) {
      issues.push({
        type: 'missing-condition',
        fieldPath,
        suggestion:
          `Consider adding a condition to show/hide this field based on other field values:\n` +
          `admin: {\n` +
          `  condition: (data, siblingData) => {\n` +
          `    // Return true to show field, false to hide\n` +
          `    return data.someField === 'someValue'\n` +
          `  },\n` +
          `}`,
      })
    }

    // Check for missing group on related fields
    if (this.shouldBeGrouped(field) && !field.admin?.group) {
      issues.push({
        type: 'missing-group',
        fieldPath,
        suggestion:
          `Consider grouping related fields together:\n` +
          `admin: {\n` +
          `  group: 'Group Name',\n` +
          `}`,
      })
    }

    return issues
  }

  /**
   * Extract all fields recursively
   */
  private extractAllFields(
    fields: Field[],
    blockSlug: string,
    parentPath: string = '',
  ): Array<{ field: Field; path: string }> {
    const result: Array<{ field: Field; path: string }> = []

    fields.forEach((field) => {
      const fieldPath = parentPath ? `${parentPath}.${field.name}` : `${blockSlug}.${field.name}`
      result.push({ field, path: fieldPath })

      // Check for nested fields
      if (this.hasNestedFields(field)) {
        const nestedFields = this.getNestedFields(field)
        if (nestedFields) {
          const nested = this.extractAllFields(nestedFields, blockSlug, fieldPath)
          result.push(...nested)
        }
      }
    })

    return result
  }

  /**
   * Check if field is complex and should have description
   */
  private isComplexField(field: Field): boolean {
    const complexTypes = ['array', 'blocks', 'group', 'richText', 'relationship', 'upload']
    return complexTypes.includes(field.type)
  }

  /**
   * Check if field is a text input that should have placeholder
   */
  private isTextInputField(field: Field): boolean {
    const textTypes = ['text', 'textarea', 'email', 'number']
    return textTypes.includes(field.type)
  }

  /**
   * Check if field should have a condition
   */
  private shouldHaveCondition(field: Field): boolean {
    // Fields with names suggesting conditional logic
    const conditionalNames = ['optional', 'advanced', 'custom', 'override']
    const fieldNameLower = field.name.toLowerCase()

    return conditionalNames.some((name) => fieldNameLower.includes(name))
  }

  /**
   * Check if field should be grouped
   */
  private shouldBeGrouped(field: Field): boolean {
    // Fields with names suggesting they belong to a group
    const groupNames = ['meta', 'seo', 'settings', 'config', 'options']
    const fieldNameLower = field.name.toLowerCase()

    return groupNames.some((name) => fieldNameLower.includes(name))
  }

  /**
   * Check if field has nested fields
   */
  private hasNestedFields(field: Field): boolean {
    return ['group', 'array', 'blocks', 'row', 'collapsible', 'tabs'].includes(field.type)
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
        const blocks = (field as any).blocks || []
        const allBlockFields: Field[] = []
        blocks.forEach((block: any) => {
          if (block.fields) {
            allBlockFields.push(...block.fields)
          }
        })
        return allBlockFields.length > 0 ? allBlockFields : null

      case 'tabs':
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
   * Generate comprehensive admin config report
   */
  generateAdminConfigReport(block: Block): AdminConfigReport {
    const issues = this.checkAdminConfig(block)

    const hasAdminConfig = block.admin !== undefined

    const missingConfigurations: string[] = []

    if (!block.admin) {
      missingConfigurations.push('admin configuration')
    } else {
      if (!block.admin.useAsTitle) missingConfigurations.push('useAsTitle')
      if (!block.admin.defaultColumns) missingConfigurations.push('defaultColumns')
      if (!block.admin.description) missingConfigurations.push('description')
      if (!block.admin.group) missingConfigurations.push('group')
    }

    // Calculate completeness score (0-100)
    let completenessScore = 100

    if (!hasAdminConfig) {
      completenessScore = 0
    } else {
      // Deduct points for missing configurations
      if (!block.admin.useAsTitle) completenessScore -= 20
      if (!block.admin.defaultColumns) completenessScore -= 15
      if (!block.admin.description) completenessScore -= 15
      if (!block.admin.group) completenessScore -= 10

      // Deduct points for field-level issues
      const fieldIssues = issues.filter((issue) => issue.fieldPath.includes('.'))
      completenessScore -= Math.min(40, fieldIssues.length * 5)
    }

    completenessScore = Math.max(0, completenessScore)

    const suggestions = this.generateSuggestions(block, issues)

    return {
      hasAdminConfig,
      completenessScore,
      missingConfigurations,
      issues,
      suggestions,
    }
  }

  /**
   * Generate suggestions for improving admin configuration
   */
  private generateSuggestions(block: Block, issues: AdminConfigIssue[]): string[] {
    const suggestions: string[] = []

    if (!block.admin) {
      suggestions.push('Add admin configuration to improve CMS usability and editor experience.')
      return suggestions
    }

    // Group suggestions by type
    const descriptionIssues = issues.filter((i) => i.type === 'missing-description')
    const placeholderIssues = issues.filter((i) => i.type === 'missing-placeholder')
    const conditionIssues = issues.filter((i) => i.type === 'missing-condition')
    const groupIssues = issues.filter((i) => i.type === 'missing-group')

    if (descriptionIssues.length > 0) {
      suggestions.push(
        `Add descriptions to ${descriptionIssues.length} field(s) to help editors understand their purpose.`,
      )
    }

    if (placeholderIssues.length > 0) {
      suggestions.push(
        `Add placeholder text to ${placeholderIssues.length} text field(s) to guide editor input.`,
      )
    }

    if (conditionIssues.length > 0) {
      suggestions.push(
        `Consider adding conditional logic to ${conditionIssues.length} field(s) to improve form usability.`,
      )
    }

    if (groupIssues.length > 0) {
      suggestions.push(
        `Group ${groupIssues.length} related field(s) together for better organization.`,
      )
    }

    // Add general suggestions
    if (!block.admin.useAsTitle) {
      suggestions.push('Specify which field should be used as the document title in list views.')
    }

    if (!block.admin.defaultColumns || block.admin.defaultColumns.length === 0) {
      suggestions.push('Define default columns to show in the list view for better overview.')
    }

    return suggestions
  }

  /**
   * Suggest improvements for missing configurations
   */
  suggestImprovements(block: Block): string[] {
    const report = this.generateAdminConfigReport(block)
    return report.suggestions
  }

  /**
   * Get fields with missing admin configuration
   */
  getFieldsWithMissingAdminConfig(block: Block): string[] {
    const issues = this.checkAdminConfig(block)
    const fieldPaths = new Set<string>()

    issues.forEach((issue) => {
      if (issue.fieldPath.includes('.')) {
        fieldPaths.add(issue.fieldPath)
      }
    })

    return Array.from(fieldPaths)
  }
}
