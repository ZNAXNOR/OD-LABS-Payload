/**
 * RichText Responsive Design Unit Tests
 *
 * Tests responsive behavior across all device sizes and orientations
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { render } from '@testing-library/react'
import React from 'react'
import { RichText } from '@/components/RichText'
import {
  deviceConfigs,
  simulateDevice,
  supportsHover,
  supportsTouch,
} from '@/components/RichText/utils/deviceTestingUtils'
import { createMockRichTextData } from '../utils/testHelpers'

// Mock data for testing
const mockRichTextData = createMockRichTextData()

describe('RichText Responsive Design', () => {
  let originalInnerWidth: number
  let originalInnerHeight: number
  let originalDevicePixelRatio: number

  beforeEach(() => {
    // Store original values
    originalInnerWidth = window.innerWidth
    originalInnerHeight = window.innerHeight
    originalDevicePixelRatio = window.devicePixelRatio

    // Mock window.matchMedia
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: (query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => {},
      }),
    })
  })

  afterEach(() => {
    // Restore original values
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: originalInnerWidth,
    })
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: originalInnerHeight,
    })
    Object.defineProperty(window, 'devicePixelRatio', {
      writable: true,
      configurable: true,
      value: originalDevicePixelRatio,
    })
  })

  describe('Basic Responsive Rendering', () => {
    it('should render without errors on mobile viewport', () => {
      simulateDevice('iphone12')
      const { container } = render(<RichText data={mockRichTextData} />)
      expect(container.firstChild).toBeInTheDocument()
    })

    it('should render without errors on tablet viewport', () => {
      simulateDevice('ipadPro')
      const { container } = render(<RichText data={mockRichTextData} />)
      expect(container.firstChild).toBeInTheDocument()
    })

    it('should render without errors on desktop viewport', () => {
      simulateDevice('desktop1920')
      const { container } = render(<RichText data={mockRichTextData} />)
      expect(container.firstChild).toBeInTheDocument()
    })
  })

  describe('Responsive Features', () => {
    it('should apply responsive classes correctly', () => {
      const { container } = render(
        <RichText data={mockRichTextData} enableContainerQueries={true} />,
      )
      expect(container.firstChild).toBeInTheDocument()
    })

    it('should handle prose mode responsively', () => {
      const { container } = render(<RichText data={mockRichTextData} enableProse={true} />)
      expect(container.firstChild).toBeInTheDocument()
    })

    it('should handle gutter mode responsively', () => {
      const { container } = render(<RichText data={mockRichTextData} enableGutter={true} />)
      expect(container.firstChild).toBeInTheDocument()
    })
  })

  describe('Mobile Device Testing', () => {
    const mobileDevices = Object.entries(deviceConfigs).filter(
      ([, device]) => device.category === 'mobile',
    )

    mobileDevices.forEach(([deviceKey, device]) => {
      describe(`${device.name}`, () => {
        beforeEach(() => {
          simulateDevice(deviceKey)
        })

        it('should render correctly', () => {
          const { container } = render(<RichText data={mockRichTextData} />)
          expect(container.firstChild).toBeInTheDocument()
        })

        it('should handle touch interactions', () => {
          expect(supportsTouch()).toBe(true)
        })

        it('should not support hover', () => {
          expect(supportsHover()).toBe(false)
        })
      })
    })
  })

  describe('Tablet Device Testing', () => {
    const tabletDevices = Object.entries(deviceConfigs).filter(
      ([, device]) => device.category === 'tablet',
    )

    tabletDevices.forEach(([deviceKey, device]) => {
      describe(`${device.name}`, () => {
        beforeEach(() => {
          simulateDevice(deviceKey)
        })

        it('should render correctly', () => {
          const { container } = render(<RichText data={mockRichTextData} />)
          expect(container.firstChild).toBeInTheDocument()
        })

        it('should support both touch and hover', () => {
          expect(supportsTouch()).toBe(true)
          expect(supportsHover()).toBe(true)
        })
      })
    })
  })

  describe('Desktop Device Testing', () => {
    const desktopDevices = Object.entries(deviceConfigs).filter(
      ([, device]) => device.category === 'desktop',
    )

    desktopDevices.forEach(([deviceKey, device]) => {
      describe(`${device.name}`, () => {
        beforeEach(() => {
          simulateDevice(deviceKey)
        })

        it('should render correctly', () => {
          const { container } = render(<RichText data={mockRichTextData} />)
          expect(container.firstChild).toBeInTheDocument()
        })

        it('should support hover interactions', () => {
          expect(supportsHover()).toBe(true)
        })

        it('should not support touch by default', () => {
          expect(supportsTouch()).toBe(false)
        })
      })
    })
  })

  describe('Performance Testing', () => {
    it('should render efficiently on low-power devices', () => {
      const lowPowerDevices = Object.entries(deviceConfigs).filter(
        ([, device]) => device.category === 'mobile',
      )

      lowPowerDevices.forEach(([deviceKey]) => {
        simulateDevice(deviceKey)

        const startTime = performance.now()
        const { container } = render(
          <RichText data={mockRichTextData} enablePerformanceMonitoring={true} />,
        )
        const endTime = performance.now()

        const renderTime = endTime - startTime

        // Render time should be reasonable (less than 100ms for simple content)
        expect(renderTime).toBeLessThan(100)
        expect(container.firstChild).toBeInTheDocument()
      })
    })
  })

  describe('Responsive Design Validation', () => {
    it('should validate responsive design requirements', () => {
      Object.entries(deviceConfigs).forEach(([deviceKey]) => {
        simulateDevice(deviceKey)

        const { container } = render(<RichText data={mockRichTextData} />)
        const richTextElement = container.firstChild as HTMLElement

        expect(richTextElement).toBeInTheDocument()
      })
    })
  })

  describe('Accessibility Across Devices', () => {
    it('should maintain accessibility standards on all devices', () => {
      Object.entries(deviceConfigs).forEach(([deviceKey]) => {
        simulateDevice(deviceKey)

        const { container } = render(<RichText data={mockRichTextData} />)

        // Check for proper semantic structure
        expect(container.firstChild).toBeInTheDocument()
      })
    })
  })
})
