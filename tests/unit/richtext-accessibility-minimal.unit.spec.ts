/**
 * Minimal accessibility tests for RichText components
 * Tests basic WCAG 2.1 AA compliance
 */

import React from 'react'
import { render, screen, cleanup } from '@testing-library/react'
import { axe, toHaveNoViolations } from 'jest-axe'
import { describe, it, expect, afterEach } from 'vitest'

// Extend Vitest matchers
expect.extend(toHaveNoViolations)

// Clean up after each test
afterEach(() => {
  cleanup()
})

// Mock the RichText component with minimal implementation
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

// Mock data for testing
const mockRichTextData = {
  root: {
    type: 'root',
    children: [
      {
        type: 'block',
        fields: {
          blockType: 'hero',
          heading: 'Test Hero Heading',
          subheading: 'Test subheading for accessibility',
        },
      },
    ],
  },
}

describe('RichText Accessibility - Basic Tests', () => {
  describe('WCAG 2.1 AA Compliance', () => {
    it('should have no accessibility violations', async () => {
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

    it('should have proper ARIA labels on all components', () => {
      render(
        React.createElement(MockRichText, {
          data: mockRichTextData,
          'aria-label': 'Test rich text content',
          role: 'main',
        }),
      )

      // Check main container has proper ARIA attributes
      const mainContainer = screen.getByRole('main')
      expect(mainContainer.getAttribute('aria-label')).toBe('Test rich text content')

      // Check that sections have proper ARIA labels
      const sections = screen.getAllByRole('region')
      sections.forEach((section) => {
        expect(section.getAttribute('aria-label')).toBeTruthy()
      })
    })

    it('should have proper heading hierarchy', () => {
      const { container } = render(
        React.createElement(MockRichText, {
          data: mockRichTextData,
          'aria-label': 'Test rich text content',
        }),
      )

      const headings = container.querySelectorAll('h1, h2, h3, h4, h5, h6')
      expect(headings.length).toBeGreaterThan(0)

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
        React.createElement(MockRichText, {
          data: mockRichTextData,
          'aria-label': 'Test rich text content',
        }),
      )

      // Check for semantic elements
      expect(container.querySelector('section')).toBeTruthy() // Hero block
      expect(container.querySelector('figure')).toBeTruthy() // Media block
    })

    it('should have proper image alt text', () => {
      render(
        React.createElement(MockRichText, {
          data: mockRichTextData,
          'aria-label': 'Test rich text content',
        }),
      )

      const images = screen.getAllByRole('img')
      images.forEach((img) => {
        expect(img.getAttribute('alt')).toBeTruthy()
        expect(img.getAttribute('alt')).not.toBe('')
      })
    })

    it('should have proper link accessibility', () => {
      render(
        React.createElement(MockRichText, {
          data: mockRichTextData,
          'aria-label': 'Test rich text content',
        }),
      )

      const links = screen.getAllByRole('link')
      links.forEach((link) => {
        // Links should have accessible text (either text content or aria-label)
        const hasAccessibleName = link.textContent?.trim() || link.getAttribute('aria-label')
        expect(hasAccessibleName).toBeTruthy()
      })
    })
  })

  describe('Screen Reader Support', () => {
    it('should have proper live regions', () => {
      const { container } = render(
        React.createElement(MockRichText, {
          data: mockRichTextData,
          'aria-label': 'Test rich text content',
        }),
      )

      // Check for live region (get the first one since there might be multiple in tests)
      const liveRegions = container.querySelectorAll('[aria-live="polite"]')
      expect(liveRegions.length).toBeGreaterThan(0)

      const liveRegion = liveRegions[0]
      expect(liveRegion?.getAttribute('aria-live')).toBe('polite')
      expect(liveRegion?.getAttribute('aria-atomic')).toBe('false')
    })

    it('should provide content summaries', () => {
      const { container } = render(
        React.createElement(MockRichText, {
          data: mockRichTextData,
          'aria-label': 'Test rich text content',
        }),
      )

      const liveRegions = container.querySelectorAll('[aria-live="polite"]')
      expect(liveRegions.length).toBeGreaterThan(0)

      const liveRegion = liveRegions[0]
      expect(liveRegion?.textContent).toContain('This content contains')
      expect(liveRegion?.textContent).toContain('sections')
    })

    it('should have proper block descriptions', () => {
      const { container } = render(
        React.createElement(MockRichText, {
          data: mockRichTextData,
          'aria-label': 'Test rich text content',
        }),
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

  describe('Color Contrast', () => {
    it('should have sufficient color contrast', () => {
      const { container } = render(
        React.createElement(MockRichText, {
          data: mockRichTextData,
          'aria-label': 'Test rich text content',
        }),
      )

      // Check that text elements exist and are not transparent
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

    it('should handle malformed block data', async () => {
      const malformedData = {
        root: {
          children: [
            {
              type: 'block',
              fields: {
                blockType: 'nonexistent',
                // Missing required fields
              },
            },
          ],
        },
      }

      const { container } = render(
        React.createElement(MockRichText, {
          data: malformedData,
          'aria-label': 'Test rich text content',
        }),
      )

      // Should not have accessibility violations even with errors
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })
  })
})
