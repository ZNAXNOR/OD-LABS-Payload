/**
 * Color contrast tests for RichText components
 * Tests WCAG 2.1 AA color contrast compliance
 */

import React from 'react'
import { render, cleanup } from '@testing-library/react'
import { axe, toHaveNoViolations } from 'jest-axe'
import { describe, it, expect, afterEach } from 'vitest'

// Extend Vitest matchers
expect.extend(toHaveNoViolations)

// Clean up after each test
afterEach(() => {
  cleanup()
})

/**
 * Calculate contrast ratio between two colors
 * Based on WCAG 2.1 formula
 */
function calculateContrastRatio(color1: string, color2: string): number {
  // Convert hex to RGB
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result
      ? {
          r: parseInt(result[1]!, 16),
          g: parseInt(result[2]!, 16),
          b: parseInt(result[3]!, 16),
        }
      : null
  }

  // Calculate relative luminance
  const getLuminance = (r: number, g: number, b: number) => {
    const [rs, gs, bs] = [r, g, b].map((c) => {
      c = c / 255
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
    })
    return 0.2126 * rs! + 0.7152 * gs! + 0.0722 * bs!
  }

  const rgb1 = hexToRgb(color1)
  const rgb2 = hexToRgb(color2)

  if (!rgb1 || !rgb2) return 1

  const lum1 = getLuminance(rgb1.r, rgb1.g, rgb1.b)
  const lum2 = getLuminance(rgb2.r, rgb2.g, rgb2.b)

  const brightest = Math.max(lum1, lum2)
  const darkest = Math.min(lum1, lum2)

  return (brightest + 0.05) / (darkest + 0.05)
}

/**
 * Check if contrast ratio meets WCAG requirements
 */
function meetsWCAGAA(ratio: number, isLargeText = false): boolean {
  return isLargeText ? ratio >= 3.0 : ratio >= 4.5
}

function meetsWCAGAAA(ratio: number, isLargeText = false): boolean {
  return isLargeText ? ratio >= 4.5 : ratio >= 7.0
}

// Mock RichText component with various text elements
const MockRichTextWithColors = ({ theme = 'light' }: { theme?: 'light' | 'dark' }) => {
  const colors = {
    light: {
      background: '#FFFFFF',
      text: '#333333',
      heading: '#000000',
      link: '#0066CC',
      linkHover: '#003D7A',
      muted: '#767676',
      error: '#D32F2F',
      success: '#2E7D32',
      button: '#1976D2',
      buttonText: '#FFFFFF',
    },
    dark: {
      background: '#121212',
      text: '#E0E0E0',
      heading: '#FFFFFF',
      link: '#90CAF9',
      linkHover: '#BBDEFB',
      muted: '#BDBDBD',
      error: '#F44336',
      success: '#4CAF50',
      button: '#2196F3',
      buttonText: '#000000',
    },
  }

  const themeColors = colors[theme]

  return React.createElement(
    'div',
    {
      style: {
        backgroundColor: themeColors.background,
        color: themeColors.text,
        padding: '20px',
      },
      'data-testid': 'richtext-container',
    },
    // Heading
    React.createElement(
      'h1',
      {
        style: { color: themeColors.heading, fontSize: '32px', fontWeight: 'bold' },
        'data-testid': 'heading-large',
      },
      'Large Heading Text',
    ),
    // Normal text
    React.createElement(
      'p',
      {
        style: { color: themeColors.text, fontSize: '16px' },
        'data-testid': 'body-text',
      },
      'This is normal body text that should meet WCAG AA contrast requirements.',
    ),
    // Link
    React.createElement(
      'a',
      {
        href: '#',
        style: { color: themeColors.link, fontSize: '16px' },
        'data-testid': 'link-normal',
      },
      'This is a link',
    ),
    // Link hover state
    React.createElement(
      'a',
      {
        href: '#',
        style: { color: themeColors.linkHover, fontSize: '16px' },
        'data-testid': 'link-hover',
        className: 'hover-state',
      },
      'This is a hovered link',
    ),
    // Muted text
    React.createElement(
      'p',
      {
        style: { color: themeColors.muted, fontSize: '14px' },
        'data-testid': 'muted-text',
      },
      'This is muted text for less important information.',
    ),
    // Error text
    React.createElement(
      'p',
      {
        style: { color: themeColors.error, fontSize: '16px', fontWeight: 'bold' },
        'data-testid': 'error-text',
      },
      'This is error text',
    ),
    // Success text
    React.createElement(
      'p',
      {
        style: { color: themeColors.success, fontSize: '16px', fontWeight: 'bold' },
        'data-testid': 'success-text',
      },
      'This is success text',
    ),
    // Button
    React.createElement(
      'button',
      {
        style: {
          backgroundColor: themeColors.button,
          color: themeColors.buttonText,
          padding: '12px 24px',
          fontSize: '16px',
          border: 'none',
          borderRadius: '4px',
        },
        'data-testid': 'button-primary',
      },
      'Primary Button',
    ),
    // Large text
    React.createElement(
      'p',
      {
        style: { color: themeColors.text, fontSize: '24px' },
        'data-testid': 'large-text',
      },
      'This is large text (24px)',
    ),
    // Bold large text
    React.createElement(
      'p',
      {
        style: { color: themeColors.text, fontSize: '18px', fontWeight: 'bold' },
        'data-testid': 'bold-large-text',
      },
      'This is bold large text (18px bold)',
    ),
  )
}

describe('RichText Color Contrast', () => {
  describe('WCAG 2.1 AA Compliance - Light Theme', () => {
    it('should have no color contrast violations', async () => {
      const { container } = render(React.createElement(MockRichTextWithColors, { theme: 'light' }))

      const results = await axe(container, {
        rules: {
          'color-contrast': { enabled: true },
        },
      })

      expect(results).toHaveNoViolations()
    })

    it('should meet contrast requirements for body text', () => {
      const ratio = calculateContrastRatio('#333333', '#FFFFFF')
      expect(ratio).toBeGreaterThanOrEqual(4.5)
      expect(meetsWCAGAA(ratio)).toBe(true)
    })

    it('should meet contrast requirements for headings', () => {
      const ratio = calculateContrastRatio('#000000', '#FFFFFF')
      expect(ratio).toBeGreaterThanOrEqual(4.5)
      expect(meetsWCAGAA(ratio)).toBe(true)
    })

    it('should meet contrast requirements for links', () => {
      const ratio = calculateContrastRatio('#0066CC', '#FFFFFF')
      expect(ratio).toBeGreaterThanOrEqual(4.5)
      expect(meetsWCAGAA(ratio)).toBe(true)
    })

    it('should meet contrast requirements for link hover state', () => {
      const ratio = calculateContrastRatio('#003D7A', '#FFFFFF')
      expect(ratio).toBeGreaterThanOrEqual(4.5)
      expect(meetsWCAGAA(ratio)).toBe(true)
    })

    it('should meet contrast requirements for muted text', () => {
      const ratio = calculateContrastRatio('#767676', '#FFFFFF')
      expect(ratio).toBeGreaterThanOrEqual(4.5)
      expect(meetsWCAGAA(ratio)).toBe(true)
    })

    it('should meet contrast requirements for error text', () => {
      const ratio = calculateContrastRatio('#D32F2F', '#FFFFFF')
      expect(ratio).toBeGreaterThanOrEqual(4.5)
      expect(meetsWCAGAA(ratio)).toBe(true)
    })

    it('should meet contrast requirements for success text', () => {
      const ratio = calculateContrastRatio('#2E7D32', '#FFFFFF')
      expect(ratio).toBeGreaterThanOrEqual(4.5)
      expect(meetsWCAGAA(ratio)).toBe(true)
    })

    it('should meet contrast requirements for button', () => {
      const ratio = calculateContrastRatio('#FFFFFF', '#1976D2')
      expect(ratio).toBeGreaterThanOrEqual(4.5)
      expect(meetsWCAGAA(ratio)).toBe(true)
    })

    it('should meet large text contrast requirements', () => {
      // Large text (24px) only needs 3:1 ratio
      const ratio = calculateContrastRatio('#333333', '#FFFFFF')
      expect(ratio).toBeGreaterThanOrEqual(3.0)
      expect(meetsWCAGAA(ratio, true)).toBe(true)
    })

    it('should meet bold large text contrast requirements', () => {
      // Bold text at 18px+ only needs 3:1 ratio
      const ratio = calculateContrastRatio('#333333', '#FFFFFF')
      expect(ratio).toBeGreaterThanOrEqual(3.0)
      expect(meetsWCAGAA(ratio, true)).toBe(true)
    })
  })

  describe('WCAG 2.1 AA Compliance - Dark Theme', () => {
    it('should have no color contrast violations in dark theme', async () => {
      const { container } = render(React.createElement(MockRichTextWithColors, { theme: 'dark' }))

      const results = await axe(container, {
        rules: {
          'color-contrast': { enabled: true },
        },
      })

      expect(results).toHaveNoViolations()
    })

    it('should meet contrast requirements for dark theme body text', () => {
      const ratio = calculateContrastRatio('#E0E0E0', '#121212')
      expect(ratio).toBeGreaterThanOrEqual(4.5)
      expect(meetsWCAGAA(ratio)).toBe(true)
    })

    it('should meet contrast requirements for dark theme headings', () => {
      const ratio = calculateContrastRatio('#FFFFFF', '#121212')
      expect(ratio).toBeGreaterThanOrEqual(4.5)
      expect(meetsWCAGAA(ratio)).toBe(true)
    })

    it('should meet contrast requirements for dark theme links', () => {
      const ratio = calculateContrastRatio('#90CAF9', '#121212')
      expect(ratio).toBeGreaterThanOrEqual(4.5)
      expect(meetsWCAGAA(ratio)).toBe(true)
    })
  })

  describe('Contrast Ratio Calculations', () => {
    it('should calculate correct contrast ratios for known color pairs', () => {
      // Black on white should be 21:1
      const blackWhite = calculateContrastRatio('#000000', '#FFFFFF')
      expect(Math.round(blackWhite * 10) / 10).toBe(21)

      // White on black should be 21:1
      const whiteBlack = calculateContrastRatio('#FFFFFF', '#000000')
      expect(Math.round(whiteBlack * 10) / 10).toBe(21)

      // Gray on white should be around 12.6:1
      const grayWhite = calculateContrastRatio('#333333', '#FFFFFF')
      expect(Math.round(grayWhite * 10) / 10).toBeCloseTo(12.6, 1)
    })

    it('should identify WCAG AA compliance correctly', () => {
      // 4.5:1 should pass AA for normal text
      expect(meetsWCAGAA(4.5)).toBe(true)
      expect(meetsWCAGAA(4.4)).toBe(false)

      // 3:1 should pass AA for large text
      expect(meetsWCAGAA(3.0, true)).toBe(true)
      expect(meetsWCAGAA(2.9, true)).toBe(false)
    })

    it('should identify WCAG AAA compliance correctly', () => {
      // 7:1 should pass AAA for normal text
      expect(meetsWCAGAAA(7.0)).toBe(true)
      expect(meetsWCAGAAA(6.9)).toBe(false)

      // 4.5:1 should pass AAA for large text
      expect(meetsWCAGAAA(4.5, true)).toBe(true)
      expect(meetsWCAGAAA(4.4, true)).toBe(false)
    })
  })

  describe('Common Color Combinations', () => {
    const testCases = [
      // Good combinations (should pass)
      { fg: '#000000', bg: '#FFFFFF', name: 'Black on White', shouldPass: true },
      { fg: '#FFFFFF', bg: '#000000', name: 'White on Black', shouldPass: true },
      { fg: '#333333', bg: '#FFFFFF', name: 'Dark Gray on White', shouldPass: true },
      { fg: '#767676', bg: '#FFFFFF', name: 'Medium Gray on White', shouldPass: true },
      { fg: '#0066CC', bg: '#FFFFFF', name: 'Blue Link on White', shouldPass: true },

      // Bad combinations (should fail)
      { fg: '#999999', bg: '#FFFFFF', name: 'Light Gray on White', shouldPass: false },
      { fg: '#CCCCCC', bg: '#FFFFFF', name: 'Very Light Gray on White', shouldPass: false },
      { fg: '#FFFF00', bg: '#FFFFFF', name: 'Yellow on White', shouldPass: false },
    ]

    testCases.forEach(({ fg, bg, name, shouldPass }) => {
      it(`should ${shouldPass ? 'pass' : 'fail'} contrast test for ${name}`, () => {
        const ratio = calculateContrastRatio(fg, bg)
        const passes = meetsWCAGAA(ratio)

        if (shouldPass) {
          expect(passes).toBe(true)
          expect(ratio).toBeGreaterThanOrEqual(4.5)
        } else {
          expect(passes).toBe(false)
          expect(ratio).toBeLessThan(4.5)
        }
      })
    })
  })

  describe('Edge Cases and Error Handling', () => {
    it('should handle invalid color formats gracefully', () => {
      const ratio1 = calculateContrastRatio('invalid', '#FFFFFF')
      const ratio2 = calculateContrastRatio('#000000', 'invalid')
      const ratio3 = calculateContrastRatio('invalid', 'invalid')

      expect(ratio1).toBe(1)
      expect(ratio2).toBe(1)
      expect(ratio3).toBe(1)
    })

    it('should handle short hex colors', () => {
      // Note: Our function doesn't handle 3-digit hex, but we test the behavior
      const ratio = calculateContrastRatio('#000', '#FFF')
      expect(ratio).toBe(1) // Should return 1 for invalid format
    })

    it('should handle same colors', () => {
      const ratio = calculateContrastRatio('#FFFFFF', '#FFFFFF')
      expect(ratio).toBe(1) // Same colors have 1:1 ratio
    })
  })

  describe('Accessibility Features Integration', () => {
    it('should work with high contrast mode simulation', () => {
      // Test high contrast color combinations
      const highContrastPairs = [
        { fg: '#000000', bg: '#FFFFFF' }, // Black on white
        { fg: '#FFFFFF', bg: '#000000' }, // White on black
        { fg: '#FFFF00', bg: '#000000' }, // Yellow on black
        { fg: '#000000', bg: '#FFFF00' }, // Black on yellow
      ]

      highContrastPairs.forEach(({ fg, bg }) => {
        const ratio = calculateContrastRatio(fg, bg)
        expect(ratio).toBeGreaterThanOrEqual(4.5)
      })
    })

    it('should provide sufficient contrast for focus indicators', () => {
      // Focus indicators should have at least 3:1 contrast with adjacent colors
      const focusColor = '#005FCC' // Focus indicator color
      const backgroundColor = '#FFFFFF'

      const ratio = calculateContrastRatio(focusColor, backgroundColor)
      expect(ratio).toBeGreaterThanOrEqual(3.0)
    })

    it('should maintain contrast in different states', () => {
      // Test button states
      const buttonStates = [
        { bg: '#1976D2', fg: '#FFFFFF', state: 'normal' },
        { bg: '#1565C0', fg: '#FFFFFF', state: 'hover' },
        { bg: '#0D47A1', fg: '#FFFFFF', state: 'active' },
        { bg: '#BBBBBB', fg: '#666666', state: 'disabled' },
      ]

      buttonStates.forEach(({ bg, fg, state }) => {
        const ratio = calculateContrastRatio(fg, bg)
        if (state !== 'disabled') {
          // Disabled states don't need to meet contrast requirements
          expect(ratio).toBeGreaterThanOrEqual(4.5)
        }
      })
    })
  })

  describe('Performance and Optimization', () => {
    it('should calculate contrast ratios efficiently', () => {
      const startTime = performance.now()

      // Calculate many contrast ratios
      for (let i = 0; i < 1000; i++) {
        calculateContrastRatio('#333333', '#FFFFFF')
      }

      const endTime = performance.now()
      const duration = endTime - startTime

      // Should complete 1000 calculations in reasonable time (< 100ms)
      expect(duration).toBeLessThan(100)
    })

    it('should handle batch contrast testing', () => {
      const colorPairs = [
        ['#000000', '#FFFFFF'],
        ['#333333', '#FFFFFF'],
        ['#666666', '#FFFFFF'],
        ['#999999', '#FFFFFF'],
        ['#CCCCCC', '#FFFFFF'],
      ]

      const results = colorPairs.map(([fg, bg]) => ({
        fg,
        bg,
        ratio: calculateContrastRatio(fg!, bg!),
        passes: meetsWCAGAA(calculateContrastRatio(fg!, bg!)),
      }))

      expect(results).toHaveLength(5)
      expect(results.filter((r) => r.passes)).toHaveLength(3) // First 3 should pass
    })
  })
})
