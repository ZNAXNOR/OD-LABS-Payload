import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react'

// ============================================================================
// INCREMENTAL RENDERING TYPES
// ============================================================================

interface RenderBatch {
  id: string
  items: RenderItem[]
  priority: number
  estimatedRenderTime: number
}

interface RenderItem {
  id: string
  type: string
  data: any
  priority: number
  dependencies?: string[]
  estimatedRenderTime: number
}

interface IncrementalRenderConfig {
  batchSize: number
  maxRenderTime: number
  priorityThreshold: number
  enableTimeSlicing: boolean
  enablePriorityScheduling: boolean
  frameTimeLimit: number
}

interface RenderState {
  renderedItems: Set<string>
  pendingItems: RenderItem[]
  currentBatch: RenderBatch | null
  isRendering: boolean
  renderProgress: number
}

// ============================================================================
// PRIORITY SYSTEM
// ============================================================================

/**
 * Priority levels for rendering
 */
export const RENDER_PRIORITY = {
  IMMEDIATE: 1, // Critical content (above fold)
  HIGH: 2, // Important content (visible soon)
  NORMAL: 3, // Standard content
  LOW: 4, // Background content
  IDLE: 5, // Non-essential content
} as const

type RenderPriority = (typeof RENDER_PRIORITY)[keyof typeof RENDER_PRIORITY]

/**
 * Determine render priority based on content type and position
 */
export const calculateRenderPriority = (
  item: any,
  index: number,
  viewportInfo?: {
    isVisible: boolean
    distanceFromViewport: number
    isAboveFold: boolean
  },
): RenderPriority => {
  // Immediate priority for critical content
  if (viewportInfo?.isAboveFold || index < 3) {
    return RENDER_PRIORITY.IMMEDIATE
  }

  // High priority for visible or near-visible content
  if (viewportInfo?.isVisible || (viewportInfo?.distanceFromViewport || 0) < 200) {
    return RENDER_PRIORITY.HIGH
  }

  // Priority based on content type
  switch (item.type) {
    case 'block':
      // Critical blocks get higher priority
      if (['hero', 'banner', 'cta'].includes(item.blockType)) {
        return RENDER_PRIORITY.HIGH
      }
      // Heavy blocks get lower priority
      if (['projectShowcase', 'caseStudy', 'beforeAfter'].includes(item.blockType)) {
        return RENDER_PRIORITY.LOW
      }
      return RENDER_PRIORITY.NORMAL

    case 'heading':
    case 'paragraph':
      return RENDER_PRIORITY.NORMAL

    case 'list':
    case 'quote':
      return RENDER_PRIORITY.NORMAL

    case 'code':
      return RENDER_PRIORITY.LOW

    default:
      return RENDER_PRIORITY.NORMAL
  }
}

/**
 * Estimate rendering time for different content types
 */
export const estimateRenderTime = (item: any): number => {
  const baseTime = 1 // Base 1ms for simple content

  switch (item.type) {
    case 'block':
      // Block rendering times vary significantly
      const blockTimes: Record<string, number> = {
        // Simple blocks
        spacer: 1,
        divider: 1,
        banner: 2,

        // Medium complexity blocks
        content: 5,
        hero: 8,
        cta: 5,
        mediaBlock: 10,

        // Complex blocks
        servicesGrid: 15,
        featureGrid: 12,
        faqAccordion: 10,
        timeline: 20,

        // Heavy blocks
        projectShowcase: 25,
        caseStudy: 30,
        beforeAfter: 20,
        contactForm: 15,
        pricingTable: 18,
      }
      return blockTimes[item.blockType] || 10

    case 'heading':
      return baseTime * 2

    case 'paragraph':
      // Estimate based on content length
      const textLength =
        item.children?.reduce((acc: number, child: any) => {
          return acc + (child.text?.length || 0)
        }, 0) || 0
      return baseTime + Math.ceil(textLength / 100)

    case 'list':
      // Estimate based on number of items
      const itemCount = item.children?.length || 1
      return baseTime * (1 + itemCount * 0.5)

    case 'code':
      // Code blocks can be expensive due to syntax highlighting
      const lines = item.value?.split('\n').length || 1
      return baseTime * (2 + lines * 0.2)

    case 'quote':
      return baseTime * 3

    default:
      return baseTime
  }
}

// ============================================================================
// INCREMENTAL RENDERING HOOK
// ============================================================================

/**
 * Hook for incremental rendering with time slicing and priority scheduling
 */
export const useIncrementalRendering = (items: any[], config: IncrementalRenderConfig) => {
  const { batchSize, maxRenderTime, enableTimeSlicing, enablePriorityScheduling, frameTimeLimit } =
    config

  const [renderState, setRenderState] = useState<RenderState>({
    renderedItems: new Set(),
    pendingItems: [],
    currentBatch: null,
    isRendering: false,
    renderProgress: 0,
  })

  const renderTimeRef = useRef<number>(0)
  const frameStartRef = useRef<number>(0)
  const scheduledWorkRef = useRef<number | null>(null)

  // Convert items to render items with priorities
  const renderItems = useMemo(() => {
    return items.map((item, index) => ({
      id: `item-${index}`,
      type: item.type || 'unknown',
      data: item,
      priority: calculateRenderPriority(item, index),
      estimatedRenderTime: estimateRenderTime(item),
    }))
  }, [items])

  // Create render batches based on priority and estimated time
  const createRenderBatches = useCallback(
    (items: RenderItem[]): RenderBatch[] => {
      if (!enablePriorityScheduling) {
        // Simple batching without priority
        const batches: RenderBatch[] = []
        for (let i = 0; i < items.length; i += batchSize) {
          const batchItems = items.slice(i, i + batchSize)
          const totalTime = batchItems.reduce((sum, item) => sum + item.estimatedRenderTime, 0)

          batches.push({
            id: `batch-${i / batchSize}`,
            items: batchItems,
            priority: RENDER_PRIORITY.NORMAL,
            estimatedRenderTime: totalTime,
          })
        }
        return batches
      }

      // Priority-based batching
      const sortedItems = [...items].sort((a, b) => a.priority - b.priority)
      const batches: RenderBatch[] = []
      let currentBatch: RenderItem[] = []
      let currentBatchTime = 0
      let currentPriority = sortedItems[0]?.priority || RENDER_PRIORITY.NORMAL

      for (const item of sortedItems) {
        // Start new batch if priority changes or batch is full
        if (
          item.priority !== currentPriority ||
          currentBatch.length >= batchSize ||
          currentBatchTime + item.estimatedRenderTime > maxRenderTime
        ) {
          if (currentBatch.length > 0) {
            batches.push({
              id: `batch-${batches.length}`,
              items: [...currentBatch],
              priority: currentPriority,
              estimatedRenderTime: currentBatchTime,
            })
          }

          currentBatch = []
          currentBatchTime = 0
          currentPriority = item.priority
        }

        currentBatch.push(item)
        currentBatchTime += item.estimatedRenderTime
      }

      // Add final batch
      if (currentBatch.length > 0) {
        batches.push({
          id: `batch-${batches.length}`,
          items: currentBatch,
          priority: currentPriority,
          estimatedRenderTime: currentBatchTime,
        })
      }

      return batches
    },
    [batchSize, maxRenderTime, enablePriorityScheduling],
  )

  // Time slicing implementation
  const shouldYieldToMain = useCallback((): boolean => {
    if (!enableTimeSlicing) return false

    const now = performance.now()
    const elapsed = now - frameStartRef.current

    return elapsed >= frameTimeLimit
  }, [enableTimeSlicing, frameTimeLimit])

  // Render a single batch
  const renderBatch = useCallback(
    async (batch: RenderBatch): Promise<void> => {
      return new Promise((resolve) => {
        const renderBatchItems = (itemIndex: number = 0) => {
          frameStartRef.current = performance.now()

          while (itemIndex < batch.items.length) {
            const item = batch.items[itemIndex]
            if (!item) {
              itemIndex++
              continue
            }

            // Simulate rendering work
            const renderStart = performance.now()

            // Mark item as rendered
            setRenderState((prev) => ({
              ...prev,
              renderedItems: new Set([...prev.renderedItems, item.id]),
              renderProgress: (prev.renderedItems.size + 1) / renderItems.length,
            }))

            const renderEnd = performance.now()
            renderTimeRef.current += renderEnd - renderStart

            itemIndex++

            // Check if we should yield to main thread
            if (shouldYieldToMain()) {
              // Schedule continuation
              scheduledWorkRef.current = requestAnimationFrame(() => {
                renderBatchItems(itemIndex)
              })
              return
            }
          }

          // Batch complete
          resolve()
        }

        renderBatchItems()
      })
    },
    [renderItems.length, shouldYieldToMain],
  )

  // Start incremental rendering
  const startRendering = useCallback(async () => {
    if (renderState.isRendering) return

    setRenderState((prev) => ({
      ...prev,
      isRendering: true,
      renderProgress: 0,
    }))

    const batches = createRenderBatches(renderItems)

    for (const batch of batches) {
      setRenderState((prev) => ({
        ...prev,
        currentBatch: batch,
      }))

      await renderBatch(batch)

      // Small delay between batches to prevent blocking
      if (enableTimeSlicing) {
        await new Promise((resolve) => setTimeout(resolve, 0))
      }
    }

    setRenderState((prev) => ({
      ...prev,
      isRendering: false,
      currentBatch: null,
      renderProgress: 1,
    }))
  }, [renderState.isRendering, createRenderBatches, renderItems, renderBatch, enableTimeSlicing])

  // Cancel rendering
  const cancelRendering = useCallback(() => {
    if (scheduledWorkRef.current) {
      cancelAnimationFrame(scheduledWorkRef.current)
      scheduledWorkRef.current = null
    }

    setRenderState((prev) => ({
      ...prev,
      isRendering: false,
      currentBatch: null,
    }))
  }, [])

  // Reset rendering state
  const resetRendering = useCallback(() => {
    cancelRendering()
    setRenderState({
      renderedItems: new Set(),
      pendingItems: [],
      currentBatch: null,
      isRendering: false,
      renderProgress: 0,
    })
  }, [cancelRendering])

  // Auto-start rendering when items change
  useEffect(() => {
    if (renderItems.length > 0 && !renderState.isRendering) {
      startRendering()
    }
  }, [renderItems, renderState.isRendering, startRendering])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cancelRendering()
    }
  }, [cancelRendering])

  return {
    renderedItems: renderState.renderedItems,
    isRendering: renderState.isRendering,
    renderProgress: renderState.renderProgress,
    currentBatch: renderState.currentBatch,
    startRendering,
    cancelRendering,
    resetRendering,
  }
}

// ============================================================================
// INCREMENTAL RENDER COMPONENT
// ============================================================================

interface IncrementalRenderProps {
  items: any[]
  renderItem: (item: any, index: number) => React.ReactNode
  config?: Partial<IncrementalRenderConfig>
  placeholder?: React.ReactNode
  onRenderComplete?: () => void
  onRenderProgress?: (progress: number) => void
}

/**
 * Component that renders items incrementally
 */
export const IncrementalRender: React.FC<IncrementalRenderProps> = ({
  items,
  renderItem,
  config = {},
  placeholder,
  onRenderComplete,
  onRenderProgress,
}) => {
  const renderConfig: IncrementalRenderConfig = {
    batchSize: 5,
    maxRenderTime: 16, // ~60fps
    priorityThreshold: RENDER_PRIORITY.HIGH,
    enableTimeSlicing: true,
    enablePriorityScheduling: true,
    frameTimeLimit: 5,
    ...config,
  }

  const { renderedItems, isRendering, renderProgress } = useIncrementalRendering(
    items,
    renderConfig,
  )

  // Notify progress changes
  useEffect(() => {
    onRenderProgress?.(renderProgress)
  }, [renderProgress, onRenderProgress])

  // Notify completion
  useEffect(() => {
    if (!isRendering && renderProgress === 1) {
      onRenderComplete?.()
    }
  }, [isRendering, renderProgress, onRenderComplete])

  // Render items that have been processed
  const renderedElements = useMemo(() => {
    return items.map((item, index) => {
      const itemId = `item-${index}`
      if (renderedItems.has(itemId)) {
        return renderItem(item, index)
      }
      return (
        placeholder || (
          <div
            key={itemId}
            className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded h-20 mb-4"
          >
            <div className="p-4">
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
            </div>
          </div>
        )
      )
    })
  }, [items, renderedItems, renderItem, placeholder])

  return (
    <div className="incremental-render-container">
      {renderedElements}

      {/* Render progress indicator */}
      {isRendering && (
        <div className="render-progress-indicator">
          <div className="flex items-center space-x-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
            <div className="animate-spin w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
            <span className="text-sm text-blue-600 dark:text-blue-400">
              Rendering content... {Math.round(renderProgress * 100)}%
            </span>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1 mt-2">
            <div
              className="bg-blue-500 h-1 rounded-full transition-all duration-300"
              style={{ width: `${renderProgress * 100}%` }}
            />
          </div>
        </div>
      )}
    </div>
  )
}

// ============================================================================
// RICH TEXT INCREMENTAL RENDERING
// ============================================================================

interface IncrementalRichTextProps {
  data: any
  converters: any
  className?: string
  enableIncrementalRendering?: boolean
  incrementalConfig?: Partial<IncrementalRenderConfig>
  onRenderComplete?: () => void
}

/**
 * Rich text component with incremental rendering
 */
export const IncrementalRichText: React.FC<IncrementalRichTextProps> = ({
  data,
  converters,
  className = '',
  enableIncrementalRendering = false,
  incrementalConfig = {},
  onRenderComplete,
}) => {
  // Extract content items
  const contentItems = useMemo(() => {
    if (!data?.root?.children) return []
    return data.root.children
  }, [data])

  // Render individual content item
  const renderContentItem = useCallback(
    (item: any, index: number) => {
      const key = `content-${index}`

      // Handle block content
      if (item.type === 'block' && converters.blocks?.[item.blockType]) {
        const BlockConverter = converters.blocks[item.blockType]
        return <BlockConverter key={key} node={item} />
      }

      // Handle text content
      switch (item.type) {
        case 'paragraph':
          return (
            <p key={key} className="mb-4">
              {renderInlineContent(item.children, converters)}
            </p>
          )

        case 'heading':
          const HeadingTag = item.tag || 'h2'
          return React.createElement(
            HeadingTag,
            { key, className: 'mb-4 font-bold' },
            renderInlineContent(item.children, converters),
          )

        case 'list':
          const ListTag = item.listType === 'number' ? 'ol' : 'ul'
          return React.createElement(
            ListTag,
            { key, className: 'mb-4 ml-6' },
            item.children?.map((child: any, childIndex: number) => (
              <li key={childIndex} className="mb-2">
                {renderInlineContent(child.children, converters)}
              </li>
            )),
          )

        default:
          return (
            <div key={key} className="mb-4">
              {renderInlineContent(item.children, converters)}
            </div>
          )
      }
    },
    [converters],
  )

  // Render inline content helper
  const renderInlineContent = (children: any[], converters: any): React.ReactNode => {
    if (!Array.isArray(children)) return null

    return children.map((child, index) => {
      if (typeof child === 'string') return child

      if (child.type === 'text') {
        let element = child.text
        if (child.bold) element = <strong key={index}>{element}</strong>
        if (child.italic) element = <em key={index}>{element}</em>
        return element
      }

      if (child.type === 'link' && converters.link) {
        return converters.link({ node: child, key: index })
      }

      return null
    })
  }

  // Decide whether to use incremental rendering
  const shouldUseIncremental =
    enableIncrementalRendering && contentItems.length > (incrementalConfig.priorityThreshold || 10)

  if (!shouldUseIncremental) {
    // Render normally
    return <div className={className}>{contentItems.map(renderContentItem)}</div>
  }

  // Render incrementally
  return (
    <div className={className}>
      <IncrementalRender
        items={contentItems}
        renderItem={renderContentItem}
        config={incrementalConfig}
        onRenderComplete={onRenderComplete}
      />
    </div>
  )
}

// ============================================================================
// PERFORMANCE UTILITIES
// ============================================================================

/**
 * Analyze content complexity for incremental rendering decisions
 */
export const analyzeContentComplexity = (
  content: any,
): {
  totalItems: number
  blockCount: number
  textCount: number
  estimatedRenderTime: number
  recommendIncremental: boolean
} => {
  if (!content?.root?.children) {
    return {
      totalItems: 0,
      blockCount: 0,
      textCount: 0,
      estimatedRenderTime: 0,
      recommendIncremental: false,
    }
  }

  let blockCount = 0
  let textCount = 0
  let totalRenderTime = 0

  content.root.children.forEach((item: any) => {
    if (item.type === 'block') {
      blockCount++
    } else {
      textCount++
    }

    totalRenderTime += estimateRenderTime(item)
  })

  const totalItems = content.root.children.length
  const recommendIncremental = totalItems > 10 || totalRenderTime > 50

  return {
    totalItems,
    blockCount,
    textCount,
    estimatedRenderTime: totalRenderTime,
    recommendIncremental,
  }
}

// Default export
export default IncrementalRichText
