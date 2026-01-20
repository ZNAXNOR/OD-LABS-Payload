import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react'

// ============================================================================
// VIRTUAL SCROLLING TYPES
// ============================================================================

interface VirtualScrollItem {
  id: string
  type: string
  height?: number
  estimatedHeight: number
  data: any
}

interface VirtualScrollConfig {
  itemHeight?: number
  estimatedItemHeight: number
  overscan: number
  threshold: number
  enableDynamicHeight: boolean
  bufferSize: number
}

interface VirtualScrollState {
  scrollTop: number
  containerHeight: number
  startIndex: number
  endIndex: number
  visibleItems: VirtualScrollItem[]
  totalHeight: number
}

interface VirtualScrollHookReturn {
  containerRef: React.RefObject<HTMLDivElement | null>
  scrollElementRef: React.RefObject<HTMLDivElement | null>
  visibleItems: VirtualScrollItem[]
  totalHeight: number
  startIndex: number
  endIndex: number
  scrollToIndex: (index: number) => void
  scrollToTop: () => void
  updateItemHeight: (index: number, height: number) => void
}

// ============================================================================
// VIRTUAL SCROLLING HOOK
// ============================================================================

/**
 * Custom hook for virtual scrolling implementation
 */
export const useVirtualScroll = (
  items: VirtualScrollItem[],
  config: VirtualScrollConfig,
): VirtualScrollHookReturn => {
  const { estimatedItemHeight, overscan, enableDynamicHeight } = config

  const containerRef = useRef<HTMLDivElement>(null)
  const scrollElementRef = useRef<HTMLDivElement>(null)

  // State for virtual scrolling
  const [scrollState, setScrollState] = useState<VirtualScrollState>({
    scrollTop: 0,
    containerHeight: 0,
    startIndex: 0,
    endIndex: 0,
    visibleItems: [],
    totalHeight: 0,
  })

  // Cache for measured item heights
  const itemHeights = useRef<Map<number, number>>(new Map())
  const itemOffsets = useRef<Map<number, number>>(new Map())

  // Calculate item positions and total height
  const calculateLayout = useCallback(() => {
    let totalHeight = 0
    const offsets = new Map<number, number>()

    items.forEach((item, index) => {
      offsets.set(index, totalHeight)

      const measuredHeight = itemHeights.current.get(index)
      const height = measuredHeight || item.height || estimatedItemHeight

      totalHeight += height
    })

    itemOffsets.current = offsets
    return totalHeight
  }, [items, estimatedItemHeight])

  // Calculate visible range based on scroll position
  const calculateVisibleRange = useCallback(
    (scrollTop: number, containerHeight: number) => {
      if (items.length === 0) {
        return { startIndex: 0, endIndex: 0 }
      }

      // Binary search for start index
      let startIndex = 0
      let endIndex = items.length - 1

      while (startIndex < endIndex) {
        const midIndex = Math.floor((startIndex + endIndex) / 2)
        const offset = itemOffsets.current.get(midIndex) || 0

        if (offset < scrollTop) {
          startIndex = midIndex + 1
        } else {
          endIndex = midIndex
        }
      }

      // Find end index
      let visibleEndIndex = startIndex
      let currentOffset = itemOffsets.current.get(startIndex) || 0

      while (visibleEndIndex < items.length && currentOffset < scrollTop + containerHeight) {
        const height =
          itemHeights.current.get(visibleEndIndex) ||
          items[visibleEndIndex]?.height ||
          estimatedItemHeight
        currentOffset += height
        visibleEndIndex++
      }

      // Apply overscan
      const overscanStart = Math.max(0, startIndex - overscan)
      const overscanEnd = Math.min(items.length - 1, visibleEndIndex + overscan)

      return {
        startIndex: overscanStart,
        endIndex: overscanEnd,
      }
    },
    [items, estimatedItemHeight, overscan],
  )

  // Update scroll state
  const updateScrollState = useCallback(() => {
    if (!containerRef.current) return

    const container = containerRef.current
    const scrollTop = container.scrollTop
    const containerHeight = container.clientHeight

    const totalHeight = calculateLayout()
    const { startIndex, endIndex } = calculateVisibleRange(scrollTop, containerHeight)

    const visibleItems = items.slice(startIndex, endIndex + 1)

    setScrollState({
      scrollTop,
      containerHeight,
      startIndex,
      endIndex,
      visibleItems,
      totalHeight,
    })
  }, [items, calculateLayout, calculateVisibleRange])

  // Handle scroll events
  const handleScroll = useCallback(() => {
    updateScrollState()
  }, [updateScrollState])

  // Handle resize events
  const handleResize = useCallback(() => {
    updateScrollState()
  }, [updateScrollState])

  // Update item height measurement
  const updateItemHeight = useCallback(
    (index: number, height: number) => {
      if (enableDynamicHeight) {
        const currentHeight = itemHeights.current.get(index)
        if (currentHeight !== height) {
          itemHeights.current.set(index, height)
          // Recalculate layout after height change
          requestAnimationFrame(updateScrollState)
        }
      }
    },
    [enableDynamicHeight, updateScrollState],
  )

  // Scroll to specific index
  const scrollToIndex = useCallback(
    (index: number) => {
      if (!containerRef.current || index < 0 || index >= items.length) return

      const offset = itemOffsets.current.get(index) || 0
      containerRef.current.scrollTop = offset
    },
    [items.length],
  )

  // Scroll to top
  const scrollToTop = useCallback(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = 0
    }
  }, [])

  // Set up event listeners
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    container.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleResize)

    // Initial calculation
    updateScrollState()

    return () => {
      container.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleResize)
    }
  }, [handleScroll, handleResize, updateScrollState])

  // Update when items change
  useEffect(() => {
    updateScrollState()
  }, [items, updateScrollState])

  return {
    containerRef,
    scrollElementRef,
    visibleItems: scrollState.visibleItems,
    totalHeight: scrollState.totalHeight,
    startIndex: scrollState.startIndex,
    endIndex: scrollState.endIndex,
    scrollToIndex,
    scrollToTop,
    updateItemHeight,
  }
}

// ============================================================================
// VIRTUAL SCROLL COMPONENT
// ============================================================================

interface VirtualScrollProps {
  items: VirtualScrollItem[]
  renderItem: (item: VirtualScrollItem, index: number) => React.ReactNode
  config?: Partial<VirtualScrollConfig>
  className?: string
  style?: React.CSSProperties
  onScroll?: (scrollTop: number) => void
  onVisibleRangeChange?: (startIndex: number, endIndex: number) => void
}

/**
 * Virtual scroll container component
 */
export const VirtualScroll: React.FC<VirtualScrollProps> = ({
  items,
  renderItem,
  config = {},
  className = '',
  style = {},
  onScroll,
  onVisibleRangeChange,
}) => {
  const virtualConfig: VirtualScrollConfig = {
    estimatedItemHeight: 100,
    overscan: 5,
    threshold: 1000,
    enableDynamicHeight: true,
    bufferSize: 10,
    ...config,
  }

  const { containerRef, visibleItems, totalHeight, startIndex, endIndex, updateItemHeight } =
    useVirtualScroll(items, virtualConfig)

  // Item measurement ref
  const itemRefs = useRef<Map<number, HTMLDivElement>>(new Map())

  // Measure item heights
  const measureItem = useCallback(
    (index: number, element: HTMLDivElement | null) => {
      if (element && virtualConfig.enableDynamicHeight) {
        itemRefs.current.set(index, element)

        // Use ResizeObserver for accurate height measurement
        const resizeObserver = new ResizeObserver((entries) => {
          for (const entry of entries) {
            const height = entry.contentRect.height
            updateItemHeight(index, height)
          }
        })

        resizeObserver.observe(element)

        return () => {
          resizeObserver.disconnect()
          itemRefs.current.delete(index)
        }
      }
      return undefined
    },
    [updateItemHeight, virtualConfig.enableDynamicHeight],
  )

  // Handle scroll events
  const handleScroll = useCallback(
    (event: React.UIEvent<HTMLDivElement>) => {
      const scrollTop = event.currentTarget.scrollTop
      onScroll?.(scrollTop)
    },
    [onScroll],
  )

  // Notify visible range changes
  useEffect(() => {
    onVisibleRangeChange?.(startIndex, endIndex)
  }, [startIndex, endIndex, onVisibleRangeChange])

  // Calculate offset for visible items
  const getItemOffset = (index: number): number => {
    let offset = 0
    for (let i = 0; i < index; i++) {
      const height =
        itemRefs.current.get(i)?.offsetHeight ||
        items[i]?.height ||
        virtualConfig.estimatedItemHeight
      offset += height
    }
    return offset
  }

  return (
    <div
      ref={containerRef}
      className={`virtual-scroll-container ${className}`}
      style={{
        height: '100%',
        overflow: 'auto',
        ...style,
      }}
      onScroll={handleScroll}
    >
      <div
        className="virtual-scroll-content"
        style={{
          height: totalHeight,
          position: 'relative',
        }}
      >
        {visibleItems.map((item, virtualIndex) => {
          const actualIndex = startIndex + virtualIndex
          const offset = getItemOffset(actualIndex)

          return (
            <div
              key={item.id}
              ref={(el) => measureItem(actualIndex, el)}
              className="virtual-scroll-item"
              style={{
                position: 'absolute',
                top: offset,
                left: 0,
                right: 0,
                minHeight: item.height || virtualConfig.estimatedItemHeight,
              }}
            >
              {renderItem(item, actualIndex)}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ============================================================================
// RICH TEXT VIRTUAL SCROLLING
// ============================================================================

/**
 * Convert rich text content to virtual scroll items
 */
export const convertRichTextToVirtualItems = (content: any): VirtualScrollItem[] => {
  const items: VirtualScrollItem[] = []

  const processNode = (node: any, index: number): VirtualScrollItem | null => {
    if (!node || typeof node !== 'object') return null

    // Estimate height based on node type
    let estimatedHeight = 50 // Default height

    switch (node.type) {
      case 'paragraph':
        estimatedHeight = 60
        break
      case 'heading':
        estimatedHeight = node.tag === 'h1' ? 80 : node.tag === 'h2' ? 70 : 60
        break
      case 'block':
        // Block components are typically larger
        estimatedHeight = getBlockEstimatedHeight(node.blockType)
        break
      case 'list':
        // Estimate based on number of items
        const itemCount = node.children?.length || 1
        estimatedHeight = 40 + itemCount * 30
        break
      case 'quote':
        estimatedHeight = 100
        break
      case 'code':
        // Estimate based on number of lines
        const lines = node.value?.split('\n').length || 1
        estimatedHeight = 40 + lines * 20
        break
      default:
        estimatedHeight = 50
    }

    return {
      id: `richtext-${index}`,
      type: node.type || 'unknown',
      estimatedHeight,
      data: node,
    }
  }

  // Process root children
  if (content?.root?.children) {
    content.root.children.forEach((child: any, index: number) => {
      const item = processNode(child, index)
      if (item) {
        items.push(item)
      }
    })
  }

  return items
}

/**
 * Get estimated height for block components
 */
const getBlockEstimatedHeight = (blockType: string): number => {
  const blockHeights: Record<string, number> = {
    // Layout blocks
    spacer: 50,
    divider: 30,
    container: 100,

    // Content blocks
    content: 200,
    banner: 80,
    code: 150,
    mediaBlock: 300,

    // Hero blocks
    hero: 400,

    // CTA blocks
    cta: 200,
    contactForm: 400,
    newsletter: 150,
    socialProof: 200,

    // Services blocks
    servicesGrid: 300,
    techStack: 250,
    processSteps: 350,
    pricingTable: 400,

    // Portfolio blocks
    projectShowcase: 500,
    caseStudy: 600,
    beforeAfter: 400,
    testimonial: 200,

    // Technical blocks
    featureGrid: 300,
    statsCounter: 200,
    faqAccordion: 400,
    timeline: 500,
  }

  return blockHeights[blockType] || 200
}

// ============================================================================
// VIRTUAL RICH TEXT COMPONENT
// ============================================================================

interface VirtualRichTextProps {
  data: any
  converters: any
  className?: string
  enableVirtualScrolling?: boolean
  virtualScrollConfig?: Partial<VirtualScrollConfig>
  onScroll?: (scrollTop: number) => void
}

/**
 * Rich text component with virtual scrolling support
 */
export const VirtualRichText: React.FC<VirtualRichTextProps> = ({
  data,
  converters,
  className = '',
  enableVirtualScrolling = false,
  virtualScrollConfig = {},
  onScroll,
}) => {
  // Convert content to virtual items
  const virtualItems = useMemo(() => {
    if (!enableVirtualScrolling) return []
    return convertRichTextToVirtualItems(data)
  }, [data, enableVirtualScrolling])

  // Render individual rich text item
  const renderRichTextItem = useCallback(
    (item: VirtualScrollItem, _index: number) => {
      const node = item.data

      // Use appropriate converter based on node type
      if (node.type === 'block' && converters.blocks?.[node.blockType]) {
        const BlockConverter = converters.blocks[node.blockType]
        return <BlockConverter key={item.id} node={node} />
      }

      // Handle other node types
      switch (node.type) {
        case 'paragraph':
          return (
            <p key={item.id} className="mb-4">
              {renderInlineContent(node.children, converters)}
            </p>
          )

        case 'heading':
          const HeadingTag = node.tag || 'h2'
          return React.createElement(
            HeadingTag,
            { key: item.id, className: 'mb-4 font-bold' },
            renderInlineContent(node.children, converters),
          )

        case 'list':
          const ListTag = node.listType === 'number' ? 'ol' : 'ul'
          return React.createElement(
            ListTag,
            { key: item.id, className: 'mb-4 ml-6' },
            node.children?.map((child: any, childIndex: number) => (
              <li key={childIndex} className="mb-2">
                {renderInlineContent(child.children, converters)}
              </li>
            )),
          )

        case 'quote':
          return (
            <blockquote key={item.id} className="border-l-4 border-gray-300 pl-4 mb-4 italic">
              {renderInlineContent(node.children, converters)}
            </blockquote>
          )

        case 'code':
          return (
            <pre key={item.id} className="bg-gray-100 p-4 rounded mb-4 overflow-x-auto">
              <code>{node.value}</code>
            </pre>
          )

        default:
          return (
            <div key={item.id} className="mb-4">
              {renderInlineContent(node.children, converters)}
            </div>
          )
      }
    },
    [converters],
  )

  // Render inline content (text, links, etc.)
  const renderInlineContent = (children: any[], converters: any): React.ReactNode => {
    if (!Array.isArray(children)) return null

    return children.map((child, index) => {
      if (typeof child === 'string') {
        return child
      }

      if (child.type === 'text') {
        let element = child.text

        if (child.bold) element = <strong key={index}>{element}</strong>
        if (child.italic) element = <em key={index}>{element}</em>
        if (child.underline) element = <u key={index}>{element}</u>

        return element
      }

      if (child.type === 'link' && converters.link) {
        return converters.link({ node: child, key: index })
      }

      return null
    })
  }

  // Decide whether to use virtual scrolling
  const shouldUseVirtualScrolling =
    enableVirtualScrolling && virtualItems.length > (virtualScrollConfig.threshold || 50)

  if (!shouldUseVirtualScrolling) {
    // Render normally without virtual scrolling
    return (
      <div className={className}>
        {/* Render using standard RichText component */}
        {data?.root?.children?.map((child: any, index: number) => {
          const item = { id: `item-${index}`, type: child.type, estimatedHeight: 100, data: child }
          return renderRichTextItem(item, index)
        })}
      </div>
    )
  }

  // Render with virtual scrolling
  return (
    <VirtualScroll
      items={virtualItems}
      renderItem={renderRichTextItem}
      config={{
        estimatedItemHeight: 100,
        overscan: 5,
        threshold: 50,
        enableDynamicHeight: true,
        bufferSize: 10,
        ...virtualScrollConfig,
      }}
      className={className}
      onScroll={onScroll}
    />
  )
}

// ============================================================================
// PERFORMANCE UTILITIES
// ============================================================================

/**
 * Calculate if content should use virtual scrolling
 */
export const shouldUseVirtualScrolling = (content: any, threshold: number = 50): boolean => {
  if (!content?.root?.children) return false

  const itemCount = content.root.children.length
  return itemCount > threshold
}

/**
 * Estimate total content height
 */
export const estimateContentHeight = (content: any): number => {
  if (!content?.root?.children) return 0

  return content.root.children.reduce((total: number, child: any) => {
    const estimatedHeight = child.type === 'block' ? getBlockEstimatedHeight(child.blockType) : 60 // Default height for text content

    return total + estimatedHeight
  }, 0)
}

// Default export
export default VirtualRichText
