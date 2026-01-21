import React from 'react'

/**
 * LegacyBlockWarning Component
 *
 * Displays a warning message for legacy block types that may need migration.
 * This component can be used in the admin panel to alert editors about
 * deprecated or legacy content blocks.
 */
export default function LegacyBlockWarning() {
  return (
    <div
      style={{
        padding: '1rem',
        backgroundColor: 'var(--theme-warning-50)',
        border: '1px solid var(--theme-warning-500)',
        borderRadius: 'var(--border-radius-m)',
        color: 'var(--theme-warning-900)',
      }}
    >
      <strong>⚠️ Legacy Block</strong>
      <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.875rem' }}>
        This block uses a legacy format. Consider updating to the latest block structure.
      </p>
    </div>
  )
}
