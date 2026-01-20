'use client'

import React, { useState } from 'react'
import { BlockDeleteConfirmation } from './BlockDeleteConfirmation'
import { getBlockBySlug } from '@/fields/blockEmbedding'

interface BlockDeleteButtonProps {
  blockData: any
  onDelete: () => void
  onError?: (error: string) => void
  className?: string
  variant?: 'button' | 'icon'
  showConfirmation?: boolean
  confirmationVariant?: 'modal' | 'inline'
  disabled?: boolean
  customConfirmationTitle?: string
  customConfirmationMessage?: string
}

export const BlockDeleteButton: React.FC<BlockDeleteButtonProps> = ({
  blockData,
  onDelete,
  onError,
  className = '',
  variant = 'icon',
  showConfirmation = true,
  confirmationVariant = 'modal',
  disabled = false,
  customConfirmationTitle,
  customConfirmationMessage,
}) => {
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const block = getBlockBySlug(blockData?.blockType)
  const blockName = block?.labels?.singular || blockData?.blockType || 'block'

  const handleDeleteClick = () => {
    if (disabled || isDeleting) return

    if (showConfirmation) {
      setShowConfirmationDialog(true)
    } else {
      handleConfirmDelete()
    }
  }

  const handleConfirmDelete = async () => {
    setIsDeleting(true)

    try {
      await onDelete()
      setShowConfirmationDialog(false)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete block'
      onError?.(errorMessage)
      console.error('Block deletion error:', error)
    } finally {
      setIsDeleting(false)
    }
  }

  const handleCancelDelete = () => {
    setShowConfirmationDialog(false)
  }

  const buttonContent = (
    <>
      {isDeleting ? (
        <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
      ) : (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
      )}
      {variant === 'button' && (
        <span className="ml-2">{isDeleting ? 'Deleting...' : 'Delete'}</span>
      )}
    </>
  )

  const baseClasses =
    'inline-flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2'

  const variantClasses = {
    button: `px-3 py-2 text-sm rounded-md ${
      disabled || isDeleting
        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
        : 'bg-red-100 text-red-700 hover:bg-red-200'
    }`,
    icon: `p-2 rounded-md ${
      disabled || isDeleting
        ? 'text-gray-300 cursor-not-allowed'
        : 'text-gray-600 hover:text-red-600 hover:bg-red-50'
    }`,
  }

  const tooltipText = disabled
    ? 'Cannot delete this block'
    : isDeleting
      ? 'Deleting...'
      : `Delete ${blockName}`

  return (
    <>
      <button
        onClick={handleDeleteClick}
        disabled={disabled || isDeleting}
        className={`${baseClasses} ${variantClasses[variant]} ${className}`}
        title={tooltipText}
        aria-label={tooltipText}
      >
        {buttonContent}
      </button>

      {/* Confirmation Dialog */}
      {showConfirmation && (
        <BlockDeleteConfirmation
          blockData={blockData}
          isOpen={showConfirmationDialog}
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
          variant={confirmationVariant}
          title={customConfirmationTitle}
          message={customConfirmationMessage}
        />
      )}
    </>
  )
}

export default BlockDeleteButton
