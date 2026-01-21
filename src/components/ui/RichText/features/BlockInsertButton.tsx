'use client'

import React, { useState } from 'react'
import type { Block } from 'payload'
import { BlockSearch } from './BlockSearch'
import { allBlocks } from '@/fields/blockEmbedding'

interface BlockInsertButtonProps {
  onInsertBlock: (block: Block) => void
  allowedBlocks?: Block[]
  showCategories?: boolean
  className?: string
  variant?: 'button' | 'icon' | 'floating'
}

export const BlockInsertButton: React.FC<BlockInsertButtonProps> = ({
  onInsertBlock,
  allowedBlocks = allBlocks,
  showCategories = true,
  className = '',
  variant = 'button',
}) => {
  const [showSearch, setShowSearch] = useState(false)

  const handleInsertBlock = (block: Block) => {
    onInsertBlock(block)
    setShowSearch(false)
  }

  const buttonContent = (
    <>
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
        />
      </svg>
      {variant === 'button' && <span className="ml-2">Insert Block</span>}
    </>
  )

  const baseClasses =
    'inline-flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'

  const variantClasses = {
    button: 'px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700',
    icon: 'p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md',
    floating:
      'fixed bottom-6 right-6 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 hover:shadow-xl z-40',
  }

  return (
    <>
      <button
        onClick={() => setShowSearch(true)}
        className={`${baseClasses} ${variantClasses[variant]} ${className}`}
        title="Insert Block"
        aria-label="Insert Block"
      >
        {buttonContent}
      </button>

      {showSearch && (
        <BlockSearch
          onSelectBlock={handleInsertBlock}
          onClose={() => setShowSearch(false)}
          allowedBlocks={allowedBlocks}
          showCategories={showCategories}
        />
      )}
    </>
  )
}

export default BlockInsertButton
