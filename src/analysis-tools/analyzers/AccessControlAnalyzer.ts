/**
 * Access Control Analyzer
 * Detects missing or weak access control in block configurations
 */

import type { Block, Field, SecurityIssue } from '../types'

export interface AccessControlReport {
  hasBlockLevelAccess: boolean
  missingBlockOperations: string[]
  fieldsWithoutAccess: string[]
  securityIssues: SecurityIssue[]
  securityScore: number
}

export class AccessControlAnalyzer {
  /**
   * Check access control for a block
   */
  checkAccessControl(block: Block): SecurityIssue[] {
    const issues: SecurityIssue[] = []

    // Check block-level access control
    const blockLevelIssues = this.checkBlockLevelAccess(block)
    issues.push(...blockLevelIssues)

    // Check field-level access control
    const fieldLevelIssues = this.checkFieldLevelAccess(block)
    issues.push(...fieldLevelIssues)

    return issues
  }

  /**
   * Check block-level access control
   */
  private checkBlockLevelAccess(block: Block): SecurityIssue[] {
    const issues: SecurityIssue[] = []

    if (!block.access) {
      issues.push({
        type: 'missing-access-control',
        severity: 'critical',
        description: `Block '${block.slug}' has no access control defined. This means all operations are unrestricted.`,
        remediation:
          `Add access control to the block:\n` +
          `{\n` +
          `  slug: '${block.slug}',\n` +
          `  access: {\n` +
          `    create: ({ req: { user } }) => Boolean(user),\n` +
          `    read: () => true,\n` +
          `    update: ({ req: { user } }) => Boolean(user),\n` +
          `    delete: ({ req: { user } }) => user?.roles?.includes('admin'),\n` +
          `  },\n` +
          `  // ... other properties\n` +
          `}`,
      })
      return issues
    }

    // Check for missing operations
    const operations = ['create', 'read', 'update', 'delete']
    const missingOperations: string[] = []

    operations.forEach((operation) => {
      if (!(block.access as any)[operation]) {
        missingOperations.push(operation)
      }
    })

    if (missingOperations.length > 0) {
      issues.push({
        type: 'missing-access-control',
        severity: 'high',
        description: `Block '${block.slug}' is missing access control for: ${missingOperations.join(', ')}. These operations will use default (unrestricted) access.`,
        remediation:
          `Add access control for missing operations:\n` +
          `access: {\n` +
          `  ${missingOperations.map((op) => `${op}: ({ req: { user } }) => Boolean(user),`).join('\n  ')}\n` +
          `}`,
      })
    }

    // Check for insecure defaults (all operations returning true)
    const hasInsecureDefaults = this.checkInsecureDefaults(block)
    if (hasInsecureDefaults) {
      issues.push({
        type: 'insecure-default',
        severity: 'high',
        description: `Block '${block.slug}' appears to have overly permissive access control (all operations may return true).`,
        remediation:
          `Review access control logic and implement proper restrictions:\n` +
          `- Use user authentication checks\n` +
          `- Implement role-based access control (RBAC)\n` +
          `- Add query constraints for read operations\n` +
          `- Restrict sensitive operations to admins`,
      })
    }

    return issues
  }

  /**
   * Check field-level access control
   */
  private checkFieldLevelAccess(block: Block): SecurityIssue[] {
    const issues: SecurityIssue[] = []

    // Get all fields including nested
    const allFields = this.extractAllFields(block.fields)

    // Check for sensitive fields without access control
    allFields.forEach(({ field, path }) => {
      if (this.isSensitiveField(field) && !field.access) {
        issues.push({
          type: 'missing-access-control',
          severity: 'critical',
          description: `Sensitive field '${path}' in block '${block.slug}' has no access control. This field may contain private data.`,
          remediation:
            `Add field-level access control:\n` +
            `{\n` +
            `  name: '${field.name}',\n` +
            `  type: '${field.type}',\n` +
            `  access: {\n` +
            `    read: ({ req: { user }, doc }) => {\n` +
            `      // Only owner or admin can read\n` +
            `      if (user?.id === doc?.userId) return true\n` +
            `      return user?.roles?.includes('admin')\n` +
            `    },\n` +
            `    update: ({ req: { user } }) => user?.roles?.includes('admin'),\n` +
            `  },\n` +
            `}`,
        })
      }
    })

    return issues
  }

  /**
   * Extract all fields recursively
   */
  private extractAllFields(
    fields: Field[],
    parentPath: string = '',
  ): Array<{ field: Field; path: string }> {
    const result: Array<{ field: Field; path: string }> = []

    fields.forEach((field) => {
      const fieldPath = parentPath ? `${parentPath}.${field.name}` : field.name
      result.push({ field, path: fieldPath })

      // Check for nested fields
      if (this.hasNestedFields(field)) {
        const nestedFields = this.getNestedFields(field)
        if (nestedFields) {
          const nested = this.extractAllFields(nestedFields, fieldPath)
          result.push(...nested)
        }
      }
    })

    return result
  }

  /**
   * Check if field is sensitive and should have access control
   */
  private isSensitiveField(field: Field): boolean {
    const sensitiveNames = [
      'password',
      'token',
      'secret',
      'apiKey',
      'api_key',
      'privateKey',
      'private_key',
      'ssn',
      'social_security',
      'creditCard',
      'credit_card',
      'salary',
      'income',
      'bankAccount',
      'bank_account',
    ]

    const fieldNameLower = field.name.toLowerCase()

    return sensitiveNames.some((sensitiveName) => fieldNameLower.includes(sensitiveName))
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
   * Check for insecure default access patterns
   */
  private checkInsecureDefaults(block: Block): boolean {
    // This is a heuristic check - in real implementation,
    // we would need to analyze the actual function code
    // For now, we just check if access exists
    return false
  }

  /**
   * Generate comprehensive access control report
   */
  generateAccessControlReport(block: Block): AccessControlReport {
    const issues = this.checkAccessControl(block)

    const hasBlockLevelAccess = block.access !== undefined

    const missingBlockOperations: string[] = []
    if (block.access) {
      const operations = ['create', 'read', 'update', 'delete']
      operations.forEach((operation) => {
        if (!(block.access as any)[operation]) {
          missingBlockOperations.push(operation)
        }
      })
    } else {
      missingBlockOperations.push('create', 'read', 'update', 'delete')
    }

    const allFields = this.extractAllFields(block.fields)
    const fieldsWithoutAccess = allFields
      .filter(({ field }) => this.isSensitiveField(field) && !field.access)
      .map(({ path }) => path)

    // Calculate security score (0-100)
    let securityScore = 100

    if (!hasBlockLevelAccess) {
      securityScore -= 50
    } else {
      securityScore -= missingBlockOperations.length * 10
    }

    securityScore -= fieldsWithoutAccess.length * 15

    securityScore = Math.max(0, securityScore)

    return {
      hasBlockLevelAccess,
      missingBlockOperations,
      fieldsWithoutAccess,
      securityIssues: issues,
      securityScore,
    }
  }

  /**
   * Evaluate access control patterns
   */
  evaluateAccessControlPatterns(block: Block): {
    usesRBAC: boolean
    usesQueryConstraints: boolean
    usesFieldLevelAccess: boolean
    patterns: string[]
  } {
    const patterns: string[] = []

    // Check if block uses RBAC (role-based access control)
    const usesRBAC = this.detectRBACPattern(block)
    if (usesRBAC) {
      patterns.push('Role-Based Access Control (RBAC)')
    }

    // Check if block uses query constraints
    const usesQueryConstraints = this.detectQueryConstraints(block)
    if (usesQueryConstraints) {
      patterns.push('Query Constraints')
    }

    // Check if block uses field-level access
    const usesFieldLevelAccess = this.detectFieldLevelAccess(block)
    if (usesFieldLevelAccess) {
      patterns.push('Field-Level Access Control')
    }

    return {
      usesRBAC,
      usesQueryConstraints,
      usesFieldLevelAccess,
      patterns,
    }
  }

  /**
   * Detect RBAC pattern usage
   */
  private detectRBACPattern(block: Block): boolean {
    // Heuristic: Check if access control exists
    // In real implementation, would analyze function code for role checks
    return block.access !== undefined
  }

  /**
   * Detect query constraint usage
   */
  private detectQueryConstraints(block: Block): boolean {
    // Heuristic: Check if read access exists
    // In real implementation, would analyze if read returns query objects
    return block.access?.read !== undefined
  }

  /**
   * Detect field-level access usage
   */
  private detectFieldLevelAccess(block: Block): boolean {
    const allFields = this.extractAllFields(block.fields)
    return allFields.some(({ field }) => field.access !== undefined)
  }

  /**
   * Suggest access control improvements
   */
  suggestImprovements(block: Block): string[] {
    const suggestions: string[] = []
    const report = this.generateAccessControlReport(block)

    if (!report.hasBlockLevelAccess) {
      suggestions.push(
        'Add block-level access control to restrict who can create, read, update, and delete documents.',
      )
    }

    if (report.missingBlockOperations.length > 0) {
      suggestions.push(
        `Define access control for missing operations: ${report.missingBlockOperations.join(', ')}`,
      )
    }

    if (report.fieldsWithoutAccess.length > 0) {
      suggestions.push(
        `Add field-level access control for sensitive fields: ${report.fieldsWithoutAccess.join(', ')}`,
      )
    }

    const patterns = this.evaluateAccessControlPatterns(block)

    if (!patterns.usesRBAC) {
      suggestions.push(
        'Consider implementing Role-Based Access Control (RBAC) for better security.',
      )
    }

    if (!patterns.usesQueryConstraints) {
      suggestions.push(
        'Consider using query constraints in read access to filter data based on user context.',
      )
    }

    if (!patterns.usesFieldLevelAccess && report.fieldsWithoutAccess.length > 0) {
      suggestions.push('Implement field-level access control for sensitive data fields.')
    }

    return suggestions
  }
}
