'use client'

import React, { useState } from 'react'

interface BlockDropZoneProps {
  onDrop: (draggedBlockId: string) => void
  position: 'above' | 'below'
  isVisible: boolean
  className?: string
}

export const BlockDropZone: React.FC<BlockDropZoneProps> = ({
  onDrop,
  position,
  isVisible,
  className = '',
}) => {
  const [isDragOver, setIsDragOver] = useState(false)

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
    setIsDragOver(true)
  }

  const handleDragLeave = (event: React.DragEvent) => {
    // Only set drag over to false if we're actually leaving the drop zone
    const rect = event.currentTarget.getBoundingClientRect()
    const x = event.clientX
    const y = event.clientY

    if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
      setIsDragOver(false)
    }
  }

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault()
    setIsDragOver(false)

    const draggedBlockId = event.dataTransfer.getData('text/plain')
    if (draggedBlockId) {
      onDrop(draggedBlockId)
    }
  }

  if (!isVisible) return null

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`
        relative transition-all duration-200 ease-in-out
        ${isDragOver ? 'h-12' : 'h-2'}
        ${className}
      `}
    >
      {/* Drop indicator */}
      <div
        className={`
          absolute inset-x-0 transition-all duration-200 ease-in-out
          ${position === 'above' ? 'top-0' : 'bottom-0'}
          ${
            isDragOver
              ? 'h-12 bg-blue-50 border-2 border-dashed border-blue-300 rounded-lg'
              : 'h-1 bg-transparent'
          }
        `}
      >
        {isDragOver && (
          <div className="flex items-center justify-center h-full">
            <div className="flex items-center space-x-2 text-blue-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              <span className="text-sm font-medium">Drop block {position}</span>
            </div>
          </div>
        )}
      </div>

      {/* Hover line indicator when not dragging over */}
      {!isDragOver && (
        <div
          className={`
            absolute inset-x-0 h-0.5 bg-blue-400 opacity-0 transition-opacity duration-200
            ${position === 'above' ? 'top-0' : 'bottom-0'}
            hover:opacity-100
          `}
        />
      )}
    </div>
  )
}

export default BlockDropZone
