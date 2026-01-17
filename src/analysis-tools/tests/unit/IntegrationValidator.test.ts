/**
 * Unit tests for IntegrationValidator
 * Tests block-component integration validation
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { IntegrationValidator } from '../../analyzers/IntegrationValidator'
import type { Block, Component, Field, PropDefinition } from '../../types'

describe('IntegrationValidator', () => {
  let validator: IntegrationValidator

  beforeEach(() => {
    validator = new IntegrationValidator()
  })

  describe('validateFieldMapping', () => {
    it('should pass when all fields have matching props', () => {
      const fields: Field[] = [
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'textarea' },
        { name: 'published', type: 'checkbox' },
      ]

      const props: PropDefinition[] = [
        { name: 'title', type: 'string', required: true },
        { name: 'description', type: 'string', required: false },
        { name: 'published', type: 'boolean', required: false },
      ]

      const issues = validator.validateFieldMapping(fields, props)
      expect(issues).toHaveLength(0)
    })

    it('should detect missing props', () => {
      const fields: Field[] = [
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'textarea' },
      ]

      const props: PropDefinition[] = [{ name: 'title', type: 'string', required: true }]

      const issues = validator.validateFieldMapping(fields, props)
      expect(issues).toHaveLength(1)
      expect(issues[0].type).toBe('missing-prop')
      expect(issues[0].fieldName).toBe('description')
    })

    it('should detect extra props', () => {
      const fields: Field[] = [{ name: 'title', type: 'text', required: true }]

      const props: PropDefinition[] = [
        { name: 'title', type: 'string', required: true },
        { name: 'extraProp', type: 'string', required: false },
      ]

      const issues = validator.validateFieldMapping(fields, props)
      expect(issues).toHaveLength(1)
      expect(issues[0].type).toBe('extra-prop')
      expect(issues[0].fieldName).toBe('extraProp')
    })

    it('should ignore common React props', () => {
      const fields: Field[] = [{ name: 'title', type: 'text', required: true }]

      const props: PropDefinition[] = [
        { name: 'title', type: 'string', required: true },
        { name: 'className', type: 'string', required: false },
        { name: 'children', type: 'ReactNode', required: false },
      ]

      const issues = validator.validateFieldMapping(fields, props)
      expect(issues).toHaveLength(0)
    })

    it('should detect type mismatches', () => {
      const fields: Field[] = [{ name: 'count', type: 'number', required: true }]

      const props: PropDefinition[] = [{ name: 'count', type: 'string', required: true }]

      const issues = validator.validateFieldMapping(fields, props)
      expect(issues).toHaveLength(1)
      expect(issues[0].type).toBe('type-mismatch')
      expect(issues[0].fieldName).toBe('count')
    })

    it('should handle nested fields in groups', () => {
      const fields: Field[] = [
        {
          name: 'meta',
          type: 'group',
          fields: [
            { name: 'title', type: 'text' },
            { name: 'description', type: 'textarea' },
          ],
        } as any,
      ]

      const props: PropDefinition[] = [
        { name: 'meta', type: 'object', required: false },
        { name: 'title', type: 'string', required: false },
        { name: 'description', type: 'string', required: false },
      ]

      const issues = validator.validateFieldMapping(fields, props)
      expect(issues).toHaveLength(0)
    })

    it('should handle nested fields in arrays', () => {
      const fields: Field[] = [
        {
          name: 'items',
          type: 'array',
          fields: [
            { name: 'name', type: 'text' },
            { name: 'value', type: 'number' },
          ],
        } as any,
      ]

      const props: PropDefinition[] = [
        { name: 'items', type: 'any[]', required: false },
        { name: 'name', type: 'string', required: false },
        { name: 'value', type: 'number', required: false },
      ]

      const issues = validator.validateFieldMapping(fields, props)
      expect(issues).toHaveLength(0)
    })

    it('should skip UI-only fields', () => {
      const fields: Field[] = [
        { name: 'title', type: 'text', required: true },
        { name: 'separator', type: 'ui' },
      ]

      const props: PropDefinition[] = [{ name: 'title', type: 'string', required: true }]

      const issues = validator.validateFieldMapping(fields, props)
      expect(issues).toHaveLength(0)
    })

    it('should assign critical severity to missing required field props', () => {
      const fields: Field[] = [{ name: 'title', type: 'text', required: true }]

      const props: PropDefinition[] = []

      const issues = validator.validateFieldMapping(fields, props)
      expect(issues).toHaveLength(1)
      expect(issues[0].severity).toBe('critical')
    })

    it('should assign high severity to missing optional field props', () => {
      const fields: Field[] = [{ name: 'description', type: 'textarea', required: false }]

      const props: PropDefinition[] = []

      const issues = validator.validateFieldMapping(fields, props)
      expect(issues).toHaveLength(1)
      expect(issues[0].severity).toBe('high')
    })
  })

  describe('validateNaming', () => {
    it('should pass when naming conventions are correct', () => {
      const block: Block = {
        slug: 'hero-block',
        interfaceName: 'HeroBlockProps',
        fields: [],
      }

      const component: Component = {
        path: '/components/HeroBlock.tsx',
        name: 'HeroBlock',
        type: 'server',
        props: [],
        imports: [],
        exports: [],
        jsx: [],
        hooks: [],
        ast: null,
      }

      const issues = validator.validateNaming(block, component)
      expect(issues).toHaveLength(0)
    })

    it('should detect file name mismatch', () => {
      const block: Block = {
        slug: 'hero-block',
        fields: [],
      }

      const component: Component = {
        path: '/components/Banner.tsx',
        name: 'Banner',
        type: 'server',
        props: [],
        imports: [],
        exports: [],
        jsx: [],
        hooks: [],
        ast: null,
      }

      const issues = validator.validateNaming(block, component)
      expect(issues.length).toBeGreaterThan(0)
      expect(issues.some((i) => i.type === 'file-name-mismatch')).toBe(true)
    })

    it('should detect interface name mismatch', () => {
      const block: Block = {
        slug: 'hero-block',
        interfaceName: 'WrongInterface',
        fields: [],
      }

      const component: Component = {
        path: '/components/HeroBlock.tsx',
        name: 'HeroBlock',
        type: 'server',
        props: [],
        imports: [],
        exports: [],
        jsx: [],
        hooks: [],
        ast: null,
      }

      const issues = validator.validateNaming(block, component)
      expect(issues.length).toBeGreaterThan(0)
      expect(issues.some((i) => i.type === 'interface-mismatch')).toBe(true)
    })

    it('should detect non-kebab-case slug', () => {
      const block: Block = {
        slug: 'HeroBlock',
        fields: [],
      }

      const component: Component = {
        path: '/components/HeroBlock.tsx',
        name: 'HeroBlock',
        type: 'server',
        props: [],
        imports: [],
        exports: [],
        jsx: [],
        hooks: [],
        ast: null,
      }

      const issues = validator.validateNaming(block, component)
      expect(issues.some((i) => i.type === 'slug-mismatch')).toBe(true)
    })

    it('should convert kebab-case slug to PascalCase component name', () => {
      const block: Block = {
        slug: 'call-to-action',
        fields: [],
      }

      const component: Component = {
        path: '/components/CallToAction.tsx',
        name: 'CallToAction',
        type: 'server',
        props: [],
        imports: [],
        exports: [],
        jsx: [],
        hooks: [],
        ast: null,
      }

      const issues = validator.validateNaming(block, component)
      expect(issues.filter((i) => i.type === 'file-name-mismatch')).toHaveLength(0)
    })
  })

  describe('validatePreview', () => {
    it('should pass when no preview is configured', () => {
      const block: Block = {
        slug: 'hero-block',
        fields: [],
      }

      const issues = validator.validatePreview(block)
      expect(issues).toHaveLength(0)
    })

    it('should detect missing preview file', () => {
      const block: Block = {
        slug: 'hero-block',
        fields: [],
        admin: {
          preview: '/non-existent-path/Preview.tsx',
        },
      }

      const issues = validator.validatePreview(block)
      expect(issues).toHaveLength(1)
      expect(issues[0].type).toBe('missing-preview-file')
    })
  })

  describe('validateIntegration', () => {
    it('should return valid result when all checks pass', () => {
      const block: Block = {
        slug: 'hero-block',
        interfaceName: 'HeroBlockProps',
        fields: [{ name: 'title', type: 'text', required: true }],
      }

      const component: Component = {
        path: '/components/HeroBlock.tsx',
        name: 'HeroBlock',
        type: 'server',
        props: [{ name: 'title', type: 'string', required: true }],
        imports: [],
        exports: [],
        jsx: [],
        hooks: [],
        ast: null,
      }

      const result = validator.validateIntegration(block, component)
      expect(result.isValid).toBe(true)
      expect(result.issues).toHaveLength(0)
    })

    it('should return invalid result when checks fail', () => {
      const block: Block = {
        slug: 'hero-block',
        fields: [
          { name: 'title', type: 'text', required: true },
          { name: 'description', type: 'textarea' },
        ],
      }

      const component: Component = {
        path: '/components/Banner.tsx',
        name: 'Banner',
        type: 'server',
        props: [{ name: 'title', type: 'string', required: true }],
        imports: [],
        exports: [],
        jsx: [],
        hooks: [],
        ast: null,
      }

      const result = validator.validateIntegration(block, component)
      expect(result.isValid).toBe(false)
      expect(result.issues.length).toBeGreaterThan(0)
    })

    it('should provide suggestions when issues are found', () => {
      const block: Block = {
        slug: 'hero-block',
        fields: [{ name: 'title', type: 'text', required: true }],
      }

      const component: Component = {
        path: '/components/Banner.tsx',
        name: 'Banner',
        type: 'server',
        props: [],
        imports: [],
        exports: [],
        jsx: [],
        hooks: [],
        ast: null,
      }

      const result = validator.validateIntegration(block, component)
      expect(result.suggestions.length).toBeGreaterThan(0)
    })

    it('should detect nested field issues', () => {
      const block: Block = {
        slug: 'hero-block',
        fields: [
          {
            name: 'meta',
            type: 'group',
            fields: [{ name: 'title', type: 'text' }],
          } as any,
        ],
      }

      const component: Component = {
        path: '/components/HeroBlock.tsx',
        name: 'HeroBlock',
        type: 'server',
        props: [],
        imports: [],
        exports: [],
        jsx: [],
        hooks: [],
        ast: null,
      }

      const result = validator.validateIntegration(block, component)
      expect(result.isValid).toBe(false)
      expect(result.issues.length).toBeGreaterThan(0)
    })
  })

  describe('edge cases', () => {
    it('should handle empty fields array', () => {
      const fields: Field[] = []
      const props: PropDefinition[] = []

      const issues = validator.validateFieldMapping(fields, props)
      expect(issues).toHaveLength(0)
    })

    it('should handle deeply nested fields', () => {
      const fields: Field[] = [
        {
          name: 'level1',
          type: 'group',
          fields: [
            {
              name: 'level2',
              type: 'group',
              fields: [{ name: 'level3', type: 'text' }],
            } as any,
          ],
        } as any,
      ]

      const props: PropDefinition[] = [
        { name: 'level1', type: 'object', required: false },
        { name: 'level2', type: 'object', required: false },
        { name: 'level3', type: 'string', required: false },
      ]

      const issues = validator.validateFieldMapping(fields, props)
      expect(issues).toHaveLength(0)
    })

    it('should handle blocks field type', () => {
      const fields: Field[] = [
        {
          name: 'content',
          type: 'blocks',
          blocks: [
            {
              slug: 'text-block',
              fields: [{ name: 'text', type: 'text' }],
            },
          ],
        } as any,
      ]

      const props: PropDefinition[] = [
        { name: 'content', type: 'any[]', required: false },
        { name: 'text', type: 'string', required: false },
      ]

      const issues = validator.validateFieldMapping(fields, props)
      expect(issues).toHaveLength(0)
    })

    it('should handle fields with special characters in names', () => {
      const fields: Field[] = [{ name: 'field_with_underscore', type: 'text' }]

      const props: PropDefinition[] = [
        { name: 'field_with_underscore', type: 'string', required: false },
      ]

      const issues = validator.validateFieldMapping(fields, props)
      expect(issues).toHaveLength(0)
    })
  })
})
