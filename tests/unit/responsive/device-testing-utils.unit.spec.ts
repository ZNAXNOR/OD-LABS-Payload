/**
 * Device Testing Utilities Unit Tests
 *
 * Tests the device testing utilities for responsive design validation
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import {
  deviceConfigs,
  simulateDevice,
  validateResponsiveDesign,
  generateResponsiveTestCases,
  getDeviceCategory,
  supportsHover,
  supportsTouch,
  getDeviceClasses,
  getResponsiveContainerClasses,
  getDeviceTypographyClasses,
  // type DeviceConfig, // Unused - commented out
} from '@/components/ui/RichText/utils/deviceTestingUtils'

describe('Device Testing Utilities', () => {
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

  describe('Device Configuration', () => {
    it('should have comprehensive device configurations', () => {
      expect(Object.keys(deviceConfigs).length).toBeGreaterThan(10)

      // Check for different device categories
      const categories = Object.values(deviceConfigs).map((d) => d.category)
      expect(categories).toContain('mobile')
      expect(categories).toContain('tablet')
      expect(categories).toContain('desktop')
      expect(categories).toContain('tv')
    })

    it('should have valid device properties', () => {
      Object.entries(deviceConfigs).forEach(([_key, device]) => {
        expect(device.name).toBeTruthy()
        expect(device.width).toBeGreaterThan(0)
        expect(device.height).toBeGreaterThan(0)
        expect(device.pixelRatio).toBeGreaterThan(0)
        expect(device.userAgent).toBeTruthy()
        expect(['portrait', 'landscape']).toContain(device.orientation)
        expect(['mobile', 'tablet', 'desktop', 'tv', 'watch']).toContain(device.category)
        expect(typeof device.touchEnabled).toBe('boolean')
        expect(typeof device.hoverEnabled).toBe('boolean')
      })
    })
  })

  describe('Device Category Detection', () => {
    it('should correctly categorize mobile devices', () => {
      expect(getDeviceCategory(375)).toBe('mobile')
      expect(getDeviceCategory(414)).toBe('mobile')
      expect(getDeviceCategory(767)).toBe('mobile')
    })

    it('should correctly categorize tablet devices', () => {
      expect(getDeviceCategory(768)).toBe('tablet')
      expect(getDeviceCategory(820)).toBe('tablet')
      expect(getDeviceCategory(1023)).toBe('tablet')
    })

    it('should correctly categorize desktop devices', () => {
      expect(getDeviceCategory(1024)).toBe('desktop')
      expect(getDeviceCategory(1440)).toBe('desktop')
      expect(getDeviceCategory(1919)).toBe('desktop')
    })

    it('should correctly categorize TV/large displays', () => {
      expect(getDeviceCategory(1920)).toBe('tv')
      expect(getDeviceCategory(3840)).toBe('tv')
    })
  })

  describe('Device Capability Detection', () => {
    it('should detect hover support correctly', () => {
      expect(supportsHover('desktop-1080p')).toBe(true)
      expect(supportsHover('laptop-13')).toBe(true)
      expect(supportsHover('iphone-12')).toBe(false)
      expect(supportsHover('ipad-air')).toBe(false)
    })

    it('should detect touch support correctly', () => {
      expect(supportsTouch('iphone-12')).toBe(true)
      expect(supportsTouch('ipad-air')).toBe(true)
      expect(supportsTouch('surface-pro')).toBe(true)
      expect(supportsTouch('desktop-1080p')).toBe(false)
    })
  })

  describe('Device Simulation', () => {
    it('should simulate device viewport correctly', () => {
      simulateDevice('iphone-12')

      expect(window.innerWidth).toBe(390)
      expect(window.innerHeight).toBe(844)
      expect(window.devicePixelRatio).toBe(3)
    })

    it('should handle invalid device keys gracefully', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      simulateDevice('invalid-device')

      expect(consoleSpy).toHaveBeenCalledWith('Device configuration not found: invalid-device')
      consoleSpy.mockRestore()
    })
  })

  describe('Responsive Test Cases Generation', () => {
    it('should generate comprehensive test cases for all devices', () => {
      const testCases = generateResponsiveTestCases()

      expect(testCases).toHaveLength(Object.keys(deviceConfigs).length)

      testCases.forEach((testCase) => {
        expect(testCase.name).toBeTruthy()
        expect(testCase.device).toBeTruthy()
        expect(testCase.expectations).toBeInstanceOf(Array)
        expect(testCase.expectations.length).toBeGreaterThan(0)
      })
    })

    it('should include device-specific expectations', () => {
      const testCases = generateResponsiveTestCases()

      const mobileCase = testCases.find((tc) => tc.device.category === 'mobile')
      const desktopCase = testCases.find((tc) => tc.device.category === 'desktop')

      expect(mobileCase).toBeTruthy()
      expect(desktopCase).toBeTruthy()

      if (mobileCase && desktopCase) {
        expect(mobileCase.expectations).toContain('Touch targets should be at least 44px')
        expect(desktopCase.expectations).toContain('Hover states should work')
      }
    })
  })

  describe('Device Classes Generation', () => {
    it('should generate appropriate device classes', () => {
      const mobileDevice = deviceConfigs['iphone-12']
      const desktopDevice = deviceConfigs['desktop-1080p']

      if (!mobileDevice || !desktopDevice) {
        throw new Error('Required device configs not found')
      }

      const mobileClasses = getDeviceClasses(mobileDevice)
      const desktopClasses = getDeviceClasses(desktopDevice)

      expect(mobileClasses).toContain('device-mobile')
      expect(mobileClasses).toContain('touch-enabled')
      expect(mobileClasses).toContain('orientation-portrait')

      expect(desktopClasses).toContain('device-desktop')
      expect(desktopClasses).toContain('hover-enabled')
      expect(desktopClasses).toContain('orientation-landscape')
    })

    it('should generate responsive container classes', () => {
      const mobileDevice = deviceConfigs['iphone-12']
      const desktopDevice = deviceConfigs['desktop-1080p']

      if (!mobileDevice || !desktopDevice) {
        throw new Error('Required device configs not found')
      }

      const mobileContainer = getResponsiveContainerClasses(mobileDevice)
      const desktopContainer = getResponsiveContainerClasses(desktopDevice)

      expect(mobileContainer).toContain('container-mobile')
      expect(mobileContainer).toContain('px-4')

      expect(desktopContainer).toContain('container-desktop')
      expect(desktopContainer).toContain('px-8')
    })

    it('should generate device typography classes', () => {
      const mobileDevice = deviceConfigs['iphone-12']
      const desktopDevice = deviceConfigs['desktop-1080p']

      if (!mobileDevice || !desktopDevice) {
        throw new Error('Required device configs not found')
      }

      const mobileTypography = getDeviceTypographyClasses(mobileDevice)
      const desktopTypography = getDeviceTypographyClasses(desktopDevice)

      expect(mobileTypography).toContain('text-sm')
      expect(desktopTypography).toContain('text-lg')
    })
  })

  describe('Responsive Design Validation', () => {
    it('should validate responsive design requirements', () => {
      // Create a mock element
      const mockElement = document.createElement('div')
      mockElement.style.width = '300px'
      mockElement.style.height = '200px'

      const mobileDevice = deviceConfigs['iphone-12']

      if (!mobileDevice) {
        throw new Error('Required mobile device config not found')
      }

      const validation = validateResponsiveDesign(mockElement, mobileDevice)

      expect(validation).toHaveProperty('passed')
      expect(validation).toHaveProperty('issues')
      expect(validation).toHaveProperty('warnings')
      expect(Array.isArray(validation.issues)).toBe(true)
      expect(Array.isArray(validation.warnings)).toBe(true)
    })

    it('should detect horizontal overflow', () => {
      const mockElement = document.createElement('div')
      Object.defineProperty(mockElement, 'scrollWidth', {
        value: 500,
        configurable: true,
      })

      const mobileDevice = deviceConfigs['iphone-12'] // 390px width

      if (!mobileDevice) {
        throw new Error('Required mobile device config not found')
      }

      const validation = validateResponsiveDesign(mockElement, mobileDevice)

      expect(validation.passed).toBe(false)
      expect(validation.issues.some((issue) => issue.includes('Horizontal overflow'))).toBe(true)
    })
  })

  describe('Cross-Device Testing', () => {
    it('should test across all device categories', () => {
      const deviceCategories = new Set()

      Object.values(deviceConfigs).forEach((device) => {
        deviceCategories.add(device.category)
      })

      expect(deviceCategories.has('mobile')).toBe(true)
      expect(deviceCategories.has('tablet')).toBe(true)
      expect(deviceCategories.has('desktop')).toBe(true)
      expect(deviceCategories.has('tv')).toBe(true)
    })

    it('should handle different orientations', () => {
      const portraitDevices = Object.values(deviceConfigs).filter(
        (d) => d.orientation === 'portrait',
      )
      const landscapeDevices = Object.values(deviceConfigs).filter(
        (d) => d.orientation === 'landscape',
      )

      expect(portraitDevices.length).toBeGreaterThan(0)
      expect(landscapeDevices.length).toBeGreaterThan(0)
    })

    it('should cover different pixel ratios', () => {
      const pixelRatios = new Set(Object.values(deviceConfigs).map((d) => d.pixelRatio))

      expect(pixelRatios.has(1)).toBe(true) // Standard displays
      expect(pixelRatios.has(2)).toBe(true) // Retina displays
      expect(pixelRatios.has(3)).toBe(true) // High-DPI mobile displays
    })
  })

  describe('Performance Testing Utilities', () => {
    it('should provide performance testing framework', () => {
      // Test that the performance testing utilities are available
      expect(typeof generateResponsiveTestCases).toBe('function')
      expect(typeof validateResponsiveDesign).toBe('function')
      expect(typeof simulateDevice).toBe('function')
    })
  })
})
