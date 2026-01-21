'use client'

import React, { useState } from 'react'
import { duplicateBlocks, updateBlockReferences } from '../utils/blockDuplication'

interface BatchBlockDuplicatorProps {
  selectedBlocks: any[]
  onDuplicateBlocks: (duplicatedBlocks: any[]) => void
  onError?: (errors: string[]) => void
  className?: string
}

export const BatchBlockDuplicator: React.FC<BatchBlockDuplicatorProps> = ({
  selectedBlocks,
  onDuplicateBlocks,
  onError,
  className = '',
}) => {
  const [isLoading, setIsLoading] = useState(false)

  const handleBatchDuplicate = async () => {
    if (selectedBlocks.length === 0 || isLoading) return

    setIsLoading(true)

    try {
      // Create a map to track original to new IDs for reference updates
      const originalToNewIdMap = new Map<string, string>()
      const duplicatedBlocks: any[] = []
      const errors: string[] = []

      // First pass: duplicate all blocks
      for (const block of selectedBlocks) {
        try {
          const duplicated = duplicateBlocks([block])[0]
          duplicatedBlocks.push(duplicated)

          if (block.id && duplicated.id) {
            originalToNewIdMap.set(block.id, duplicated.id)
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error'
          errors.push(`Failed to duplicate block: ${errorMessage}`)
        }
      }

      // Second pass: update any internal references between duplicated blocks
      const updatedBlocks = updateBlockReferences(duplicatedBlocks, originalToNewIdMap)

      if (errors.length > 0) {
        onError?.(errors)
      }

      if (updatedBlocks.length > 0) {
        onDuplicateBlocks(updatedBlocks)
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      onError?.([errorMessage])
      console.error('Batch duplication error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (selectedBlocks.length === 0) {
    return null
  }

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <button
        onClick={handleBatchDuplicate}
        disabled={isLoading}
        className={`
          inline-flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors
          focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2
          ${
            isLoading
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-green-100 text-green-700 hover:bg-green-200'
          }
        `}
      >
        {isLoading ? (
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
            Duplicating...
          </>
        ) : (
          <>
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
            Duplicate {selectedBlocks.length} Block{selectedBlocks.length !== 1 ? 's' : ''}
          </>
        )}
      </button>

      <span className="text-sm text-gray-600">
        {selectedBlocks.length} block{selectedBlocks.length !== 1 ? 's' : ''} selected
      </span>
    </div>
  )
}

export default BatchBlockDuplicator
