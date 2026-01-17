/**
 * Property Test Generator
 * Generates property-based tests for complex validation rules
 * Validates: Requirements 5.3, 5.7
 */

import type { Block, Field, PropertyTest, Generator } from '../types'

export class PropertyTestGenerator {
  private readonly MIN_ITERATIONS = 100

  /**
   * Generate property tests for block validation rules
   */
  generatePropertyTests(block: Block): PropertyTest[] {
    const tests: PropertyTest[] = []
    const complexFields = this.extractComplexValidationFields(block.fields)

    for (const field of complexFields) {
      tests.push(...this.generateFieldPropertyTests(field, block.slug))
    }

    return tests
  }

  /**
   * Generate property tests for a specific field
   */
  private generateFieldPropertyTests(field: Field, blockSlug: string): PropertyTest[] {
    const tests: PropertyTest[] = []

    // Generate property test based on field type and validation
    if (field.type === 'text' || field.type === 'textarea') {
      tests.push(this.generateStringPropertyTest(field, blockSlug))
    } else if (field.type === 'number') {
      tests.push(this.generateNumberPropertyTest(field, blockSlug))
    } else if (field.type === 'email') {
      tests.push(this.generateEmailPropertyTest(field, blockSlug))
    } else if (field.type === 'array') {
      tests.push(this.generateArrayPropertyTest(field, blockSlug))
    }

    // Generate custom validation property test if present
    if (field.validate) {
      tests.push(this.generateCustomValidationPropertyTest(field, blockSlug))
    }

    return tests
  }

  /**
   * Generate property test for string fields
   */
  private generateStringPropertyTest(field: Field, blockSlug: string): PropertyTest {
    const generators: Generator[] = []
    const constraints: any = {}

    if (field.minLength) {
      constraints.minLength = field.minLength
    }
    if (field.maxLength) {
      constraints.maxLength = field.maxLength
    }

    generators.push({
      name: 'stringValue',
      type: 'fc.string',
      constraints,
    })

    const property = `
    // Property: String validation should be consistent
    // For any string within constraints, validation should succeed
    // For any string outside constraints, validation should fail
    fc.assert(
      fc.property(
        ${this.generateArbitraryCode(generators[0])},
        async (value) => {
          const field = ${blockSlug}Block.fields.find(f => f.name === '${field.name}')
          const isValid = await validateField(field, value)
          
          // Check length constraints
          ${
            field.minLength
              ? `if (value.length < ${field.minLength}) {
            expect(isValid).toBe(false)
            return
          }`
              : ''
          }
          ${
            field.maxLength
              ? `if (value.length > ${field.maxLength}) {
            expect(isValid).toBe(false)
            return
          }`
              : ''
          }
          
          // Within constraints should be valid
          expect(isValid).toBe(true)
        }
      ),
      { numRuns: ${this.MIN_ITERATIONS} }
    )
`

    return {
      type: 'property',
      name: `Property test: ${field.name} string validation`,
      code: this.wrapPropertyTest(field.name, property, blockSlug),
      dependencies: ['fast-check'],
      iterations: this.MIN_ITERATIONS,
      generators,
      property: 'String validation consistency',
    }
  }

  /**
   * Generate property test for number fields
   */
  private generateNumberPropertyTest(field: Field, blockSlug: string): PropertyTest {
    const generators: Generator[] = []
    const constraints: any = {}

    if (field.min !== undefined) {
      constraints.min = field.min
    }
    if (field.max !== undefined) {
      constraints.max = field.max
    }

    generators.push({
      name: 'numberValue',
      type: 'fc.integer',
      constraints,
    })

    const property = `
    // Property: Number validation should be consistent
    // For any number within range, validation should succeed
    // For any number outside range, validation should fail
    fc.assert(
      fc.property(
        ${this.generateArbitraryCode(generators[0])},
        async (value) => {
          const field = ${blockSlug}Block.fields.find(f => f.name === '${field.name}')
          const isValid = await validateField(field, value)
          
          // Check range constraints
          ${
            field.min !== undefined
              ? `if (value < ${field.min}) {
            expect(isValid).toBe(false)
            return
          }`
              : ''
          }
          ${
            field.max !== undefined
              ? `if (value > ${field.max}) {
            expect(isValid).toBe(false)
            return
          }`
              : ''
          }
          
          // Within range should be valid
          expect(isValid).toBe(true)
        }
      ),
      { numRuns: ${this.MIN_ITERATIONS} }
    )
`

    return {
      type: 'property',
      name: `Property test: ${field.name} number validation`,
      code: this.wrapPropertyTest(field.name, property, blockSlug),
      dependencies: ['fast-check'],
      iterations: this.MIN_ITERATIONS,
      generators,
      property: 'Number validation consistency',
    }
  }

  /**
   * Generate property test for email fields
   */
  private generateEmailPropertyTest(field: Field, blockSlug: string): PropertyTest {
    const generators: Generator[] = [
      {
        name: 'emailValue',
        type: 'fc.emailAddress',
        constraints: {},
      },
    ]

    const property = `
    // Property: Email validation should accept valid emails
    // For any valid email format, validation should succeed
    fc.assert(
      fc.property(
        fc.emailAddress(),
        async (value) => {
          const field = ${blockSlug}Block.fields.find(f => f.name === '${field.name}')
          const isValid = await validateField(field, value)
          
          // Valid email format should pass
          expect(isValid).toBe(true)
        }
      ),
      { numRuns: ${this.MIN_ITERATIONS} }
    )
`

    return {
      type: 'property',
      name: `Property test: ${field.name} email validation`,
      code: this.wrapPropertyTest(field.name, property, blockSlug),
      dependencies: ['fast-check'],
      iterations: this.MIN_ITERATIONS,
      generators,
      property: 'Email validation consistency',
    }
  }

  /**
   * Generate property test for array fields
   */
  private generateArrayPropertyTest(field: Field, blockSlug: string): PropertyTest {
    const generators: Generator[] = []
    const constraints: any = {}

    if (field.minRows) {
      constraints.minLength = field.minRows
    }
    if (field.maxRows) {
      constraints.maxLength = field.maxRows
    }

    generators.push({
      name: 'arrayValue',
      type: 'fc.array',
      constraints,
    })

    const property = `
    // Property: Array validation should enforce row constraints
    // For any array within row limits, validation should succeed
    // For any array outside row limits, validation should fail
    fc.assert(
      fc.property(
        fc.array(fc.record({}), ${JSON.stringify(constraints)}),
        async (value) => {
          const field = ${blockSlug}Block.fields.find(f => f.name === '${field.name}')
          const isValid = await validateField(field, value)
          
          // Check row constraints
          ${
            field.minRows
              ? `if (value.length < ${field.minRows}) {
            expect(isValid).toBe(false)
            return
          }`
              : ''
          }
          ${
            field.maxRows
              ? `if (value.length > ${field.maxRows}) {
            expect(isValid).toBe(false)
            return
          }`
              : ''
          }
          
          // Within constraints should be valid
          expect(isValid).toBe(true)
        }
      ),
      { numRuns: ${this.MIN_ITERATIONS} }
    )
`

    return {
      type: 'property',
      name: `Property test: ${field.name} array validation`,
      code: this.wrapPropertyTest(field.name, property, blockSlug),
      dependencies: ['fast-check'],
      iterations: this.MIN_ITERATIONS,
      generators,
      property: 'Array validation consistency',
    }
  }

  /**
   * Generate property test for custom validation
   */
  private generateCustomValidationPropertyTest(field: Field, blockSlug: string): PropertyTest {
    const generators: Generator[] = [
      {
        name: 'arbitraryValue',
        type: this.getArbitraryForFieldType(field.type),
        constraints: {},
      },
    ]

    const property = `
    // Property: Custom validation should be deterministic
    // For any value, validation result should be consistent
    fc.assert(
      fc.property(
        ${this.generateArbitraryCode(generators[0])},
        async (value) => {
          const field = ${blockSlug}Block.fields.find(f => f.name === '${field.name}')
          
          // Run validation twice with same value
          const result1 = await validateField(field, value)
          const result2 = await validateField(field, value)
          
          // Results should be identical (deterministic)
          expect(result1).toBe(result2)
        }
      ),
      { numRuns: ${this.MIN_ITERATIONS} }
    )
`

    return {
      type: 'property',
      name: `Property test: ${field.name} custom validation determinism`,
      code: this.wrapPropertyTest(field.name, property, blockSlug),
      dependencies: ['fast-check'],
      iterations: this.MIN_ITERATIONS,
      generators,
      property: 'Validation determinism',
    }
  }

  /**
   * Wrap property test with necessary boilerplate
   */
  private wrapPropertyTest(fieldName: string, property: string, blockSlug: string): string {
    return `
  it('Property test: ${this.escapeString(fieldName)} validation', async () => {
    const validateField = async (field: any, value: any) => {
      if (!field) return false
      if (!field.validate) {
        // Check basic constraints
        if (field.required && !value) return false
        return true
      }
      const result = await field.validate(value, { data: {}, siblingData: {} })
      return result === true
    }

${property}
  })
`
  }

  /**
   * Extract fields with complex validation
   */
  private extractComplexValidationFields(fields: Field[]): Field[] {
    const result: Field[] = []

    for (const field of fields) {
      if (this.hasComplexValidation(field)) {
        result.push(field)
      }

      // Recursively check nested fields
      if (this.hasSubFields(field)) {
        result.push(...this.extractComplexValidationFields(field.fields))
      }
    }

    return result
  }

  /**
   * Check if field has complex validation worth property testing
   */
  private hasComplexValidation(field: Field): boolean {
    return !!(
      field.validate ||
      (field.type === 'text' && (field.minLength || field.maxLength)) ||
      (field.type === 'number' && (field.min !== undefined || field.max !== undefined)) ||
      field.type === 'email' ||
      (field.type === 'array' && (field.minRows || field.maxRows))
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
   * Get fast-check arbitrary for field type
   */
  private getArbitraryForFieldType(fieldType: string): string {
    switch (fieldType) {
      case 'text':
      case 'textarea':
        return 'fc.string'
      case 'email':
        return 'fc.emailAddress'
      case 'number':
        return 'fc.integer'
      case 'checkbox':
        return 'fc.boolean'
      case 'date':
        return 'fc.date'
      case 'select':
        return 'fc.string'
      case 'array':
        return 'fc.array'
      default:
        return 'fc.anything'
    }
  }

  /**
   * Generate arbitrary code from generator
   */
  private generateArbitraryCode(generator: Generator): string {
    const constraintsStr =
      Object.keys(generator.constraints || {}).length > 0
        ? `(${JSON.stringify(generator.constraints)})`
        : '()'

    return `${generator.type}${constraintsStr}`
  }

  /**
   * Escape string for use in test names
   */
  private escapeString(str: string): string {
    return str.replace(/'/g, "\\'")
  }
}
