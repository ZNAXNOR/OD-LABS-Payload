/**
 * Unit tests for Test Generators
 */

import { describe, it, expect } from 'vitest'
import { TestGenerator } from '../../generators/TestGenerator'
import type { Block, Component } from '../../types'

describe('Test Generators', () => {
  const testGenerator = new TestGenerator()

  describe('BlockTestGenerator', () => {
    it('should generate test suite for a simple block', () => {
      const block: Block = {
        slug: 'hero',
        fields: [
          {
            name: 'title',
            type: 'text',
            required: true,
            minLength: 5,
            maxLength: 100,
          },
          {
            name: 'description',
            type: 'textarea',
          },
        ],
      }

      const testSuite = testGenerator.generateBlockTests(block)

      expect(testSuite).toBeDefined()
      expect(testSuite.testFilePath).toContain('hero')
      expect(testSuite.imports).toContain(
        "import { describe, it, expect, beforeEach, afterEach } from 'vitest'",
      )
      expect(testSuite.tests.length).toBeGreaterThan(0)
    })

    it('should generate validation tests for fields with validation', () => {
      const block: Block = {
        slug: 'contact',
        fields: [
          {
            name: 'email',
            type: 'email',
            required: true,
          },
          {
            name: 'age',
            type: 'number',
            min: 18,
            max: 120,
          },
        ],
      }

      const testSuite = testGenerator.generateBlockTests(block)

      expect(testSuite.tests.length).toBeGreaterThan(0)
      expect(testSuite.tests.some((t) => t.name.includes('email'))).toBe(true)
      expect(testSuite.tests.some((t) => t.name.includes('age'))).toBe(true)
    })
  })

  describe('ComponentTestGenerator', () => {
    it('should generate test suite for a component', () => {
      const component: Component = {
        path: 'src/components/Hero.tsx',
        name: 'Hero',
        type: 'client',
        props: [
          {
            name: 'title',
            type: 'string',
            required: true,
          },
          {
            name: 'description',
            type: 'string',
            required: false,
          },
        ],
        imports: [],
        exports: [],
        jsx: [],
        hooks: [],
        ast: null,
      }

      const testSuite = testGenerator.generateComponentTests(component)

      expect(testSuite).toBeDefined()
      expect(testSuite.testFilePath).toContain('Hero')
      expect(testSuite.imports).toContain("import { render, screen } from '@testing-library/react'")
      expect(testSuite.tests.length).toBeGreaterThan(0)
    })

    it('should generate rendering tests', () => {
      const component: Component = {
        path: 'src/components/Button.tsx',
        name: 'Button',
        type: 'client',
        props: [
          {
            name: 'label',
            type: 'string',
            required: true,
          },
        ],
        imports: [],
        exports: [],
        jsx: [],
        hooks: [],
        ast: null,
      }

      const testSuite = testGenerator.generateComponentTests(component)

      expect(testSuite.tests.some((t) => t.name.includes('render'))).toBe(true)
    })
  })

  describe('PropertyTestGenerator', () => {
    it('should generate property tests for complex validation', () => {
      const block: Block = {
        slug: 'form',
        fields: [
          {
            name: 'username',
            type: 'text',
            minLength: 3,
            maxLength: 20,
          },
          {
            name: 'age',
            type: 'number',
            min: 0,
            max: 150,
          },
        ],
      }

      const propertyTests = testGenerator.generatePropertyTests(block)

      expect(propertyTests.length).toBeGreaterThan(0)
      expect(propertyTests[0].iterations).toBeGreaterThanOrEqual(100)
      expect(propertyTests[0].generators.length).toBeGreaterThan(0)
    })
  })

  describe('AccessibilityTestGenerator', () => {
    it('should generate accessibility tests for interactive components', () => {
      const component: Component = {
        path: 'src/components/Modal.tsx',
        name: 'Modal',
        type: 'client',
        props: [
          {
            name: 'isOpen',
            type: 'boolean',
            required: true,
          },
        ],
        imports: [],
        exports: [],
        jsx: [
          {
            type: 'button',
            props: {},
            children: [],
            line: 10,
          },
        ],
        hooks: [],
        ast: null,
      }

      const accessibilityTests = testGenerator.generateAccessibilityTests(component)

      expect(accessibilityTests.length).toBeGreaterThan(0)
      expect(accessibilityTests.some((t) => t.testType === 'keyboard-nav')).toBe(true)
    })
  })

  describe('IntegrationTestGenerator', () => {
    it('should generate integration tests for block-component pairs', () => {
      const block: Block = {
        slug: 'hero',
        fields: [
          {
            name: 'title',
            type: 'text',
            required: true,
          },
        ],
      }

      const component: Component = {
        path: 'src/components/Hero.tsx',
        name: 'Hero',
        type: 'server',
        props: [
          {
            name: 'title',
            type: 'string',
            required: true,
          },
        ],
        imports: [],
        exports: [],
        jsx: [],
        hooks: [],
        ast: null,
      }

      const testSuite = testGenerator.generateIntegrationTests(block, component)

      expect(testSuite).toBeDefined()
      expect(testSuite.tests.length).toBeGreaterThan(0)
      expect(testSuite.tests.some((t) => t.type === 'integration')).toBe(true)
    })
  })

  describe('generateAllTests', () => {
    it('should generate complete test suite for analysis', () => {
      const blocks: Block[] = [
        {
          slug: 'hero',
          fields: [
            {
              name: 'title',
              type: 'text',
              required: true,
            },
          ],
        },
      ]

      const components: Component[] = [
        {
          path: 'src/components/Hero.tsx',
          name: 'Hero',
          type: 'server',
          props: [
            {
              name: 'title',
              type: 'string',
              required: true,
            },
          ],
          imports: [],
          exports: [],
          jsx: [],
          hooks: [],
          ast: null,
        },
      ]

      const pairs = [{ block: blocks[0], component: components[0] }]

      const result = testGenerator.generateAllTests(blocks, components, pairs)

      expect(result.blockTests.length).toBe(1)
      expect(result.componentTests.length).toBe(1)
      expect(result.integrationTests.length).toBe(1)
      expect(result.propertyTests.length).toBeGreaterThanOrEqual(0)
      expect(result.accessibilityTests.length).toBeGreaterThanOrEqual(0)
    })
  })
})
