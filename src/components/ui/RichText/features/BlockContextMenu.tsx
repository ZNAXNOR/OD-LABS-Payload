'use client'

import React, { useState, useEffect, useRef } from 'react'
import { canDuplicateBlock } from '../utils/blockDuplication'
import { getBlockBySlug } from '@/fields/blockEmbedding'

interface BlockContextMenuProps {
  blockData: any
  position: { x: number; y: number }
  isVisible: boolean
  onClose: () => void
  onDuplicate: () => void
  onConfigure?: () => void
  onDelete?: () => void
  onMoveUp?: () => void
  onMoveDown?: () => void
  canMoveUp?: boolean
  canMoveDown?: boolean
}

export const BlockContextMenu: React.FC<BlockContextMenuProps> = ({
  blockData,
  position,
  isVisible,
  onClose,
  onDuplicate,
  onConfigure,
  onDelete,
  onMoveUp,
  onMoveDown,
  canMoveUp = false,
  canMoveDown = false,
}) => {
  const menuRef = useRef<HTMLDivElement>(null)
  const [adjustedPosition, setAdjustedPosition] = useState(position)

  const block = getBlockBySlug(blockData?.blockType)
  const canDuplicate = blockData?.blockType ? canDuplicateBlock(blockData.blockType) : false

  // Adjust menu position to stay within viewport
  useEffect(() => {
    if (isVisible && menuRef.current) {
      const menu = menuRef.current
      const rect = menu.getBoundingClientRect()
      const viewport = {
        width: window.innerWidth,
        height: window.innerHeight,
      }

      let newX = position.x
      let newY = position.y

      // Adjust horizontal position
      if (position.x + rect.width > viewport.width) {
        newX = viewport.width - rect.width - 10
      }

      // Adjust vertical position
      if (position.y + rect.height > viewport.height) {
        newY = viewport.height - rect.height - 10
      }

      // Ensure menu doesn't go off the left or top edge
      newX = Math.max(10, newX)
      newY = Math.max(10, newY)

      setAdjustedPosition({ x: newX, y: newY })
    }
  }, [isVisible, position])

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    if (isVisible) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('keydown', handleEscape)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isVisible, onClose])

  if (!isVisible) return null

  const menuItems = [
    // Configure
    ...(onConfigure
      ? [
          {
            label: 'Configure',
            icon: (
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
            ),
            onClick: () => {
              onConfigure()
              onClose()
            },
            disabled: false,
          },
        ]
      : []),

    // Duplicate
    {
      label: 'Duplicate',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
          />
        </svg>
      ),
      onClick: () => {
        onDuplicate()
        onClose()
      },
      disabled: !canDuplicate,
    },

    // Separator
    { type: 'separator' },

    // Move Up
    ...(onMoveUp
      ? [
          {
            label: 'Move Up',
            icon: (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 15l7-7 7 7"
                />
              </svg>
            ),
            onClick: () => {
              onMoveUp()
              onClose()
            },
            disabled: !canMoveUp,
          },
        ]
      : []),

    // Move Down
    ...(onMoveDown
      ? [
          {
            label: 'Move Down',
            icon: (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            ),
            onClick: () => {
              onMoveDown()
              onClose()
            },
            disabled: !canMoveDown,
          },
        ]
      : []),

    // Separator (only if we have move actions)
    ...(onMoveUp || onMoveDown ? [{ type: 'separator' }] : []),

    // Delete
    ...(onDelete
      ? [
          {
            label: 'Delete',
            icon: (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            ),
            onClick: () => {
              onDelete()
              onClose()
            },
            disabled: false,
            danger: true,
          },
        ]
      : []),
  ].filter(Boolean)

  return (
    <div
      ref={menuRef}
      className="fixed z-50 bg-white border border-gray-200 rounded-lg shadow-lg py-1 min-w-40"
      style={{
        left: adjustedPosition.x,
        top: adjustedPosition.y,
      }}
    >
      {/* Header */}
      <div className="px-3 py-2 border-b border-gray-100">
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
          <span className="text-sm font-medium text-gray-700 truncate">
            {block?.labels?.singular || blockData?.blockType || 'Block'}
          </span>
        </div>
      </div>

      {/* Menu Items */}
      {menuItems.map((item, index) => {
        if (item.type === 'separator') {
          return <div key={index} className="border-t border-gray-100 my-1" />
        }

        return (
          <button
            key={index}
            onClick={item.onClick}
            disabled={item.disabled}
            className={`
              w-full px-3 py-2 text-left text-sm flex items-center space-x-2 transition-colors
              ${
                item.disabled
                  ? 'text-gray-400 cursor-not-allowed'
                  : item.danger
                    ? 'text-red-700 hover:bg-red-50'
                    : 'text-gray-700 hover:bg-gray-50'
              }
            `}
          >
            <span className={item.disabled ? 'text-gray-300' : ''}>{item.icon}</span>
            <span>{item.label}</span>
            {item.disabled && item.label === 'Duplicate' && (
              <span className="ml-auto text-xs text-gray-400">Not allowed</span>
            )}
          </button>
        )
      })}
    </div>
  )
}

export default BlockContextMenu
