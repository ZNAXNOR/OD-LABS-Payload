/**
 * TypeScript Typing Analyzer
 * Analyzes TypeScript typing completeness in block configurations
 */

import type { Block, Field, TypingIssue } from '../types'

export class TypingAnalyzer {
  /**
   * Check for interfaceName presence and typing completeness
   */
  checkTyping(block: Block): TypingIssue[] {
    const issues: TypingIssue[] = []

    // Check for missing interfaceName
    if (!block.interfaceName) {
      issues.push({
        type: 'missing-interface-name',
        location: `Block: ${block.slug}`,
        suggestion: `Add interfaceName property to block configuration. Example: interfaceName: '${this.generateInterfaceName(block.slug)}'`,
      })
    }

    // Check field typing
    const fieldTypingIssues = this.checkFieldTyping(block.fields, block.slug)
    issues.push(...fieldTypingIssues)

    return issues
  }

  /**
   * Check typing for all fields recursively
   */
  private checkFieldTyping(
    fields: Field[],
    blockSlug: string,
    parentPath: string = '',
  ): TypingIssue[] {
    const issues: TypingIssue[] = []

    fields.forEach((field) => {
      const fieldPath = parentPath ? `${parentPath}.${field.name}` : field.name

      // Check for weak typing patterns
      const weakTypingIssues = this.detectWeakTyping(field, blockSlug, fieldPath)
      issues.push(...weakTypingIssues)

      // Check nested fields
      if (this.hasNestedFields(field)) {
        const nestedFields = this.getNestedFields(field)
        if (nestedFields) {
          const nestedIssues = this.checkFieldTyping(nestedFields, blockSlug, fieldPath)
          issues.push(...nestedIssues)
        }
      }
    })

    return issues
  }

  /**
   * Detect weak typing patterns in fields
   */
  private detectWeakTyping(field: Field, blockSlug: string, fieldPath: string): TypingIssue[] {
    const issues: TypingIssue[] = []

    // Check for missing type definition
    if (!field.type) {
      issues.push({
        type: 'weak-typing',
        location: `Block: ${blockSlug}, Field: ${fieldPath}`,
        suggestion: 'Field is missing type definition. Add a type property.',
      })
      return issues
    }

    // Check for relationship fields without proper typing
    if (field.type === 'relationship') {
      const relationField = field as any
      if (!relationField.relationTo) {
        issues.push({
          type: 'weak-typing',
          location: `Block: ${blockSlug}, Field: ${fieldPath}`,
          suggestion: 'Relationship field must specify relationTo property for proper typing.',
        })
      }
    }

    // Check for select/radio fields without options
    if (field.type === 'select' || field.type === 'radio') {
      const selectField = field as any
      if (!selectField.options || selectField.options.length === 0) {
        issues.push({
          type: 'weak-typing',
          location: `Block: ${blockSlug}, Field: ${fieldPath}`,
          suggestion: 'Select/radio field should have options defined for proper type inference.',
        })
      }
    }

    // Check for blocks field without interfaceName
    if (field.type === 'blocks') {
      const blocksField = field as any
      if (blocksField.blocks && Array.isArray(blocksField.blocks)) {
        blocksField.blocks.forEach((block: any, index: number) => {
          if (!block.interfaceName) {
            issues.push({
              type: 'missing-interface-name',
              location: `Block: ${blockSlug}, Field: ${fieldPath}, Block[${index}]: ${block.slug || 'unnamed'}`,
              suggestion: `Add interfaceName to nested block. Example: interfaceName: '${this.generateInterfaceName(block.slug || 'Block')}'`,
            })
          }
        })
      }
    }

    // Check for group field without interfaceName
    if (field.type === 'group') {
      const groupField = field as any
      if (!groupField.interfaceName) {
        issues.push({
          type: 'missing-interface-name',
          location: `Block: ${blockSlug}, Field: ${fieldPath}`,
          suggestion: `Add interfaceName to group field. Example: interfaceName: '${this.generateInterfaceName(field.name)}'`,
        })
      }
    }

    // Check for array field without proper typing
    if (field.type === 'array') {
      const arrayField = field as any
      if (!arrayField.interfaceName) {
        issues.push({
          type: 'missing-interface-name',
          location: `Block: ${blockSlug}, Field: ${fieldPath}`,
          suggestion: `Add interfaceName to array field for better type safety. Example: interfaceName: '${this.generateInterfaceName(field.name)}'`,
        })
      }
    }

    return issues
  }

  /**
   * Generate suggested interface name from slug
   */
  private generateInterfaceName(slug: string): string {
    return slug
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join('')
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
   * Suggest proper TypeScript patterns for a block
   */
  suggestTypingPatterns(block: Block): string[] {
    const suggestions: string[] = []

    // Suggest interfaceName if missing
    if (!block.interfaceName) {
      const suggestedName = this.generateInterfaceName(block.slug)
      suggestions.push(
        `Add interfaceName to block configuration:\n` +
          `{\n` +
          `  slug: '${block.slug}',\n` +
          `  interfaceName: '${suggestedName}',\n` +
          `  // ... other properties\n` +
          `}`,
      )
    }

    // Suggest using generated types
    suggestions.push(
      `Import and use generated types:\n` +
        `import type { ${block.interfaceName || this.generateInterfaceName(block.slug)} } from '@/payload-types'`,
    )

    // Suggest type guards for field checking
    suggestions.push(
      `Use Payload's field type guards for runtime type checking:\n` +
        `import { fieldAffectsData, fieldHasSubFields } from 'payload'\n\n` +
        `if (fieldAffectsData(field)) {\n` +
        `  // Safe to access field.name\n` +
        `}`,
    )

    return suggestions
  }

  /**
   * Check if block has complete typing
   */
  hasCompleteTyping(block: Block): boolean {
    const issues = this.checkTyping(block)
    return issues.length === 0
  }

  /**
   * Get typing completeness score (0-100)
   */
  getTypingScore(block: Block): number {
    const issues = this.checkTyping(block)

    // Calculate score based on issues
    let score = 100

    issues.forEach((issue) => {
      switch (issue.type) {
        case 'missing-interface-name':
          score -= 20
          break
        case 'weak-typing':
          score -= 10
          break
        case 'any-type':
          score -= 15
          break
      }
    })

    return Math.max(0, score)
  }

  /**
   * Get fields with typing issues
   */
  getFieldsWithTypingIssues(block: Block): string[] {
    const issues = this.checkTyping(block)
    const fieldPaths = new Set<string>()

    issues.forEach((issue) => {
      // Extract field path from location string
      const match = issue.location.match(/Field: ([^,]+)/)
      if (match && match[1]) {
        fieldPaths.add(match[1])
      }
    })

    return Array.from(fieldPaths)
  }
}
