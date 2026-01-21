'use client'

import React, { useState } from 'react'
import { duplicateBlockSafely, canDuplicateBlock } from '../utils/blockDuplication'
import { getBlockBySlug } from '@/fields/blockEmbedding'

interface BlockDuplicateButtonProps {
  blockData: any
  onDuplicate: (duplicatedBlock: any) => void
  onError?: (error: string) => void
  className?: string
  variant?: 'button' | 'icon'
  showTooltip?: boolean
  disabled?: boolean
}

export const BlockDuplicateButton: React.FC<BlockDuplicateButtonProps> = ({
  blockData,
  onDuplicate,
  onError,
  className = '',
  variant = 'icon',
  showTooltip = true,
  disabled = false,
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const [showTooltipState, setShowTooltipState] = useState(false)

  const block = getBlockBySlug(blockData?.blockType)
  const canDuplicate = blockData?.blockType ? canDuplicateBlock(blockData.blockType) : false
  const isDisabled = disabled || !canDuplicate || isLoading

  const handleDuplicate = async () => {
    if (isDisabled) return

    setIsLoading(true)

    try {
      const result = duplicateBlockSafely(blockData)

      if (result.success && result.duplicatedBlock) {
        onDuplicate(result.duplicatedBlock)
      } else {
        const error = result.error || 'Failed to duplicate block'
        onError?.(error)
        console.error('Block duplication failed:', error)
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      onError?.(errorMessage)
      console.error('Block duplication error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const buttonContent = (
    <>
      {isLoading ? (
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
            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
          />
        </svg>
      )}
      {variant === 'button' && (
        <span className="ml-2">{isLoading ? 'Duplicating...' : 'Duplicate'}</span>
      )}
    </>
  )

  const baseClasses =
    'inline-flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2'

  const variantClasses = {
    button: `px-3 py-2 text-sm rounded-md ${
      isDisabled
        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
        : 'bg-green-100 text-green-700 hover:bg-green-200'
    }`,
    icon: `p-2 rounded-md ${
      isDisabled
        ? 'text-gray-300 cursor-not-allowed'
        : 'text-gray-600 hover:text-green-600 hover:bg-green-50'
    }`,
  }

  const tooltipText = isDisabled
    ? canDuplicate
      ? 'Duplication in progress...'
      : 'This block cannot be duplicated'
    : `Duplicate ${block?.labels?.singular || 'block'}`

  return (
    <div className="relative">
      <button
        onClick={handleDuplicate}
        disabled={isDisabled}
        className={`${baseClasses} ${variantClasses[variant]} ${className}`}
        title={tooltipText}
        aria-label={tooltipText}
        onMouseEnter={() => showTooltip && setShowTooltipState(true)}
        onMouseLeave={() => setShowTooltipState(false)}
      >
        {buttonContent}
      </button>

      {/* Tooltip */}
      {showTooltip && showTooltipState && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap z-50">
          {tooltipText}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-gray-900"></div>
        </div>
      )}
    </div>
  )
}

export default BlockDuplicateButton
