'use client'

import React, { useState } from 'react'
import { getBlockBySlug } from '@/fields/blockEmbedding'

interface BlockToolbarProps {
  blockSlug: string
  blockData: any
  onConfigureBlock: () => void
  onDuplicateBlock: () => void
  onDeleteBlock: () => void
  onMoveUp?: () => void
  onMoveDown?: () => void
  canMoveUp?: boolean
  canMoveDown?: boolean
  position?: { x: number; y: number }
  isVisible: boolean
}

export const BlockToolbar: React.FC<BlockToolbarProps> = ({
  blockSlug,
  // blockData, // Commented out unused parameter
  onConfigureBlock,
  onDuplicateBlock,
  onDeleteBlock,
  onMoveUp,
  onMoveDown,
  canMoveUp = false,
  canMoveDown = false,
  position = { x: 0, y: 0 },
  isVisible,
}) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const block = getBlockBySlug(blockSlug)

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true)
  }

  const handleConfirmDelete = () => {
    onDeleteBlock()
    setShowDeleteConfirm(false)
  }

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false)
  }

  if (!isVisible || !block) return null

  return (
    <div
      className="absolute z-40 bg-white border border-gray-200 rounded-lg shadow-lg"
      style={{
        left: position.x,
        top: position.y,
      }}
    >
      {showDeleteConfirm ? (
        // Delete confirmation
        <div className="p-3 min-w-64">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <svg
                className="w-5 h-5 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-medium text-gray-900">Delete Block</h3>
              <p className="text-sm text-gray-600 mt-1">
                Are you sure you want to delete this{' '}
                {typeof block.labels?.singular === 'string'
                  ? block.labels.singular.toLowerCase()
                  : 'block'}
                ? This action cannot be undone.
              </p>
              <div className="flex space-x-2 mt-3">
                <button
                  onClick={handleConfirmDelete}
                  className="px-3 py-1.5 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
                <button
                  onClick={handleCancelDelete}
                  className="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Main toolbar
        <div className="flex items-center divide-x divide-gray-200">
          {/* Block Info */}
          <div className="px-3 py-2">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-blue-100 rounded flex items-center justify-center">
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
              <span className="text-sm font-medium text-gray-700">
                {typeof block.labels?.singular === 'string' ? block.labels.singular : block.slug}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center">
            {/* Move Up */}
            {onMoveUp && (
              <button
                onClick={onMoveUp}
                disabled={!canMoveUp}
                className={`p-2 transition-colors ${
                  canMoveUp
                    ? 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                    : 'text-gray-300 cursor-not-allowed'
                }`}
                title="Move up"
                aria-label="Move block up"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 15l7-7 7 7"
                  />
                </svg>
              </button>
            )}

            {/* Move Down */}
            {onMoveDown && (
              <button
                onClick={onMoveDown}
                disabled={!canMoveDown}
                className={`p-2 transition-colors ${
                  canMoveDown
                    ? 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                    : 'text-gray-300 cursor-not-allowed'
                }`}
                title="Move down"
                aria-label="Move block down"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
            )}

            {/* Configure */}
            <button
              onClick={onConfigureBlock}
              className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"
              title="Configure block"
              aria-label="Configure block"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </button>

            {/* Duplicate */}
            <button
              onClick={onDuplicateBlock}
              className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 transition-colors"
              title="Duplicate block"
              aria-label="Duplicate block"
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

            {/* Delete */}
            <button
              onClick={handleDeleteClick}
              className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 transition-colors"
              title="Delete block"
              aria-label="Delete block"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default BlockToolbar
