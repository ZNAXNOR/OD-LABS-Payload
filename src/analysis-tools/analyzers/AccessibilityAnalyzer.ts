/**
 * Accessibility Analyzer
 * Analyzes React components for WCAG 2.1 AA accessibility compliance
 * Checks for missing alt text, ARIA labels, semantic HTML, keyboard navigation, etc.
 */

import type { Component, JSXElement, AccessibilityIssue } from '../types'

export class AccessibilityAnalyzer {
  // Interactive elements that require keyboard support
  private readonly interactiveElements = new Set([
    'button',
    'a',
    'input',
    'select',
    'textarea',
    'details',
    'summary',
  ])

  // Elements that should have alt text
  private readonly imageElements = new Set(['img', 'area'])

  // Semantic HTML elements
  private readonly semanticElements = new Set([
    'header',
    'nav',
    'main',
    'article',
    'section',
    'aside',
    'footer',
    'figure',
    'figcaption',
  ])

  /**
   * Check component for accessibility issues
   */
  checkAccessibility(component: Component): AccessibilityIssue[] {
    const issues: AccessibilityIssue[] = []

    // Analyze JSX elements
    component.jsx.forEach((element) => {
      issues.push(...this.analyzeJSXElement(element, component.path))
    })

    // Check for semantic HTML usage
    const semanticIssues = this.checkSemanticHTML(component)
    issues.push(...semanticIssues)

    // Check for keyboard navigation support
    const keyboardIssues = this.checkKeyboardNavigation(component)
    issues.push(...keyboardIssues)

    // Check for ARIA live regions on dynamic content
    const liveRegionIssues = this.checkLiveRegions(component)
    issues.push(...liveRegionIssues)

    return issues
  }

  /**
   * Analyze a single JSX element for accessibility issues
   */
  private analyzeJSXElement(element: JSXElement, filePath: string): AccessibilityIssue[] {
    const issues: AccessibilityIssue[] = []

    // Check for missing alt text on images
    if (this.imageElements.has(element.type.toLowerCase())) {
      if (!element.props.alt && !element.props['aria-label'] && !element.props['aria-labelledby']) {
        issues.push({
          type: 'missing-alt',
          element: element.type,
          line: element.line,
          wcagLevel: 'A',
          remediation:
            `Add alt text to <${element.type}> element. Use alt="" for decorative images or ` +
            `provide descriptive text for meaningful images.`,
        })
      }
    }

    // Check for missing ARIA labels on interactive elements
    if (this.interactiveElements.has(element.type.toLowerCase())) {
      const hasLabel = this.hasAccessibleLabel(element)

      if (!hasLabel) {
        // Buttons with text content are okay
        if (element.type.toLowerCase() === 'button' && element.children.length > 0) {
          // Has children, likely has text content
        } else if (element.type.toLowerCase() === 'a' && element.children.length > 0) {
          // Links with text content are okay
        } else {
          issues.push({
            type: 'missing-aria-label',
            element: element.type,
            line: element.line,
            wcagLevel: 'A',
            remediation:
              `Add an accessible label to <${element.type}> element using aria-label, ` +
              `aria-labelledby, or visible text content.`,
          })
        }
      }
    }

    // Check for buttons/links without proper roles
    if (element.type.toLowerCase() === 'div' || element.type.toLowerCase() === 'span') {
      if (element.props.onClick || element.props.onKeyDown || element.props.onKeyPress) {
        // Interactive div/span should have role and keyboard support
        if (!element.props.role) {
          issues.push({
            type: 'no-semantic-html',
            element: element.type,
            line: element.line,
            wcagLevel: 'A',
            remediation:
              `<${element.type}> with click handler should use semantic HTML (<button>) or ` +
              `have role="button" with proper keyboard support.`,
          })
        }
      }
    }

    // Check for form inputs without labels
    if (element.type.toLowerCase() === 'input' || element.type.toLowerCase() === 'textarea') {
      if (
        !element.props['aria-label'] &&
        !element.props['aria-labelledby'] &&
        !element.props.id // ID could be associated with a label
      ) {
        issues.push({
          type: 'missing-aria-label',
          element: element.type,
          line: element.line,
          wcagLevel: 'A',
          remediation: `Form input should have an associated <label>, aria-label, or aria-labelledby attribute.`,
        })
      }
    }

    // Check for insufficient color contrast (basic heuristic)
    if (element.props.style || element.props.className) {
      // This is a basic check - full contrast checking requires computed styles
      const colorIssue = this.checkColorContrast(element)
      if (colorIssue) {
        issues.push(colorIssue)
      }
    }

    // Recursively check children
    element.children.forEach((child) => {
      issues.push(...this.analyzeJSXElement(child, filePath))
    })

    return issues
  }

  /**
   * Check if element has an accessible label
   */
  private hasAccessibleLabel(element: JSXElement): boolean {
    return !!(
      element.props['aria-label'] ||
      element.props['aria-labelledby'] ||
      element.props.title ||
      (element.type.toLowerCase() === 'input' && element.props.placeholder)
    )
  }

  /**
   * Check for semantic HTML usage
   */
  private checkSemanticHTML(component: Component): AccessibilityIssue[] {
    const issues: AccessibilityIssue[] = []

    // Count div usage vs semantic elements
    let divCount = 0
    let semanticCount = 0

    const countElements = (element: JSXElement) => {
      if (element.type.toLowerCase() === 'div') {
        divCount++
      } else if (this.semanticElements.has(element.type.toLowerCase())) {
        semanticCount++
      }
      element.children.forEach(countElements)
    }

    component.jsx.forEach(countElements)

    // If component uses many divs but no semantic elements, suggest improvement
    if (divCount > 5 && semanticCount === 0) {
      issues.push({
        type: 'no-semantic-html',
        element: 'Component structure',
        line: 0,
        wcagLevel: 'AA',
        remediation:
          `Component uses ${divCount} <div> elements but no semantic HTML. ` +
          `Consider using semantic elements like <header>, <nav>, <main>, <article>, <section>, <footer> ` +
          `to improve accessibility and SEO.`,
      })
    }

    return issues
  }

  /**
   * Check for keyboard navigation support
   */
  private checkKeyboardNavigation(component: Component): AccessibilityIssue[] {
    const issues: AccessibilityIssue[] = []

    // Check if component has interactive elements with onClick but no keyboard support
    const checkKeyboardSupport = (element: JSXElement) => {
      if (element.props.onClick) {
        const hasKeyboardSupport =
          element.props.onKeyDown ||
          element.props.onKeyPress ||
          element.props.onKeyUp ||
          this.interactiveElements.has(element.type.toLowerCase())

        if (!hasKeyboardSupport) {
          issues.push({
            type: 'missing-keyboard-nav',
            element: element.type,
            line: element.line,
            wcagLevel: 'A',
            remediation:
              `<${element.type}> with onClick handler should also support keyboard navigation. ` +
              `Add onKeyDown handler or use semantic HTML like <button>.`,
          })
        }

        // Check for tabIndex
        if (!this.interactiveElements.has(element.type.toLowerCase()) && !element.props.tabIndex) {
          issues.push({
            type: 'missing-keyboard-nav',
            element: element.type,
            line: element.line,
            wcagLevel: 'A',
            remediation: `Interactive <${element.type}> should have tabIndex attribute to be keyboard accessible.`,
          })
        }
      }

      element.children.forEach(checkKeyboardSupport)
    }

    component.jsx.forEach(checkKeyboardSupport)

    return issues
  }

  /**
   * Check for ARIA live regions on dynamic content
   */
  private checkLiveRegions(component: Component): AccessibilityIssue[] {
    const issues: AccessibilityIssue[] = []

    // Check if component uses state/effects that might update content dynamically
    const hasStateUpdates = component.hooks.some(
      (hook) => hook.name === 'useState' || hook.name === 'useEffect',
    )

    if (hasStateUpdates) {
      // Check if any elements have aria-live attributes
      const hasLiveRegion = this.hasAriaLiveRegion(component.jsx)

      if (!hasLiveRegion) {
        // This is a suggestion, not always required
        issues.push({
          type: 'missing-live-region',
          element: 'Component',
          line: 0,
          wcagLevel: 'AA',
          remediation:
            `Component uses state/effects that may update content dynamically. ` +
            `Consider adding aria-live regions for important dynamic updates to announce changes to screen readers.`,
        })
      }
    }

    return issues
  }

  /**
   * Check if component has ARIA live regions
   */
  private hasAriaLiveRegion(elements: JSXElement[]): boolean {
    for (const element of elements) {
      if (
        element.props['aria-live'] ||
        element.props['aria-atomic'] ||
        element.props['aria-relevant']
      ) {
        return true
      }
      if (this.hasAriaLiveRegion(element.children)) {
        return true
      }
    }
    return false
  }

  /**
   * Check color contrast (basic heuristic)
   */
  private checkColorContrast(element: JSXElement): AccessibilityIssue | null {
    // This is a very basic check - proper contrast checking requires computed styles
    // and color parsing which is complex

    // Check for common low-contrast patterns in inline styles
    const style = element.props.style
    if (typeof style === 'string' && style.includes('color')) {
      // Very basic check for gray-on-gray or light colors
      const hasLightGray = /color:\s*#[cdef][cdef][cdef]/i.test(style)
      const hasLightBackground = /background:\s*#[cdef][cdef][cdef]/i.test(style)

      if (hasLightGray && hasLightBackground) {
        return {
          type: 'insufficient-contrast',
          element: element.type,
          line: element.line,
          wcagLevel: 'AA',
          remediation:
            `Element may have insufficient color contrast. Ensure text has at least 4.5:1 contrast ratio ` +
            `(3:1 for large text) against its background.`,
        }
      }
    }

    return null
  }

  /**
   * Generate accessibility suggestions
   */
  suggestImprovements(component: Component): string[] {
    const suggestions: string[] = []

    // Suggest adding skip links for navigation-heavy components
    const hasNav = component.jsx.some((el) => el.type.toLowerCase() === 'nav')
    if (hasNav) {
      suggestions.push(
        `Consider adding skip links to allow keyboard users to bypass navigation and jump to main content.`,
      )
    }

    // Suggest focus management for modals/dialogs
    const hasModal = component.jsx.some(
      (el) => el.props.role === 'dialog' || el.props.role === 'alertdialog',
    )
    if (hasModal) {
      suggestions.push(
        `Ensure modal/dialog manages focus properly: ` +
          `trap focus within modal, return focus to trigger element on close, and set initial focus.`,
      )
    }

    // Suggest ARIA landmarks
    const hasLandmarks = component.jsx.some(
      (el) =>
        this.semanticElements.has(el.type.toLowerCase()) ||
        ['banner', 'navigation', 'main', 'complementary', 'contentinfo'].includes(el.props.role),
    )
    if (!hasLandmarks && component.jsx.length > 10) {
      suggestions.push(
        `Consider using ARIA landmarks (role="banner", "navigation", "main", etc.) or semantic HTML ` +
          `to help screen reader users navigate the page structure.`,
      )
    }

    return suggestions
  }

  /**
   * Calculate accessibility score (0-100)
   */
  calculateAccessibilityScore(issues: AccessibilityIssue[]): number {
    let score = 100

    issues.forEach((issue) => {
      switch (issue.wcagLevel) {
        case 'A':
          score -= 15 // Critical issues
          break
        case 'AA':
          score -= 10 // Important issues
          break
        case 'AAA':
          score -= 5 // Nice-to-have issues
          break
      }
    })

    return Math.max(0, score)
  }
}
