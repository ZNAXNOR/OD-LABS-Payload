/**
 * Unit tests for BlockAnalyzer
 * Tests block analysis with various structures, error handling, and edge cases
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { BlockAnalyzer } from '../../analyzers/BlockAnalyzer'
import type { Block } from '../../types'

describe('BlockAnalyzer', () => {
  let analyzer: BlockAnalyzer

  beforeEach(() => {
    analyzer = new BlockAnalyzer()
  })

  describe('validateFields', () => {
    it('should validate fields in a simple block', () => {
      const block: Block = {
        slug: 'hero',
        fields: [
          {
            name: 'title',
            type: 'text',
            required: true,
          },
          {
            name: 'description',
            type: 'textarea',
          },
        ],
      }

      const results = analyzer.validateFields(block)
      expect(Array.isArray(results)).toBe(true)
    })

    it('should detect missing validation on fields', () => {
      const block: Block = {
        slug: 'hero',
        fields: [
          {
            name: 'email',
            type: 'email',
            // Missing required validation
          },
        ],
      }

      const results = analyzer.validateFields(block)
      expect(results.length).toBeGreaterThan(0)
      expect(results[0]?.missingValidations).toBeDefined()
    })

    it('should handle blocks with nested fields', () => {
      const block: Block = {
        slug: 'complex',
        fields: [
          {
            name: 'content',
            type: 'group',
            fields: [
              {
                name: 'title',
                type: 'text',
              },
              {
                name: 'items',
                type: 'array',
                fields: [
                  {
                    name: 'label',
                    type: 'text',
                  },
                ],
              },
            ],
          },
        ],
      }

      const results = analyzer.validateFields(block)
      expect(Array.isArray(results)).toBe(true)
    })

    it('should handle empty blocks', () => {
      const block: Block = {
        slug: 'empty',
        fields: [],
      }

      const results = analyzer.validateFields(block)
      expect(Array.isArray(results)).toBe(true)
      expect(results.length).toBe(0)
    })

    it('should handle deeply nested fields', () => {
      const block: Block = {
        slug: 'deep',
        fields: [
          {
            name: 'level1',
            type: 'group',
            fields: [
              {
                name: 'level2',
                type: 'group',
                fields: [
                  {
                    name: 'level3',
                    type: 'group',
                    fields: [
                      {
                        name: 'level4',
                        type: 'text',
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      }

      const results = analyzer.validateFields(block)
      expect(Array.isArray(results)).toBe(true)
    })
  })

  describe('checkTyping', () => {
    it('should detect missing interfaceName', () => {
      const block: Block = {
        slug: 'hero',
        fields: [
          {
            name: 'title',
            type: 'text',
          },
        ],
      }

      const issues = analyzer.checkTyping(block)
      expect(Array.isArray(issues)).toBe(true)
      const hasInterfaceNameIssue = issues.some((issue) => issue.type === 'missing-interface-name')
      expect(hasInterfaceNameIssue).toBe(true)
    })

    it('should not report issues when interfaceName is present', () => {
      const block: Block = {
        slug: 'hero',
        interfaceName: 'HeroBlock',
        fields: [
          {
            name: 'title',
            type: 'text',
          },
        ],
      }

      const issues = analyzer.checkTyping(block)
      const hasInterfaceNameIssue = issues.some((issue) => issue.type === 'missing-interface-name')
      expect(hasInterfaceNameIssue).toBe(false)
    })

    it('should handle blocks with no fields', () => {
      const block: Block = {
        slug: 'empty',
        fields: [],
      }

      const issues = analyzer.checkTyping(block)
      expect(Array.isArray(issues)).toBe(true)
    })
  })

  describe('checkAccessControl', () => {
    it('should detect missing access control', () => {
      const block: Block = {
        slug: 'hero',
        fields: [
          {
            name: 'title',
            type: 'text',
          },
        ],
      }

      const issues = analyzer.checkAccessControl(block)
      expect(Array.isArray(issues)).toBe(true)
      expect(issues.length).toBeGreaterThan(0)
    })

    it('should not report critical issues when access control is present', () => {
      const block: Block = {
        slug: 'hero',
        access: {
          create: () => true,
          read: () => true,
          update: () => true,
          delete: () => true,
        },
        fields: [
          {
            name: 'title',
            type: 'text',
          },
        ],
      }

      const issues = analyzer.checkAccessControl(block)
      const hasCriticalAccessIssue = issues.some(
        (issue) => issue.type === 'missing-access-control' && issue.severity === 'critical',
      )
      expect(hasCriticalAccessIssue).toBe(false)
    })

    it('should check field-level access control', () => {
      const block: Block = {
        slug: 'hero',
        access: {
          read: () => true,
        },
        fields: [
          {
            name: 'publicField',
            type: 'text',
          },
          {
            name: 'privateField',
            type: 'text',
            access: {
              read: () => false,
            },
          },
        ],
      }

      const issues = analyzer.checkAccessControl(block)
      expect(Array.isArray(issues)).toBe(true)
    })
  })

  describe('checkAdminConfig', () => {
    it('should detect missing admin configuration', () => {
      const block: Block = {
        slug: 'hero',
        fields: [
          {
            name: 'title',
            type: 'text',
          },
        ],
      }

      const issues = analyzer.checkAdminConfig(block)
      expect(Array.isArray(issues)).toBe(true)
    })

    it('should handle blocks with admin configuration', () => {
      const block: Block = {
        slug: 'hero',
        fields: [
          {
            name: 'title',
            type: 'text',
            admin: {
              description: 'The main title',
              placeholder: 'Enter title...',
            },
          },
        ],
      }

      const issues = analyzer.checkAdminConfig(block)
      expect(Array.isArray(issues)).toBe(true)
    })

    it('should handle empty blocks', () => {
      const block: Block = {
        slug: 'empty',
        fields: [],
      }

      const issues = analyzer.checkAdminConfig(block)
      expect(Array.isArray(issues)).toBe(true)
    })
  })

  describe('Edge Cases', () => {
    it('should handle blocks with undefined fields', () => {
      const block: Block = {
        slug: 'test',
        fields: undefined as any,
      }

      expect(() => analyzer.validateFields(block)).not.toThrow()
    })

    it('should handle blocks with null values', () => {
      const block: Block = {
        slug: 'test',
        fields: [
          {
            name: 'field1',
            type: 'text',
            required: null as any,
          },
        ],
      }

      expect(() => analyzer.validateFields(block)).not.toThrow()
    })

    it('should handle blocks with circular references gracefully', () => {
      const block: Block = {
        slug: 'circular',
        fields: [
          {
            name: 'self',
            type: 'relationship',
            relationTo: 'circular',
          },
        ],
      }

      expect(() => analyzer.validateFields(block)).not.toThrow()
    })

    it('should handle blocks with very long field names', () => {
      const longName = 'a'.repeat(1000)
      const block: Block = {
        slug: 'test',
        fields: [
          {
            name: longName,
            type: 'text',
          },
        ],
      }

      expect(() => analyzer.validateFields(block)).not.toThrow()
    })

    it('should handle blocks with special characters in field names', () => {
      const block: Block = {
        slug: 'test',
        fields: [
          {
            name: 'field-with-dashes',
            type: 'text',
          },
          {
            name: 'field_with_underscores',
            type: 'text',
          },
        ],
      }

      expect(() => analyzer.validateFields(block)).not.toThrow()
    })

    it('should handle blocks with all field types', () => {
      const block: Block = {
        slug: 'all-types',
        fields: [
          { name: 'text', type: 'text' },
          { name: 'textarea', type: 'textarea' },
          { name: 'email', type: 'email' },
          { name: 'number', type: 'number' },
          { name: 'checkbox', type: 'checkbox' },
          { name: 'select', type: 'select', options: [] },
          { name: 'radio', type: 'radio', options: [] },
          { name: 'date', type: 'date' },
          { name: 'upload', type: 'upload', relationTo: 'media' },
          { name: 'relationship', type: 'relationship', relationTo: 'posts' },
          { name: 'richText', type: 'richText' },
          { name: 'array', type: 'array', fields: [] },
          { name: 'group', type: 'group', fields: [] },
          { name: 'blocks', type: 'blocks', blocks: [] },
        ],
      }

      expect(() => analyzer.validateFields(block)).not.toThrow()
    })
  })

  describe('Complex Scenarios', () => {
    it('should handle blocks with mixed validation rules', () => {
      const block: Block = {
        slug: 'complex',
        fields: [
          {
            name: 'email',
            type: 'email',
            required: true,
            validate: (_value: any) => true,
          },
          {
            name: 'age',
            type: 'number',
            min: 0,
            max: 120,
          },
          {
            name: 'description',
            type: 'textarea',
            minLength: 10,
            maxLength: 500,
          },
        ],
      }

      const results = analyzer.validateFields(block)
      expect(Array.isArray(results)).toBe(true)
    })

    it('should handle blocks with conditional fields', () => {
      const block: Block = {
        slug: 'conditional',
        fields: [
          {
            name: 'showExtra',
            type: 'checkbox',
          },
          {
            name: 'extraField',
            type: 'text',
            admin: {
              condition: (data: any) => data.showExtra === true,
            },
          },
        ],
      }

      expect(() => analyzer.validateFields(block)).not.toThrow()
    })

    it('should handle blocks with hooks', () => {
      const block: Block = {
        slug: 'with-hooks',
        hooks: {
          beforeChange: [async ({ data }: any) => data],
          afterChange: [async ({ doc }: any) => doc],
        },
        fields: [
          {
            name: 'title',
            type: 'text',
          },
        ],
      }

      expect(() => analyzer.validateFields(block)).not.toThrow()
    })

    it('should handle blocks with labels', () => {
      const block: Block = {
        slug: 'labeled',
        labels: {
          singular: 'Hero Block',
          plural: 'Hero Blocks',
        },
        fields: [
          {
            name: 'title',
            type: 'text',
          },
        ],
      }

      expect(() => analyzer.validateFields(block)).not.toThrow()
    })
  })
})
