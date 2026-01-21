/**
 * @jest-environment jsdom
 */

import React from 'react'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { jest } from '@jest/globals'

import { OptimizedImage } from '../imageOptimization'
import { ImagePerformanceMonitor } from '../imagePerformanceMonitor'
import { ImageOptimizationConfigManager } from '../imageOptimizationConfig'

// Mock Next.js Image component
jest.mock('next/image', () => {
  return function MockImage({ src, alt, onLoadingComplete, onError, ...props }: any) {
    return (
      <img
        src={src}
        alt={alt}
        {...props}
        onLoad={() => onLoadingComplete?.()}
        onError={() => onError?.(new Error('Image failed to load'))}
        data-testid="optimized-image"
      />
    )
  }
})

// Mock utilities
jest.mock('@/utilities/getMediaUrl', () => ({
  getMediaUrl: (url: string, cacheTag?: string) =>
    `https://example.com${url}${cacheTag ? `?v=${cacheTag}` : ''}`,
}))

jest.mock('@/utilities/ui', () => ({
  cn: (...classes: any[]) => classes.filter(Boolean).join(' '),
}))

// Mock IntersectionObserver
const mockIntersectionObserver = jest.fn()
mockIntersectionObserver.mockReturnValue({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
})
;(window as any).IntersectionObserver = mockIntersectionObserver

// Mock performance observer
const mockPerformanceObserver = jest.fn()
mockPerformanceObserver.mockReturnValue({
  observe: jest.fn(),
  disconnect: jest.fn(),
})
;(window as any).PerformanceObserver = mockPerformanceObserver
;(mockPerformanceObserver as any).supportedEntryTypes = ['measure', 'navigation']

describe('OptimizedImage', () => {
  const mockResource = {
    id: 1,
    url: '/media/test-image.jpg',
    alt: 'Test image',
    width: 800,
    height: 600,
    mimeType: 'image/jpeg',
    filename: 'test-image.jpg',
    filesize: 150000,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Basic Rendering', () => {
    it('renders with resource prop', () => {
      render(<OptimizedImage resource={mockResource} />)

      const image = screen.getByTestId('optimized-image')
      expect(image).toBeInTheDocument()
      expect(image).toHaveAttribute('alt', 'Test image')
      expect(image).toHaveAttribute('src', expect.stringContaining('/media/test-image.jpg'))
    })

    it('renders with src prop', () => {
      render(<OptimizedImage src="/test.jpg" alt="Test" />)

      const image = screen.getByTestId('optimized-image')
      expect(image).toBeInTheDocument()
      expect(image).toHaveAttribute('src', '/test.jpg')
      expect(image).toHaveAttribute('alt', 'Test')
    })

    it('renders loading skeleton when intersection observer is enabled and not intersected', () => {
      render(
        <OptimizedImage
          resource={mockResource}
          enableIntersectionObserver={true}
          loadingStrategy="intersection"
        />,
      )

      // Should show loading skeleton initially
      expect(screen.queryByTestId('optimized-image')).not.toBeInTheDocument()
    })
  })

  describe('Loading Strategies', () => {
    it('loads immediately with eager strategy', () => {
      render(<OptimizedImage resource={mockResource} loadingStrategy="eager" />)

      const image = screen.getByTestId('optimized-image')
      expect(image).toBeInTheDocument()
    })

    it('loads immediately with critical resource flag', () => {
      render(<OptimizedImage resource={mockResource} criticalResource={true} />)

      const image = screen.getByTestId('optimized-image')
      expect(image).toBeInTheDocument()
    })

    it('loads immediately with priority flag', () => {
      render(<OptimizedImage resource={mockResource} priority={true} />)

      const image = screen.getByTestId('optimized-image')
      expect(image).toBeInTheDocument()
    })
  })

  describe('Error Handling', () => {
    it('shows error fallback when image fails to load', async () => {
      const onError = jest.fn()

      render(<OptimizedImage src="/broken-image.jpg" alt="Broken" onError={onError} />)

      const image = screen.getByTestId('optimized-image')
      fireEvent.error(image)

      await waitFor(() => {
        expect(onError).toHaveBeenCalledWith(expect.any(Error))
      })
    })

    it('handles error gracefully', async () => {
      render(<OptimizedImage src="/broken-image.jpg" alt="Broken" />)

      const image = screen.getByTestId('optimized-image')
      fireEvent.error(image)

      await waitFor(() => {
        expect(screen.getByText(/Retry \(1\/2\)/)).toBeInTheDocument()
      })

      const retryButton = screen.getByText(/Retry/)
      fireEvent.click(retryButton)

      // Should attempt to load again
      expect(screen.getByTestId('optimized-image')).toBeInTheDocument()
    })
  })

  describe('Performance Monitoring', () => {
    it('calls performance monitoring callbacks', () => {
      const onLoadStart = jest.fn()
      const onLoadComplete = jest.fn()

      render(
        <OptimizedImage
          resource={mockResource}
          onLoadStart={onLoadStart}
          onLoadComplete={onLoadComplete}
        />,
      )

      const image = screen.getByTestId('optimized-image')
      fireEvent.load(image)

      expect(onLoadComplete).toHaveBeenCalled()
    })
  })

  describe('Responsive Behavior', () => {
    it('generates appropriate sizes attribute', () => {
      const customBreakpoints = {
        mobile: 640,
        tablet: 768,
        desktop: 1024,
      }

      render(<OptimizedImage resource={mockResource} breakpoints={customBreakpoints} />)

      const image = screen.getByTestId('optimized-image')
      expect(image).toHaveAttribute('sizes')
    })
  })

  describe('Format Optimization', () => {
    it('applies WebP optimization when enabled', () => {
      render(<OptimizedImage resource={mockResource} enableWebP={true} />)

      const image = screen.getByTestId('optimized-image')
      expect(image).toBeInTheDocument()
    })

    it('applies AVIF optimization when enabled', () => {
      render(<OptimizedImage resource={mockResource} enableAVIF={true} />)

      const image = screen.getByTestId('optimized-image')
      expect(image).toBeInTheDocument()
    })
  })
})

describe('ImagePerformanceMonitor', () => {
  let monitor: ImagePerformanceMonitor

  beforeEach(() => {
    monitor = new ImagePerformanceMonitor()
  })

  describe('Metrics Collection', () => {
    it('records image load start', () => {
      monitor.startImageLoad('/test.jpg', {
        dimensions: { width: 800, height: 600 },
        quality: 85,
        format: 'jpeg',
      })

      const metrics = monitor.getImageMetrics('/test.jpg')
      expect(metrics).toBeUndefined() // Not completed yet
    })

    it('records image load completion', () => {
      monitor.startImageLoad('/test.jpg')
      monitor.completeImageLoad('/test.jpg', {
        fileSize: 150000,
        format: 'jpeg',
        dimensions: { width: 800, height: 600 },
      })

      const metrics = monitor.getImageMetrics('/test.jpg')
      expect(metrics).toBeDefined()
      expect(metrics?.format).toBe('jpeg')
      expect(metrics?.fileSize).toBe(150000)
    })

    it('records image load errors', () => {
      const error = new Error('Failed to load')
      monitor.recordImageError('/test.jpg', error)

      // Error should be recorded in events
      const summary = monitor.getPerformanceSummary()
      expect(summary.totalImages).toBe(0) // No successful loads
    })
  })

  describe('Performance Analysis', () => {
    beforeEach(() => {
      // Add some test data
      monitor.startImageLoad('/fast.jpg')
      monitor.completeImageLoad('/fast.jpg', {
        loadTime: 500,
        format: 'webp',
        dimensions: { width: 400, height: 300 },
        fileSize: 50000,
      })

      monitor.startImageLoad('/slow.jpg')
      monitor.completeImageLoad('/slow.jpg', {
        loadTime: 3000,
        format: 'jpeg',
        dimensions: { width: 1200, height: 800 },
        fileSize: 500000,
      })
    })

    it('calculates performance summary', () => {
      const summary = monitor.getPerformanceSummary()

      expect(summary.totalImages).toBe(2)
      expect(summary.averageLoadTime).toBe(1750) // (500 + 3000) / 2
      expect(summary.formatDistribution).toEqual({
        webp: 1,
        jpeg: 1,
      })
    })

    it('generates optimization recommendations', () => {
      const recommendations = monitor.getOptimizationRecommendations()

      expect(recommendations).toBeInstanceOf(Array)
      expect(recommendations.length).toBeGreaterThan(0)

      // Should recommend WebP for JPEG images
      const formatRecommendation = recommendations.find((r) => r.type === 'format')
      expect(formatRecommendation).toBeDefined()
    })

    it('exports metrics as JSON', () => {
      const exported = monitor.exportMetrics()
      const parsed = JSON.parse(exported)

      expect(parsed).toHaveProperty('metrics')
      expect(parsed).toHaveProperty('events')
      expect(parsed).toHaveProperty('summary')
      expect(parsed).toHaveProperty('recommendations')
    })
  })
})

describe('ImageOptimizationConfigManager', () => {
  let configManager: ImageOptimizationConfigManager

  beforeEach(() => {
    configManager = new ImageOptimizationConfigManager()
  })

  describe('Configuration Management', () => {
    it('provides default configuration', () => {
      const config = configManager.getConfig()

      expect(config.defaultQuality).toBe(85)
      expect(config.enableWebP).toBe(true)
      expect(config.enableAVIF).toBe(false)
      expect(config.defaultLoadingStrategy).toBe('intersection')
    })

    it('updates configuration', () => {
      configManager.updateConfig({
        defaultQuality: 90,
        enableAVIF: true,
      })

      const config = configManager.getConfig()
      expect(config.defaultQuality).toBe(90)
      expect(config.enableAVIF).toBe(true)
    })

    it('applies presets', () => {
      configManager.applyPreset('performance')

      const config = configManager.getConfig()
      expect(config.defaultQuality).toBe(75)
      expect(config.enableAVIF).toBe(true)
    })

    it('validates configuration', () => {
      // Valid configuration
      let validation = configManager.validateConfig()
      expect(validation.isValid).toBe(true)
      expect(validation.errors).toHaveLength(0)

      // Invalid configuration
      configManager.updateConfig({ defaultQuality: 150 })
      validation = configManager.validateConfig()
      expect(validation.isValid).toBe(false)
      expect(validation.errors.length).toBeGreaterThan(0)
    })
  })

  describe('Responsive Configuration', () => {
    it('generates responsive configurations', () => {
      const responsiveConfigs = configManager.getResponsiveConfigs()

      expect(responsiveConfigs).toBeInstanceOf(Array)
      expect(responsiveConfigs.length).toBeGreaterThan(0)

      const mobileConfig = responsiveConfigs.find((c) => c.breakpoint === 'mobile')
      expect(mobileConfig).toBeDefined()
      expect(mobileConfig?.width).toBe(640)
    })

    it('generates sizes attribute', () => {
      const sizes = configManager.generateSizesAttribute()

      expect(sizes).toContain('(max-width:')
      expect(sizes).toContain('px)')
    })
  })

  describe('Configuration Persistence', () => {
    it('exports configuration as JSON', () => {
      const exported = configManager.exportConfig()
      const parsed = JSON.parse(exported)

      expect(parsed).toHaveProperty('defaultQuality')
      expect(parsed).toHaveProperty('enableWebP')
    })

    it('imports configuration from JSON', () => {
      const customConfig = {
        defaultQuality: 95,
        enableAVIF: true,
        enableWebP: false,
      }

      configManager.importConfig(JSON.stringify(customConfig))

      const config = configManager.getConfig()
      expect(config.defaultQuality).toBe(95)
      expect(config.enableAVIF).toBe(true)
      expect(config.enableWebP).toBe(false)
    })
  })
})

describe('Integration Tests', () => {
  it('integrates performance monitoring with optimized image', async () => {
    const monitor = new ImagePerformanceMonitor()

    render(
      <OptimizedImage
        resource={{
          id: 1,
          url: '/test.jpg',
          alt: 'Test',
          width: 800,
          height: 600,
          mimeType: 'image/jpeg',
          filename: 'test.jpg',
          filesize: 150000,
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z',
        }}
        onLoadStart={() => monitor.startImageLoad('/test.jpg')}
        onLoadComplete={() => monitor.completeImageLoad('/test.jpg')}
      />,
    )

    const image = screen.getByTestId('optimized-image')
    fireEvent.load(image)

    await waitFor(() => {
      const metrics = monitor.getImageMetrics('/test.jpg')
      expect(metrics).toBeDefined()
    })
  })

  it('applies configuration to optimized image', () => {
    const configManager = new ImageOptimizationConfigManager({
      defaultQuality: 95,
      enableWebP: true,
      enableAVIF: true,
    })

    const config = configManager.getConfig()

    render(
      <OptimizedImage
        resource={{
          id: 1,
          url: '/test.jpg',
          alt: 'Test',
          width: 800,
          height: 600,
          mimeType: 'image/jpeg',
          filename: 'test.jpg',
          filesize: 150000,
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z',
        }}
        quality={config.defaultQuality}
        enableWebP={config.enableWebP}
        enableAVIF={config.enableAVIF}
      />,
    )

    const image = screen.getByTestId('optimized-image')
    expect(image).toBeInTheDocument()
  })
})
