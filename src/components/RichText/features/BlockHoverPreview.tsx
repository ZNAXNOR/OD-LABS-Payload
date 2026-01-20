'use client'

import React, { useState, useRef, useEffect } from 'react'
import { BlockPreview } from './BlockPreview'

interface BlockHoverPreviewProps {
  blockData: any
  children: React.ReactNode
  delay?: number
  disabled?: boolean
  previewProps?: {
    maxWidth?: number
    maxHeight?: number
    showHeader?: boolean
    showActions?: boolean
  }
  onEdit?: () => void
  onDuplicate?: () => void
}

export const BlockHoverPreview: React.FC<BlockHoverPreviewProps> = ({
  blockData,
  children,
  delay = 500,
  disabled = false,
  previewProps = {},
  onEdit,
  onDuplicate,
}) => {
  const [showPreview, setShowPreview] = useState(false)
  const [previewPosition, setPreviewPosition] = useState({ x: 0, y: 0 })
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleMouseEnter = () => {
    if (disabled) return

    // Clear any existing hide timeout
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current)
      hideTimeoutRef.current = null
    }

    // Set up show timeout
    hoverTimeoutRef.current = setTimeout(() => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        const x = rect.right + 10
        const y = rect.top

        setPreviewPosition({ x, y })
        setShowPreview(true)
      }
    }, delay)
  }

  const handleMouseLeave = () => {
    // Clear show timeout
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current)
      hoverTimeoutRef.current = null
    }

    // Set up hide timeout with a small delay to allow moving to preview
    hideTimeoutRef.current = setTimeout(() => {
      setShowPreview(false)
    }, 100)
  }

  const handlePreviewMouseEnter = () => {
    // Clear hide timeout when hovering over preview
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current)
      hideTimeoutRef.current = null
    }
  }

  const handlePreviewMouseLeave = () => {
    // Hide preview when leaving preview area
    setShowPreview(false)
  }

  const handleClosePreview = () => {
    setShowPreview(false)
  }

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current)
      }
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current)
      }
    }
  }, [])

  return (
    <>
      <div
        ref={containerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="relative"
      >
        {children}
      </div>

      {/* Preview with hover handling */}
      {showPreview && (
        <div onMouseEnter={handlePreviewMouseEnter} onMouseLeave={handlePreviewMouseLeave}>
          <BlockPreview
            blockData={blockData}
            isVisible={showPreview}
            onClose={handleClosePreview}
            position={previewPosition}
            maxWidth={previewProps.maxWidth}
            maxHeight={previewProps.maxHeight}
            showHeader={previewProps.showHeader}
            showActions={previewProps.showActions}
            onEdit={onEdit}
            onDuplicate={onDuplicate}
          />
        </div>
      )}
    </>
  )
}

export default BlockHoverPreview
