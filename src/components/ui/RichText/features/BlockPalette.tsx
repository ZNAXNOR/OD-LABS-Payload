'use client'

import React, { useState, useRef, useEffect } from 'react'
import type { Block } from 'payload'
import { blockCategories, allBlocks, type BlockCategory } from '@/fields/blockEmbedding'

interface BlockPaletteProps {
  onSelectBlock: (block: Block) => void
  allowedBlocks?: Block[]
  showCategories?: boolean
  isOpen: boolean
  onClose: () => void
  position?: { x: number; y: number }
}

export const BlockPalette: React.FC<BlockPaletteProps> = ({
  onSelectBlock,
  allowedBlocks = allBlocks,
  showCategories = true,
  isOpen,
  onClose,
  position = { x: 0, y: 0 },
}) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const paletteRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

  // Filter blocks based on search term and category
  const filteredBlocks = React.useMemo(() => {
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
          (typeof block.labels?.singular === 'string' ? block.labels.singular : '')
            .toLowerCase()
            .includes(term) ||
          (typeof block.labels?.plural === 'string' ? block.labels.plural : '')
            .toLowerCase()
            .includes(term),
      )
    }

    return blocks
  }, [allowedBlocks, searchTerm, selectedCategory])

  // Get available categories
  const availableCategories = React.useMemo(() => {
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

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return

      switch (event.key) {
        case 'Escape':
          event.preventDefault()
          onClose()
          break
        case 'ArrowDown':
          event.preventDefault()
          setSelectedIndex((prev) => Math.min(prev + 1, filteredBlocks.length - 1))
          break
        case 'ArrowUp':
          event.preventDefault()
          setSelectedIndex((prev) => Math.max(prev - 1, 0))
          break
        case 'Enter':
          event.preventDefault()
          if (filteredBlocks[selectedIndex]) {
            handleBlockSelect(filteredBlocks[selectedIndex])
          }
          break
        case 'Tab':
          event.preventDefault()
          // Cycle through categories
          const categoryKeys = ['all', ...Object.keys(availableCategories)]
          const currentIndex = categoryKeys.indexOf(selectedCategory)
          const nextIndex = (currentIndex + 1) % categoryKeys.length
          const nextCategory = categoryKeys[nextIndex]
          if (nextCategory) {
            setSelectedCategory(nextCategory)
          }
          setSelectedIndex(0)
          break
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      // Focus search input when opened
      setTimeout(() => searchInputRef.current?.focus(), 100)
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, filteredBlocks, selectedIndex, selectedCategory, availableCategories])

  // Reset selection when blocks change
  useEffect(() => {
    setSelectedIndex(0)
  }, [filteredBlocks])

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (paletteRef.current && !paletteRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, onClose])

  const handleBlockSelect = (block: Block) => {
    onSelectBlock(block)
    onClose()
    setSearchTerm('')
    setSelectedIndex(0)
  }

  if (!isOpen) return null

  return (
    <div
      ref={paletteRef}
      className="fixed z-50 bg-white border border-gray-200 rounded-lg shadow-xl max-w-sm w-80"
      style={{
        left: position.x,
        top: position.y,
        maxHeight: '400px',
      }}
    >
      {/* Search Header */}
      <div className="p-3 border-b border-gray-100">
        <div className="relative">
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search blocks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 pl-8 text-sm border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <svg
            className="absolute left-2.5 top-2.5 w-4 h-4 text-gray-400"
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

        {/* Category Tabs */}
        {showCategories && Object.keys(availableCategories).length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            <button
              onClick={() => {
                setSelectedCategory('all')
                setSelectedIndex(0)
              }}
              className={`px-2 py-1 text-xs rounded transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-blue-100 text-blue-800'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              All
            </button>
            {Object.entries(availableCategories).map(([key, category]) => (
              <button
                key={key}
                onClick={() => {
                  setSelectedCategory(key)
                  setSelectedIndex(0)
                }}
                className={`px-2 py-1 text-xs rounded transition-colors ${
                  selectedCategory === key
                    ? 'bg-blue-100 text-blue-800'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Block List */}
      <div className="max-h-64 overflow-y-auto">
        {filteredBlocks.length === 0 ? (
          <div className="p-4 text-center text-gray-500 text-sm">
            <div className="mb-2">No blocks found</div>
            {searchTerm && <div className="text-xs">Try different search terms</div>}
          </div>
        ) : (
          <div className="p-1">
            {filteredBlocks.map((block, index) => (
              <button
                key={block.slug}
                onClick={() => handleBlockSelect(block)}
                className={`w-full p-2 text-left rounded-md transition-colors ${
                  index === selectedIndex ? 'bg-blue-50 border border-blue-200' : 'hover:bg-gray-50'
                }`}
                onMouseEnter={() => setSelectedIndex(index)}
              >
                <div className="flex items-center space-x-2">
                  {/* Block Icon */}
                  <div className="flex-shrink-0 w-6 h-6 bg-gray-100 rounded flex items-center justify-center">
                    <svg
                      className="w-3 h-3 text-gray-600"
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
                    <div className="text-sm font-medium text-gray-900 truncate">
                      {typeof block.labels?.singular === 'string'
                        ? block.labels.singular
                        : block.slug}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-2 border-t border-gray-100 bg-gray-50 text-xs text-gray-500">
        <div className="flex justify-between items-center">
          <span>{filteredBlocks.length} blocks</span>
          <div className="flex space-x-2">
            <kbd className="px-1 py-0.5 bg-white border border-gray-300 rounded text-xs">↑↓</kbd>
            <span>navigate</span>
            <kbd className="px-1 py-0.5 bg-white border border-gray-300 rounded text-xs">↵</kbd>
            <span>select</span>
            <kbd className="px-1 py-0.5 bg-white border border-gray-300 rounded text-xs">Esc</kbd>
            <span>close</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BlockPalette
