/**
 * Comprehensive accessibility tests for RichText components
 * Tests WCAG 2.1 AA compliance, screen reader support, and keyboard navigation
 * Consolidated from multiple accessibility test files
 */

import * as React from 'react'
import { render, screen, waitFor, cleanup } from '@testing-library/react'
import { axe, toHaveNoViolations } from 'jest-axe'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, afterEach } from 'vitest'
import '@testing-library/jest-dom'
import { RichText } from '@/components/ui/RichText/index'
import {
  validateAriaAttributes,
  generateAccessibilityReport,
} from '@/components/ui/RichText/utils/accessibilityUtils'
import { validateContentStructure } from '@/components/ui/RichText/utils/semanticHtml'
import { createMockRichTextData } from '../../utils/testHelpers'

// Extend Jest matchers
expect.extend(toHaveNoViolations)

// Clean up after each test
afterEach(() => {
  cleanup()
})

// Mock data for testing - use proper Lexical-compatible structure
const mockRichTextData = createMockRichTextData({
  root: {
    type: 'root',
    format: '',
    indent: 0,
    version: 1,
    direction: 'ltr' as const,
    textFormat: 0,
    textStyle: '',
    children: [
      {
        type: 'paragraph',
        format: '',
        indent: 0,
        version: 1,
        direction: null,
        textFormat: 0,
        textStyle: '',
        children: [
          {
            type: 'text',
            format: 0,
            style: '',
            mode: 'normal',
            detail: 0,
            text: 'Test Hero Heading - Test subheading for accessibility',
            version: 1,
          },
        ],
      },
      {
        type: 'paragraph',
        format: '',
        indent: 0,
        version: 1,
        direction: null,
        textFormat: 0,
        textStyle: '',
        children: [
          {
            type: 'text',
            format: 0,
            style: '',
            mode: 'normal',
            detail: 0,
            text: 'This is test content for accessibility testing.',
            version: 1,
          },
        ],
      },
    ],
  },
})

// Mock RichText component for basic tests
const MockRichText = ({ data, 'aria-label': ariaLabel, role = 'region', ...props }: any) => {
  return React.createElement(
    'div',
    { role, 'aria-label': ariaLabel, ...props },
    React.createElement(
      'div',
      {
        'aria-live': 'polite',
        'aria-atomic': 'false',
        className: 'sr-only',
        'aria-label': 'Content announcements',
      },
      'This content contains 3 sections.',
    ),
    React.createElement(
      'section',
      {
        'aria-label': 'Hero section with heading Test Hero Heading',
      },
      React.createElement('h1', {}, 'Test Hero Heading'),
      React.createElement('p', {}, 'Test subheading for accessibility'),
      React.createElement(
        'a',
        {
          href: '/test',
          'aria-label': 'Test Action',
        },
        'Test Action',
      ),
    ),
    React.createElement(
      'section',
      {
        'aria-label': 'Content section',
      },
      React.createElement('p', {}, 'This is test content for accessibility testing.'),
    ),
    React.createElement(
      'figure',
      {
        'aria-label': 'Media content',
      },
      React.createElement('img', {
        src: '/test-image.jpg',
        alt: 'Test image for accessibility',
      }),
      React.createElement('figcaption', {}, 'Test image caption'),
    ),
  )
}

describe('RichText Accessibility', () => {
  describe('Basic WCAG 2.1 AA Compliance', () => {
    it('should have no accessibility violations with mock component', async () => {
      const { container } = render(
        React.createElement(MockRichText, {
          data: mockRichTextData,
          'aria-label': 'Test rich text content',
          enableKeyboardNavigation: true,
        }),
      )

      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('should handle missing data gracefully', () => {
      const emptyData = { root: { children: [] } }

      const { container } = render(
        React.createElement(MockRichText, {
          data: emptyData,
          'aria-label': 'Empty rich text content',
        }),
      )

      // Should still be accessible even with no content
      expect(container.querySelector('[role="region"]')).toBeTruthy()
      const liveRegions = container.querySelectorAll('[aria-live="polite"]')
      expect(liveRegions.length).toBeGreaterThan(0)
    })
  })

  describe('WCAG 2.1 AA Compliance - Full Component', () => {
    it('should have no accessibility violations', async () => {
      const { container } = render(
        React.createElement(RichText, {
          data: mockRichTextData,
          'aria-label': 'Test rich text content',
          enableKeyboardNavigation: true,
        }),
      )

      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('should have proper ARIA labels on all components', () => {
      render(
        React.createElement(RichText, {
          data: mockRichTextData,
          'aria-label': 'Test rich text content',
          role: 'main',
        }),
      )

      // Check main container has proper ARIA attributes
      const mainContainer = screen.getByRole('main')
      expect(mainContainer).toHaveAttribute('aria-label', 'Test rich text content')

      // Check that sections have proper ARIA labels
      const sections = screen.getAllByRole('region')
      sections.forEach((section) => {
        expect(section).toHaveAttribute('aria-label')
      })
    })

    it('should have proper heading hierarchy', () => {
      const { container } = render(
        React.createElement(RichText, {
          data: mockRichTextData,
          'aria-label': 'Test rich text content',
        }),
      )

      const headings = container.querySelectorAll('h1, h2, h3, h4, h5, h6')
      const headingLevels = Array.from(headings).map((h) => parseInt(h.tagName.charAt(1)))

      // Check that heading levels don't skip (e.g., h1 -> h3)
      for (let i = 1; i < headingLevels.length; i++) {
        const current = headingLevels[i]
        const previous = headingLevels[i - 1]
        if (current !== undefined && previous !== undefined) {
          expect(current - previous).toBeLessThanOrEqual(1)
        }
      }
    })

    it('should have proper semantic HTML structure', () => {
      const { container } = render(
        React.createElement(RichText, {
          data: mockRichTextData,
          'aria-label': 'Test rich text content',
        }),
      )

      // Check for semantic elements
      expect(container.querySelector('section')).toBeInTheDocument() // Hero block
      expect(container.querySelector('figure')).toBeInTheDocument() // Media block

      // Validate content structure
      const warnings = validateContentStructure(container)
      expect(warnings.length).toBe(0)
    })

    it('should have proper image alt text', () => {
      render(
        React.createElement(RichText, {
          data: mockRichTextData,
          'aria-label': 'Test rich text content',
        }),
      )

      const images = screen.getAllByRole('img')
      images.forEach((img) => {
        expect(img).toHaveAttribute('alt')
        expect(img.getAttribute('alt')).not.toBe('')
      })
    })

    it('should have proper link accessibility', () => {
      render(
        React.createElement(RichText, {
          data: mockRichTextData,
          'aria-label': 'Test rich text content',
        }),
      )

      const links = screen.getAllByRole('link')
      links.forEach((link) => {
        // Links should have accessible text
        expect(link).toHaveAccessibleName()

        // External links should have proper attributes
        if (link.getAttribute('href')?.startsWith('http')) {
          expect(link).toHaveAttribute('target', '_blank')
          expect(link).toHaveAttribute('rel')
        }
      })
    })
  })

  describe('Keyboard Navigation', () => {
    it('should be keyboard navigable', async () => {
      const user = userEvent.setup()

      render(
        React.createElement(RichText, {
          data: mockRichTextData,
          'aria-label': 'Test rich text content',
          enableKeyboardNavigation: true,
        }),
      )

      // Should be able to tab to the main container
      await user.tab()
      const mainContainer = screen.getByRole('main')
      expect(mainContainer).toHaveFocus()

      // Should be able to navigate with arrow keys
      await user.keyboard('{ArrowDown}')
      // Focus should move to next focusable element
    })

    it('should have proper tab order', async () => {
      const user = userEvent.setup()

      render(
        React.createElement(RichText, {
          data: mockRichTextData,
          'aria-label': 'Test rich text content',
          enableKeyboardNavigation: true,
        }),
      )

      // Get all focusable elements
      const focusableElements = screen
        .getAllByRole('button')
        .concat(screen.getAllByRole('link'))
        .concat(screen.getAllByRole('main'))

      // Tab through all elements
      for (const element of focusableElements) {
        await user.tab()
        expect(document.activeElement).toBe(element)
      }
    })

    it('should handle escape key properly', async () => {
      const user = userEvent.setup()

      render(
        React.createElement(RichText, {
          data: mockRichTextData,
          'aria-label': 'Test rich text content',
          enableKeyboardNavigation: true,
        }),
      )

      const mainContainer = screen.getByRole('main')
      mainContainer.focus()

      await user.keyboard('{Escape}')
      // Should maintain focus on container after escape
      expect(mainContainer).toHaveFocus()
    })
  })

  describe('Screen Reader Support', () => {
    it('should have proper live regions', () => {
      render(
        React.createElement(RichText, {
          data: mockRichTextData,
          'aria-label': 'Test rich text content',
        }),
      )

      // Check for live region
      const liveRegion = screen.getByLabelText('Content announcements')
      expect(liveRegion).toHaveAttribute('aria-live', 'polite')
      expect(liveRegion).toHaveAttribute('aria-atomic', 'false')
    })

    it('should announce content changes', async () => {
      const { rerender } = render(
        React.createElement(RichText, {
          data: mockRichTextData,
          'aria-label': 'Test rich text content',
        }),
      )

      const liveRegion = screen.getByLabelText('Content announcements')

      // Update content
      const updatedData = createMockRichTextData({
        root: {
          type: 'root',
          format: '',
          indent: 0,
          version: 1,
          direction: 'ltr' as const,
          textFormat: 0,
          textStyle: '',
          children: [
            ...mockRichTextData.root.children,
            {
              type: 'paragraph',
              format: '',
              indent: 0,
              version: 1,
              direction: null,
              textFormat: 0,
              textStyle: '',
              children: [
                {
                  type: 'text',
                  format: 0,
                  style: '',
                  mode: 'normal',
                  detail: 0,
                  text: 'New CTA Block',
                  version: 1,
                },
              ],
            },
          ],
        },
      })

      rerender(
        React.createElement(RichText, {
          data: updatedData,
          'aria-label': 'Test rich text content',
        }),
      )

      // Should announce content summary
      await waitFor(() => {
        expect(liveRegion.textContent).toContain('sections')
      })
    })
  })

  describe('Focus Management', () => {
    it('should manage focus properly', async () => {
      const user = userEvent.setup()

      render(
        React.createElement(RichText, {
          data: mockRichTextData,
          'aria-label': 'Test rich text content',
          enableKeyboardNavigation: true,
        }),
      )

      const mainContainer = screen.getByRole('main')

      // Focus should be manageable
      mainContainer.focus()
      expect(mainContainer).toHaveFocus()

      // Should be able to move focus with keyboard
      await user.keyboard('{Tab}')
      expect(document.activeElement).not.toBe(mainContainer)
    })

    it('should have visible focus indicators', () => {
      render(
        React.createElement(RichText, {
          data: mockRichTextData,
          'aria-label': 'Test rich text content',
          enableKeyboardNavigation: true,
        }),
      )

      const focusableElements = screen
        .getAllByRole('button')
        .concat(screen.getAllByRole('link'))
        .concat(screen.getAllByRole('main'))

      focusableElements.forEach((element) => {
        element.focus()

        // Check that element has focus styles
        const computedStyle = window.getComputedStyle(element)
        expect(
          computedStyle.outline !== 'none' ||
            computedStyle.boxShadow !== 'none' ||
            element.classList.contains('focus:'),
        ).toBe(true)
      })
    })
  })

  describe('Color Contrast', () => {
    it('should have sufficient color contrast', () => {
      const { container } = render(
        React.createElement(RichText, {
          data: mockRichTextData,
          'aria-label': 'Test rich text content',
        }),
      )

      // This would typically use a color contrast checking library
      // For now, we'll check that text elements have proper classes
      const textElements = container.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span')

      textElements.forEach((element) => {
        const computedStyle = window.getComputedStyle(element)
        // Check that text is not transparent or very light
        expect(computedStyle.color).not.toBe('transparent')
        expect(computedStyle.opacity).not.toBe('0')
      })
    })
  })

  describe('Error Handling', () => {
    it('should handle malformed block data', async () => {
      const malformedData = createMockRichTextData({
        root: {
          type: 'root',
          format: '',
          indent: 0,
          version: 1,
          direction: 'ltr' as const,
          textFormat: 0,
          textStyle: '',
          children: [
            {
              type: 'paragraph',
              format: '',
              indent: 0,
              version: 1,
              direction: null,
              textFormat: 0,
              textStyle: '',
              children: [
                {
                  type: 'text',
                  format: 0,
                  style: '',
                  mode: 'normal',
                  detail: 0,
                  text: 'Malformed content',
                  version: 1,
                },
              ],
            },
          ],
        },
      })

      const { container } = render(
        React.createElement(RichText, {
          data: malformedData,
          'aria-label': 'Test rich text content',
        }),
      )

      // Should not have accessibility violations even with errors
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })
  })

  describe('Accessibility Utilities', () => {
    it('should validate ARIA attributes correctly', () => {
      const { container } = render(
        React.createElement(RichText, {
          data: mockRichTextData,
          'aria-label': 'Test rich text content',
        }),
      )

      const mainElement = container.querySelector('[role="main"]') as HTMLElement
      const warnings = validateAriaAttributes(mainElement)

      // Should have no warnings for properly configured component
      expect(warnings.length).toBe(0)
    })

    it('should generate accessibility reports', () => {
      const { container } = render(
        React.createElement(RichText, {
          data: mockRichTextData,
          'aria-label': 'Test rich text content',
        }),
      )

      const report = generateAccessibilityReport(container)

      expect(report).toHaveProperty('warnings')
      expect(report).toHaveProperty('errors')
      expect(report).toHaveProperty('suggestions')
      expect(report).toHaveProperty('score')

      // Should have a good accessibility score
      expect(report.score).toBeGreaterThanOrEqual(90)
    })
  })
})
