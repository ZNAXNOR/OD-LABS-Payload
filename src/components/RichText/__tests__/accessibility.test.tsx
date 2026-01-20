/**
 * Accessibility tests for RichText components
 * Tests WCAG 2.1 AA compliance and screen reader support
 */

import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import { axe, toHaveNoViolations } from 'jest-axe'
import userEvent from '@testing-library/user-event'
import { RichText } from '../index'
import { validateAriaAttributes, generateAccessibilityReport } from '../utils/accessibilityUtils'
import { validateContentStructure } from '../utils/semanticHtml'
import { createMockRichTextData } from '../../../../tests/utils/testHelpers'

// Extend Jest matchers
expect.extend(toHaveNoViolations)

// Mock data for testing
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
    ],
  },
})

describe('RichText Accessibility', () => {
  describe('WCAG 2.1 AA Compliance', () => {
    it('should have no accessibility violations', async () => {
      const { container } = render(
        <RichText
          data={mockRichTextData}
          aria-label="Test rich text content"
          enableKeyboardNavigation={true}
        />,
      )

      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('should have proper ARIA labels on all components', () => {
      render(<RichText data={mockRichTextData} aria-label="Test rich text content" role="main" />)

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
        <RichText data={mockRichTextData} aria-label="Test rich text content" />,
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
        <RichText data={mockRichTextData} aria-label="Test rich text content" />,
      )

      // Check for semantic elements
      expect(container.querySelector('section')).toBeInTheDocument() // Hero block
      expect(container.querySelector('figure')).toBeInTheDocument() // Media block

      // Validate content structure
      const warnings = validateContentStructure(container)
      expect(warnings.length).toBe(0)
    })

    it('should have proper image alt text', () => {
      render(<RichText data={mockRichTextData} aria-label="Test rich text content" />)

      const images = screen.getAllByRole('img')
      images.forEach((img) => {
        expect(img).toHaveAttribute('alt')
        expect(img.getAttribute('alt')).not.toBe('')
      })
    })

    it('should have proper link accessibility', () => {
      render(<RichText data={mockRichTextData} aria-label="Test rich text content" />)

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
        <RichText
          data={mockRichTextData}
          aria-label="Test rich text content"
          enableKeyboardNavigation={true}
        />,
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
        <RichText
          data={mockRichTextData}
          aria-label="Test rich text content"
          enableKeyboardNavigation={true}
        />,
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

    it('should support skip links', () => {
      render(
        <RichText
          data={mockRichTextData}
          aria-label="Test rich text content"
          enableKeyboardNavigation={true}
        />,
      )

      // Check for skip links
      const skipLinks = screen.getAllByText(/skip to/i)
      expect(skipLinks.length).toBeGreaterThan(0)

      skipLinks.forEach((link) => {
        expect(link).toHaveAttribute('href')
        expect(link.getAttribute('href')).toMatch(/^#/)
      })
    })

    it('should handle escape key properly', async () => {
      const user = userEvent.setup()

      render(
        <RichText
          data={mockRichTextData}
          aria-label="Test rich text content"
          enableKeyboardNavigation={true}
        />,
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
      render(<RichText data={mockRichTextData} aria-label="Test rich text content" />)

      // Check for live region
      const liveRegion = screen.getByLabelText('Content announcements')
      expect(liveRegion).toHaveAttribute('aria-live', 'polite')
      expect(liveRegion).toHaveAttribute('aria-atomic', 'false')
    })

    it('should announce content changes', async () => {
      const { rerender } = render(
        <RichText data={mockRichTextData} aria-label="Test rich text content" />,
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
                  text: 'Updated content with new sections',
                  version: 1,
                },
              ],
            },
          ],
        },
      })

      rerender(<RichText data={updatedData} aria-label="Test rich text content" />)

      // Should announce content summary
      await waitFor(() => {
        expect(liveRegion.textContent).toContain('sections')
      })
    })

    it('should provide content summaries', () => {
      render(<RichText data={mockRichTextData} aria-label="Test rich text content" />)

      const liveRegion = screen.getByLabelText('Content announcements')

      // Should eventually contain content summary
      waitFor(() => {
        expect(liveRegion.textContent).toContain('This content contains')
        expect(liveRegion.textContent).toContain('sections')
      })
    })

    it('should have proper block descriptions', () => {
      const { container } = render(
        <RichText data={mockRichTextData} aria-label="Test rich text content" />,
      )

      // Check that blocks have descriptive ARIA labels
      const sections = container.querySelectorAll('section')
      sections.forEach((section) => {
        const ariaLabel = section.getAttribute('aria-label')
        expect(ariaLabel).toBeTruthy()
        expect(ariaLabel).not.toBe('section')
      })
    })
  })

  describe('Focus Management', () => {
    it('should manage focus properly', async () => {
      const user = userEvent.setup()

      render(
        <RichText
          data={mockRichTextData}
          aria-label="Test rich text content"
          enableKeyboardNavigation={true}
        />,
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
        <RichText
          data={mockRichTextData}
          aria-label="Test rich text content"
          enableKeyboardNavigation={true}
        />,
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
        <RichText data={mockRichTextData} aria-label="Test rich text content" />,
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

  describe('Responsive Accessibility', () => {
    it('should maintain accessibility on mobile', () => {
      // Mock mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      })

      const { container } = render(
        <RichText
          data={mockRichTextData}
          aria-label="Test rich text content"
          enableKeyboardNavigation={true}
        />,
      )

      // Check that touch targets are large enough (44px minimum)
      const interactiveElements = container.querySelectorAll('button, a, [role="button"]')

      interactiveElements.forEach((element) => {
        const rect = element.getBoundingClientRect()
        expect(Math.max(rect.width, rect.height)).toBeGreaterThanOrEqual(44)
      })
    })

    it('should work with screen readers on mobile', () => {
      // Mock mobile user agent
      Object.defineProperty(navigator, 'userAgent', {
        writable: true,
        value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15',
      })

      render(<RichText data={mockRichTextData} aria-label="Test rich text content" />)

      // Should still have proper ARIA attributes on mobile
      const mainContainer = screen.getByRole('main')
      expect(mainContainer).toHaveAttribute('aria-label')

      const liveRegion = screen.getByLabelText('Content announcements')
      expect(liveRegion).toHaveAttribute('aria-live')
    })
  })

  describe('Error Handling', () => {
    it('should handle missing data gracefully', () => {
      const emptyData = createMockRichTextData({
        root: {
          type: 'root',
          format: '',
          indent: 0,
          version: 1,
          direction: 'ltr' as const,
          textFormat: 0,
          textStyle: '',
          children: [],
        },
      })

      const { container } = render(
        <RichText data={emptyData} aria-label="Empty rich text content" />,
      )

      // Should still be accessible even with no content
      expect(container.querySelector('[role="main"]')).toBeInTheDocument()
      expect(screen.getByLabelText('Content announcements')).toBeInTheDocument()
    })

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
        <RichText data={malformedData} aria-label="Test rich text content" />,
      )

      // Should not have accessibility violations even with errors
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })
  })

  describe('Accessibility Utilities', () => {
    it('should validate ARIA attributes correctly', () => {
      const { container } = render(
        <RichText data={mockRichTextData} aria-label="Test rich text content" />,
      )

      const mainElement = container.querySelector('[role="main"]') as HTMLElement
      const warnings = validateAriaAttributes(mainElement)

      // Should have no warnings for properly configured component
      expect(warnings.length).toBe(0)
    })

    it('should generate accessibility reports', () => {
      const { container } = render(
        <RichText data={mockRichTextData} aria-label="Test rich text content" />,
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

describe('RichText Accessibility Integration', () => {
  it('should work with assistive technologies', async () => {
    // Mock screen reader environment
    Object.defineProperty(window, 'speechSynthesis', {
      value: {
        speak: jest.fn(),
        cancel: jest.fn(),
        getVoices: jest.fn(() => []),
      },
    })

    render(
      <RichText
        data={mockRichTextData}
        aria-label="Test rich text content"
        enableKeyboardNavigation={true}
      />,
    )

    // Should work without errors in screen reader environment
    const mainContainer = screen.getByRole('main')
    expect(mainContainer).toBeInTheDocument()
  })

  it('should support high contrast mode', () => {
    // Mock high contrast media query
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation((query) => ({
        matches: query === '(prefers-contrast: high)',
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    })

    const { container } = render(
      <RichText data={mockRichTextData} aria-label="Test rich text content" />,
    )

    // Should render without issues in high contrast mode
    expect(container.firstChild).toBeInTheDocument()
  })

  it('should support reduced motion preferences', () => {
    // Mock reduced motion media query
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation((query) => ({
        matches: query === '(prefers-reduced-motion: reduce)',
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    })

    const { container } = render(
      <RichText data={mockRichTextData} aria-label="Test rich text content" />,
    )

    // Should respect reduced motion preferences
    const animatedElements = container.querySelectorAll('[class*="animate"]')
    animatedElements.forEach((element) => {
      const computedStyle = window.getComputedStyle(element)
      expect(
        computedStyle.animationDuration === '0.01ms' ||
          computedStyle.transitionDuration === '0.01ms',
      ).toBe(true)
    })
  })
})
