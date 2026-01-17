/**
 * Accessibility Test Generator
 * Generates accessibility tests using @testing-library/react and jest-axe
 * Validates: Requirements 5.4, 5.8
 */

import type { Component, AccessibilityTest, JSXElement } from '../types'

export class AccessibilityTestGenerator {
  /**
   * Generate comprehensive accessibility tests for a component
   */
  generateAccessibilityTests(component: Component): AccessibilityTest[] {
    const tests: AccessibilityTest[] = []

    // Generate keyboard navigation tests
    tests.push(...this.generateKeyboardNavigationTests(component))

    // Generate screen reader tests
    tests.push(...this.generateScreenReaderTests(component))

    // Generate ARIA attribute tests
    tests.push(...this.generateAriaAttributeTests(component))

    // Generate axe accessibility tests
    tests.push(this.generateAxeTest(component))

    return tests
  }

  /**
   * Generate keyboard navigation tests
   */
  private generateKeyboardNavigationTests(component: Component): AccessibilityTest[] {
    const tests: AccessibilityTest[] = []
    const interactiveElements = this.findInteractiveElements(component.jsx)

    if (interactiveElements.length > 0) {
      tests.push(this.generateTabNavigationTest(component))
      tests.push(this.generateEnterKeyTest(component))
      tests.push(this.generateEscapeKeyTest(component))
    }

    return tests
  }

  /**
   * Generate tab navigation test
   */
  private generateTabNavigationTest(component: Component): AccessibilityTest {
    const testName = `should support keyboard navigation with Tab key`
    const props = this.generateDefaultProps(component.props)

    const code = `
  it('${this.escapeString(testName)}', async () => {
    const user = userEvent.setup()
    const props = ${props}
    render(<${component.name} {...props} />)
    
    // Get all interactive elements
    const interactiveElements = screen.getAllByRole(/button|link|textbox|combobox/)
    
    // Tab through elements
    for (const element of interactiveElements) {
      await user.tab()
      expect(document.activeElement).toBe(element)
    }
  })
`

    return {
      type: 'accessibility',
      name: testName,
      code,
      dependencies: ['@testing-library/react', '@testing-library/user-event'],
      wcagLevel: 'A',
      testType: 'keyboard-nav',
    }
  }

  /**
   * Generate Enter key test
   */
  private generateEnterKeyTest(component: Component): AccessibilityTest {
    const testName = `should activate interactive elements with Enter key`
    const props = this.generateDefaultProps(component.props)

    const code = `
  it('${this.escapeString(testName)}', async () => {
    const user = userEvent.setup()
    const handleClick = vi.fn()
    const props = { ...${props}, onClick: handleClick }
    render(<${component.name} {...props} />)
    
    // Focus on interactive element
    const button = screen.getByRole('button')
    button.focus()
    
    // Press Enter
    await user.keyboard('{Enter}')
    
    // Verify activation
    expect(handleClick).toHaveBeenCalled()
  })
`

    return {
      type: 'accessibility',
      name: testName,
      code,
      dependencies: ['@testing-library/react', '@testing-library/user-event'],
      wcagLevel: 'A',
      testType: 'keyboard-nav',
    }
  }

  /**
   * Generate Escape key test
   */
  private generateEscapeKeyTest(component: Component): AccessibilityTest {
    const testName = `should close/dismiss with Escape key`
    const props = this.generateDefaultProps(component.props)

    const code = `
  it('${this.escapeString(testName)}', async () => {
    const user = userEvent.setup()
    const handleClose = vi.fn()
    const props = { ...${props}, onClose: handleClose }
    render(<${component.name} {...props} />)
    
    // Press Escape
    await user.keyboard('{Escape}')
    
    // Verify close handler was called
    expect(handleClose).toHaveBeenCalled()
  })
`

    return {
      type: 'accessibility',
      name: testName,
      code,
      dependencies: ['@testing-library/react', '@testing-library/user-event'],
      wcagLevel: 'A',
      testType: 'keyboard-nav',
    }
  }

  /**
   * Generate screen reader tests
   */
  private generateScreenReaderTests(component: Component): AccessibilityTest[] {
    const tests: AccessibilityTest[] = []

    // Test for proper labeling
    tests.push(this.generateLabelTest(component))

    // Test for live regions
    if (this.hasDynamicContent(component)) {
      tests.push(this.generateLiveRegionTest(component))
    }

    // Test for heading hierarchy
    if (this.hasHeadings(component)) {
      tests.push(this.generateHeadingHierarchyTest(component))
    }

    return tests
  }

  /**
   * Generate label test
   */
  private generateLabelTest(component: Component): AccessibilityTest {
    const testName = `should have accessible labels for all interactive elements`
    const props = this.generateDefaultProps(component.props)

    const code = `
  it('${this.escapeString(testName)}', () => {
    const props = ${props}
    render(<${component.name} {...props} />)
    
    // Check buttons have accessible names
    const buttons = screen.queryAllByRole('button')
    buttons.forEach(button => {
      expect(button).toHaveAccessibleName()
    })
    
    // Check inputs have labels
    const inputs = screen.queryAllByRole('textbox')
    inputs.forEach(input => {
      expect(input).toHaveAccessibleName()
    })
    
    // Check links have accessible names
    const links = screen.queryAllByRole('link')
    links.forEach(link => {
      expect(link).toHaveAccessibleName()
    })
  })
`

    return {
      type: 'accessibility',
      name: testName,
      code,
      dependencies: ['@testing-library/react'],
      wcagLevel: 'A',
      testType: 'screen-reader',
    }
  }

  /**
   * Generate live region test
   */
  private generateLiveRegionTest(component: Component): AccessibilityTest {
    const testName = `should announce dynamic content changes to screen readers`
    const props = this.generateDefaultProps(component.props)

    const code = `
  it('${this.escapeString(testName)}', () => {
    const props = ${props}
    render(<${component.name} {...props} />)
    
    // Check for ARIA live regions
    const liveRegions = screen.queryAllByRole('status') || screen.queryAllByRole('alert')
    
    // Verify live regions exist for dynamic content
    expect(liveRegions.length).toBeGreaterThan(0)
    
    // Verify aria-live attribute
    liveRegions.forEach(region => {
      expect(region).toHaveAttribute('aria-live')
    })
  })
`

    return {
      type: 'accessibility',
      name: testName,
      code,
      dependencies: ['@testing-library/react'],
      wcagLevel: 'AA',
      testType: 'screen-reader',
    }
  }

  /**
   * Generate heading hierarchy test
   */
  private generateHeadingHierarchyTest(component: Component): AccessibilityTest {
    const testName = `should have proper heading hierarchy`
    const props = this.generateDefaultProps(component.props)

    const code = `
  it('${this.escapeString(testName)}', () => {
    const props = ${props}
    const { container } = render(<${component.name} {...props} />)
    
    // Get all headings
    const headings = container.querySelectorAll('h1, h2, h3, h4, h5, h6')
    
    // Verify heading levels don't skip
    let previousLevel = 0
    headings.forEach(heading => {
      const level = parseInt(heading.tagName.substring(1))
      expect(level - previousLevel).toBeLessThanOrEqual(1)
      previousLevel = level
    })
  })
`

    return {
      type: 'accessibility',
      name: testName,
      code,
      dependencies: ['@testing-library/react'],
      wcagLevel: 'AA',
      testType: 'screen-reader',
    }
  }

  /**
   * Generate ARIA attribute tests
   */
  private generateAriaAttributeTests(component: Component): AccessibilityTest[] {
    const tests: AccessibilityTest[] = []

    // Test for required ARIA attributes
    tests.push(this.generateAriaRequiredTest(component))

    // Test for ARIA roles
    tests.push(this.generateAriaRoleTest(component))

    // Test for ARIA states
    if (this.hasInteractiveState(component)) {
      tests.push(this.generateAriaStateTest(component))
    }

    return tests
  }

  /**
   * Generate ARIA required test
   */
  private generateAriaRequiredTest(component: Component): AccessibilityTest {
    const testName = `should have required ARIA attributes`
    const props = this.generateDefaultProps(component.props)

    const code = `
  it('${this.escapeString(testName)}', () => {
    const props = ${props}
    const { container } = render(<${component.name} {...props} />)
    
    // Check for elements with ARIA attributes
    const elementsWithAria = container.querySelectorAll('[aria-label], [aria-labelledby], [aria-describedby]')
    
    // Verify ARIA attributes are properly set
    elementsWithAria.forEach(element => {
      const ariaLabel = element.getAttribute('aria-label')
      const ariaLabelledby = element.getAttribute('aria-labelledby')
      
      if (ariaLabel) {
        expect(ariaLabel).not.toBe('')
      }
      if (ariaLabelledby) {
        const labelElement = container.querySelector(\`#\${ariaLabelledby}\`)
        expect(labelElement).toBeTruthy()
      }
    })
  })
`

    return {
      type: 'accessibility',
      name: testName,
      code,
      dependencies: ['@testing-library/react'],
      wcagLevel: 'A',
      testType: 'aria-attributes',
    }
  }

  /**
   * Generate ARIA role test
   */
  private generateAriaRoleTest(component: Component): AccessibilityTest {
    const testName = `should use appropriate ARIA roles`
    const props = this.generateDefaultProps(component.props)

    const code = `
  it('${this.escapeString(testName)}', () => {
    const props = ${props}
    const { container } = render(<${component.name} {...props} />)
    
    // Check for custom roles
    const elementsWithRole = container.querySelectorAll('[role]')
    
    // Verify roles are valid ARIA roles
    const validRoles = ['button', 'link', 'navigation', 'main', 'complementary', 'banner', 'contentinfo', 'search', 'form', 'dialog', 'alert', 'status']
    
    elementsWithRole.forEach(element => {
      const role = element.getAttribute('role')
      expect(validRoles).toContain(role)
    })
  })
`

    return {
      type: 'accessibility',
      name: testName,
      code,
      dependencies: ['@testing-library/react'],
      wcagLevel: 'A',
      testType: 'aria-attributes',
    }
  }

  /**
   * Generate ARIA state test
   */
  private generateAriaStateTest(component: Component): AccessibilityTest {
    const testName = `should update ARIA states correctly`
    const props = this.generateDefaultProps(component.props)

    const code = `
  it('${this.escapeString(testName)}', async () => {
    const user = userEvent.setup()
    const props = ${props}
    render(<${component.name} {...props} />)
    
    // Find expandable/toggleable elements
    const toggleElement = screen.queryByRole('button', { expanded: false })
    
    if (toggleElement) {
      // Verify initial state
      expect(toggleElement).toHaveAttribute('aria-expanded', 'false')
      
      // Toggle state
      await user.click(toggleElement)
      
      // Verify updated state
      expect(toggleElement).toHaveAttribute('aria-expanded', 'true')
    }
  })
`

    return {
      type: 'accessibility',
      name: testName,
      code,
      dependencies: ['@testing-library/react', '@testing-library/user-event'],
      wcagLevel: 'AA',
      testType: 'aria-attributes',
    }
  }

  /**
   * Generate axe accessibility test
   */
  private generateAxeTest(component: Component): AccessibilityTest {
    const testName = `should have no accessibility violations (axe)`
    const props = this.generateDefaultProps(component.props)

    const code = `
  it('${this.escapeString(testName)}', async () => {
    const props = ${props}
    const { container } = render(<${component.name} {...props} />)
    
    // Run axe accessibility tests
    const results = await axe(container)
    
    // Verify no violations
    expect(results.violations).toHaveLength(0)
  })
`

    return {
      type: 'accessibility',
      name: testName,
      code,
      dependencies: ['@testing-library/react', 'jest-axe'],
      wcagLevel: 'AA',
      testType: 'contrast',
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
   * Check if component has dynamic content
   */
  private hasDynamicContent(component: Component): boolean {
    // Check for state hooks or props that suggest dynamic content
    return component.hooks.some((hook) => hook.name === 'useState' || hook.name === 'useEffect')
  }

  /**
   * Check if component has headings
   */
  private hasHeadings(component: Component): boolean {
    const hasHeading = (elements: JSXElement[]): boolean => {
      for (const element of elements) {
        if (/^h[1-6]$/i.test(element.type)) {
          return true
        }
        if (element.children && hasHeading(element.children)) {
          return true
        }
      }
      return false
    }

    return hasHeading(component.jsx)
  }

  /**
   * Check if component has interactive state
   */
  private hasInteractiveState(component: Component): boolean {
    // Check for state management or props that suggest interactive state
    return (
      component.hooks.some((hook) => hook.name === 'useState') ||
      component.props.some((prop) => prop.name.includes('expanded') || prop.name.includes('open'))
    )
  }

  /**
   * Generate default props object
   */
  private generateDefaultProps(props: any[]): string {
    if (!props || props.length === 0) {
      return '{}'
    }

    const propEntries = props.map((prop) => {
      const value = this.generateDefaultPropValue(prop)
      return `${prop.name}: ${value}`
    })

    return `{\n      ${propEntries.join(',\n      ')}\n    }`
  }

  /**
   * Generate default value for prop
   */
  private generateDefaultPropValue(prop: any): string {
    if (prop.defaultValue !== undefined) {
      return JSON.stringify(prop.defaultValue)
    }

    if (prop.type?.includes('string')) {
      return `'test-${prop.name}'`
    } else if (prop.type?.includes('number')) {
      return '42'
    } else if (prop.type?.includes('boolean')) {
      return 'true'
    } else if (prop.type?.includes('[]')) {
      return '[]'
    } else if (prop.type?.includes('{}')) {
      return '{}'
    } else {
      return 'undefined'
    }
  }

  /**
   * Escape string for use in test names
   */
  private escapeString(str: string): string {
    return str.replace(/'/g, "\\'")
  }
}
