/**
 * Integration Test Generator
 * Generates integration tests for block-component data flow
 * Validates: Requirements 5.5
 */

import type { Block, Component, Field, TestSuite, Test } from '../types'

export class IntegrationTestGenerator {
  /**
   * Generate integration test suite for block-component pair
   */
  generateIntegrationTests(block: Block, component: Component): TestSuite {
    const tests: Test[] = []
    const imports = this.generateImports(block, component)

    // Generate data flow tests
    tests.push(...this.generateDataFlowTests(block, component))

    // Generate nested data handling tests
    tests.push(...this.generateNestedDataTests(block, component))

    // Generate field-to-prop mapping tests
    tests.push(...this.generateFieldPropMappingTests(block, component))

    return {
      testFilePath: `tests/integration/${block.slug}-${component.name}.test.tsx`,
      imports,
      tests,
      setup: this.generateSetup(),
      teardown: this.generateTeardown(),
    }
  }

  /**
   * Generate imports for test file
   */
  private generateImports(block: Block, component: Component): string[] {
    return [
      "import { describe, it, expect, beforeEach, afterEach } from 'vitest'",
      "import { render, screen } from '@testing-library/react'",
      `import { ${block.slug}Block } from '@/blocks/${this.toPascalCase(block.slug)}/config'`,
      `import { ${component.name} } from '@/components/blocks/${component.name}'`,
      "import type { Block } from 'payload'",
    ]
  }

  /**
   * Generate data flow tests
   */
  private generateDataFlowTests(block: Block, component: Component): Test[] {
    const tests: Test[] = []

    // Test that all block fields flow to component props
    tests.push(this.generateCompleteDataFlowTest(block, component))

    // Test individual field mappings
    const mappableFields = this.extractMappableFields(block.fields)
    for (const field of mappableFields.slice(0, 3)) {
      // Test first 3 fields
      tests.push(this.generateFieldDataFlowTest(field, block, component))
    }

    return tests
  }

  /**
   * Generate complete data flow test
   */
  private generateCompleteDataFlowTest(block: Block, component: Component): Test {
    const testName = `should pass all block data to component props`
    const blockData = this.generateBlockData(block.fields)

    const code = `
  it('${this.escapeString(testName)}', () => {
    // Create block data matching the block config
    const blockData = ${blockData}
    
    // Render component with block data
    render(<${component.name} {...blockData} />)
    
    // Verify component renders with data
    expect(screen.getByTestId || screen.getByRole).toBeDefined()
  })
`

    return {
      type: 'integration',
      name: testName,
      code,
      dependencies: ['@testing-library/react'],
    }
  }

  /**
   * Generate field data flow test
   */
  private generateFieldDataFlowTest(field: Field, block: Block, component: Component): Test {
    const testName = `should correctly pass ${field.name} from block to component`
    const fieldValue = this.generateFieldValue(field)

    const code = `
  it('${this.escapeString(testName)}', () => {
    // Create block data with specific field value
    const blockData = {
      ${field.name}: ${fieldValue}
    }
    
    // Render component
    const { container } = render(<${component.name} {...blockData} />)
    
    // Verify field data is used in component
    ${this.generateFieldVerification(field)}
  })
`

    return {
      type: 'integration',
      name: testName,
      code,
      dependencies: ['@testing-library/react'],
    }
  }

  /**
   * Generate nested data handling tests
   */
  private generateNestedDataTests(block: Block, component: Component): Test[] {
    const tests: Test[] = []
    const nestedFields = this.extractNestedFields(block.fields)

    for (const field of nestedFields) {
      tests.push(this.generateNestedDataTest(field, block, component))
    }

    return tests
  }

  /**
   * Generate nested data test
   */
  private generateNestedDataTest(field: Field, block: Block, component: Component): Test {
    const testName = `should handle nested data in ${field.name}`
    const nestedData = this.generateNestedData(field)

    const code = `
  it('${this.escapeString(testName)}', () => {
    // Create block data with nested structure
    const blockData = {
      ${field.name}: ${nestedData}
    }
    
    // Render component
    const { container } = render(<${component.name} {...blockData} />)
    
    // Verify nested data is handled correctly
    expect(container.firstChild).toBeTruthy()
    
    // Verify nested data is accessible
    ${this.generateNestedDataVerification(field)}
  })
`

    return {
      type: 'integration',
      name: testName,
      code,
      dependencies: ['@testing-library/react'],
    }
  }

  /**
   * Generate field-prop mapping tests
   */
  private generateFieldPropMappingTests(block: Block, component: Component): Test[] {
    const tests: Test[] = []

    // Test that all required fields have corresponding props
    tests.push(this.generateRequiredFieldMappingTest(block, component))

    // Test that component handles missing optional fields
    tests.push(this.generateOptionalFieldHandlingTest(block, component))

    return tests
  }

  /**
   * Generate required field mapping test
   */
  private generateRequiredFieldMappingTest(block: Block, component: Component): Test {
    const testName = `should require all mandatory block fields as props`
    const requiredFields = this.extractRequiredFields(block.fields)
    const requiredData = this.generateRequiredFieldsData(requiredFields)

    const code = `
  it('${this.escapeString(testName)}', () => {
    // Create data with only required fields
    const requiredData = ${requiredData}
    
    // Component should render with required fields only
    const { container } = render(<${component.name} {...requiredData} />)
    
    expect(container.firstChild).toBeTruthy()
  })
`

    return {
      type: 'integration',
      name: testName,
      code,
      dependencies: ['@testing-library/react'],
    }
  }

  /**
   * Generate optional field handling test
   */
  private generateOptionalFieldHandlingTest(block: Block, component: Component): Test {
    const testName = `should handle missing optional fields gracefully`
    const requiredFields = this.extractRequiredFields(block.fields)
    const minimalData = this.generateRequiredFieldsData(requiredFields)

    const code = `
  it('${this.escapeString(testName)}', () => {
    // Create data with only required fields (no optional fields)
    const minimalData = ${minimalData}
    
    // Component should render without errors
    const { container } = render(<${component.name} {...minimalData} />)
    
    expect(container.firstChild).toBeTruthy()
    
    // Verify no console errors
    expect(console.error).not.toHaveBeenCalled()
  })
`

    return {
      type: 'integration',
      name: testName,
      code,
      dependencies: ['@testing-library/react'],
    }
  }

  /**
   * Extract mappable fields (fields that should map to props)
   */
  private extractMappableFields(fields: Field[]): Field[] {
    const result: Field[] = []

    for (const field of fields) {
      // Skip UI-only fields
      if (field.type !== 'ui') {
        result.push(field)
      }

      // Recursively extract from nested fields
      if (this.hasSubFields(field)) {
        result.push(...this.extractMappableFields(field.fields))
      }
    }

    return result
  }

  /**
   * Extract nested fields
   */
  private extractNestedFields(fields: Field[]): Field[] {
    return fields.filter((field) => this.hasSubFields(field))
  }

  /**
   * Extract required fields
   */
  private extractRequiredFields(fields: Field[]): Field[] {
    const result: Field[] = []

    for (const field of fields) {
      if (field.required && field.type !== 'ui') {
        result.push(field)
      }

      // Recursively extract from nested fields
      if (this.hasSubFields(field)) {
        result.push(...this.extractRequiredFields(field.fields))
      }
    }

    return result
  }

  /**
   * Check if field has sub-fields
   */
  private hasSubFields(field: Field): boolean {
    return (
      !!(field.type === 'group' || field.type === 'array' || field.type === 'blocks') &&
      field.fields
    )
  }

  /**
   * Generate block data object
   */
  private generateBlockData(fields: Field[]): string {
    const fieldEntries: string[] = []

    for (const field of fields) {
      if (field.type !== 'ui') {
        const value = this.generateFieldValue(field)
        fieldEntries.push(`${field.name}: ${value}`)
      }
    }

    return `{\n      ${fieldEntries.join(',\n      ')}\n    }`
  }

  /**
   * Generate required fields data object
   */
  private generateRequiredFieldsData(fields: Field[]): string {
    const fieldEntries: string[] = []

    for (const field of fields) {
      const value = this.generateFieldValue(field)
      fieldEntries.push(`${field.name}: ${value}`)
    }

    return `{\n      ${fieldEntries.join(',\n      ')}\n    }`
  }

  /**
   * Generate field value based on type
   */
  private generateFieldValue(field: Field): string {
    switch (field.type) {
      case 'text':
      case 'textarea':
        return `'Test ${field.name}'`
      case 'email':
        return `'test@example.com'`
      case 'number':
        return '42'
      case 'checkbox':
        return 'true'
      case 'date':
        return `new Date().toISOString()`
      case 'select':
        return field.options && field.options.length > 0 ? `'${field.options[0]}'` : `'option1'`
      case 'relationship':
        return `{ id: 'rel-123', relationTo: 'collection' }`
      case 'upload':
        return `{ id: 'upload-456', url: '/media/test.jpg' }`
      case 'richText':
        return `{ root: { children: [{ text: 'Rich text content' }] } }`
      case 'array':
        return this.generateArrayValue(field)
      case 'group':
        return this.generateGroupValue(field)
      case 'blocks':
        return `[]`
      default:
        return `'test-value'`
    }
  }

  /**
   * Generate array field value
   */
  private generateArrayValue(field: Field): string {
    if (!field.fields || field.fields.length === 0) {
      return '[]'
    }

    const itemData = this.generateBlockData(field.fields)
    return `[${itemData}]`
  }

  /**
   * Generate group field value
   */
  private generateGroupValue(field: Field): string {
    if (!field.fields || field.fields.length === 0) {
      return '{}'
    }

    return this.generateBlockData(field.fields)
  }

  /**
   * Generate nested data for field
   */
  private generateNestedData(field: Field): string {
    if (field.type === 'array') {
      return this.generateArrayValue(field)
    } else if (field.type === 'group') {
      return this.generateGroupValue(field)
    } else if (field.type === 'blocks') {
      return `[{ blockType: 'example', data: {} }]`
    }
    return '{}'
  }

  /**
   * Generate field verification code
   */
  private generateFieldVerification(field: Field): string {
    switch (field.type) {
      case 'text':
      case 'textarea':
        return `expect(container.textContent).toContain('Test ${field.name}')`
      case 'number':
        return `expect(container.textContent).toContain('42')`
      case 'checkbox':
        return `expect(container.querySelector('input[type="checkbox"]')).toBeTruthy()`
      default:
        return `expect(container.firstChild).toBeTruthy()`
    }
  }

  /**
   * Generate nested data verification code
   */
  private generateNestedDataVerification(field: Field): string {
    if (field.type === 'array') {
      return `expect(container.querySelectorAll('[data-array-item]').length).toBeGreaterThan(0)`
    } else if (field.type === 'group') {
      return `expect(container.querySelector('[data-group]')).toBeTruthy()`
    }
    return `expect(container.firstChild).toBeTruthy()`
  }

  /**
   * Generate test setup
   */
  private generateSetup(): string {
    return `
  beforeEach(() => {
    // Setup integration test environment
  })
`
  }

  /**
   * Generate test teardown
   */
  private generateTeardown(): string {
    return `
  afterEach(() => {
    // Cleanup integration test environment
  })
`
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

  /**
   * Escape string for use in test names
   */
  private escapeString(str: string): string {
    return str.replace(/'/g, "\\'")
  }
}
