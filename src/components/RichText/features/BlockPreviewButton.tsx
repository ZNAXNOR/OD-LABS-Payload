'use client'

import React, { useState, useRef } from 'react'
import { BlockPreview } from './BlockPreview'
import { getBlockBySlug } from '@/fields/blockEmbedding'

interface BlockPreviewButtonProps {
  blockData: any
  className?: string
  variant?: 'button' | 'icon'
  position?: 'auto' | 'cursor' | 'fixed'
  onEdit?: () => void
  onDuplicate?: () => void
  disabled?: boolean
}

export const BlockPreviewButton: React.FC<BlockPreviewButtonProps> = ({
  blockData,
  className = '',
  variant = 'icon',
  position = 'auto',
  onEdit,
  onDuplicate,
  disabled = false,
}) => {
  const [showPreview, setShowPreview] = useState(false)
  const [previewPosition, setPreviewPosition] = useState({ x: 0, y: 0 })
  const buttonRef = useRef<HTMLButtonElement>(null)

  const block = getBlockBySlug(blockData?.blockType)
  const blockName = block?.labels?.singular || blockData?.blockType || 'block'

  const handlePreviewClick = (event: React.MouseEvent) => {
    if (disabled) return

    // Calculate preview position based on the position prop
    let x = 0
    let y = 0

    if (position === 'cursor') {
      x = event.clientX + 10
      y = event.clientY + 10
    } else if (position === 'fixed') {
      x = window.innerWidth / 2 - 200 // Center horizontally
      y = window.innerHeight / 2 - 150 // Center vertically
    } else if (position === 'auto' && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect()
      x = rect.right + 10
      y = rect.top
    }

    setPreviewPosition({ x, y })
    setShowPreview(true)
  }

  const handleClosePreview = () => {
    setShowPreview(false)
  }

  const buttonContent = (
    <>
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
        />
      </svg>
      {variant === 'button' && <span className="ml-2">Preview</span>}
    </>
  )

  const baseClasses =
    'inline-flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'

  const variantClasses = {
    button: `px-3 py-2 text-sm rounded-md ${
      disabled
        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
        : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
    }`,
    icon: `p-2 rounded-md ${
      disabled
        ? 'text-gray-300 cursor-not-allowed'
        : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
    }`,
  }

  const tooltipText = disabled ? 'Preview not available' : `Preview ${blockName}`

  return (
    <>
      <button
        ref={buttonRef}
        onClick={handlePreviewClick}
        disabled={disabled}
        className={`${baseClasses} ${variantClasses[variant]} ${className}`}
        title={tooltipText}
        aria-label={tooltipText}
      >
        {buttonContent}
      </button>

      {/* Preview Modal */}
      <BlockPreview
        blockData={blockData}
        isVisible={showPreview}
        onClose={handleClosePreview}
        position={previewPosition}
        onEdit={onEdit}
        onDuplicate={onDuplicate}
      />
    </>
  )
}

export default BlockPreviewButton
