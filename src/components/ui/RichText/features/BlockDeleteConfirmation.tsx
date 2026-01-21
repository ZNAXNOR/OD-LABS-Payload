'use client'

import React, { useState, useEffect } from 'react'
import { getBlockBySlug } from '@/fields/blockEmbedding'

interface BlockDeleteConfirmationProps {
  blockData: any
  isOpen: boolean
  onConfirm: () => void
  onCancel: () => void
  title?: string
  message?: string
  confirmText?: string
  cancelText?: string
  variant?: 'modal' | 'inline'
  showBlockInfo?: boolean
}

export const BlockDeleteConfirmation: React.FC<BlockDeleteConfirmationProps> = ({
  blockData,
  isOpen,
  onConfirm,
  onCancel,
  title,
  message,
  confirmText = 'Delete',
  cancelText = 'Cancel',
  variant = 'modal',
  showBlockInfo = true,
}) => {
  const [isDeleting, setIsDeleting] = useState(false)

  const block = getBlockBySlug(blockData?.blockType)
  const blockName = block?.labels?.singular || blockData?.blockType || 'block'

  const defaultTitle = `Delete ${blockName}`
  const defaultMessage = `Are you sure you want to delete this ${blockName.toLowerCase()}? This action cannot be undone.`

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen && !isDeleting) {
        onCancel()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, isDeleting, onCancel])

  const handleConfirm = async () => {
    setIsDeleting(true)
    try {
      await onConfirm()
    } finally {
      setIsDeleting(false)
    }
  }

  const handleCancel = () => {
    if (!isDeleting) {
      onCancel()
    }
  }

  if (!isOpen) return null

  const content = (
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
        <h3 className="text-lg font-medium text-gray-900 mb-2">{title || defaultTitle}</h3>

        <p className="text-sm text-gray-600 mb-4">{message || defaultMessage}</p>

        {/* Block Info */}
        {showBlockInfo && blockData && (
          <div className="bg-gray-50 rounded-md p-3 mb-4">
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
              <span className="text-sm font-medium text-gray-700">{blockName}</span>
            </div>

            {/* Show some block content preview if available */}
            {(blockData.title || blockData.heading || blockData.name) && (
              <p className="text-xs text-gray-500 mt-1 truncate">
                {blockData.title || blockData.heading || blockData.name}
              </p>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex space-x-3">
          <button
            onClick={handleConfirm}
            disabled={isDeleting}
            className={`
              px-4 py-2 text-sm font-medium rounded-md transition-colors
              focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2
              ${
                isDeleting
                  ? 'bg-red-300 text-red-800 cursor-not-allowed'
                  : 'bg-red-600 text-white hover:bg-red-700'
              }
            `}
          >
            {isDeleting ? (
              <>
                <svg
                  className="w-4 h-4 mr-2 animate-spin inline"
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
              confirmText
            )}
          </button>

          <button
            onClick={handleCancel}
            disabled={isDeleting}
            className={`
              px-4 py-2 text-sm font-medium rounded-md transition-colors
              focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2
              ${
                isDeleting
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }
            `}
          >
            {cancelText}
          </button>
        </div>

        {/* Keyboard shortcuts hint */}
        <div className="mt-3 text-xs text-gray-500">
          Press <kbd className="px-1 py-0.5 bg-white border border-gray-300 rounded">Esc</kbd> to
          cancel
        </div>
      </div>
    </div>
  )

  if (variant === 'inline') {
    return <div className="bg-white border border-red-200 rounded-lg p-4 shadow-sm">{content}</div>
  }

  // Modal variant
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={handleCancel}
    >
      <div
        className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {content}
      </div>
    </div>
  )
}

export default BlockDeleteConfirmation
