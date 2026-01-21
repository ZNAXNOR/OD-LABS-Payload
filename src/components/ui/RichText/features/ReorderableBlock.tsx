'use client'

import React, { useState, useRef } from 'react'
import { BlockReorderHandle } from './BlockReorderHandle'
import { BlockDropZone } from './BlockDropZone'

interface ReorderableBlockProps {
  blockId: string
  children: React.ReactNode
  onMoveUp: () => void
  onMoveDown: () => void
  onReorder: (draggedBlockId: string, targetBlockId: string, position: 'above' | 'below') => void
  canMoveUp: boolean
  canMoveDown: boolean
  isDraggable?: boolean
  showDropZones?: boolean
  className?: string
}

export const ReorderableBlock: React.FC<ReorderableBlockProps> = ({
  blockId,
  children,
  onMoveUp,
  onMoveDown,
  onReorder,
  canMoveUp,
  canMoveDown,
  isDraggable = true,
  showDropZones = true,
  className = '',
}) => {
  const [isDragging, setIsDragging] = useState(false)
  const [isDraggedOver, setIsDraggedOver] = useState(false)
  const [showHandle, setShowHandle] = useState(false)
  const blockRef = useRef<HTMLDivElement>(null)

  const handleDragStart = (event: React.DragEvent) => {
    setIsDragging(true)
    event.dataTransfer.setData('text/plain', blockId)
    event.dataTransfer.effectAllowed = 'move'

    // Add a slight delay to allow the drag image to be set
    setTimeout(() => {
      if (blockRef.current) {
        blockRef.current.style.opacity = '0.5'
      }
    }, 0)
  }

  const handleDragEnd = () => {
    setIsDragging(false)
    if (blockRef.current) {
      blockRef.current.style.opacity = '1'
    }
  }

  const handleDropAbove = (draggedBlockId: string) => {
    if (draggedBlockId !== blockId) {
      onReorder(draggedBlockId, blockId, 'above')
    }
  }

  const handleDropBelow = (draggedBlockId: string) => {
    if (draggedBlockId !== blockId) {
      onReorder(draggedBlockId, blockId, 'below')
    }
  }

  const handleDragOverBlock = (event: React.DragEvent) => {
    event.preventDefault()
    const draggedBlockId = event.dataTransfer.getData('text/plain')
    if (draggedBlockId && draggedBlockId !== blockId) {
      setIsDraggedOver(true)
    }
  }

  const handleDragLeaveBlock = () => {
    setIsDraggedOver(false)
  }

  return (
    <div className={`relative group ${className}`}>
      {/* Drop zone above */}
      {showDropZones && (
        <BlockDropZone onDrop={handleDropAbove} position="above" isVisible={!isDragging} />
      )}

      {/* Block container */}
      <div
        ref={blockRef}
        onMouseEnter={() => setShowHandle(true)}
        onMouseLeave={() => setShowHandle(false)}
        onDragOver={handleDragOverBlock}
        onDragLeave={handleDragLeaveBlock}
        className={`
          relative transition-all duration-200
          ${isDragging ? 'opacity-50' : ''}
          ${isDraggedOver ? 'ring-2 ring-blue-300 ring-opacity-50' : ''}
        `}
      >
        {/* Drag handle */}
        {(showHandle || isDragging) && isDraggable && (
          <div className="absolute -left-10 top-2 z-10">
            <BlockReorderHandle
              blockId={blockId}
              onMoveUp={onMoveUp}
              onMoveDown={onMoveDown}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              canMoveUp={canMoveUp}
              canMoveDown={canMoveDown}
              isDraggable={isDraggable}
            />
          </div>
        )}

        {/* Block content */}
        <div
          className={`
          ${showHandle ? 'ml-2' : ''}
          transition-all duration-200
        `}
        >
          {children}
        </div>

        {/* Hover overlay */}
        {showHandle && !isDragging && (
          <div className="absolute inset-0 border border-blue-200 rounded-md pointer-events-none opacity-50" />
        )}
      </div>

      {/* Drop zone below */}
      {showDropZones && (
        <BlockDropZone onDrop={handleDropBelow} position="below" isVisible={!isDragging} />
      )}
    </div>
  )
}

export default ReorderableBlock
