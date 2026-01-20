'use client'

import React, { useState, useRef } from 'react'

interface BlockReorderHandleProps {
  onMoveUp: () => void
  onMoveDown: () => void
  onDragStart?: (event: React.DragEvent) => void
  onDragEnd?: (event: React.DragEvent) => void
  canMoveUp: boolean
  canMoveDown: boolean
  isDraggable?: boolean
  blockId: string
}

export const BlockReorderHandle: React.FC<BlockReorderHandleProps> = ({
  onMoveUp,
  onMoveDown,
  onDragStart,
  onDragEnd,
  canMoveUp,
  canMoveDown,
  isDraggable = true,
  blockId,
}) => {
  const [isDragging, setIsDragging] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)
  const dragRef = useRef<HTMLDivElement>(null)

  const handleDragStart = (event: React.DragEvent) => {
    setIsDragging(true)
    event.dataTransfer.setData('text/plain', blockId)
    event.dataTransfer.effectAllowed = 'move'

    // Create a custom drag image
    if (dragRef.current) {
      const dragImage = dragRef.current.cloneNode(true) as HTMLElement
      dragImage.style.transform = 'rotate(5deg)'
      dragImage.style.opacity = '0.8'
      document.body.appendChild(dragImage)
      event.dataTransfer.setDragImage(dragImage, 10, 10)
      setTimeout(() => document.body.removeChild(dragImage), 0)
    }

    onDragStart?.(event)
  }

  const handleDragEnd = (event: React.DragEvent) => {
    setIsDragging(false)
    onDragEnd?.(event)
  }

  return (
    <div className="relative">
      {/* Drag Handle */}
      <div
        ref={dragRef}
        draggable={isDraggable}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className={`
          flex flex-col items-center justify-center w-6 h-8 cursor-move transition-all duration-200
          ${isDragging ? 'opacity-50' : 'opacity-60 hover:opacity-100'}
          ${isDraggable ? 'cursor-move' : 'cursor-not-allowed'}
        `}
        title="Drag to reorder"
      >
        {/* Drag dots */}
        <div className="flex flex-col space-y-0.5">
          <div className="flex space-x-0.5">
            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
          </div>
          <div className="flex space-x-0.5">
            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
          </div>
          <div className="flex space-x-0.5">
            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Arrow Controls */}
      <div className="absolute -right-8 top-0 flex flex-col">
        {/* Move Up */}
        <button
          onClick={onMoveUp}
          disabled={!canMoveUp}
          className={`
            p-1 transition-colors rounded
            ${
              canMoveUp
                ? 'text-gray-500 hover:text-blue-600 hover:bg-blue-50'
                : 'text-gray-300 cursor-not-allowed'
            }
          `}
          title="Move up"
          aria-label="Move block up"
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
        </button>

        {/* Move Down */}
        <button
          onClick={onMoveDown}
          disabled={!canMoveDown}
          className={`
            p-1 transition-colors rounded
            ${
              canMoveDown
                ? 'text-gray-500 hover:text-blue-600 hover:bg-blue-50'
                : 'text-gray-300 cursor-not-allowed'
            }
          `}
          title="Move down"
          aria-label="Move block down"
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* Tooltip */}
      {showTooltip && (
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap z-50">
          Drag to reorder
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-gray-900"></div>
        </div>
      )}
    </div>
  )
}

export default BlockReorderHandle
