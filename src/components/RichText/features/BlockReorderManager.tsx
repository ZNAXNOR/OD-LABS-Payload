'use client'

import React, { useState, useCallback } from 'react'
import { ReorderableBlock } from './ReorderableBlock'

interface BlockItem {
  id: string
  type: string
  data: any
}

interface BlockReorderManagerProps {
  blocks: BlockItem[]
  onReorderBlocks: (newBlocks: BlockItem[]) => void
  renderBlock: (block: BlockItem, index: number) => React.ReactNode
  className?: string
  enableDragAndDrop?: boolean
  enableArrowControls?: boolean
}

export const BlockReorderManager: React.FC<BlockReorderManagerProps> = ({
  blocks,
  onReorderBlocks,
  renderBlock,
  className = '',
  enableDragAndDrop = true,
  enableArrowControls = true,
}) => {
  const [draggedBlockId] = useState<string | null>(null)

  // Move block up by one position
  const moveBlockUp = useCallback(
    (blockId: string) => {
      const currentIndex = blocks.findIndex((block) => block.id === blockId)
      if (currentIndex > 0) {
        const newBlocks = [...blocks]
        const [movedBlock] = newBlocks.splice(currentIndex, 1)
        if (movedBlock) {
          newBlocks.splice(currentIndex - 1, 0, movedBlock)
          onReorderBlocks(newBlocks)
        }
      }
    },
    [blocks, onReorderBlocks],
  )

  // Move block down by one position
  const moveBlockDown = useCallback(
    (blockId: string) => {
      const currentIndex = blocks.findIndex((block) => block.id === blockId)
      if (currentIndex < blocks.length - 1) {
        const newBlocks = [...blocks]
        const [movedBlock] = newBlocks.splice(currentIndex, 1)
        if (movedBlock) {
          newBlocks.splice(currentIndex + 1, 0, movedBlock)
          onReorderBlocks(newBlocks)
        }
      }
    },
    [blocks, onReorderBlocks],
  )

  // Handle drag and drop reordering
  const handleReorder = useCallback(
    (draggedBlockId: string, targetBlockId: string, position: 'above' | 'below') => {
      const draggedIndex = blocks.findIndex((block) => block.id === draggedBlockId)
      const targetIndex = blocks.findIndex((block) => block.id === targetBlockId)

      if (draggedIndex === -1 || targetIndex === -1 || draggedIndex === targetIndex) {
        return
      }

      const newBlocks = [...blocks]
      const [draggedBlock] = newBlocks.splice(draggedIndex, 1)

      if (!draggedBlock) return

      // Calculate the new position
      let insertIndex = targetIndex
      if (draggedIndex < targetIndex) {
        // If dragging down, adjust for the removed item
        insertIndex = targetIndex - 1
      }

      if (position === 'below') {
        insertIndex += 1
      }

      // Ensure the index is within bounds
      insertIndex = Math.max(0, Math.min(insertIndex, newBlocks.length))

      newBlocks.splice(insertIndex, 0, draggedBlock)
      onReorderBlocks(newBlocks)
    },
    [blocks, onReorderBlocks],
  )

  // Check if a block can move up
  const canMoveUp = useCallback(
    (blockId: string) => {
      const index = blocks.findIndex((block) => block.id === blockId)
      return index > 0
    },
    [blocks],
  )

  // Check if a block can move down
  const canMoveDown = useCallback(
    (blockId: string) => {
      const index = blocks.findIndex((block) => block.id === blockId)
      return index < blocks.length - 1
    },
    [blocks],
  )

  if (blocks.length === 0) {
    return (
      <div className={`text-center py-8 text-gray-500 ${className}`}>
        <svg
          className="w-12 h-12 mx-auto mb-4 text-gray-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2"
          />
        </svg>
        <p>No blocks to display</p>
      </div>
    )
  }

  return (
    <div className={`space-y-1 ${className}`}>
      {blocks.map((block, index) => (
        <ReorderableBlock
          key={block.id}
          blockId={block.id}
          onMoveUp={() => moveBlockUp(block.id)}
          onMoveDown={() => moveBlockDown(block.id)}
          onReorder={handleReorder}
          canMoveUp={enableArrowControls && canMoveUp(block.id)}
          canMoveDown={enableArrowControls && canMoveDown(block.id)}
          isDraggable={enableDragAndDrop}
          showDropZones={enableDragAndDrop}
        >
          {renderBlock(block, index)}
        </ReorderableBlock>
      ))}

      {/* Global drop zone at the end */}
      {enableDragAndDrop && draggedBlockId && (
        <div
          onDragOver={(e) => {
            e.preventDefault()
            e.dataTransfer.dropEffect = 'move'
          }}
          onDrop={(e) => {
            e.preventDefault()
            const draggedId = e.dataTransfer.getData('text/plain')
            if (draggedId && blocks.length > 0) {
              const lastBlock = blocks[blocks.length - 1]
              if (lastBlock) {
                handleReorder(draggedId, lastBlock.id, 'below')
              }
            }
          }}
          className="h-8 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-500 text-sm opacity-0 hover:opacity-100 transition-opacity"
        >
          Drop here to move to end
        </div>
      )}
    </div>
  )
}

export default BlockReorderManager
