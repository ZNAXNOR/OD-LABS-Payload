/**
 * Responsive Design Integration Tests
 *
 * Tests integration of responsive design utilities with actual components
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import {
  deviceConfigs,
  simulateDevice,
  testResponsiveBehavior,
  validateResponsiveDesign,
  type DeviceConfig,
} from '@/components/ui/RichText/utils/deviceTestingUtils'

describe('Responsive Design Integration', () => {
  let originalInnerWidth: number
  let originalInnerHeight: number
  let originalDevicePixelRatio: number
  let originalUserAgent: string

  beforeEach(() => {
    // Store original values
    originalInnerWidth = window.innerWidth
    originalInnerHeight = window.innerHeight
    originalDevicePixelRatio = window.devicePixelRatio
    originalUserAgent = navigator.userAgent
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
    Object.defineProperty(navigator, 'userAgent', {
      writable: true,
      configurable: true,
      value: originalUserAgent,
    })
  })

  describe('Cross-Device Responsive Behavior', () => {
    it('should test responsive behavior across all device sizes', () => {
      const testResults: Record<string, boolean> = {}

      // Create a mock element for testing
      const mockElement = document.createElement('div')
      mockElement.style.width = '100%'
      mockElement.style.maxWidth = '1200px'
      mockElement.style.padding = '16px'
      document.body.appendChild(mockElement)

      try {
        testResponsiveBehavior(mockElement, (device: DeviceConfig, element: HTMLElement) => {
          // Simulate the device
          simulateDevice(
            Object.keys(deviceConfigs).find((key) => deviceConfigs[key] === device) || '',
          )

          // Validate responsive design
          const validation = validateResponsiveDesign(element, device)
          testResults[device.name] = validation.passed

          // Log any issues for debugging
          if (!validation.passed) {
            console.warn(`Responsive issues on ${device.name}:`, validation.issues)
          }
          if (validation.warnings.length > 0) {
            console.info(`Responsive warnings on ${device.name}:`, validation.warnings)
          }
        })

        // Check that most devices pass validation
        const passedDevices = Object.values(testResults).filter((passed) => passed).length
        const totalDevices = Object.keys(testResults).length
        const passRate = passedDevices / totalDevices

        expect(passRate).toBeGreaterThan(0.8) // At least 80% of devices should pass
        expect(totalDevices).toBeGreaterThan(10) // Should test multiple devices
      } finally {
        document.body.removeChild(mockElement)
      }
    })

    it('should handle different device categories appropriately', () => {
      const categoryResults: Record<string, number> = {
        mobile: 0,
        tablet: 0,
        desktop: 0,
        tv: 0,
      }

      Object.entries(deviceConfigs).forEach(([deviceKey, device]) => {
        simulateDevice(deviceKey)

        // Create appropriate element for device category
        const element = document.createElement('div')

        switch (device.category) {
          case 'mobile':
            element.style.width = '100%'
            element.style.padding = '12px'
            element.style.fontSize = '14px'
            break
          case 'tablet':
            element.style.width = '100%'
            element.style.maxWidth = '768px'
            element.style.padding = '16px'
            element.style.fontSize = '16px'
            break
          case 'desktop':
            element.style.width = '100%'
            element.style.maxWidth = '1200px'
            element.style.padding = '24px'
            element.style.fontSize = '18px'
            break
          case 'tv':
            element.style.width = '100%'
            element.style.maxWidth = '1600px'
            element.style.padding = '32px'
            element.style.fontSize = '20px'
            break
        }

        document.body.appendChild(element)

        try {
          const validation = validateResponsiveDesign(element, device)
          if (validation.passed) {
            const category = device.category
            if (category && categoryResults[category] !== undefined) {
              categoryResults[category]++
            }
          }
        } finally {
          document.body.removeChild(element)
        }
      })

      // Each category should have at least one passing device
      expect(categoryResults.mobile).toBeGreaterThan(0)
      expect(categoryResults.tablet).toBeGreaterThan(0)
      expect(categoryResults.desktop).toBeGreaterThan(0)
      expect(categoryResults.tv).toBeGreaterThan(0)
    })

    it('should validate touch target sizes on touch devices', () => {
      const touchDevices = Object.entries(deviceConfigs).filter(([, device]) => device.touchEnabled)

      expect(touchDevices.length).toBeGreaterThan(0)

      touchDevices.forEach(([deviceKey, device]) => {
        simulateDevice(deviceKey)

        // Create elements with different sizes
        const smallButton = document.createElement('button')
        smallButton.style.width = '30px'
        smallButton.style.height = '30px'

        const largeButton = document.createElement('button')
        largeButton.style.width = '48px'
        largeButton.style.height = '48px'

        const container = document.createElement('div')
        container.appendChild(smallButton)
        container.appendChild(largeButton)
        document.body.appendChild(container)

        try {
          const validation = validateResponsiveDesign(container, device)

          // Should detect small touch targets as issues
          const hasTouchTargetIssues = validation.issues.some((issue) =>
            issue.includes('Touch target too small'),
          )

          expect(hasTouchTargetIssues).toBe(true)
        } finally {
          document.body.removeChild(container)
        }
      })
    })

    it('should handle high-DPI displays correctly', () => {
      const highDpiDevices = Object.entries(deviceConfigs).filter(
        ([, device]) => device.pixelRatio > 1,
      )

      expect(highDpiDevices.length).toBeGreaterThan(0)

      highDpiDevices.forEach(([deviceKey, device]) => {
        simulateDevice(deviceKey)

        expect(window.devicePixelRatio).toBe(device.pixelRatio)
        expect(window.devicePixelRatio).toBeGreaterThan(1)
      })
    })

    it('should test across different orientations', () => {
      const portraitDevices = Object.entries(deviceConfigs).filter(
        ([, device]) => device.orientation === 'portrait',
      )
      const landscapeDevices = Object.entries(deviceConfigs).filter(
        ([, device]) => device.orientation === 'landscape',
      )

      expect(portraitDevices.length).toBeGreaterThan(0)
      expect(landscapeDevices.length).toBeGreaterThan(0)

      // Test portrait devices
      portraitDevices.slice(0, 3).forEach(([deviceKey, device]) => {
        simulateDevice(deviceKey)
        expect(device.height).toBeGreaterThan(device.width)
      })

      // Test landscape devices
      landscapeDevices.slice(0, 3).forEach(([deviceKey, device]) => {
        simulateDevice(deviceKey)
        expect(device.width).toBeGreaterThan(device.height)
      })
    })
  })

  describe('Performance Across Devices', () => {
    it('should maintain reasonable performance on all device types', () => {
      const performanceResults: Record<string, number> = {}

      Object.entries(deviceConfigs).forEach(([deviceKey, device]) => {
        simulateDevice(deviceKey)

        const startTime = performance.now()

        // Simulate some responsive operations
        const element = document.createElement('div')
        element.style.width = '100%'
        element.style.height = '200px'

        // Add some content
        for (let i = 0; i < 10; i++) {
          const child = document.createElement('p')
          child.textContent = `Test content ${i}`
          element.appendChild(child)
        }

        document.body.appendChild(element)

        // Perform validation
        validateResponsiveDesign(element, device)

        const endTime = performance.now()
        performanceResults[deviceKey] = endTime - startTime

        document.body.removeChild(element)
      })

      // All operations should complete within reasonable time
      Object.entries(performanceResults).forEach(([_deviceKey, time]) => {
        expect(time).toBeLessThan(100) // 100ms should be more than enough for test environment
      })

      // Average performance should be good
      const avgTime =
        Object.values(performanceResults).reduce((sum, time) => sum + time, 0) /
        Object.values(performanceResults).length
      expect(avgTime).toBeLessThan(20) // Average should be under 20ms
    })
  })

  describe('Error Handling', () => {
    it('should handle malformed elements gracefully', () => {
      const device = deviceConfigs['iphone-12']

      if (!device) {
        throw new Error('Required device config not found')
      }

      // Test with element without proper dimensions
      const element = document.createElement('div')
      expect(() => {
        validateResponsiveDesign(element, device)
      }).not.toThrow()
    })

    it('should handle missing device configurations', () => {
      expect(() => {
        simulateDevice('non-existent-device')
      }).not.toThrow()
    })
  })
})
