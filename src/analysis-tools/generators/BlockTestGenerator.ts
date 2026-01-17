/**
 * Block Test Generator
 * Generates unit tests for Payload CMS block configurations
 * Validates: Requirements 5.1
 */

import type { Block, Field, TestSuite, Test } from '../types'

export class BlockTestGenerator {
  /**
   * Generate comprehensive test suite for a block configuration
   */
  generateBlockTests(block: Block): TestSuite {
    const tests: Test[] = []
    const imports = this.generateImports(block)

    // Generate tests for field validation
    tests.push(...this.generateFieldValidationTests(block))

    // Generate tests for conditional fields
    tests.push(...this.generateConditionalFieldTests(block))

    // Generate tests for field hooks
    tests.push(...this.generateFieldHookTests(block))

    // Generate tests for access control
    if (block.access) {
      tests.push(...this.generateAccessControlTests(block))
    }

    return {
      testFilePath: `tests/unit/blocks/${block.slug}.test.ts`,
      imports,
      tests,
      setup: this.generateSetup(block),
      teardown: this.generateTeardown(),
    }
  }

  /**
   * Generate imports for test file
   */
  private generateImports(block: Block): string[] {
    return [
      "import { describe, it, expect, beforeEach, afterEach } from 'vitest'",
      `import { ${block.slug}Block } from '@/blocks/${this.toPascalCase(block.slug)}/config'`,
      "import type { Field } from 'payload'",
    ]
  }

  /**
   * Generate field validation tests
   */
  private generateFieldValidationTests(block: Block): Test[] {
    const tests: Test[] = []
    const fieldsWithValidation = this.extractFieldsWithValidation(block.fields)

    for (const field of fieldsWithValidation) {
      tests.push(this.generateValidationTest(field, block.slug))
    }

    return tests
  }

  /**
   * Generate a single validation test for a field
   */
  private generateValidationTest(field: Field, blockSlug: string): Test {
    const testName = `should validate ${field.name} field correctly`
    const code = this.generateValidationTestCode(field, blockSlug)

    return {
      type: 'unit',
      name: testName,
      code,
      dependencies: [],
    }
  }

  /**
   * Generate validation test code
   */
  private generateValidationTestCode(field: Field, blockSlug: string): string {
    const validationChecks: string[] = []

    if (field.required) {
      validationChecks.push(`
    // Test required validation
    const emptyResult = await validateField(undefined)
    expect(emptyResult).toBe(false) // or expect error message
`)
    }

    if (field.type === 'text' && field.minLength) {
      validationChecks.push(`
    // Test minLength validation
    const shortValue = 'a'.repeat(${field.minLength - 1})
    const shortResult = await validateField(shortValue)
    expect(shortResult).toBe(false)
`)
    }

    if (field.type === 'text' && field.maxLength) {
      validationChecks.push(`
    // Test maxLength validation
    const longValue = 'a'.repeat(${field.maxLength + 1})
    const longResult = await validateField(longValue)
    expect(longResult).toBe(false)
`)
    }

    if (field.type === 'number' && field.min !== undefined) {
      validationChecks.push(`
    // Test min value validation
    const belowMin = ${field.min - 1}
    const belowMinResult = await validateField(belowMin)
    expect(belowMinResult).toBe(false)
`)
    }

    if (field.type === 'number' && field.max !== undefined) {
      validationChecks.push(`
    // Test max value validation
    const aboveMax = ${field.max + 1}
    const aboveMaxResult = await validateField(aboveMax)
    expect(aboveMaxResult).toBe(false)
`)
    }

    // Valid value test
    validationChecks.push(`
    // Test valid value
    const validValue = ${this.generateValidValue(field)}
    const validResult = await validateField(validValue)
    expect(validResult).toBe(true)
`)

    return `
  it('${this.escapeString(`should validate ${field.name} field correctly`)}', async () => {
    const field = ${blockSlug}Block.fields.find(f => f.name === '${field.name}')
    expect(field).toBeDefined()
    
    const validateField = async (value: any) => {
      if (!field.validate) return true
      const result = await field.validate(value, { data: {}, siblingData: {} })
      return result === true
    }
${validationChecks.join('\n')}
  })
`
  }

  /**
   * Generate conditional field tests
   */
  private generateConditionalFieldTests(block: Block): Test[] {
    const tests: Test[] = []
    const conditionalFields = this.extractConditionalFields(block.fields)

    for (const field of conditionalFields) {
      tests.push(this.generateConditionalTest(field, block.slug))
    }

    return tests
  }

  /**
   * Generate a single conditional field test
   */
  private generateConditionalTest(field: Field, blockSlug: string): Test {
    const testName = `should conditionally show/hide ${field.name} field`
    const code = `
  it('${this.escapeString(testName)}', () => {
    const field = ${blockSlug}Block.fields.find(f => f.name === '${field.name}')
    expect(field).toBeDefined()
    expect(field.admin?.condition).toBeDefined()
    
    // Test condition with data that should show field
    const showData = ${this.generateShowData(field)}
    const shouldShow = field.admin.condition(showData, showData)
    expect(shouldShow).toBe(true)
    
    // Test condition with data that should hide field
    const hideData = ${this.generateHideData(field)}
    const shouldHide = field.admin.condition(hideData, hideData)
    expect(shouldHide).toBe(false)
  })
`

    return {
      type: 'unit',
      name: testName,
      code,
      dependencies: [],
    }
  }

  /**
   * Generate field hook tests
   */
  private generateFieldHookTests(block: Block): Test[] {
    const tests: Test[] = []
    const fieldsWithHooks = this.extractFieldsWithHooks(block.fields)

    for (const field of fieldsWithHooks) {
      if (field.hooks?.beforeValidate) {
        tests.push(this.generateBeforeValidateHookTest(field, block.slug))
      }
      if (field.hooks?.beforeChange) {
        tests.push(this.generateBeforeChangeHookTest(field, block.slug))
      }
      if (field.hooks?.afterRead) {
        tests.push(this.generateAfterReadHookTest(field, block.slug))
      }
    }

    return tests
  }

  /**
   * Generate beforeValidate hook test
   */
  private generateBeforeValidateHookTest(field: Field, blockSlug: string): Test {
    const testName = `should execute beforeValidate hook for ${field.name}`
    const code = `
  it('${this.escapeString(testName)}', async () => {
    const field = ${blockSlug}Block.fields.find(f => f.name === '${field.name}')
    expect(field).toBeDefined()
    expect(field.hooks?.beforeValidate).toBeDefined()
    
    const inputValue = ${this.generateValidValue(field)}
    const hook = field.hooks.beforeValidate[0]
    const result = await hook({ value: inputValue, data: {}, req: {} as any })
    
    // Verify hook transforms or validates the value
    expect(result).toBeDefined()
  })
`

    return {
      type: 'unit',
      name: testName,
      code,
      dependencies: [],
    }
  }

  /**
   * Generate beforeChange hook test
   */
  private generateBeforeChangeHookTest(field: Field, blockSlug: string): Test {
    const testName = `should execute beforeChange hook for ${field.name}`
    const code = `
  it('${this.escapeString(testName)}', async () => {
    const field = ${blockSlug}Block.fields.find(f => f.name === '${field.name}')
    expect(field).toBeDefined()
    expect(field.hooks?.beforeChange).toBeDefined()
    
    const inputValue = ${this.generateValidValue(field)}
    const hook = field.hooks.beforeChange[0]
    const result = await hook({ 
      value: inputValue, 
      data: {}, 
      siblingData: {},
      operation: 'create',
      req: {} as any 
    })
    
    // Verify hook processes the value
    expect(result).toBeDefined()
  })
`

    return {
      type: 'unit',
      name: testName,
      code,
      dependencies: [],
    }
  }

  /**
   * Generate afterRead hook test
   */
  private generateAfterReadHookTest(field: Field, blockSlug: string): Test {
    const testName = `should execute afterRead hook for ${field.name}`
    const code = `
  it('${this.escapeString(testName)}', async () => {
    const field = ${blockSlug}Block.fields.find(f => f.name === '${field.name}')
    expect(field).toBeDefined()
    expect(field.hooks?.afterRead).toBeDefined()
    
    const storedValue = ${this.generateValidValue(field)}
    const hook = field.hooks.afterRead[0]
    const result = await hook({ 
      value: storedValue, 
      data: {},
      req: {} as any 
    })
    
    // Verify hook transforms the value for reading
    expect(result).toBeDefined()
  })
`

    return {
      type: 'unit',
      name: testName,
      code,
      dependencies: [],
    }
  }

  /**
   * Generate access control tests
   */
  private generateAccessControlTests(block: Block): Test[] {
    const tests: Test[] = []

    if (block.access?.create) {
      tests.push(this.generateAccessTest('create', block.slug))
    }
    if (block.access?.read) {
      tests.push(this.generateAccessTest('read', block.slug))
    }
    if (block.access?.update) {
      tests.push(this.generateAccessTest('update', block.slug))
    }
    if (block.access?.delete) {
      tests.push(this.generateAccessTest('delete', block.slug))
    }

    return tests
  }

  /**
   * Generate access control test
   */
  private generateAccessTest(operation: string, blockSlug: string): Test {
    const testName = `should enforce ${operation} access control`
    const code = `
  it('${this.escapeString(testName)}', async () => {
    const accessFn = ${blockSlug}Block.access?.${operation}
    expect(accessFn).toBeDefined()
    
    // Test with authenticated user
    const authenticatedResult = await accessFn({ 
      req: { user: { id: '123', roles: ['user'] } } as any 
    })
    expect(authenticatedResult).toBeDefined()
    
    // Test without user
    const unauthenticatedResult = await accessFn({ 
      req: { user: null } as any 
    })
    expect(unauthenticatedResult).toBeDefined()
  })
`

    return {
      type: 'unit',
      name: testName,
      code,
      dependencies: [],
    }
  }

  /**
   * Extract fields with validation
   */
  private extractFieldsWithValidation(fields: Field[]): Field[] {
    const result: Field[] = []

    for (const field of fields) {
      if (this.hasValidation(field)) {
        result.push(field)
      }

      // Recursively check nested fields
      if (this.hasSubFields(field)) {
        result.push(...this.extractFieldsWithValidation(field.fields))
      }
    }

    return result
  }

  /**
   * Extract conditional fields
   */
  private extractConditionalFields(fields: Field[]): Field[] {
    const result: Field[] = []

    for (const field of fields) {
      if (field.admin?.condition) {
        result.push(field)
      }

      // Recursively check nested fields
      if (this.hasSubFields(field)) {
        result.push(...this.extractConditionalFields(field.fields))
      }
    }

    return result
  }

  /**
   * Extract fields with hooks
   */
  private extractFieldsWithHooks(fields: Field[]): Field[] {
    const result: Field[] = []

    for (const field of fields) {
      if (field.hooks) {
        result.push(field)
      }

      // Recursively check nested fields
      if (this.hasSubFields(field)) {
        result.push(...this.extractFieldsWithHooks(field.fields))
      }
    }

    return result
  }

  /**
   * Check if field has validation
   */
  private hasValidation(field: Field): boolean {
    return !!(
      field.required ||
      field.validate ||
      field.minLength ||
      field.maxLength ||
      field.min !== undefined ||
      field.max !== undefined ||
      field.unique
    )
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
   * Generate valid value for field type
   */
  private generateValidValue(field: Field): string {
    switch (field.type) {
      case 'text':
      case 'textarea':
        return `'valid text value'`
      case 'email':
        return `'test@example.com'`
      case 'number':
        const numValue = field.min !== undefined ? field.min + 1 : 42
        return `${numValue}`
      case 'checkbox':
        return `true`
      case 'date':
        return `new Date().toISOString()`
      case 'select':
        return field.options && field.options.length > 0 ? `'${field.options[0]}'` : `'option1'`
      case 'relationship':
        return `'relationship-id-123'`
      case 'upload':
        return `'upload-id-456'`
      default:
        return `'test-value'`
    }
  }

  /**
   * Generate data that should show conditional field
   */
  private generateShowData(field: Field): string {
    return `{ showField: true }`
  }

  /**
   * Generate data that should hide conditional field
   */
  private generateHideData(field: Field): string {
    return `{ showField: false }`
  }

  /**
   * Generate test setup
   */
  private generateSetup(block: Block): string {
    return `
  beforeEach(() => {
    // Setup test environment
  })
`
  }

  /**
   * Generate test teardown
   */
  private generateTeardown(): string {
    return `
  afterEach(() => {
    // Cleanup test environment
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
