/**
 * RichText Cross-Device Integration Tests
 *
 * Tests integration and consistency across different device types and sizes
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { render, fireEvent } from '@testing-library/react'
import React from 'react'
import { RichText } from '@/components/ui/RichText'
import {
  deviceConfigs,
  simulateDevice,
  testPerformanceAcrossDevices,
} from '@/components/ui/RichText/utils/deviceTestingUtils'
import { createMockRichTextData } from '../../utils/testHelpers'

// Complex mock data for integration testing
const complexRichTextData = createMockRichTextData({
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
        type: 'heading',
        format: '',
        indent: 0,
        version: 1,
        direction: null,
        textFormat: 0,
        textStyle: '',
        tag: 'h1',
        children: [
          {
            type: 'text',
            format: 1, // bold
            style: '',
            mode: 'normal',
            detail: 0,
            text: 'Cross-Device Integration Test',
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
            text: 'This content should render consistently across all device types and sizes. ',
            version: 1,
          },
          {
            type: 'link',
            format: '',
            indent: 0,
            version: 1,
            direction: null,
            textFormat: 0,
            textStyle: '',
            rel: null,
            target: '_blank',
            title: 'External Link',
            url: 'https://example.com',
            children: [
              {
                type: 'text',
                format: 0,
                style: '',
                mode: 'normal',
                detail: 0,
                text: 'This is a test link',
                version: 1,
              },
            ],
          },
          {
            type: 'text',
            format: 0,
            style: '',
            mode: 'normal',
            detail: 0,
            text: ' that should work on all devices.',
            version: 1,
          },
        ],
      },
    ],
  },
})

describe('RichText Cross-Device Integration', () => {
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

  describe('Content Consistency Across Devices', () => {
    it('should render the same content structure on all devices', () => {
      const deviceResults: Record<
        string,
        { headings: number; paragraphs: number; links: number; lists: number }
      > = {}

      Object.entries(deviceConfigs).forEach(([deviceKey]) => {
        simulateDevice(deviceKey)

        const { container } = render(<RichText data={complexRichTextData} />)

        deviceResults[deviceKey] = {
          headings: container.querySelectorAll('h1, h2, h3, h4, h5, h6').length,
          paragraphs: container.querySelectorAll('p').length,
          links: container.querySelectorAll('a').length,
          lists: container.querySelectorAll('ul, ol').length,
        }
      })

      // All devices should have the same content structure
      const firstDevice = Object.values(deviceResults)[0]
      if (firstDevice) {
        Object.values(deviceResults).forEach((result) => {
          expect(result.headings).toBe(firstDevice.headings)
          expect(result.paragraphs).toBe(firstDevice.paragraphs)
          expect(result.links).toBe(firstDevice.links)
          expect(result.lists).toBe(firstDevice.lists)
        })
      }
    })

    it('should maintain semantic HTML structure across devices', () => {
      Object.entries(deviceConfigs).forEach(([deviceKey]) => {
        simulateDevice(deviceKey)

        const { container } = render(<RichText data={complexRichTextData} />)

        // Check for proper heading hierarchy
        const h1 = container.querySelector('h1')
        expect(h1).toBeInTheDocument()
        expect(h1?.textContent).toContain('Cross-Device Integration Test')

        // Check for proper paragraph structure
        const paragraphs = container.querySelectorAll('p')
        expect(paragraphs.length).toBeGreaterThan(0)

        // Check for proper link attributes
        const links = container.querySelectorAll('a')
        links.forEach((link) => {
          expect(link.getAttribute('href')).toBeTruthy()
          if (link.getAttribute('target') === '_blank') {
            expect(link.getAttribute('rel')).toContain('noopener')
          }
        })

        // Check for proper list structure
        const lists = container.querySelectorAll('ul')
        lists.forEach((list) => {
          const items = list.querySelectorAll('li')
          expect(items.length).toBeGreaterThan(0)
        })
      })
    })
  })

  describe('Responsive Layout Behavior', () => {
    it('should adapt layout appropriately for each device category', () => {
      const layoutResults: Record<string, { containerWidth: number; fontSize: number }> = {}

      Object.entries(deviceConfigs).forEach(([deviceKey]) => {
        simulateDevice(deviceKey)

        const { container } = render(
          <RichText
            data={complexRichTextData}
            enableContainerQueries={true}
            responsive={{
              mobile: { enableGutter: true, enableProse: true },
              tablet: { enableGutter: true, enableProse: true },
              desktop: { enableGutter: true, enableProse: true },
            }}
          />,
        )

        const richTextElement = container.firstChild as HTMLElement
        const paragraph = container.querySelector('p')

        if (richTextElement && paragraph) {
          const textStyles = window.getComputedStyle(paragraph)

          layoutResults[deviceKey] = {
            containerWidth: richTextElement.getBoundingClientRect().width,
            fontSize: parseFloat(textStyles.fontSize),
          }
        }
      })

      // Verify responsive behavior patterns
      const mobileDevices = Object.entries(deviceConfigs).filter(([, d]) => d.category === 'mobile')
      const desktopDevices = Object.entries(deviceConfigs).filter(
        ([, d]) => d.category === 'desktop',
      )

      // Mobile should have smaller font sizes
      mobileDevices.forEach(([deviceKey]) => {
        const mobileResult = layoutResults[deviceKey]
        desktopDevices.forEach(([desktopKey]) => {
          const desktopResult = layoutResults[desktopKey]
          if (mobileResult && desktopResult) {
            expect(mobileResult.fontSize).toBeLessThanOrEqual(desktopResult.fontSize)
          }
        })
      })
    })

    it('should handle orientation changes gracefully', () => {
      const tabletDevices = Object.entries(deviceConfigs).filter(
        ([, device]) => device.category === 'tablet',
      )

      tabletDevices.forEach(([deviceKey, device]) => {
        // Test portrait orientation
        simulateDevice(deviceKey)
        const { container: portraitContainer } = render(<RichText data={complexRichTextData} />)

        const portraitElement = portraitContainer.firstChild as HTMLElement
        const portraitWidth = portraitElement?.getBoundingClientRect().width || 0

        // Test landscape orientation
        Object.defineProperty(window, 'innerWidth', {
          writable: true,
          configurable: true,
          value: device.height,
        })
        Object.defineProperty(window, 'innerHeight', {
          writable: true,
          configurable: true,
          value: device.width,
        })

        const { container: landscapeContainer } = render(<RichText data={complexRichTextData} />)

        const landscapeElement = landscapeContainer.firstChild as HTMLElement
        const landscapeWidth = landscapeElement?.getBoundingClientRect().width || 0

        // Both orientations should render without errors
        expect(portraitElement).toBeInTheDocument()
        expect(landscapeElement).toBeInTheDocument()

        // Layout should adapt to orientation
        expect(Math.abs(portraitWidth - landscapeWidth)).toBeGreaterThan(0)
      })
    })
  })

  describe('Interactive Elements Across Devices', () => {
    it('should handle touch interactions on touch devices', async () => {
      const touchDevices = Object.entries(deviceConfigs).filter(([, device]) => device.touchEnabled)

      for (const [deviceKey] of touchDevices) {
        simulateDevice(deviceKey)

        const { container } = render(<RichText data={complexRichTextData} />)

        const links = container.querySelectorAll('a')

        for (const link of links) {
          // Simulate touch interaction
          fireEvent.touchStart(link)
          fireEvent.touchEnd(link)

          // Link should be accessible and functional
          expect(link).toBeInTheDocument()
          expect(link.getAttribute('href')).toBeTruthy()

          // Touch targets should be appropriately sized
          const rect = link.getBoundingClientRect()
          expect(Math.max(rect.width, rect.height)).toBeGreaterThanOrEqual(44)
        }
      }
    })

    it('should handle hover interactions on hover-capable devices', async () => {
      const hoverDevices = Object.entries(deviceConfigs).filter(([, device]) => device.hoverEnabled)

      for (const [deviceKey] of hoverDevices) {
        simulateDevice(deviceKey)

        const { container } = render(<RichText data={complexRichTextData} />)

        const links = container.querySelectorAll('a')

        for (const link of links) {
          // Simulate hover interaction
          fireEvent.mouseEnter(link)

          // Should have hover styles
          const styles = window.getComputedStyle(link)
          expect(styles.cursor).toBe('pointer')

          fireEvent.mouseLeave(link)
        }
      }
    })
  })

  describe('Media Content Across Devices', () => {
    it('should scale media appropriately for each device', () => {
      Object.entries(deviceConfigs).forEach(([deviceKey, device]) => {
        simulateDevice(deviceKey)

        const { container } = render(<RichText data={complexRichTextData} />)

        const images = container.querySelectorAll('img')

        images.forEach((img) => {
          const rect = img.getBoundingClientRect()

          // Images should not exceed viewport width
          expect(rect.width).toBeLessThanOrEqual(device.width + 10) // 10px tolerance

          // Images should have proper alt text
          expect(img.getAttribute('alt')).toBeTruthy()

          // Images should be responsive
          const styles = window.getComputedStyle(img)
          expect(
            ['100%', 'auto'].some(
              (value) => styles.width.includes(value) || styles.maxWidth.includes(value),
            ),
          ).toBe(true)
        })
      })
    })
  })

  describe('Performance Consistency', () => {
    it('should maintain acceptable performance across all devices', async () => {
      const performanceResults = await testPerformanceAcrossDevices(async () => {
        const startTime = performance.now()

        const { container } = render(
          <RichText data={complexRichTextData} enablePerformanceMonitoring={true} />,
        )

        const endTime = performance.now()
        const renderTime = endTime - startTime

        // Cleanup
        container.remove()

        return renderTime
      })

      // All devices should render within reasonable time
      Object.entries(performanceResults).forEach(([deviceKey, renderTime]) => {
        const device = deviceConfigs[deviceKey]
        if (device) {
          // Mobile devices get more lenient performance requirements
          const maxRenderTime = device.category === 'mobile' ? 200 : 100

          expect(renderTime).toBeLessThan(maxRenderTime)
        }
      })

      // Performance should be consistent (no device should be dramatically slower)
      const renderTimes = Object.values(performanceResults)
      const avgRenderTime = renderTimes.reduce((sum, time) => sum + time, 0) / renderTimes.length
      const maxDeviation = Math.max(...renderTimes) - Math.min(...renderTimes)

      // Maximum deviation should not exceed 3x the average
      expect(maxDeviation).toBeLessThan(avgRenderTime * 3)
    })
  })

  describe('Container Query Integration', () => {
    it('should apply container queries consistently across devices', () => {
      Object.entries(deviceConfigs).forEach(([deviceKey]) => {
        simulateDevice(deviceKey)

        const { container } = render(
          <RichText
            data={complexRichTextData}
            enableContainerQueries={true}
            containerName="test-container"
          />,
        )

        // Check for container query wrapper
        const wrapper = container.querySelector('[data-container-name="test-container"]')
        expect(wrapper).toBeInTheDocument()

        // Check for responsive classes
        const richTextElement = container.querySelector('.payload-richtext')
        expect(richTextElement).toBeInTheDocument()

        if (richTextElement) {
          const classList = Array.from(richTextElement.classList)
          expect(classList.some((cls) => cls.includes('richtext'))).toBe(true)
        }
      })
    })

    it('should fallback gracefully when container queries are not supported', () => {
      // Mock container query support as false
      const originalSupports = CSS.supports
      CSS.supports = () => false

      Object.entries(deviceConfigs).forEach(([deviceKey]) => {
        simulateDevice(deviceKey)

        const { container } = render(
          <RichText data={complexRichTextData} enableContainerQueries={true} />,
        )

        // Should still render without errors
        expect(container.firstChild).toBeInTheDocument()

        // Should have fallback classes
        const richTextElement = container.querySelector('.payload-richtext')
        expect(richTextElement).toBeInTheDocument()
      })

      // Restore original CSS.supports
      CSS.supports = originalSupports
    })
  })

  describe('Accessibility Consistency', () => {
    it('should maintain accessibility standards across all devices', () => {
      Object.entries(deviceConfigs).forEach(([deviceKey]) => {
        simulateDevice(deviceKey)

        const { container } = render(<RichText data={complexRichTextData} />)

        // Check heading hierarchy
        const h1 = container.querySelector('h1')
        expect(h1).toBeInTheDocument()

        // Check link accessibility
        const links = container.querySelectorAll('a')
        links.forEach((link) => {
          expect(link.getAttribute('href')).toBeTruthy()

          // External links should have proper rel attributes
          if (link.getAttribute('target') === '_blank') {
            const rel = link.getAttribute('rel') || ''
            expect(rel).toContain('noopener')
          }
        })

        // Check image accessibility
        const images = container.querySelectorAll('img')
        images.forEach((img) => {
          expect(img.getAttribute('alt')).toBeTruthy()
        })

        // Check list structure
        const lists = container.querySelectorAll('ul, ol')
        lists.forEach((list) => {
          const items = list.querySelectorAll('li')
          expect(items.length).toBeGreaterThan(0)
        })
      })
    })
  })

  describe('Error Handling Across Devices', () => {
    it('should handle malformed content gracefully on all devices', () => {
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
                  text: 'This should render even with malformed siblings',
                  version: 1,
                },
                // Malformed node
                {
                  type: 'invalid-type',
                  malformedProperty: 'should not break rendering',
                },
              ],
            },
          ],
        },
      })

      Object.entries(deviceConfigs).forEach(([deviceKey]) => {
        simulateDevice(deviceKey)

        expect(() => {
          const { container } = render(<RichText data={malformedData} />)

          // Should still render the valid content
          expect(container.firstChild).toBeInTheDocument()

          // Should contain the valid text
          expect(container.textContent).toContain('This should render even with malformed siblings')
        }).not.toThrow()
      })
    })
  })
})
