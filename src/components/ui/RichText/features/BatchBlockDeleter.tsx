'use client'

import React, { useState } from 'react'

interface BatchBlockDeleterProps {
  selectedBlocks: any[]
  onDeleteBlocks: (blockIds: string[]) => void
  onError?: (errors: string[]) => void
  className?: string
  showConfirmation?: boolean
}

export const BatchBlockDeleter: React.FC<BatchBlockDeleterProps> = ({
  selectedBlocks,
  onDeleteBlocks,
  onError,
  className = '',
  showConfirmation = true,
}) => {
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDeleteClick = () => {
    if (selectedBlocks.length === 0 || isDeleting) return

    if (showConfirmation) {
      setShowConfirmationDialog(true)
    } else {
      handleConfirmDelete()
    }
  }

  const handleConfirmDelete = async () => {
    setIsDeleting(true)

    try {
      const blockIds = selectedBlocks.map((block) => block.id).filter(Boolean)
      await onDeleteBlocks(blockIds)
      setShowConfirmationDialog(false)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete blocks'
      onError?.([errorMessage])
      console.error('Batch deletion error:', error)
    } finally {
      setIsDeleting(false)
    }
  }

  const handleCancelDelete = () => {
    setShowConfirmationDialog(false)
  }

  if (selectedBlocks.length === 0) {
    return null
  }

  const blockCount = selectedBlocks.length
  const isPlural = blockCount !== 1

  return (
    <>
      <div className={`flex items-center space-x-2 ${className}`}>
        <button
          onClick={handleDeleteClick}
          disabled={isDeleting}
          className={`
            inline-flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors
            focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2
            ${
              isDeleting
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-red-100 text-red-700 hover:bg-red-200'
            }
          `}
        >
          {isDeleting ? (
            <>
              <svg
                className="w-4 h-4 mr-2 animate-spin"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Deleting...
            </>
          ) : (
            <>
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
              Delete {blockCount} Block{isPlural ? 's' : ''}
            </>
          )}
        </button>

        <span className="text-sm text-gray-600">
          {blockCount} block{isPlural ? 's' : ''} selected
        </span>
      </div>

      {/* Batch Confirmation Dialog */}
      {showConfirmation && (
        <BatchDeleteConfirmation
          selectedBlocks={selectedBlocks}
          isOpen={showConfirmationDialog}
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}
    </>
  )
}

// Specialized confirmation dialog for batch deletion
interface BatchDeleteConfirmationProps {
  selectedBlocks: any[]
  isOpen: boolean
  onConfirm: () => void
  onCancel: () => void
}

const BatchDeleteConfirmation: React.FC<BatchDeleteConfirmationProps> = ({
  selectedBlocks,
  isOpen,
  onConfirm,
  onCancel,
}) => {
  const blockCount = selectedBlocks.length
  const isPlural = blockCount !== 1

  const title = `Delete ${blockCount} Block${isPlural ? 's' : ''}`
  const message = `Are you sure you want to delete ${blockCount} selected block${isPlural ? 's' : ''}? This action cannot be undone.`

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={onCancel}
    >
      <div
        className="bg-white rounded-lg shadow-xl max-w-lg w-full mx-4 p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start space-x-4">
          {/* Warning Icon */}
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <svg
                className="w-6 h-6 text-red-600"
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
          </div>

          {/* Content */}
          <div className="flex-1">
            <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>

            <p className="text-sm text-gray-600 mb-4">{message}</p>

            {/* Block List Preview */}
            <div className="bg-gray-50 rounded-md p-3 mb-4 max-h-32 overflow-y-auto">
              <div className="text-xs font-medium text-gray-700 mb-2">Blocks to be deleted:</div>
              <div className="space-y-1">
                {selectedBlocks.slice(0, 5).map((block, index) => (
                  <div key={index} className="flex items-center space-x-2 text-xs">
                    <div className="w-3 h-3 bg-blue-100 rounded flex items-center justify-center">
                      <svg
                        className="w-2 h-2 text-blue-600"
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
                    <span className="text-gray-600 truncate">
                      {block.blockType || 'Unknown Block'}
                      {(block.title || block.heading || block.name) && (
                        <span className="text-gray-500">
                          {' '}
                          - {block.title || block.heading || block.name}
                        </span>
                      )}
                    </span>
                  </div>
                ))}
                {selectedBlocks.length > 5 && (
                  <div className="text-xs text-gray-500 italic">
                    ... and {selectedBlocks.length - 5} more
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex space-x-3">
              <button
                onClick={onConfirm}
                className="px-4 py-2 text-sm font-medium bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                Delete All
              </button>

              <button
                onClick={onCancel}
                className="px-4 py-2 text-sm font-medium bg-white text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                Cancel
              </button>
            </div>

            {/* Keyboard shortcuts hint */}
            <div className="mt-3 text-xs text-gray-500">
              Press <kbd className="px-1 py-0.5 bg-white border border-gray-300 rounded">Esc</kbd>{' '}
              to cancel
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BatchBlockDeleter
