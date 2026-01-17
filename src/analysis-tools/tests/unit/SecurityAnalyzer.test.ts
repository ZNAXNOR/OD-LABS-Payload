/**
 * Unit tests for SecurityAnalyzer
 * Tests access control, XSS protection, file upload security, and authentication validation
 */

import { describe, it, expect } from 'vitest'
import { SecurityAnalyzer } from '../../analyzers/SecurityAnalyzer'
import type { Block, Field, Component } from '../../types'

describe('SecurityAnalyzer', () => {
  const analyzer = new SecurityAnalyzer()

  describe('Access Control Validation (Task 9.1)', () => {
    it('should flag blocks without access control', () => {
      const block: Block = {
        slug: 'test-block',
        fields: [{ name: 'title', type: 'text' }],
      }

      const issues = analyzer.validateAccessControl(block)

      expect(issues.length).toBeGreaterThan(0)
      expect(issues[0].type).toBe('missing-access-control')
      expect(issues[0].severity).toBe('critical')
      expect(issues[0].description).toContain('no access control')
    })

    it('should flag blocks with partial access control', () => {
      const block: Block = {
        slug: 'test-block',
        fields: [{ name: 'title', type: 'text' }],
        access: {
          read: () => true,
        },
      }

      const issues = analyzer.validateAccessControl(block)

      expect(issues.length).toBeGreaterThan(0)
      expect(issues[0].description).toContain('missing access control for')
      expect(issues[0].description).toContain('create')
    })

    it('should flag sensitive fields without access control', () => {
      const block: Block = {
        slug: 'users',
        fields: [
          { name: 'email', type: 'email' },
          { name: 'password', type: 'text' },
        ],
        access: {
          create: () => true,
          read: () => true,
          update: () => true,
          delete: () => true,
        },
      }

      const issues = analyzer.validateAccessControl(block)

      const sensitiveFieldIssues = issues.filter((i) => i.description.includes('Sensitive field'))
      expect(sensitiveFieldIssues.length).toBeGreaterThan(0)
    })

    it('should not flag blocks with complete access control', () => {
      const block: Block = {
        slug: 'test-block',
        fields: [{ name: 'title', type: 'text' }],
        access: {
          create: () => true,
          read: () => true,
          update: () => true,
          delete: () => true,
        },
      }

      const issues = analyzer.validateAccessControl(block)

      expect(issues.length).toBe(0)
    })
  })

  describe('XSS Protection Validation (Task 9.3)', () => {
    it('should flag dangerouslySetInnerHTML usage', () => {
      const component: Component = {
        path: '/components/Test.tsx',
        name: 'TestComponent',
        type: 'client',
        props: [],
        imports: [],
        exports: [],
        jsx: [
          {
            type: 'div',
            props: {
              dangerouslySetInnerHTML: { __html: 'content' },
            },
            children: [],
            line: 10,
          },
        ],
        hooks: [],
        ast: null,
      }

      const issues = analyzer.validateXSSProtection(component)

      expect(issues.length).toBeGreaterThan(0)
      expect(issues[0].severity).toBe('critical')
      expect(issues[0].description).toContain('dangerouslySetInnerHTML')
      expect(issues[0].description).toContain('XSS')
    })

    it('should flag user content with dangerouslySetInnerHTML', () => {
      const component: Component = {
        path: '/components/Test.tsx',
        name: 'TestComponent',
        type: 'client',
        props: [{ name: 'userContent', type: 'string', required: true }],
        imports: [],
        exports: [],
        jsx: [
          {
            type: 'div',
            props: {
              dangerouslySetInnerHTML: { __html: 'content' },
            },
            children: [],
            line: 10,
          },
        ],
        hooks: [],
        ast: null,
      }

      const issues = analyzer.validateXSSProtection(component)

      expect(issues.length).toBeGreaterThan(0)
      const userContentIssue = issues.find((i) => i.description.includes('user-provided'))
      expect(userContentIssue).toBeDefined()
    })

    it('should not flag safe components', () => {
      const component: Component = {
        path: '/components/Test.tsx',
        name: 'TestComponent',
        type: 'server',
        props: [],
        imports: [],
        exports: [],
        jsx: [
          {
            type: 'div',
            props: {},
            children: [],
            line: 10,
          },
        ],
        hooks: [],
        ast: null,
      }

      const issues = analyzer.validateXSSProtection(component)

      expect(issues.length).toBe(0)
    })
  })

  describe('File Upload Security Validation (Task 9.5)', () => {
    it('should flag upload fields without file type restrictions', () => {
      const block: Block = {
        slug: 'media-block',
        fields: [
          {
            name: 'image',
            type: 'upload',
            relationTo: 'media',
          } as Field,
        ],
        access: {
          create: () => true,
          read: () => true,
          update: () => true,
          delete: () => true,
        },
      }

      const issues = analyzer.validateFileUploadSecurity(block)

      expect(issues.length).toBeGreaterThan(0)
      const typeIssue = issues.find((i) => i.description.includes('file type'))
      expect(typeIssue).toBeDefined()
      expect(typeIssue?.severity).toBe('high')
    })

    it('should flag upload fields without size limits', () => {
      const block: Block = {
        slug: 'media-block',
        fields: [
          {
            name: 'image',
            type: 'upload',
            relationTo: 'media',
          } as Field,
        ],
        access: {
          create: () => true,
          read: () => true,
          update: () => true,
          delete: () => true,
        },
      }

      const issues = analyzer.validateFileUploadSecurity(block)

      const sizeIssue = issues.find((i) => i.description.includes('size limit'))
      expect(sizeIssue).toBeDefined()
    })

    it('should flag blocks without sanitization hooks', () => {
      const block: Block = {
        slug: 'media-block',
        fields: [
          {
            name: 'image',
            type: 'upload',
            relationTo: 'media',
          } as Field,
        ],
        access: {
          create: () => true,
          read: () => true,
          update: () => true,
          delete: () => true,
        },
      }

      const issues = analyzer.validateFileUploadSecurity(block)

      const sanitizationIssue = issues.find((i) => i.description.includes('sanitization'))
      expect(sanitizationIssue).toBeDefined()
    })

    it('should not flag blocks without upload fields', () => {
      const block: Block = {
        slug: 'text-block',
        fields: [{ name: 'title', type: 'text' }],
        access: {
          create: () => true,
          read: () => true,
          update: () => true,
          delete: () => true,
        },
      }

      const issues = analyzer.validateFileUploadSecurity(block)

      expect(issues.length).toBe(0)
    })
  })

  describe('Authentication Verification (Task 9.7)', () => {
    it('should flag components with user props but no auth checks', () => {
      const component: Component = {
        path: '/components/Dashboard.tsx',
        name: 'Dashboard',
        type: 'server',
        props: [{ name: 'user', type: 'User', required: true }],
        imports: [],
        exports: [],
        jsx: [],
        hooks: [],
        ast: {
          getText: () =>
            'export default function Dashboard({ user }) { const data = fetchData(); }',
        },
      }

      const issues = analyzer.validateAuthentication(component)

      expect(issues.length).toBeGreaterThan(0)
      // Should flag missing authentication
      const authIssue = issues.find((i) => i.description.includes('user-related props'))
      expect(authIssue).toBeDefined()
      expect(authIssue?.severity).toBe('high')
    })

    it('should flag components without role checks', () => {
      const component: Component = {
        path: '/components/AdminPanel.tsx',
        name: 'AdminPanel',
        type: 'server',
        props: [{ name: 'user', type: 'User', required: true }],
        imports: [],
        exports: [],
        jsx: [],
        hooks: [],
        ast: {
          getText: () =>
            'export default function AdminPanel({ user }) { if (!user) return null; return <div>Admin</div> }',
        },
      }

      const issues = analyzer.validateAuthentication(component)

      const roleIssue = issues.find((i) => i.description.includes('role-based'))
      expect(roleIssue).toBeDefined()
      expect(roleIssue?.severity).toBe('medium')
    })

    it('should flag client components without auth hooks', () => {
      const component: Component = {
        path: '/components/ProtectedContent.tsx',
        name: 'ProtectedContent',
        type: 'client',
        props: [{ name: 'adminData', type: 'any', required: true }],
        imports: [],
        exports: [],
        jsx: [],
        hooks: [],
        ast: {
          getText: () =>
            "'use client'\nexport function ProtectedContent() { return <div>Protected</div> }",
        },
      }

      const issues = analyzer.validateAuthentication(component)

      const authHookIssue = issues.find((i) => i.description.includes('authentication hooks'))
      expect(authHookIssue).toBeDefined()
    })

    it('should not flag components with proper auth checks', () => {
      const component: Component = {
        path: '/components/Dashboard.tsx',
        name: 'Dashboard',
        type: 'server',
        props: [{ name: 'user', type: 'User', required: true }],
        imports: [],
        exports: [],
        jsx: [],
        hooks: [],
        ast: {
          getText: () =>
            'export default function Dashboard({ user }) { if (!user) redirect("/login"); return <div>Dashboard</div> }',
        },
      }

      const issues = analyzer.validateAuthentication(component)

      // Component has auth check but still gets role check suggestion
      const authIssue = issues.find((i) => i.description.includes('does not verify authentication'))
      expect(authIssue).toBeUndefined()
    })
  })

  describe('Security Report Generation', () => {
    it('should generate comprehensive security report', () => {
      const block: Block = {
        slug: 'test-block',
        fields: [
          { name: 'title', type: 'text' },
          { name: 'password', type: 'text' },
        ],
      }

      const component: Component = {
        path: '/components/Test.tsx',
        name: 'TestComponent',
        type: 'client',
        props: [{ name: 'user', type: 'User', required: true }],
        imports: [],
        exports: [],
        jsx: [
          {
            type: 'div',
            props: {
              dangerouslySetInnerHTML: { __html: 'content' },
            },
            children: [],
            line: 10,
          },
        ],
        hooks: [],
        ast: {
          getText: () => "'use client'\nexport function TestComponent() { return <div>Test</div> }",
        },
      }

      const report = analyzer.generateSecurityReport(block, component)

      expect(report.accessControlIssues.length).toBeGreaterThan(0)
      expect(report.xssIssues.length).toBeGreaterThan(0)
      expect(report.authenticationIssues.length).toBeGreaterThan(0)
      expect(report.criticalIssuesCount).toBeGreaterThan(0)
      expect(report.overallSecurityScore).toBeLessThan(100)
    })

    it('should calculate security score correctly', () => {
      const block: Block = {
        slug: 'secure-block',
        fields: [{ name: 'title', type: 'text' }],
        access: {
          create: () => true,
          read: () => true,
          update: () => true,
          delete: () => true,
        },
      }

      const report = analyzer.generateSecurityReport(block)

      expect(report.overallSecurityScore).toBe(100)
      expect(report.criticalIssuesCount).toBe(0)
    })
  })
})
