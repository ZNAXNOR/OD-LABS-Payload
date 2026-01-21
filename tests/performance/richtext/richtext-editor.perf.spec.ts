/**
 * Performance tests for RichText editor under load
 * Tests editor responsiveness with large content, many blocks, and concurrent operations
 */

import { test, expect } from '@playwright/test'
import type { Page } from '@playwright/test'

// Performance thresholds (in milliseconds)
const PERFORMANCE_THRESHOLDS = {
  EDITOR_LOAD: 2000, // Editor should load within 2 seconds
  TYPING_RESPONSE: 100, // Typing should respond within 100ms
  BLOCK_INSERTION: 1000, // Block insertion should complete within 1 second
  SAVE_OPERATION: 5000, // Save should complete within 5 seconds
  LARGE_CONTENT_LOAD: 3000, // Large content should load within 3 seconds
}

// Helper function to login as admin
async function loginAsAdmin(page: Page) {
  await page.goto('/admin/login')
  await page.fill('input[name="email"]', 'admin@test.com')
  await page.fill('input[name="password"]', 'password123')
  await page.click('button[type="submit"]')
  await page.waitForURL('/admin')
}

// Helper function to measure performance
async function measurePerformance<T>(
  operation: () => Promise<T>,
  description: string,
  threshold: number,
): Promise<{ result: T; duration: number }> {
  const startTime = Date.now()
  const result = await operation()
  const duration = Date.now() - startTime

  console.log(`${description}: ${duration}ms (threshold: ${threshold}ms)`)
  expect(duration).toBeLessThan(threshold)

  return { result, duration }
}

// Helper function to generate large content
function generateLargeContent(paragraphs: number = 50): string {
  const sampleParagraph =
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'

  return Array(paragraphs).fill(sampleParagraph).join('\n\n')
}

// Helper function to create lexical content structure
// function createLexicalContent(textContent: string) {
//   const paragraphs = textContent.split('\n\n')

//   return {
//     root: {
//       children: paragraphs.map((paragraph) => ({
//         children: [
//           {
//             detail: 0,
//             format: 0,
//             mode: 'normal',
//             style: '',
//             text: paragraph,
//             type: 'text',
//             version: 1,
//           },
//         ],
//         direction: 'ltr',
//         format: '',
//         indent: 0,
//         type: 'paragraph',
//         version: 1,
//       })),
//       direction: 'ltr',
//       format: '',
//       indent: 0,
//       type: 'root',
//       version: 1,
//     },
//   }
// }

// Helper function to simulate typing with performance measurement
async function simulateTypingWithPerformance(page: Page, text: string, chunkSize: number = 10) {
  const chunks = []
  for (let i = 0; i < text.length; i += chunkSize) {
    chunks.push(text.slice(i, i + chunkSize))
  }

  const typingTimes: number[] = []

  for (const chunk of chunks) {
    const startTime = Date.now()
    await page.keyboard.type(chunk)
    await page.waitForTimeout(10) // Small delay to allow editor to process
    const duration = Date.now() - startTime
    typingTimes.push(duration)
  }

  const averageTypingTime = typingTimes.reduce((a, b) => a + b, 0) / typingTimes.length
  const maxTypingTime = Math.max(...typingTimes)

  console.log(`Average typing response: ${averageTypingTime}ms, Max: ${maxTypingTime}ms`)
  expect(maxTypingTime).toBeLessThan(PERFORMANCE_THRESHOLDS.TYPING_RESPONSE)

  return { averageTypingTime, maxTypingTime }
}

test.describe('RichText Editor Performance Tests', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page)
  })

  test('should load editor quickly', async ({ page }) => {
    await measurePerformance(
      async () => {
        await page.goto('/admin/collections/blogs/create')
        await page.waitForSelector('.lexical-editor', { state: 'visible' })
        return true
      },
      'Editor load time',
      PERFORMANCE_THRESHOLDS.EDITOR_LOAD,
    )

    // Verify editor is interactive
    await page.click('.lexical-editor')
    await page.keyboard.type('Test')
    await expect(page.locator('.lexical-editor')).toContainText('Test')
  })

  test('should handle typing performance', async ({ page }) => {
    await page.goto('/admin/collections/blogs/create')
    await page.fill('input[name="title"]', 'Typing Performance Test')
    await page.waitForSelector('.lexical-editor')
    await page.click('.lexical-editor')

    // Test typing performance with medium-length text
    const testText =
      "This is a performance test for typing in the rich text editor. We're measuring how quickly the editor responds to user input and whether there are any noticeable delays or lag during typing."

    await simulateTypingWithPerformance(page, testText, 5)

    // Verify all text was entered correctly
    await expect(page.locator('.lexical-editor')).toContainText(testText)
  })

  test('should handle large content efficiently', async ({ page }) => {
    const largeContent = generateLargeContent(100) // 100 paragraphs

    await page.goto('/admin/collections/blogs/create')
    await page.fill('input[name="title"]', 'Large Content Performance Test')

    await measurePerformance(
      async () => {
        await page.waitForSelector('.lexical-editor')
        await page.click('.lexical-editor')

        // Paste large content
        await page.evaluate((content) => {
          navigator.clipboard.writeText(content)
        }, largeContent)

        await page.keyboard.press('Control+v')
        await page.waitForTimeout(1000) // Allow time for content to be processed

        return true
      },
      'Large content insertion',
      PERFORMANCE_THRESHOLDS.LARGE_CONTENT_LOAD,
    )

    // Verify content was inserted
    await expect(page.locator('.lexical-editor')).toContainText('Lorem ipsum')

    // Test scrolling performance with large content
    const scrollStartTime = Date.now()
    await page.keyboard.press('Control+End') // Scroll to end
    await page.waitForTimeout(100)
    await page.keyboard.press('Control+Home') // Scroll to beginning
    const scrollDuration = Date.now() - scrollStartTime

    console.log(`Scrolling large content: ${scrollDuration}ms`)
    expect(scrollDuration).toBeLessThan(500) // Should scroll smoothly
  })

  test('should handle multiple blocks efficiently', async ({ page }) => {
    await page.goto('/admin/collections/pages/create')
    await page.fill('input[name="title"]', 'Multiple Blocks Performance Test')

    // Navigate to Layout tab
    const layoutTab = page.locator('button:has-text("Layout")')
    if (await layoutTab.isVisible()) {
      await layoutTab.click()
    }

    // Add multiple blocks and measure performance
    const blockTypes = ['content', 'callToAction', 'mediaBlock', 'hero']
    const blockInsertionTimes: number[] = []

    for (let i = 0; i < 20; i++) {
      const blockType = blockTypes[i % blockTypes.length]

      const { duration } = await measurePerformance(
        async () => {
          const addBlockButton = page.locator('button:has-text("Add Block")').last()
          await addBlockButton.click()

          const blockOption = page.locator(
            `[data-block-type="${blockType}"], button:has-text("${blockType}")`,
          )
          if (await blockOption.isVisible()) {
            await blockOption.click()
          } else {
            // Try alternative selector
            const altOption = page
              .locator(
                `button:has-text("${blockType ? blockType.charAt(0).toUpperCase() + blockType.slice(1) : 'Block'}")`,
              )
              .first()
            if (await altOption.isVisible()) {
              await altOption.click()
            }
          }

          // Fill required fields quickly
          if (blockType === 'content') {
            const contentField = page.locator('textarea[name*="content"]').last()
            if (await contentField.isVisible()) {
              await contentField.fill(`Content block ${i + 1}`)
            }
          } else if (blockType === 'callToAction' || blockType === 'hero') {
            const headingField = page.locator('input[name*="heading"]').last()
            if (await headingField.isVisible()) {
              await headingField.fill(`Heading ${i + 1}`)
            }
          }

          return true
        },
        `Block ${i + 1} insertion (${blockType})`,
        PERFORMANCE_THRESHOLDS.BLOCK_INSERTION,
      )

      blockInsertionTimes.push(duration)
    }

    // Analyze block insertion performance trends
    const averageInsertionTime =
      blockInsertionTimes.reduce((a, b) => a + b, 0) / blockInsertionTimes.length
    const maxInsertionTime = Math.max(...blockInsertionTimes)

    console.log(`Average block insertion: ${averageInsertionTime}ms, Max: ${maxInsertionTime}ms`)

    // Performance should not degrade significantly with more blocks
    const firstFiveAvg = blockInsertionTimes.slice(0, 5).reduce((a, b) => a + b, 0) / 5
    const lastFiveAvg = blockInsertionTimes.slice(-5).reduce((a, b) => a + b, 0) / 5
    const performanceDegradation = (lastFiveAvg - firstFiveAvg) / firstFiveAvg

    console.log(`Performance degradation: ${(performanceDegradation * 100).toFixed(2)}%`)
    expect(performanceDegradation).toBeLessThan(0.5) // Should not degrade more than 50%

    // Verify all blocks were added
    await expect(page.locator('.block')).toHaveCount(20)
  })

  test('should handle save operations efficiently', async ({ page }) => {
    await page.goto('/admin/collections/blogs/create')
    await page.fill('input[name="title"]', 'Save Performance Test')

    // Add substantial content
    await page.waitForSelector('.lexical-editor')
    await page.click('.lexical-editor')

    const mediumContent = generateLargeContent(20)
    await page.evaluate((content) => {
      navigator.clipboard.writeText(content)
    }, mediumContent)
    await page.keyboard.press('Control+v')
    await page.waitForTimeout(500)

    // Measure save performance
    await measurePerformance(
      async () => {
        await page.click('button:has-text("Save Draft")')
        await page.waitForSelector('.toast--success', {
          timeout: PERFORMANCE_THRESHOLDS.SAVE_OPERATION,
        })
        return true
      },
      'Save operation with large content',
      PERFORMANCE_THRESHOLDS.SAVE_OPERATION,
    )

    // Test multiple rapid saves
    const rapidSaveTimes: number[] = []

    for (let i = 0; i < 5; i++) {
      // Make a small change
      await page.click('.lexical-editor')
      await page.keyboard.press('End')
      await page.keyboard.type(` Edit ${i + 1}`)

      const { duration } = await measurePerformance(
        async () => {
          await page.click('button:has-text("Save")')
          await page.waitForSelector('.toast--success', {
            timeout: PERFORMANCE_THRESHOLDS.SAVE_OPERATION,
          })
          return true
        },
        `Rapid save ${i + 1}`,
        PERFORMANCE_THRESHOLDS.SAVE_OPERATION,
      )

      rapidSaveTimes.push(duration)
      await page.waitForTimeout(100) // Brief pause between saves
    }

    const averageRapidSave = rapidSaveTimes.reduce((a, b) => a + b, 0) / rapidSaveTimes.length
    console.log(`Average rapid save time: ${averageRapidSave}ms`)
  })

  test('should handle concurrent editor operations', async ({ page, context }) => {
    // Create multiple pages to simulate concurrent editing
    const pages = [page]

    // Create additional browser tabs
    for (let i = 0; i < 2; i++) {
      const newPage = await context.newPage()
      await loginAsAdmin(newPage)
      pages.push(newPage)
    }

    // Start concurrent editing operations
    const concurrentOperations = pages.map(async (p, index) => {
      await p.goto('/admin/collections/blogs/create')
      await p.fill('input[name="title"]', `Concurrent Test ${index + 1}`)
      await p.waitForSelector('.lexical-editor')
      await p.click('.lexical-editor')

      // Simulate typing in each editor
      const content = `This is concurrent editing test ${index + 1}. ${generateLargeContent(5)}`

      return measurePerformance(
        async () => {
          await simulateTypingWithPerformance(p, content, 20)
          await p.click('button:has-text("Save Draft")')
          await p.waitForSelector('.toast--success')
          return true
        },
        `Concurrent operation ${index + 1}`,
        PERFORMANCE_THRESHOLDS.SAVE_OPERATION * 2, // Allow more time for concurrent operations
      )
    })

    // Wait for all operations to complete
    const results = await Promise.all(concurrentOperations)

    // Verify all operations completed successfully
    results.forEach((result, index) => {
      expect(result.result).toBe(true)
      console.log(`Concurrent operation ${index + 1} completed in ${result.duration}ms`)
    })

    // Clean up additional pages
    for (let i = 1; i < pages.length; i++) {
      const pageToClose = pages[i]
      if (pageToClose) {
        await pageToClose.close()
      }
    }
  })

  test('should handle memory usage efficiently', async ({ page }) => {
    await page.goto('/admin/collections/blogs/create')
    await page.fill('input[name="title"]', 'Memory Usage Test')

    // Get initial memory usage
    const initialMemory = await page.evaluate(() => {
      return (performance as any).memory
        ? {
            usedJSHeapSize: (performance as any).memory.usedJSHeapSize,
            totalJSHeapSize: (performance as any).memory.totalJSHeapSize,
          }
        : null
    })

    if (initialMemory) {
      console.log(
        `Initial memory usage: ${(initialMemory.usedJSHeapSize / 1024 / 1024).toFixed(2)} MB`,
      )
    }

    // Perform memory-intensive operations
    await page.waitForSelector('.lexical-editor')
    await page.click('.lexical-editor')

    // Add large amount of content multiple times
    for (let i = 0; i < 10; i++) {
      const content = generateLargeContent(10)
      await page.evaluate((content) => {
        navigator.clipboard.writeText(content)
      }, content)
      await page.keyboard.press('Control+v')
      await page.waitForTimeout(200)

      // Clear and add again to test memory cleanup
      await page.keyboard.press('Control+a')
      await page.keyboard.press('Delete')
      await page.waitForTimeout(100)
    }

    // Force garbage collection if available
    await page.evaluate(() => {
      if ((window as any).gc) {
        ;(window as any).gc()
      }
    })

    // Get final memory usage
    const finalMemory = await page.evaluate(() => {
      return (performance as any).memory
        ? {
            usedJSHeapSize: (performance as any).memory.usedJSHeapSize,
            totalJSHeapSize: (performance as any).memory.totalJSHeapSize,
          }
        : null
    })

    if (initialMemory && finalMemory) {
      const memoryIncrease = finalMemory.usedJSHeapSize - initialMemory.usedJSHeapSize
      const memoryIncreasePercent = (memoryIncrease / initialMemory.usedJSHeapSize) * 100

      console.log(`Final memory usage: ${(finalMemory.usedJSHeapSize / 1024 / 1024).toFixed(2)} MB`)
      console.log(
        `Memory increase: ${(memoryIncrease / 1024 / 1024).toFixed(2)} MB (${memoryIncreasePercent.toFixed(2)}%)`,
      )

      // Memory increase should be reasonable (less than 100% increase)
      expect(memoryIncreasePercent).toBeLessThan(100)
    }
  })

  test('should handle undo/redo operations efficiently', async ({ page }) => {
    await page.goto('/admin/collections/blogs/create')
    await page.fill('input[name="title"]', 'Undo/Redo Performance Test')
    await page.waitForSelector('.lexical-editor')
    await page.click('.lexical-editor')

    // Create content with multiple operations
    const operations = [
      'First paragraph of content.',
      'Second paragraph with more text.',
      'Third paragraph with even more content to test undo/redo performance.',
    ]

    // Add content with pauses to create undo history
    for (const operation of operations) {
      await page.keyboard.type(operation)
      await page.keyboard.press('Enter')
      await page.keyboard.press('Enter')
      await page.waitForTimeout(100) // Create distinct undo states
    }

    // Test undo performance
    const undoTimes: number[] = []

    for (let i = 0; i < operations.length; i++) {
      const { duration } = await measurePerformance(
        async () => {
          await page.keyboard.press('Control+z')
          await page.waitForTimeout(50) // Allow undo to process
          return true
        },
        `Undo operation ${i + 1}`,
        200, // Undo should be very fast
      )

      undoTimes.push(duration)
    }

    // Test redo performance
    const redoTimes: number[] = []

    for (let i = 0; i < operations.length; i++) {
      const { duration } = await measurePerformance(
        async () => {
          await page.keyboard.press('Control+y')
          await page.waitForTimeout(50) // Allow redo to process
          return true
        },
        `Redo operation ${i + 1}`,
        200, // Redo should be very fast
      )

      redoTimes.push(duration)
    }

    const avgUndoTime = undoTimes.reduce((a, b) => a + b, 0) / undoTimes.length
    const avgRedoTime = redoTimes.reduce((a, b) => a + b, 0) / redoTimes.length

    console.log(`Average undo time: ${avgUndoTime}ms, Average redo time: ${avgRedoTime}ms`)

    // Verify final content is restored
    const firstOperation = operations[0]
    const thirdOperation = operations[2]

    if (firstOperation) {
      await expect(page.locator('.lexical-editor')).toContainText(firstOperation)
    }
    if (thirdOperation) {
      await expect(page.locator('.lexical-editor')).toContainText(thirdOperation)
    }
  })

  test('should handle editor focus and blur efficiently', async ({ page }) => {
    await page.goto('/admin/collections/blogs/create')
    await page.fill('input[name="title"]', 'Focus Performance Test')
    await page.waitForSelector('.lexical-editor')

    // Test rapid focus/blur cycles
    const focusTimes: number[] = []

    for (let i = 0; i < 10; i++) {
      const { duration } = await measurePerformance(
        async () => {
          await page.click('.lexical-editor')
          await page.waitForTimeout(10)
          await page.click('input[name="title"]') // Focus elsewhere
          await page.waitForTimeout(10)
          return true
        },
        `Focus/blur cycle ${i + 1}`,
        100, // Should be very fast
      )

      focusTimes.push(duration)
    }

    const avgFocusTime = focusTimes.reduce((a, b) => a + b, 0) / focusTimes.length
    console.log(`Average focus/blur time: ${avgFocusTime}ms`)

    // Final focus should work correctly
    await page.click('.lexical-editor')
    await page.keyboard.type('Focus test completed')
    await expect(page.locator('.lexical-editor')).toContainText('Focus test completed')
  })
})
