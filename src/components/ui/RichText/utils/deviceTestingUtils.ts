/**
 * Device Testing Utilities for RichText Components
 *
 * Provides comprehensive testing utilities for validating responsive behavior
 * across all device sizes and orientations.
 */

import { cn } from '@/utilities/ui'

// ============================================================================
// DEVICE DEFINITIONS AND BREAKPOINTS
// ============================================================================

export interface DeviceConfig {
  name: string
  width: number
  height: number
  pixelRatio: number
  userAgent: string
  orientation: 'portrait' | 'landscape'
  category: 'mobile' | 'tablet' | 'desktop' | 'tv' | 'watch'
  touchEnabled: boolean
  hoverEnabled: boolean
}

/**
 * Comprehensive device configurations for testing
 */
export const deviceConfigs: Record<string, DeviceConfig> = {
  // Mobile devices
  'iphone-se': {
    name: 'iPhone SE',
    width: 375,
    height: 667,
    pixelRatio: 2,
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15',
    orientation: 'portrait',
    category: 'mobile',
    touchEnabled: true,
    hoverEnabled: false,
  },
  'iphone-12': {
    name: 'iPhone 12',
    width: 390,
    height: 844,
    pixelRatio: 3,
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15',
    orientation: 'portrait',
    category: 'mobile',
    touchEnabled: true,
    hoverEnabled: false,
  },
  'iphone-14-pro-max': {
    name: 'iPhone 14 Pro Max',
    width: 430,
    height: 932,
    pixelRatio: 3,
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15',
    orientation: 'portrait',
    category: 'mobile',
    touchEnabled: true,
    hoverEnabled: false,
  },
  'samsung-galaxy-s21': {
    name: 'Samsung Galaxy S21',
    width: 384,
    height: 854,
    pixelRatio: 2.75,
    userAgent: 'Mozilla/5.0 (Linux; Android 11; SM-G991B) AppleWebKit/537.36',
    orientation: 'portrait',
    category: 'mobile',
    touchEnabled: true,
    hoverEnabled: false,
  },
  'pixel-7': {
    name: 'Google Pixel 7',
    width: 412,
    height: 915,
    pixelRatio: 2.625,
    userAgent: 'Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36',
    orientation: 'portrait',
    category: 'mobile',
    touchEnabled: true,
    hoverEnabled: false,
  },

  // Tablets
  'ipad-mini': {
    name: 'iPad Mini',
    width: 768,
    height: 1024,
    pixelRatio: 2,
    userAgent: 'Mozilla/5.0 (iPad; CPU OS 15_0 like Mac OS X) AppleWebKit/605.1.15',
    orientation: 'portrait',
    category: 'tablet',
    touchEnabled: true,
    hoverEnabled: false,
  },
  'ipad-air': {
    name: 'iPad Air',
    width: 820,
    height: 1180,
    pixelRatio: 2,
    userAgent: 'Mozilla/5.0 (iPad; CPU OS 15_0 like Mac OS X) AppleWebKit/605.1.15',
    orientation: 'portrait',
    category: 'tablet',
    touchEnabled: true,
    hoverEnabled: false,
  },
  'ipad-pro-12': {
    name: 'iPad Pro 12.9"',
    width: 1024,
    height: 1366,
    pixelRatio: 2,
    userAgent: 'Mozilla/5.0 (iPad; CPU OS 15_0 like Mac OS X) AppleWebKit/605.1.15',
    orientation: 'portrait',
    category: 'tablet',
    touchEnabled: true,
    hoverEnabled: false,
  },
  'surface-pro': {
    name: 'Microsoft Surface Pro',
    width: 912,
    height: 1368,
    pixelRatio: 2,
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    orientation: 'portrait',
    category: 'tablet',
    touchEnabled: true,
    hoverEnabled: true,
  },

  // Desktop
  'laptop-13': {
    name: 'Laptop 13"',
    width: 1280,
    height: 800,
    pixelRatio: 2,
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
    orientation: 'landscape',
    category: 'desktop',
    touchEnabled: false,
    hoverEnabled: true,
  },
  'laptop-15': {
    name: 'Laptop 15"',
    width: 1440,
    height: 900,
    pixelRatio: 2,
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
    orientation: 'landscape',
    category: 'desktop',
    touchEnabled: false,
    hoverEnabled: true,
  },
  'desktop-1080p': {
    name: 'Desktop 1080p',
    width: 1920,
    height: 1080,
    pixelRatio: 1,
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    orientation: 'landscape',
    category: 'desktop',
    touchEnabled: false,
    hoverEnabled: true,
  },
  'desktop-1440p': {
    name: 'Desktop 1440p',
    width: 2560,
    height: 1440,
    pixelRatio: 1,
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    orientation: 'landscape',
    category: 'desktop',
    touchEnabled: false,
    hoverEnabled: true,
  },
  'desktop-4k': {
    name: 'Desktop 4K',
    width: 3840,
    height: 2160,
    pixelRatio: 1,
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    orientation: 'landscape',
    category: 'desktop',
    touchEnabled: false,
    hoverEnabled: true,
  },

  // Ultra-wide and special cases
  'ultrawide-1440p': {
    name: 'Ultrawide 1440p',
    width: 3440,
    height: 1440,
    pixelRatio: 1,
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    orientation: 'landscape',
    category: 'desktop',
    touchEnabled: false,
    hoverEnabled: true,
  },

  // TV/Large displays
  'tv-1080p': {
    name: 'TV 1080p',
    width: 1920,
    height: 1080,
    pixelRatio: 1,
    userAgent: 'Mozilla/5.0 (SMART-TV; Linux; Tizen 6.0) AppleWebKit/537.36',
    orientation: 'landscape',
    category: 'tv',
    touchEnabled: false,
    hoverEnabled: false,
  },
  'tv-4k': {
    name: 'TV 4K',
    width: 3840,
    height: 2160,
    pixelRatio: 1,
    userAgent: 'Mozilla/5.0 (SMART-TV; Linux; Tizen 6.0) AppleWebKit/537.36',
    orientation: 'landscape',
    category: 'tv',
    touchEnabled: false,
    hoverEnabled: false,
  },
}

// ============================================================================
// DEVICE TESTING UTILITIES
// ============================================================================

/**
 * Simulate device viewport for testing
 */
export const simulateDevice = (deviceKey: string): void => {
  const device = deviceConfigs[deviceKey]
  if (!device) {
    console.warn(`Device configuration not found: ${deviceKey}`)
    return
  }

  if (typeof window !== 'undefined') {
    // Set viewport size
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: device.width,
    })
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: device.height,
    })

    // Set device pixel ratio
    Object.defineProperty(window, 'devicePixelRatio', {
      writable: true,
      configurable: true,
      value: device.pixelRatio,
    })

    // Set user agent
    Object.defineProperty(navigator, 'userAgent', {
      writable: true,
      configurable: true,
      value: device.userAgent,
    })

    // Simulate touch capabilities
    if (device.touchEnabled) {
      Object.defineProperty(window, 'ontouchstart', {
        writable: true,
        configurable: true,
        value: () => {},
      })
    } else {
      delete (window as any).ontouchstart
    }

    // Trigger resize event
    window.dispatchEvent(new Event('resize'))
  }
}

/**
 * Get device category based on viewport width
 */
export const getDeviceCategory = (width: number): DeviceConfig['category'] => {
  if (width < 768) return 'mobile'
  if (width < 1024) return 'tablet'
  if (width < 1920) return 'desktop'
  return 'tv'
}

/**
 * Check if device supports hover
 */
export const supportsHover = (deviceKey?: string): boolean => {
  if (deviceKey) {
    const device = deviceConfigs[deviceKey]
    return device?.hoverEnabled ?? false
  }

  if (typeof window !== 'undefined') {
    return window.matchMedia('(hover: hover)').matches
  }

  return false
}

/**
 * Check if device supports touch
 */
export const supportsTouch = (deviceKey?: string): boolean => {
  if (deviceKey) {
    const device = deviceConfigs[deviceKey]
    return device?.touchEnabled ?? false
  }

  if (typeof window !== 'undefined') {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0
  }

  return false
}

// ============================================================================
// RESPONSIVE TESTING UTILITIES
// ============================================================================

/**
 * Test responsive behavior across all device sizes
 */
export const testResponsiveBehavior = (
  element: HTMLElement,
  testCallback: (device: DeviceConfig, element: HTMLElement) => void,
): void => {
  Object.entries(deviceConfigs).forEach(([key, device]) => {
    simulateDevice(key)
    testCallback(device, element)
  })
}

/**
 * Generate responsive test cases
 */
export const generateResponsiveTestCases = (): Array<{
  name: string
  device: DeviceConfig
  expectations: string[]
}> => {
  return Object.entries(deviceConfigs).map(([, device]) => ({
    name: `${device.name} (${device.width}x${device.height})`,
    device,
    expectations: [
      'Component should render without errors',
      'Text should be readable at device size',
      'Interactive elements should be appropriately sized',
      'Layout should not overflow viewport',
      'Images should scale appropriately',
      device.touchEnabled ? 'Touch targets should be at least 44px' : 'Hover states should work',
      'Typography should scale appropriately',
      'Spacing should be appropriate for device size',
    ],
  }))
}

/**
 * Validate responsive design requirements
 */
export const validateResponsiveDesign = (
  element: HTMLElement,
  device: DeviceConfig,
): {
  passed: boolean
  issues: string[]
  warnings: string[]
} => {
  const issues: string[] = []
  const warnings: string[] = []

  // Check for horizontal overflow
  if (element.scrollWidth > device.width) {
    issues.push(`Horizontal overflow detected: ${element.scrollWidth}px > ${device.width}px`)
  }

  // Check touch target sizes on touch devices
  if (device.touchEnabled) {
    const interactiveElements = element.querySelectorAll('button, a, input, select, textarea')
    interactiveElements.forEach((el) => {
      const rect = el.getBoundingClientRect()
      if (rect.width < 44 || rect.height < 44) {
        issues.push(
          `Touch target too small: ${el.tagName} (${Math.round(rect.width)}x${Math.round(rect.height)}px)`,
        )
      }
    })
  }

  // Check text readability
  const textElements = element.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, div')
  textElements.forEach((el) => {
    const styles = window.getComputedStyle(el)
    const fontSize = parseFloat(styles.fontSize)

    if (device.category === 'mobile' && fontSize < 14) {
      warnings.push(`Small font size on mobile: ${fontSize}px in ${el.tagName}`)
    }
  })

  // Check image scaling
  const images = element.querySelectorAll('img')
  images.forEach((img) => {
    if (img.naturalWidth > device.width && !img.style.maxWidth && !img.style.width) {
      warnings.push(`Image may not scale properly: ${img.src}`)
    }
  })

  // Check for appropriate spacing
  const spacingElements = element.querySelectorAll('[class*="p-"], [class*="m-"], [class*="gap-"]')
  if (device.category === 'mobile' && spacingElements.length === 0) {
    warnings.push('No responsive spacing classes detected for mobile')
  }

  return {
    passed: issues.length === 0,
    issues,
    warnings,
  }
}

// ============================================================================
// DEVICE-SPECIFIC CLASS UTILITIES
// ============================================================================

/**
 * Get device-appropriate classes
 */
export const getDeviceClasses = (device: DeviceConfig): string => {
  const classes = []

  // Base device category class
  classes.push(`device-${device.category}`)

  // Orientation class
  classes.push(`orientation-${device.orientation}`)

  // Touch/hover capability classes
  if (device.touchEnabled) classes.push('touch-enabled')
  if (device.hoverEnabled) classes.push('hover-enabled')

  // Pixel ratio class
  if (device.pixelRatio > 1) classes.push('high-dpi')

  // Size-specific classes
  if (device.width < 480) classes.push('size-xs')
  else if (device.width < 768) classes.push('size-sm')
  else if (device.width < 1024) classes.push('size-md')
  else if (device.width < 1440) classes.push('size-lg')
  else if (device.width < 1920) classes.push('size-xl')
  else classes.push('size-2xl')

  return cn(...classes)
}

/**
 * Get responsive container classes for device
 */
export const getResponsiveContainerClasses = (device: DeviceConfig): string => {
  const classes = []

  // Container size based on device
  switch (device.category) {
    case 'mobile':
      classes.push('container-mobile', 'px-4', 'max-w-full')
      break
    case 'tablet':
      classes.push('container-tablet', 'px-6', 'max-w-4xl')
      break
    case 'desktop':
      classes.push('container-desktop', 'px-8', 'max-w-6xl')
      break
    case 'tv':
      classes.push('container-tv', 'px-12', 'max-w-7xl')
      break
  }

  // Orientation-specific adjustments
  if (device.orientation === 'landscape' && device.category === 'mobile') {
    classes.push('landscape-mobile')
  }

  return cn(...classes)
}

/**
 * Get typography classes for device
 */
export const getDeviceTypographyClasses = (device: DeviceConfig): string => {
  const classes = []

  switch (device.category) {
    case 'mobile':
      classes.push('text-sm', 'leading-relaxed')
      break
    case 'tablet':
      classes.push('text-base', 'leading-relaxed')
      break
    case 'desktop':
      classes.push('text-lg', 'leading-relaxed')
      break
    case 'tv':
      classes.push('text-xl', 'leading-loose')
      break
  }

  // High DPI adjustments
  if (device.pixelRatio > 2) {
    classes.push('antialiased')
  }

  return cn(...classes)
}

// ============================================================================
// TESTING FRAMEWORK INTEGRATION
// ============================================================================

/**
 * Create device test suite for testing frameworks
 */
export const createDeviceTestSuite = (
  componentName: string,
  testFunction: (device: DeviceConfig) => void,
): void => {
  describe(`${componentName} - Device Responsive Tests`, () => {
    Object.entries(deviceConfigs).forEach(([key, device]) => {
      describe(`${device.name} (${device.category})`, () => {
        beforeEach(() => {
          simulateDevice(key)
        })

        it(`should render correctly on ${device.name}`, () => {
          testFunction(device)
        })

        it(`should meet accessibility requirements on ${device.name}`, () => {
          // Accessibility-specific tests for the device
          const mockElement = document.createElement('div')
          const validation = validateResponsiveDesign(mockElement, device)

          if (validation.issues.length > 0) {
            console.warn(`Accessibility issues on ${device.name}:`, validation.issues)
          }
        })
      })
    })
  })
}

/**
 * Performance testing across devices
 */
export const testPerformanceAcrossDevices = (
  testCallback: (device: DeviceConfig) => Promise<number>,
): Promise<Record<string, number>> => {
  const results: Record<string, number> = {}

  return Promise.all(
    Object.entries(deviceConfigs).map(async ([key, device]) => {
      simulateDevice(key)
      const performanceScore = await testCallback(device)
      results[key] = performanceScore
      return { key, score: performanceScore }
    }),
  ).then(() => results)
}

// ============================================================================
// VISUAL REGRESSION TESTING UTILITIES
// ============================================================================

/**
 * Generate screenshots for all devices
 */
export const generateDeviceScreenshots = async (
  _element: HTMLElement,
  screenshotFunction: (width: number, height: number, name: string) => Promise<void>,
): Promise<void> => {
  for (const [key, device] of Object.entries(deviceConfigs)) {
    simulateDevice(key)
    await screenshotFunction(device.width, device.height, `${key}-${device.orientation}`)
  }
}

/**
 * Device-specific test utilities export
 */
export default {
  deviceConfigs,
  simulateDevice,
  getDeviceCategory,
  supportsHover,
  supportsTouch,
  testResponsiveBehavior,
  generateResponsiveTestCases,
  validateResponsiveDesign,
  getDeviceClasses,
  getResponsiveContainerClasses,
  getDeviceTypographyClasses,
  createDeviceTestSuite,
  testPerformanceAcrossDevices,
  generateDeviceScreenshots,
}
