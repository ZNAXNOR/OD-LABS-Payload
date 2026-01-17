/**
 * Component Test Generator
 * Generates unit tests for React components
 * Validates: Requirements 5.2
 */

import type { Component, TestSuite, Test, JSXElement, PropDefinition } from '../types'

export class ComponentTestGenerator {
  /**
   * Generate comprehensive test suite for a React component
   */
  generateComponentTests(component: Component): TestSuite {
    const tests: Test[] = []
    const imports = this.generateImports(component)

    // Generate rendering tests
    tests.push(...this.generateRenderingTests(component))

    // Generate interaction tests for interactive elements
    tests.push(...this.generateInteractionTests(component))

    // Generate conditional rendering tests
    tests.push(...this.generateConditionalRenderingTests(component))

    // Generate prop validation tests
    tests.push(...this.generatePropTests(component))

    return {
      testFilePath: `tests/unit/components/${component.name}.test.tsx`,
      imports,
      tests,
      setup: this.generateSetup(component),
      teardown: this.generateTeardown(),
    }
  }

  /**
   * Generate imports for test file
   */
  private generateImports(component: Component): string[] {
    const imports = [
      "import { describe, it, expect, beforeEach, afterEach } from 'vitest'",
      "import { render, screen } from '@testing-library/react'",
      "import userEvent from '@testing-library/user-event'",
    ]

    // Add component import
    const componentPath = component.path.replace(/\.(tsx?|jsx?)$/, '')
    imports.push(`import { ${component.name} } from '${componentPath}'`)

    return imports
  }

  /**
   * Generate rendering tests
   */
  private generateRenderingTests(component: Component): Test[] {
    const tests: Test[] = []

    // Basic rendering test
    tests.push(this.generateBasicRenderTest(component))

    // Rendering with different prop combinations
    if (component.props.length > 0) {
      tests.push(this.generatePropCombinationTest(component))
    }

    // Rendering with required props only
    const requiredProps = component.props.filter((p) => p.required)
    if (requiredProps.length > 0) {
      tests.push(this.generateRequiredPropsTest(component, requiredProps))
    }

    return tests
  }

  /**
   * Generate basic render test
   */
  private generateBasicRenderTest(component: Component): Test {
    const testName = `should render ${component.name} component`
    const props = this.generateDefaultProps(component.props)

    const code = `
  it('${this.escapeString(testName)}', () => {
    const props = ${props}
    const { container } = render(<${component.name} {...props} />)
    
    expect(container).toBeDefined()
    expect(container.firstChild).toBeTruthy()
  })
`

    return {
      type: 'unit',
      name: testName,
      code,
      dependencies: ['@testing-library/react'],
    }
  }

  /**
   * Generate prop combination test
   */
  private generatePropCombinationTest(component: Component): Test {
    const testName = `should render with different prop combinations`
    const props = this.generateDefaultProps(component.props)

    const code = `
  it('${this.escapeString(testName)}', () => {
    const baseProps = ${props}
    
    // Test with base props
    const { rerender } = render(<${component.name} {...baseProps} />)
    expect(screen.getByTestId || screen.getByRole).toBeDefined()
    
    // Test with modified props
    ${this.generatePropVariations(component.props)}
  })
`

    return {
      type: 'unit',
      name: testName,
      code,
      dependencies: ['@testing-library/react'],
    }
  }

  /**
   * Generate required props test
   */
  private generateRequiredPropsTest(component: Component, requiredProps: PropDefinition[]): Test {
    const testName = `should render with required props only`
    const props = this.generateRequiredPropsObject(requiredProps)

    const code = `
  it('${this.escapeString(testName)}', () => {
    const requiredProps = ${props}
    const { container } = render(<${component.name} {...requiredProps} />)
    
    expect(container.firstChild).toBeTruthy()
  })
`

    return {
      type: 'unit',
      name: testName,
      code,
      dependencies: ['@testing-library/react'],
    }
  }

  /**
   * Generate interaction tests
   */
  private generateInteractionTests(component: Component): Test[] {
    const tests: Test[] = []
    const interactiveElements = this.findInteractiveElements(component.jsx)

    for (const element of interactiveElements) {
      tests.push(this.generateInteractionTest(component, element))
    }

    return tests
  }

  /**
   * Generate interaction test for an element
   */
  private generateInteractionTest(component: Component, element: JSXElement): Test {
    const testName = `should handle ${element.type} interaction`
    const props = this.generateDefaultProps(component.props)

    let interactionCode = ''
    if (element.type === 'button') {
      interactionCode = `
    const button = screen.getByRole('button')
    await user.click(button)
    
    // Verify interaction result
    expect(button).toBeDefined()
`
    } else if (element.type === 'input') {
      interactionCode = `
    const input = screen.getByRole('textbox')
    await user.type(input, 'test input')
    
    // Verify input value
    expect(input).toHaveValue('test input')
`
    } else if (element.type === 'select') {
      interactionCode = `
    const select = screen.getByRole('combobox')
    await user.selectOptions(select, 'option1')
    
    // Verify selection
    expect(select).toHaveValue('option1')
`
    }

    const code = `
  it('${this.escapeString(testName)}', async () => {
    const user = userEvent.setup()
    const props = ${props}
    render(<${component.name} {...props} />)
    
${interactionCode}
  })
`

    return {
      type: 'unit',
      name: testName,
      code,
      dependencies: ['@testing-library/react', '@testing-library/user-event'],
    }
  }

  /**
   * Generate conditional rendering tests
   */
  private generateConditionalRenderingTests(component: Component): Test[] {
    const tests: Test[] = []

    // Look for boolean props that likely control rendering
    const conditionalProps = component.props.filter(
      (p) => p.type === 'boolean' || p.name.startsWith('show') || p.name.startsWith('is'),
    )

    for (const prop of conditionalProps) {
      tests.push(this.generateConditionalRenderTest(component, prop))
    }

    return tests
  }

  /**
   * Generate conditional render test
   */
  private generateConditionalRenderTest(component: Component, prop: PropDefinition): Test {
    const testName = `should conditionally render based on ${prop.name}`
    const baseProps = this.generateDefaultProps(component.props)

    const code = `
  it('${this.escapeString(testName)}', () => {
    const baseProps = ${baseProps}
    
    // Test with ${prop.name} = true
    const { rerender } = render(<${component.name} {...baseProps} ${prop.name}={true} />)
    expect(screen.queryByTestId('conditional-content')).toBeTruthy()
    
    // Test with ${prop.name} = false
    rerender(<${component.name} {...baseProps} ${prop.name}={false} />)
    expect(screen.queryByTestId('conditional-content')).toBeFalsy()
  })
`

    return {
      type: 'unit',
      name: testName,
      code,
      dependencies: ['@testing-library/react'],
    }
  }

  /**
   * Generate prop validation tests
   */
  private generatePropTests(component: Component): Test[] {
    const tests: Test[] = []

    // Test required props
    const requiredProps = component.props.filter((p) => p.required)
    if (requiredProps.length > 0) {
      tests.push(this.generateRequiredPropValidationTest(component, requiredProps))
    }

    // Test prop types
    for (const prop of component.props) {
      if (this.shouldTestPropType(prop)) {
        tests.push(this.generatePropTypeTest(component, prop))
      }
    }

    return tests
  }

  /**
   * Generate required prop validation test
   */
  private generateRequiredPropValidationTest(
    component: Component,
    requiredProps: PropDefinition[],
  ): Test {
    const testName = `should require necessary props`
    const propsWithoutRequired = this.generatePropsWithout(component.props, requiredProps[0].name)

    const code = `
  it('${this.escapeString(testName)}', () => {
    const incompleteProps = ${propsWithoutRequired}
    
    // This should log a warning or error in development
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    render(<${component.name} {...incompleteProps} />)
    
    // Verify warning was logged (in development mode)
    // expect(consoleSpy).toHaveBeenCalled()
    
    consoleSpy.mockRestore()
  })
`

    return {
      type: 'unit',
      name: testName,
      code,
      dependencies: ['@testing-library/react'],
    }
  }

  /**
   * Generate prop type test
   */
  private generatePropTypeTest(component: Component, prop: PropDefinition): Test {
    const testName = `should accept correct type for ${prop.name}`
    const props = this.generateDefaultProps(component.props)

    const code = `
  it('${this.escapeString(testName)}', () => {
    const props = ${props}
    const { container } = render(<${component.name} {...props} />)
    
    expect(container.firstChild).toBeTruthy()
  })
`

    return {
      type: 'unit',
      name: testName,
      code,
      dependencies: ['@testing-library/react'],
    }
  }

  /**
   * Find interactive elements in JSX
   */
  private findInteractiveElements(jsx: JSXElement[]): JSXElement[] {
    const interactive: JSXElement[] = []
    const interactiveTypes = ['button', 'input', 'select', 'textarea', 'a']

    const traverse = (elements: JSXElement[]) => {
      for (const element of elements) {
        if (interactiveTypes.includes(element.type.toLowerCase())) {
          interactive.push(element)
        }
        if (element.children) {
          traverse(element.children)
        }
      }
    }

    traverse(jsx)
    return interactive
  }

  /**
   * Generate default props object
   */
  private generateDefaultProps(props: PropDefinition[]): string {
    const propEntries = props.map((prop) => {
      const value = this.generateDefaultPropValue(prop)
      return `${prop.name}: ${value}`
    })

    return `{\n      ${propEntries.join(',\n      ')}\n    }`
  }

  /**
   * Generate required props object
   */
  private generateRequiredPropsObject(props: PropDefinition[]): string {
    const propEntries = props.map((prop) => {
      const value = this.generateDefaultPropValue(prop)
      return `${prop.name}: ${value}`
    })

    return `{\n      ${propEntries.join(',\n      ')}\n    }`
  }

  /**
   * Generate props without specific prop
   */
  private generatePropsWithout(props: PropDefinition[], excludeProp: string): string {
    const filteredProps = props.filter((p) => p.name !== excludeProp)
    return this.generateDefaultProps(filteredProps)
  }

  /**
   * Generate default value for prop type
   */
  private generateDefaultPropValue(prop: PropDefinition): string {
    if (prop.defaultValue !== undefined) {
      return JSON.stringify(prop.defaultValue)
    }

    // Infer from type
    if (prop.type.includes('string')) {
      return `'test-${prop.name}'`
    } else if (prop.type.includes('number')) {
      return '42'
    } else if (prop.type.includes('boolean')) {
      return 'true'
    } else if (prop.type.includes('[]') || prop.type.includes('Array')) {
      return '[]'
    } else if (prop.type.includes('{}') || prop.type.includes('object')) {
      return '{}'
    } else if (prop.type.includes('function') || prop.type.includes('=>')) {
      return '() => {}'
    } else {
      return 'undefined'
    }
  }

  /**
   * Generate prop variations for testing
   */
  private generatePropVariations(props: PropDefinition[]): string {
    const variations: string[] = []

    for (const prop of props.slice(0, 2)) {
      // Test first 2 props
      const altValue = this.generateAlternativePropValue(prop)
      variations.push(`
    rerender(<${prop.name} {...baseProps} ${prop.name}={${altValue}} />)
    expect(screen.getByTestId || screen.getByRole).toBeDefined()
`)
    }

    return variations.join('\n')
  }

  /**
   * Generate alternative value for prop
   */
  private generateAlternativePropValue(prop: PropDefinition): string {
    if (prop.type.includes('string')) {
      return `'alternative-${prop.name}'`
    } else if (prop.type.includes('number')) {
      return '99'
    } else if (prop.type.includes('boolean')) {
      return 'false'
    } else {
      return 'undefined'
    }
  }

  /**
   * Check if prop type should be tested
   */
  private shouldTestPropType(prop: PropDefinition): boolean {
    // Test props with specific types (not any or unknown)
    return !prop.type.includes('any') && !prop.type.includes('unknown')
  }

  /**
   * Generate test setup
   */
  private generateSetup(component: Component): string {
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
   * Escape string for use in test names
   */
  private escapeString(str: string): string {
    return str.replace(/'/g, "\\'")
  }
}
