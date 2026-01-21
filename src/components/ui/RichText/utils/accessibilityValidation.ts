/**
 * Accessibility validation utilities for RichText components
 * Tests WCAG 2.1 AA compliance and accessibility features
 */

import { getContrastRatio, meetsContrastAA } from '@/utilities/accessibility'

export interface AccessibilityReport {
  passed: boolean
  errors: string[]
  warnings: string[]
  score: number
}

/**
 * Validate ARIA attributes on an element
 */
export function validateAriaAttributes(element: Element): string[] {
  const errors: string[] = []

  // Check for required ARIA labels
  const interactiveElements = ['button', 'link', 'input', 'select', 'textarea']
  const tagName = element.tagName.toLowerCase()

  if (interactiveElements.includes(tagName)) {
    const hasAriaLabel = element.hasAttribute('aria-label')
    const hasAriaLabelledBy = element.hasAttribute('aria-labelledby')
    const hasTitle = element.hasAttribute('title')
    const hasTextContent = element.textContent?.trim()

    if (!hasAriaLabel && !hasAriaLabelledBy && !hasTitle && !hasTextContent) {
      errors.push(`${tagName} element missing accessible name`)
    }
  }

  // Check for proper ARIA roles
  const role = element.getAttribute('role')
  if (role) {
    const validRoles = [
      'button',
      'link',
      'heading',
      'banner',
      'navigation',
      'main',
      'complementary',
      'contentinfo',
      'region',
      'article',
      'section',
      'list',
      'listitem',
      'table',
      'row',
      'cell',
      'columnheader',
      'rowheader',
      'img',
      'figure',
      'dialog',
      'alertdialog',
      'alert',
      'status',
      'log',
      'marquee',
      'timer',
    ]

    if (!validRoles.includes(role)) {
      errors.push(`Invalid ARIA role: ${role}`)
    }
  }

  return errors
}

/**
 * Check keyboard navigation support
 */
export function validateKeyboardNavigation(container: Element): string[] {
  const errors: string[] = []

  // Find all interactive elements
  const interactiveElements = container.querySelectorAll(
    'a, button, input, select, textarea, [tabindex], [role="button"], [role="link"]',
  )

  interactiveElements.forEach((element) => {
    const tabIndex = element.getAttribute('tabindex')

    // Check if element is focusable
    if (tabIndex === '-1' && !element.hasAttribute('disabled')) {
      // This might be intentional for programmatic focus
    } else if (
      element.tagName.toLowerCase() === 'div' &&
      element.getAttribute('role') === 'button'
    ) {
      // Custom buttons should have tabindex
      if (!tabIndex || tabIndex === '-1') {
        errors.push('Custom button missing tabindex for keyboard navigation')
      }
    }
  })

  return errors
}

/**
 * Validate semantic HTML structure
 */
export function validateSemanticStructure(container: Element): string[] {
  const errors: string[] = []

  // Check heading hierarchy
  const headings = container.querySelectorAll('h1, h2, h3, h4, h5, h6')
  let previousLevel = 0

  headings.forEach((heading) => {
    const level = parseInt(heading.tagName.charAt(1))

    if (previousLevel > 0 && level > previousLevel + 1) {
      errors.push(`Heading level skipped: h${previousLevel} to h${level}`)
    }

    previousLevel = level
  })

  // Check for proper list structure
  const listItems = container.querySelectorAll('li')
  listItems.forEach((li) => {
    const parent = li.parentElement
    if (parent && !['ul', 'ol'].includes(parent.tagName.toLowerCase())) {
      errors.push('List item not contained in proper list element')
    }
  })

  // Check for alt text on images
  const images = container.querySelectorAll('img')
  images.forEach((img) => {
    if (!img.hasAttribute('alt')) {
      errors.push('Image missing alt attribute')
    }
  })

  return errors
}

/**
 * Check color contrast ratios
 */
export function validateColorContrast(element: Element): string[] {
  const errors: string[] = []

  if (typeof window === 'undefined') return errors

  try {
    const computedStyle = window.getComputedStyle(element)
    const color = computedStyle.color
    const backgroundColor = computedStyle.backgroundColor

    // Parse RGB values (simplified - would need more robust parsing in production)
    const colorMatch = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/)
    const bgColorMatch = backgroundColor.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/)

    if (colorMatch && bgColorMatch) {
      const foreground = {
        r: parseInt(colorMatch[1] || '0'),
        g: parseInt(colorMatch[2] || '0'),
        b: parseInt(colorMatch[3] || '0'),
      }

      const background = {
        r: parseInt(bgColorMatch[1] || '0'),
        g: parseInt(bgColorMatch[2] || '0'),
        b: parseInt(bgColorMatch[3] || '0'),
      }

      const fontSize = parseFloat(computedStyle.fontSize)
      const fontWeight = computedStyle.fontWeight
      const isLargeText =
        fontSize >= 18 || (fontSize >= 14 && (fontWeight === 'bold' || parseInt(fontWeight) >= 700))

      if (!meetsContrastAA(foreground, background, isLargeText)) {
        const ratio = getContrastRatio(foreground, background)
        errors.push(
          `Insufficient color contrast: ${ratio.toFixed(2)}:1 (required: ${isLargeText ? '3:1' : '4.5:1'})`,
        )
      }
    }
  } catch (error) {
    // Silently fail for color contrast check
  }

  return errors
}

/**
 * Generate comprehensive accessibility report
 */
export function generateAccessibilityReport(container: Element): AccessibilityReport {
  const errors: string[] = []
  const warnings: string[] = []

  // Validate ARIA attributes
  const ariaErrors = validateAriaAttributes(container)
  errors.push(...ariaErrors)

  // Check all child elements for ARIA issues
  const allElements = container.querySelectorAll('*')
  allElements.forEach((element) => {
    const elementAriaErrors = validateAriaAttributes(element)
    errors.push(...elementAriaErrors)
  })

  // Validate keyboard navigation
  const keyboardErrors = validateKeyboardNavigation(container)
  errors.push(...keyboardErrors)

  // Validate semantic structure
  const semanticErrors = validateSemanticStructure(container)
  errors.push(...semanticErrors)

  // Validate color contrast
  const contrastErrors = validateColorContrast(container)
  errors.push(...contrastErrors)

  // Check all child elements for contrast issues
  allElements.forEach((element) => {
    const elementContrastErrors = validateColorContrast(element)
    errors.push(...elementContrastErrors)
  })

  // Calculate score (0-100)
  const totalChecks = allElements.length * 4 + 4 // 4 checks per element + 4 container checks
  const errorCount = errors.length
  const score = Math.max(0, Math.round(((totalChecks - errorCount) / totalChecks) * 100))

  return {
    passed: errors.length === 0,
    errors: [...new Set(errors)], // Remove duplicates
    warnings: [...new Set(warnings)],
    score,
  }
}

/**
 * Quick accessibility check for RichText content
 */
export function quickAccessibilityCheck(container: Element): boolean {
  const report = generateAccessibilityReport(container)
  return report.passed && report.score >= 80
}
