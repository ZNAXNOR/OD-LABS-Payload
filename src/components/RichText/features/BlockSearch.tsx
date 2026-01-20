'use client'

import React, { useState, useMemo } from 'react'
import type { Block } from 'payload'
import { blockCategories, allBlocks, type BlockCategory } from '@/fields/blockEmbedding'

interface BlockSearchProps {
  onSelectBlock: (block: Block) => void
  onClose: () => void
  allowedBlocks?: Block[]
  showCategories?: boolean
}

export const BlockSearch: React.FC<BlockSearchProps> = ({
  onSelectBlock,
  onClose,
  allowedBlocks = allBlocks,
  showCategories = true,
}) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  // Filter blocks based on search term and category
  const filteredBlocks = useMemo(() => {
    let blocks = allowedBlocks

    // Filter by category
    if (selectedCategory !== 'all') {
      const categoryBlocks = blockCategories[selectedCategory]?.blocks || []
      blocks = blocks.filter((block) =>
        categoryBlocks.some((catBlock) => catBlock.slug === block.slug),
      )
    }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      blocks = blocks.filter(
        (block) =>
          block.slug.toLowerCase().includes(term) ||
          (typeof block.labels?.singular === 'string'
            ? block.labels.singular.toLowerCase().includes(term)
            : false) ||
          (typeof block.labels?.plural === 'string'
            ? block.labels.plural.toLowerCase().includes(term)
            : false),
      )
    }

    return blocks
  }, [allowedBlocks, searchTerm, selectedCategory])

  // Get available categories based on allowed blocks
  const availableCategories = useMemo(() => {
    const categories: Record<string, BlockCategory> = {}

    Object.entries(blockCategories).forEach(([key, category]) => {
      const hasBlocks = category.blocks.some((block) =>
        allowedBlocks.some((allowed) => allowed.slug === block.slug),
      )
      if (hasBlocks) {
        categories[key] = category
      }
    })

    return categories
  }, [allowedBlocks])

  const handleBlockSelect = (block: Block) => {
    onSelectBlock(block)
    onClose()
  }

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      onClose()
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={onClose}
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      <div
        className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Insert Block</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close"
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

          {/* Search Input */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search blocks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              autoFocus
            />
            <svg
              className="absolute left-3 top-2.5 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          {/* Category Filter */}
          {showCategories && Object.keys(availableCategories).length > 0 && (
            <div className="mt-3">
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`px-3 py-1 text-sm rounded-full transition-colors ${
                    selectedCategory === 'all'
                      ? 'bg-blue-100 text-blue-800 border border-blue-200'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  All
                </button>
                {Object.entries(availableCategories).map(([key, category]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedCategory(key)}
                    className={`px-3 py-1 text-sm rounded-full transition-colors ${
                      selectedCategory === key
                        ? 'bg-blue-100 text-blue-800 border border-blue-200'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Block List */}
        <div className="p-4 overflow-y-auto max-h-96">
          {filteredBlocks.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <svg
                className="w-12 h-12 mx-auto mb-4 text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m13-8V4a1 1 0 00-1-1H7a1 1 0 00-1 1v1m8 0V4a1 1 0 00-1-1H9a1 1 0 00-1 1v1"
                />
              </svg>
              <p>No blocks found</p>
              {searchTerm && <p className="text-sm mt-1">Try adjusting your search terms</p>}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {filteredBlocks.map((block) => (
                <button
                  key={block.slug}
                  onClick={() => handleBlockSelect(block)}
                  className="p-4 text-left border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors group"
                >
                  <div className="flex items-start space-x-3">
                    {/* Block Icon */}
                    <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-md flex items-center justify-center group-hover:bg-blue-100">
                      <svg
                        className="w-5 h-5 text-gray-600 group-hover:text-blue-600"
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

                    {/* Block Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-900 group-hover:text-blue-900">
                        {typeof block.labels?.singular === 'string'
                          ? block.labels.singular
                          : block.slug}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                        {getBlockDescription(block)}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex justify-between items-center text-sm text-gray-600">
            <span>{filteredBlocks.length} blocks available</span>
            <span>
              Press{' '}
              <kbd className="px-2 py-1 bg-white border border-gray-300 rounded text-xs">Esc</kbd>{' '}
              to close
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

// Helper function to get block description
function getBlockDescription(block: Block): string {
  // Try to find the block in categories to get description
  for (const category of Object.values(blockCategories)) {
    if (category.blocks.some((b) => b.slug === block.slug)) {
      return category.description
    }
  }

  // Fallback descriptions based on block type
  const descriptions: Record<string, string> = {
    hero: 'Prominent header section with customizable layouts',
    content: 'Flexible content block with multiple columns',
    mediaBlock: 'Display images, videos, and other media',
    archive: 'Display a collection of related content',
    banner: 'Eye-catching banner with call-to-action',
    code: 'Display code snippets with syntax highlighting',
    cta: 'Call-to-action block to drive conversions',
    divider: 'Visual separator between content sections',
    spacer: 'Add vertical spacing between elements',
  }

  return (
    descriptions[block.slug] ||
    `${typeof block.labels?.singular === 'string' ? block.labels.singular : block.slug} block`
  )
}

export default BlockSearch
