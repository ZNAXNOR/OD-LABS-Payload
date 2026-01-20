/**
 * Security Analyzer
 * Comprehensive security analysis for blocks and components
 * Covers access control, XSS protection, file uploads, and authentication
 */

import type { Block, Field, Component, SecurityIssue, JSXElement } from '../types'

export interface SecurityAnalysisReport {
  accessControlIssues: SecurityIssue[]
  xssIssues: SecurityIssue[]
  fileUploadIssues: SecurityIssue[]
  authenticationIssues: SecurityIssue[]
  overallSecurityScore: number
  criticalIssuesCount: number
  highIssuesCount: number
}

export class SecurityAnalyzer {
  /**
   * Perform comprehensive security analysis on a block
   */
  analyzeBlockSecurity(block: Block): SecurityIssue[] {
    const issues: SecurityIssue[] = []

    // 1. Access control validation
    issues.push(...this.validateAccessControl(block))

    // 2. File upload security
    issues.push(...this.validateFileUploadSecurity(block))

    return issues
  }

  /**
   * Perform comprehensive security analysis on a component
   */
  analyzeComponentSecurity(component: Component): SecurityIssue[] {
    const issues: SecurityIssue[] = []

    // 1. XSS protection validation
    issues.push(...this.validateXSSProtection(component))

    // 2. Authentication verification
    issues.push(...this.validateAuthentication(component))

    return issues
  }

  /**
   * Task 9.1: Validate access control in blocks
   * Checks for missing access control and overrideAccess misuse
   */
  validateAccessControl(block: Block): SecurityIssue[] {
    const issues: SecurityIssue[] = []

    // Check for missing block-level access control
    if (!block.access) {
      issues.push({
        type: 'missing-access-control',
        severity: 'critical',
        description: `Block '${block.slug}' has no access control defined. All operations (create, read, update, delete) are unrestricted by default.`,
        remediation:
          `Add access control to the block configuration:\n\n` +
          `export const ${this.toPascalCase(block.slug)}: Block = {\n` +
          `  slug: '${block.slug}',\n` +
          `  access: {\n` +
          `    create: ({ req: { user } }) => Boolean(user),\n` +
          `    read: ({ req: { user } }) => {\n` +
          `      if (user) return true\n` +
          `      return { _status: { equals: 'published' } }\n` +
          `    },\n` +
          `    update: ({ req: { user } }) => Boolean(user),\n` +
          `    delete: ({ req: { user } }) => user?.roles?.includes('admin'),\n` +
          `  },\n` +
          `  // ... other properties\n` +
          `}`,
      })
    } else {
      // Check for missing specific operations
      const operations = ['create', 'read', 'update', 'delete']
      const missingOps: string[] = []

      operations.forEach((op) => {
        if (!(block.access as any)[op]) {
          missingOps.push(op)
        }
      })

      if (missingOps.length > 0) {
        issues.push({
          type: 'missing-access-control',
          severity: 'high',
          description: `Block '${block.slug}' is missing access control for: ${missingOps.join(', ')}. These operations will use default unrestricted access.`,
          remediation:
            `Add access control for missing operations:\n\n` +
            `access: {\n` +
            `  ${missingOps.map((op) => `${op}: ({ req: { user } }) => Boolean(user),`).join('\n  ')}\n` +
            `}`,
        })
      }
    }

    // Check for sensitive fields without field-level access control
    const sensitiveFields = this.findSensitiveFields(block.fields)
    sensitiveFields.forEach(({ field, path }) => {
      if (!field.access) {
        issues.push({
          type: 'missing-access-control',
          severity: 'critical',
          description: `Sensitive field '${path}' in block '${block.slug}' has no access control. This may expose private data.`,
          remediation:
            `Add field-level access control:\n\n` +
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
   * Task 9.3: Validate XSS protection in components
   * Detects user-provided content rendering and dangerouslySetInnerHTML usage
   */
  validateXSSProtection(component: Component): SecurityIssue[] {
    const issues: SecurityIssue[] = []

    // Check for dangerouslySetInnerHTML usage
    const dangerousUsages = this.findDangerouslySetInnerHTML(component.jsx)
    dangerousUsages.forEach((usage) => {
      issues.push({
        type: 'override-access-misuse', // Using closest available type
        severity: 'critical',
        description: `Component '${component.name}' uses dangerouslySetInnerHTML at line ${usage.line}. This can lead to XSS vulnerabilities if user-provided content is not properly sanitized.`,
        remediation:
          `Remove dangerouslySetInnerHTML and use safe rendering:\n\n` +
          `// ❌ UNSAFE: XSS vulnerability\n` +
          `<div dangerouslySetInnerHTML={{ __html: userContent }} />\n\n` +
          `// ✅ SAFE: React automatically escapes content\n` +
          `<div>{userContent}</div>\n\n` +
          `// ✅ SAFE: Use a sanitization library for rich content\n` +
          `import DOMPurify from 'dompurify'\n` +
          `<div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(userContent) }} />`,
      })
    })

    // Check for potential user content rendering without sanitization
    const userContentProps = this.findUserContentProps(component)
    if (userContentProps.length > 0 && dangerousUsages.length > 0) {
      issues.push({
        type: 'override-access-misuse',
        severity: 'high',
        description: `Component '${component.name}' receives user-provided content through props (${userContentProps.join(', ')}) and uses dangerouslySetInnerHTML. Ensure all user content is sanitized.`,
        remediation:
          `Sanitize all user-provided content before rendering:\n\n` +
          `import DOMPurify from 'dompurify'\n\n` +
          `const sanitizedContent = DOMPurify.sanitize(props.userContent, {\n` +
          `  ALLOWED_TAGS: ['p', 'br', 'strong', 'em'],\n` +
          `  ALLOWED_ATTR: [],\n` +
          `})`,
      })
    }

    // Check for unescaped rendering patterns
    const unescapedPatterns = this.findUnescapedRenderingPatterns(component)
    unescapedPatterns.forEach((pattern) => {
      issues.push({
        type: 'override-access-misuse',
        severity: 'medium',
        description: `Component '${component.name}' may render unescaped content: ${pattern.description}`,
        remediation:
          `Ensure content is properly escaped or use React's built-in escaping:\n\n` +
          `// React automatically escapes text content\n` +
          `<div>{userProvidedText}</div>\n\n` +
          `// For HTML content, sanitize first\n` +
          `<div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(html) }} />`,
      })
    })

    return issues
  }

  /**
   * Task 9.5: Validate file upload security
   * Checks upload field configurations for proper validation
   */
  validateFileUploadSecurity(block: Block): SecurityIssue[] {
    const issues: SecurityIssue[] = []

    const uploadFields = this.findUploadFields(block.fields)

    uploadFields.forEach(({ field, path }) => {
      const uploadConfig = field as any

      // Check for missing file type validation
      if (!uploadConfig.filterOptions && !uploadConfig.mimeTypes) {
        issues.push({
          type: 'insecure-default',
          severity: 'high',
          description: `Upload field '${path}' in block '${block.slug}' has no file type restrictions. This allows any file type to be uploaded.`,
          remediation:
            `Add file type validation:\n\n` +
            `{\n` +
            `  name: '${field.name}',\n` +
            `  type: 'upload',\n` +
            `  relationTo: 'media',\n` +
            `  filterOptions: {\n` +
            `    mimeType: { contains: 'image' }, // Only images\n` +
            `  },\n` +
            `}\n\n` +
            `// Or in the Media collection:\n` +
            `upload: {\n` +
            `  mimeTypes: ['image/jpeg', 'image/png', 'image/webp'],\n` +
            `}`,
        })
      }

      // Check for missing size limits
      if (!this.hasUploadSizeLimit(uploadConfig)) {
        issues.push({
          type: 'insecure-default',
          severity: 'medium',
          description: `Upload field '${path}' in block '${block.slug}' has no file size limit. This may allow excessively large files.`,
          remediation:
            `Add file size limits in the Media collection:\n\n` +
            `upload: {\n` +
            `  staticDir: 'media',\n` +
            `  imageSizes: [...],\n` +
            `  adminThumbnail: 'thumbnail',\n` +
            `  mimeTypes: ['image/*'],\n` +
            `  // Add size limit (in bytes)\n` +
            `  limits: {\n` +
            `    fileSize: 5000000, // 5MB\n` +
            `  },\n` +
            `}`,
        })
      }

      // Check for missing sanitization hooks
      if (!this.hasUploadSanitization(block)) {
        issues.push({
          type: 'insecure-default',
          severity: 'medium',
          description: `Block '${block.slug}' with upload field '${path}' should implement file sanitization hooks to prevent malicious uploads.`,
          remediation:
            `Add beforeChange hook to sanitize filenames:\n\n` +
            `hooks: {\n` +
            `  beforeChange: [\n` +
            `    ({ data }) => {\n` +
            `      if (data.filename) {\n` +
            `        // Sanitize filename: remove special characters\n` +
            `        data.filename = data.filename\n` +
            `          .replace(/[^a-zA-Z0-9.-]/g, '_')\n` +
            `          .toLowerCase()\n` +
            `      }\n` +
            `      return data\n` +
            `    },\n` +
            `  ],\n` +
            `}`,
        })
      }
    })

    return issues
  }

  /**
   * Task 9.7: Validate authentication in components
   * Checks for proper user checks in protected components
   */
  validateAuthentication(component: Component): SecurityIssue[] {
    const issues: SecurityIssue[] = []

    // Check if component appears to be protected (has user-related props or checks)
    const hasUserProps = component.props.some(
      (prop) =>
        prop.name === 'user' ||
        prop.name === 'currentUser' ||
        prop.name === 'session' ||
        prop.type.includes('User'),
    )

    const hasAuthChecks = this.hasAuthenticationChecks(component)

    // If component has user props but no auth checks, it may be vulnerable
    if (hasUserProps && !hasAuthChecks) {
      issues.push({
        type: 'missing-access-control',
        severity: 'high',
        description: `Component '${component.name}' receives user-related props but does not verify authentication. Protected content may be exposed.`,
        remediation:
          `Add authentication checks:\n\n` +
          `// Server Component\n` +
          `export default async function ${component.name}({ user }: Props) {\n` +
          `  if (!user) {\n` +
          `    redirect('/login')\n` +
          `  }\n` +
          `  // Protected content\n` +
          `}\n\n` +
          `// Client Component\n` +
          `'use client'\n` +
          `import { useAuth } from '@payloadcms/ui'\n\n` +
          `export function ${component.name}() {\n` +
          `  const { user } = useAuth()\n` +
          `  if (!user) return <div>Please log in</div>\n` +
          `  // Protected content\n` +
          `}`,
      })
    }

    // Check for missing role-based access checks
    if (hasUserProps && !this.hasRoleChecks(component)) {
      issues.push({
        type: 'missing-access-control',
        severity: 'medium',
        description: `Component '${component.name}' has user authentication but no role-based access control. Consider adding role checks for sensitive operations.`,
        remediation:
          `Add role-based checks:\n\n` +
          `if (!user?.roles?.includes('admin')) {\n` +
          `  return <div>Access denied</div>\n` +
          `}\n\n` +
          `// Or for multiple roles\n` +
          `const hasAccess = user?.roles?.some(role => \n` +
          `  ['admin', 'editor'].includes(role)\n` +
          `)\n` +
          `if (!hasAccess) {\n` +
          `  return <div>Access denied</div>\n` +
          `}`,
      })
    }

    // Check for client components that should verify authentication
    if (component.type === 'client' && this.hasProtectedContent(component)) {
      const usesAuthHook = component.hooks.some((hook) => hook.name === 'useAuth')

      if (!usesAuthHook) {
        issues.push({
          type: 'missing-access-control',
          severity: 'high',
          description: `Client component '${component.name}' appears to have protected content but does not use authentication hooks.`,
          remediation:
            `Use authentication hooks in client components:\n\n` +
            `'use client'\n` +
            `import { useAuth } from '@payloadcms/ui'\n\n` +
            `export function ${component.name}() {\n` +
            `  const { user } = useAuth()\n\n` +
            `  if (!user) {\n` +
            `    return <div>Please log in to access this content</div>\n` +
            `  }\n\n` +
            `  return (\n` +
            `    // Protected content\n` +
            `  )\n` +
            `}`,
        })
      }
    }

    return issues
  }

  /**
   * Generate comprehensive security report
   */
  generateSecurityReport(block: Block, component?: Component): SecurityAnalysisReport {
    const accessControlIssues = this.validateAccessControl(block)
    const fileUploadIssues = this.validateFileUploadSecurity(block)

    let xssIssues: SecurityIssue[] = []
    let authenticationIssues: SecurityIssue[] = []

    if (component) {
      xssIssues = this.validateXSSProtection(component)
      authenticationIssues = this.validateAuthentication(component)
    }

    const allIssues = [
      ...accessControlIssues,
      ...xssIssues,
      ...fileUploadIssues,
      ...authenticationIssues,
    ]

    const criticalIssuesCount = allIssues.filter((i) => i.severity === 'critical').length
    const highIssuesCount = allIssues.filter((i) => i.severity === 'high').length

    // Calculate security score (0-100)
    let securityScore = 100
    securityScore -= criticalIssuesCount * 25
    securityScore -= highIssuesCount * 10
    securityScore -= allIssues.filter((i) => i.severity === 'medium').length * 5
    securityScore = Math.max(0, securityScore)

    return {
      accessControlIssues,
      xssIssues,
      fileUploadIssues,
      authenticationIssues,
      overallSecurityScore: securityScore,
      criticalIssuesCount,
      highIssuesCount,
    }
  }

  // ============================================================================
  // Helper Methods
  // ============================================================================

  /**
   * Find sensitive fields that should have access control
   */
  private findSensitiveFields(
    fields: Field[],
    parentPath: string = '',
  ): Array<{ field: Field; path: string }> {
    const result: Array<{ field: Field; path: string }> = []

    fields.forEach((field) => {
      const fieldPath = parentPath ? `${parentPath}.${field.name}` : field.name

      if (this.isSensitiveField(field)) {
        result.push({ field, path: fieldPath })
      }

      // Check nested fields
      if (this.hasNestedFields(field)) {
        const nestedFields = this.getNestedFields(field)
        if (nestedFields) {
          result.push(...this.findSensitiveFields(nestedFields, fieldPath))
        }
      }
    })

    return result
  }

  /**
   * Check if field name suggests sensitive data
   */
  private isSensitiveField(field: Field): boolean {
    const sensitiveNames = [
      'password',
      'token',
      'secret',
      'apikey',
      'api_key',
      'privatekey',
      'private_key',
      'ssn',
      'social_security',
      'creditcard',
      'credit_card',
      'salary',
      'income',
      'bankaccount',
      'bank_account',
      'email',
      'phone',
      'address',
    ]

    const fieldNameLower = field.name.toLowerCase()
    return sensitiveNames.some((name) => fieldNameLower.includes(name))
  }

  /**
   * Find upload fields in block configuration
   */
  private findUploadFields(
    fields: Field[],
    parentPath: string = '',
  ): Array<{ field: Field; path: string }> {
    const result: Array<{ field: Field; path: string }> = []

    fields.forEach((field) => {
      const fieldPath = parentPath ? `${parentPath}.${field.name}` : field.name

      if (field.type === 'upload') {
        result.push({ field, path: fieldPath })
      }

      // Check nested fields
      if (this.hasNestedFields(field)) {
        const nestedFields = this.getNestedFields(field)
        if (nestedFields) {
          result.push(...this.findUploadFields(nestedFields, fieldPath))
        }
      }
    })

    return result
  }

  /**
   * Check if upload field has size limit configured
   */
  private hasUploadSizeLimit(uploadConfig: any): boolean {
    // Check if limits are defined (would be in the related collection)
    // This is a heuristic check
    return uploadConfig.limits !== undefined || uploadConfig.maxSize !== undefined
  }

  /**
   * Check if block has upload sanitization hooks
   */
  private hasUploadSanitization(block: Block): boolean {
    if (!block.hooks) return false

    const hasBeforeChange = Boolean(block.hooks.beforeChange && block.hooks.beforeChange.length > 0)
    const hasBeforeValidate = Boolean(
      block.hooks.beforeValidate && block.hooks.beforeValidate.length > 0,
    )

    return hasBeforeChange || hasBeforeValidate
  }

  /**
   * Find dangerouslySetInnerHTML usage in JSX
   */
  private findDangerouslySetInnerHTML(
    jsx: JSXElement[],
  ): Array<{ element: JSXElement; line: number }> {
    const result: Array<{ element: JSXElement; line: number }> = []

    const traverse = (elements: JSXElement[]) => {
      elements.forEach((element) => {
        if (element.props && element.props.dangerouslySetInnerHTML) {
          result.push({ element, line: element.line })
        }

        if (element.children && element.children.length > 0) {
          traverse(element.children)
        }
      })
    }

    traverse(jsx)
    return result
  }

  /**
   * Find props that may contain user-provided content
   */
  private findUserContentProps(component: Component): string[] {
    const userContentKeywords = [
      'content',
      'html',
      'text',
      'body',
      'description',
      'comment',
      'message',
      'input',
      'value',
    ]

    return component.props
      .filter((prop) => {
        const propNameLower = prop.name.toLowerCase()
        return userContentKeywords.some((keyword) => propNameLower.includes(keyword))
      })
      .map((prop) => prop.name)
  }

  /**
   * Find unescaped rendering patterns
   */
  private findUnescapedRenderingPatterns(
    component: Component,
  ): Array<{ description: string; line?: number }> {
    const patterns: Array<{ description: string; line?: number }> = []

    // Check for innerHTML usage in component
    const sourceCode = component.ast?.getText?.() || ''
    if (sourceCode.includes('.innerHTML')) {
      patterns.push({
        description: 'Direct innerHTML manipulation detected',
      })
    }

    return patterns
  }

  /**
   * Check if component has authentication checks
   */
  private hasAuthenticationChecks(component: Component): boolean {
    const sourceCode = component.ast?.getText?.() || ''

    // Check for common authentication patterns
    const authPatterns = [
      'if (!user)',
      'if (!currentUser)',
      'if (!session)',
      'redirect(',
      'return null',
      'return <',
      'useAuth(',
      'getAuth(',
    ]

    return authPatterns.some((pattern) => sourceCode.includes(pattern))
  }

  /**
   * Check if component has role-based checks
   */
  private hasRoleChecks(component: Component): boolean {
    const sourceCode = component.ast?.getText?.() || ''

    const rolePatterns = ['roles?.includes', 'role ===', 'role !==', 'hasRole', 'checkRole']

    return rolePatterns.some((pattern) => sourceCode.includes(pattern))
  }

  /**
   * Check if component has protected content
   */
  private hasProtectedContent(component: Component): boolean {
    // Heuristic: Check for admin-related or sensitive prop names
    const protectedKeywords = [
      'admin',
      'dashboard',
      'settings',
      'private',
      'protected',
      'secure',
      'sensitive',
    ]

    const componentNameLower = component.name.toLowerCase()
    const hasProtectedName = protectedKeywords.some((keyword) =>
      componentNameLower.includes(keyword),
    )

    const hasProtectedProps = component.props.some((prop) => {
      const propNameLower = prop.name.toLowerCase()
      return protectedKeywords.some((keyword) => propNameLower.includes(keyword))
    })

    return hasProtectedName || hasProtectedProps
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
   * Convert string to PascalCase
   */
  private toPascalCase(str: string): string {
    return str
      .split(/[-_]/)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join('')
  }
}
