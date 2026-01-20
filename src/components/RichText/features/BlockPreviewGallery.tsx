'use client'

import React, { useState } from 'react'
import { BlockPreview } from './BlockPreview'
import { getBlockBySlug } from '@/fields/blockEmbedding'

interface BlockPreviewGalleryProps {
  blocks: any[]
  isOpen: boolean
  onClose: () => void
  onSelectBlock?: (block: any) => void
  onEditBlock?: (block: any) => void
  onDuplicateBlock?: (block: any) => void
  title?: string
  className?: string
}

export const BlockPreviewGallery: React.FC<BlockPreviewGalleryProps> = ({
  blocks,
  isOpen,
  onClose,
  onSelectBlock,
  onEditBlock,
  onDuplicateBlock,
  title = 'Block Gallery',
  className = '',
}) => {
  const [selectedBlockIndex, setSelectedBlockIndex] = useState<number | null>(null)
  const [previewPosition, setPreviewPosition] = useState({ x: 0, y: 0 })

  const handleBlockClick = (index: number, event: React.MouseEvent) => {
    const rect = event.currentTarget.getBoundingClientRect()
    setPreviewPosition({
      x: rect.right + 10,
      y: rect.top,
    })
    setSelectedBlockIndex(index)
  }

  const handleSelectBlock = (block: any) => {
    onSelectBlock?.(block)
    onClose()
  }

  const handleEditBlock = (block: any) => {
    onEditBlock?.(block)
    setSelectedBlockIndex(null)
  }

  const handleDuplicateBlock = (block: any) => {
    onDuplicateBlock?.(block)
    setSelectedBlockIndex(null)
  }

  const handleClosePreview = () => {
    setSelectedBlockIndex(null)
  }

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      if (selectedBlockIndex !== null) {
        setSelectedBlockIndex(null)
      } else {
        onClose()
      }
    }
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={onClose}
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      <div
        className={`bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[80vh] overflow-hidden ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
              <p className="text-sm text-gray-600 mt-1">
                {blocks.length} block{blocks.length !== 1 ? 's' : ''} available
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close gallery"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Block Grid */}
        <div className="p-4 overflow-y-auto max-h-[calc(80vh-120px)]">
          {blocks.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <svg
                className="w-16 h-16 mx-auto mb-4 text-gray-300"
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
              <p className="text-lg">No blocks to display</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {blocks.map((block, index) => (
                <BlockGalleryItem
                  key={block.id || index}
                  block={block}
                  index={index}
                  onClick={(e) => handleBlockClick(index, e)}
                  onSelect={() => handleSelectBlock(block)}
                  isSelected={selectedBlockIndex === index}
                />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex justify-between items-center text-sm text-gray-600">
            <span>Click a block to preview, double-click to select</span>
            <span>
              Press{' '}
              <kbd className="px-2 py-1 bg-white border border-gray-300 rounded text-xs">Esc</kbd>{' '}
              to close
            </span>
          </div>
        </div>
      </div>

      {/* Block Preview */}
      {selectedBlockIndex !== null && (
        <BlockPreview
          blockData={blocks[selectedBlockIndex]}
          isVisible={true}
          onClose={handleClosePreview}
          position={previewPosition}
          onEdit={() => handleEditBlock(blocks[selectedBlockIndex])}
          onDuplicate={() => handleDuplicateBlock(blocks[selectedBlockIndex])}
        />
      )}
    </div>
  )
}

// Individual block item in the gallery
interface BlockGalleryItemProps {
  block: any
  index: number
  onClick: (event: React.MouseEvent) => void
  onSelect: () => void
  isSelected: boolean
}

const BlockGalleryItem: React.FC<BlockGalleryItemProps> = ({
  block,
  index,
  onClick,
  onSelect,
  isSelected,
}) => {
  const blockConfig = getBlockBySlug(block.blockType)
  const blockName = blockConfig?.labels?.singular || block.blockType || 'Block'

  // Get a preview text from the block data
  const getPreviewText = (blockData: any): string => {
    const textFields = ['title', 'heading', 'name', 'description', 'content', 'text']

    for (const field of textFields) {
      if (blockData[field] && typeof blockData[field] === 'string') {
        return blockData[field].substring(0, 100)
      }
    }

    return 'No preview available'
  }

  const previewText = getPreviewText(block)

  return (
    <div
      className={`
        p-4 border rounded-lg cursor-pointer transition-all duration-200
        ${
          isSelected
            ? 'border-blue-300 bg-blue-50 shadow-md'
            : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
        }
      `}
      onClick={onClick}
      onDoubleClick={onSelect}
    >
      {/* Block Header */}
      <div className="flex items-center space-x-2 mb-3">
        <div className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center">
          <svg
            className="w-4 h-4 text-blue-600"
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
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-gray-900 truncate">{blockName}</h3>
          <p className="text-xs text-gray-500">{block.blockType}</p>
        </div>
      </div>

      {/* Block Preview */}
      <div className="text-sm text-gray-600 line-clamp-3 mb-3">{previewText}</div>

      {/* Block Metadata */}
      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>#{index + 1}</span>
        {blockConfig?.admin?.group && (
          <span className="px-2 py-1 bg-gray-100 rounded-full">
            {typeof blockConfig.admin.group === 'string' ? blockConfig.admin.group : 'Block'}
          </span>
        )}
      </div>

      {/* Selection Indicator */}
      {isSelected && (
        <div className="absolute top-2 right-2">
          <div className="w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center">
            <svg
              className="w-3 h-3 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>
      )}
    </div>
  )
}

export default BlockPreviewGallery
