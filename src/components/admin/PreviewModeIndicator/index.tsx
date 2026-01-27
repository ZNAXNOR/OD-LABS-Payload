'use client'

import { useLivePreview } from '@/providers/LivePreview'
import { cn } from '@/utilities/ui'
import './index.scss'

interface PreviewModeIndicatorProps {
  className?: string
}

export function PreviewModeIndicator({ className }: PreviewModeIndicatorProps) {
  const { state, metrics } = useLivePreview()

  // Don't render if preview is not enabled
  if (!state.isEnabled) {
    return null
  }

  const handleExitPreview = async () => {
    try {
      await fetch('/api/preview/exit', { method: 'POST' })
      window.location.reload()
    } catch (error) {
      console.error('Failed to exit preview mode:', error)
    }
  }

  const formatTime = (date: Date | null) => {
    if (!date) return 'Never'
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }).format(date)
  }

  const getStatusColor = () => {
    if (state.error) return 'text-red-500'
    if (state.isLoading) return 'text-yellow-500'
    if (state.isRealTimeConnected) return 'text-green-500'
    return 'text-gray-500'
  }

  const getStatusText = () => {
    if (state.error) return 'Error'
    if (state.isLoading) return 'Updating...'
    if (state.isRealTimeConnected) return 'Live'
    return 'Preview'
  }

  return (
    <div className={cn('preview-mode-indicator', className)}>
      <div className="preview-indicator-content">
        <div className="preview-status">
          <div className={cn('status-dot', getStatusColor())} />
          <span className="status-text">{getStatusText()}</span>
        </div>

        <div className="preview-info">
          {state.lastUpdate && (
            <span className="last-update">Last update: {formatTime(state.lastUpdate)}</span>
          )}

          {state.concurrentEditingDetected && (
            <span className="concurrent-warning">Multiple editors detected</span>
          )}
        </div>

        <div className="preview-metrics">
          <span className="metric">Updates: {metrics.updateCount}</span>
          {metrics.errorCount > 0 && (
            <span className="metric error">Errors: {metrics.errorCount}</span>
          )}
        </div>

        <button onClick={handleExitPreview} className="exit-preview-btn" type="button">
          Exit Preview
        </button>
      </div>

      {state.error && (
        <div className="preview-error">
          <span className="error-message">{state.error}</span>
        </div>
      )}
    </div>
  )
}
