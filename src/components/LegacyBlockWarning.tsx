'use client'

import React from 'react'

interface LegacyBlockWarningProps {
  collectionType?: string
}

const LegacyBlockWarning: React.FC<LegacyBlockWarningProps> = ({ collectionType = 'page' }) => {
  return (
    <div
      className="legacy-block-warning"
      style={{
        padding: '12px 16px',
        backgroundColor: '#fef3c7',
        border: '1px solid #f59e0b',
        borderRadius: '6px',
        marginBottom: '16px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontSize: '18px' }}>⚠️</span>
        <div>
          <h4
            style={{ margin: '0 0 4px 0', color: '#92400e', fontSize: '14px', fontWeight: '600' }}
          >
            Legacy Block Configuration
          </h4>
          <p style={{ margin: 0, color: '#92400e', fontSize: '13px' }}>
            This {collectionType} uses the new block system. Some legacy blocks may need to be
            updated for optimal performance.
          </p>
        </div>
      </div>
    </div>
  )
}

export default LegacyBlockWarning
