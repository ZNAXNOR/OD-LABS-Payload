'use client'

import React, { useState, useRef, useEffect } from 'react'
import { getBlockBySlug } from '@/fields/blockEmbedding'

interface BlockPreviewProps {
  blockData: any
  isVisible: boolean
  onClose: () => void
  position?: { x: number; y: number }
  maxWidth?: number
  maxHeight?: number
  showHeader?: boolean
  showActions?: boolean
  onEdit?: () => void
  onDuplicate?: () => void
}

export const BlockPreview: React.FC<BlockPreviewProps> = ({
  blockData,
  isVisible,
  onClose,
  position = { x: 0, y: 0 },
  maxWidth = 400,
  maxHeight = 300,
  showHeader = true,
  showActions = true,
  onEdit,
  onDuplicate,
}) => {
  const [adjustedPosition, setAdjustedPosition] = useState(position)
  const previewRef = useRef<HTMLDivElement>(null)

  const block = getBlockBySlug(blockData?.blockType)
  const blockName = block?.labels?.singular || blockData?.blockType || 'Block'

  // Adjust position to stay within viewport
  useEffect(() => {
    if (isVisible && previewRef.current) {
      const preview = previewRef.current
      const rect = preview.getBoundingClientRect()
      const viewport = {
        width: window.innerWidth,
        height: window.innerHeight,
      }

      let newX = position.x
      let newY = position.y

      // Adjust horizontal position
      if (position.x + rect.width > viewport.width) {
        newX = viewport.width - rect.width - 20
      }

      // Adjust vertical position
      if (position.y + rect.height > viewport.height) {
        newY = viewport.height - rect.height - 20
      }

      // Ensure preview doesn't go off the left or top edge
      newX = Math.max(20, newX)
      newY = Math.max(20, newY)

      setAdjustedPosition({ x: newX, y: newY })
    }
  }, [isVisible, position])

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (previewRef.current && !previewRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    if (isVisible) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('keydown', handleEscape)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isVisible, onClose])

  if (!isVisible || !blockData) return null

  return (
    <div
      ref={previewRef}
      className="fixed z-50 bg-white border border-gray-200 rounded-lg shadow-xl overflow-hidden"
      style={{
        left: adjustedPosition.x,
        top: adjustedPosition.y,
        maxWidth: `${maxWidth}px`,
        maxHeight: `${maxHeight}px`,
      }}
    >
      {/* Header */}
      {showHeader && (
        <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 bg-blue-100 rounded flex items-center justify-center">
                <svg
                  className="w-3 h-3 text-blue-600"
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
              <div>
                <h3 className="text-sm font-medium text-gray-900">{blockName}</h3>
                <p className="text-xs text-gray-500">Block Preview</p>
              </div>
            </div>

            {/* Header Actions */}
            <div className="flex items-center space-x-1">
              {showActions && onEdit && (
                <button
                  onClick={onEdit}
                  className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                  title="Edit block"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                </button>
              )}

              {showActions && onDuplicate && (
                <button
                  onClick={onDuplicate}
                  className="p-1 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded transition-colors"
                  title="Duplicate block"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                </button>
              )}

              <button
                onClick={onClose}
                className="p-1 text-gray-400 hover:text-gray-600 rounded transition-colors"
                title="Close preview"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
        </div>
      )}

      {/* Preview Content */}
      <div
        className="p-4 overflow-auto"
        style={{ maxHeight: `${maxHeight - (showHeader ? 60 : 0)}px` }}
      >
        <BlockPreviewContent blockData={blockData} block={block} />
      </div>

      {/* Footer */}
      <div className="px-4 py-2 border-t border-gray-100 bg-gray-50 text-xs text-gray-500">
        <div className="flex justify-between items-center">
          <span>Preview Mode</span>
          <span>
            Press <kbd className="px-1 py-0.5 bg-white border border-gray-300 rounded">Esc</kbd> to
            close
          </span>
        </div>
      </div>
    </div>
  )
}

// Component to render the actual block preview content
interface BlockPreviewContentProps {
  blockData: any
  block: any
}

const BlockPreviewContent: React.FC<BlockPreviewContentProps> = ({ blockData, block }) => {
  // This is a simplified preview renderer
  // In a real implementation, you'd want to render the actual block component
  // or create specialized preview components for each block type

  const renderFieldPreview = (key: string, value: any): React.ReactNode => {
    if (value === null || value === undefined) return null

    if (typeof value === 'string') {
      if (value.length === 0) return null

      // Truncate long strings
      const truncated = value.length > 100 ? `${value.substring(0, 100)}...` : value

      return (
        <div key={key} className="mb-2">
          <dt className="text-xs font-medium text-gray-500 capitalize">
            {key.replace(/([A-Z])/g, ' $1').trim()}
          </dt>
          <dd className="text-sm text-gray-900 mt-1">{truncated}</dd>
        </div>
      )
    }

    if (typeof value === 'boolean') {
      return (
        <div key={key} className="mb-2">
          <dt className="text-xs font-medium text-gray-500 capitalize">
            {key.replace(/([A-Z])/g, ' $1').trim()}
          </dt>
          <dd className="text-sm text-gray-900 mt-1">
            <span
              className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                value ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
              }`}
            >
              {value ? 'Yes' : 'No'}
            </span>
          </dd>
        </div>
      )
    }

    if (typeof value === 'number') {
      return (
        <div key={key} className="mb-2">
          <dt className="text-xs font-medium text-gray-500 capitalize">
            {key.replace(/([A-Z])/g, ' $1').trim()}
          </dt>
          <dd className="text-sm text-gray-900 mt-1">{value}</dd>
        </div>
      )
    }

    if (Array.isArray(value)) {
      if (value.length === 0) return null

      return (
        <div key={key} className="mb-2">
          <dt className="text-xs font-medium text-gray-500 capitalize">
            {key.replace(/([A-Z])/g, ' $1').trim()}
          </dt>
          <dd className="text-sm text-gray-900 mt-1">
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
              {value.length} item{value.length !== 1 ? 's' : ''}
            </span>
          </dd>
        </div>
      )
    }

    if (typeof value === 'object') {
      // Handle nested objects
      const hasContent = Object.values(value).some((v) => v !== null && v !== undefined && v !== '')
      if (!hasContent) return null

      return (
        <div key={key} className="mb-2">
          <dt className="text-xs font-medium text-gray-500 capitalize">
            {key.replace(/([A-Z])/g, ' $1').trim()}
          </dt>
          <dd className="text-sm text-gray-900 mt-1">
            <div className="bg-gray-50 rounded p-2 text-xs">
              {Object.entries(value)
                .slice(0, 3)
                .map(([subKey, subValue]) => (
                  <div key={subKey} className="flex justify-between">
                    <span className="text-gray-600">{subKey}:</span>
                    <span className="text-gray-900 truncate ml-2">
                      {typeof subValue === 'string' ? subValue.substring(0, 20) : String(subValue)}
                    </span>
                  </div>
                ))}
              {Object.keys(value).length > 3 && (
                <div className="text-gray-500 italic">
                  ... and {Object.keys(value).length - 3} more
                </div>
              )}
            </div>
          </dd>
        </div>
      )
    }

    return null
  }

  // Get the most important fields to show in preview
  const importantFields = [
    'title',
    'heading',
    'name',
    'description',
    'content',
    'text',
    'variant',
    'type',
  ]
  const otherFields = Object.keys(blockData).filter(
    (key) =>
      !importantFields.includes(key) &&
      !['id', 'blockType', 'createdAt', 'updatedAt'].includes(key),
  )

  const fieldsToShow = [...importantFields, ...otherFields.slice(0, 5)]

  return (
    <div className="space-y-3">
      {/* Block Type Badge */}
      <div className="flex items-center space-x-2">
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
          {blockData.blockType || 'Unknown'}
        </span>
        {block?.admin?.group && (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-600">
            {block.admin.group}
          </span>
        )}
      </div>

      {/* Field Previews */}
      <dl className="space-y-2">
        {fieldsToShow
          .map((key) => {
            const value = blockData[key]
            return renderFieldPreview(key, value)
          })
          .filter(Boolean)}
      </dl>

      {/* Show if there are more fields */}
      {Object.keys(blockData).length > fieldsToShow.length + 4 && (
        <div className="text-xs text-gray-500 italic border-t border-gray-100 pt-2">
          ... and {Object.keys(blockData).length - fieldsToShow.length - 4} more fields
        </div>
      )}

      {/* Empty state */}
      {fieldsToShow.every((key) => {
        const value = blockData[key]
        return (
          value === null ||
          value === undefined ||
          value === '' ||
          (Array.isArray(value) && value.length === 0)
        )
      }) && (
        <div className="text-center py-4 text-gray-500">
          <svg
            className="w-8 h-8 mx-auto mb-2 text-gray-300"
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
          <p className="text-sm">No content to preview</p>
          <p className="text-xs mt-1">Configure this block to see a preview</p>
        </div>
      )}
    </div>
  )
}

export default BlockPreview
