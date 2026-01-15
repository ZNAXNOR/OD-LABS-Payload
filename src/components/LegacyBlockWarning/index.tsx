'use client'

import React from 'react'
import { useFormFields } from '@payloadcms/ui'
import { detectLegacyBlocks, formatLegacyBlockMessage } from '@/utilities/legacyBlocks'
import type { PageCollectionType } from '@/blocks/config/blockAssignments'

interface LegacyBlockWarningProps {
  collectionType: PageCollectionType
}

/**
 * Admin component that displays a warning when a page contains legacy blocks
 * that are no longer available for the current collection type
 */
export const LegacyBlockWarning: React.FC<LegacyBlockWarningProps> = ({ collectionType }) => {
  // Get hero and layout blocks from form state
  const heroBlocks = useFormFields(([fields]) => fields.hero?.value)
  const layoutBlocks = useFormFields(([fields]) => fields.layout?.value)

  // Detect legacy blocks
  const { hasLegacyBlocks, legacyBlockTypes } = detectLegacyBlocks(
    collectionType,
    heroBlocks as any[],
    layoutBlocks as any[],
  )

  // Don't render anything if no legacy blocks
  if (!hasLegacyBlocks) {
    return null
  }

  const message = formatLegacyBlockMessage(legacyBlockTypes)

  return (
    <div
      style={{
        backgroundColor: '#fff3cd',
        border: '1px solid #ffc107',
        borderRadius: '4px',
        padding: '12px 16px',
        marginBottom: '16px',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '12px',
      }}
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ flexShrink: 0, marginTop: '2px' }}
      >
        <path
          d="M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM11 15H9V13H11V15ZM11 11H9V5H11V11Z"
          fill="#856404"
        />
      </svg>
      <div style={{ flex: 1 }}>
        <strong style={{ color: '#856404', display: 'block', marginBottom: '4px' }}>
          Legacy Blocks Detected
        </strong>
        <p style={{ color: '#856404', margin: 0, fontSize: '14px', lineHeight: '1.5' }}>
          {message}
        </p>
      </div>
    </div>
  )
}
