'use client'

import { useLivePreview } from '@/providers/LivePreview'
import { cn } from '@/utilities/ui'
import { useCallback, useState } from 'react'

interface DebugPanelProps {
  isVisible: boolean
  onToggle: () => void
  className?: string
}

export function DebugPanel({ isVisible, onToggle, className }: DebugPanelProps) {
  const { state, metrics, configuration } = useLivePreview()
  const [activeTab, setActiveTab] = useState<'state' | 'metrics' | 'config' | 'logs'>('state')
  const [logs, setLogs] = useState<Array<{ timestamp: Date; level: string; message: string }>>([])

  const handleClearLogs = useCallback(() => {
    setLogs([])
  }, [])

  const handleExportDebugInfo = useCallback(() => {
    const debugInfo = {
      timestamp: new Date().toISOString(),
      state,
      metrics,
      configuration,
      logs,
      userAgent: navigator.userAgent,
      url: window.location.href,
    }

    const blob = new Blob([JSON.stringify(debugInfo, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `live-preview-debug-${Date.now()}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }, [state, metrics, configuration, logs])

  if (!isVisible) {
    return (
      <button
        onClick={onToggle}
        className="debug-toggle fixed bottom-4 right-4 bg-gray-800 text-white px-3 py-2 rounded-full text-xs hover:bg-gray-700 transition-colors z-50"
        title="Open debug panel"
      >
        🐛
      </button>
    )
  }

  return (
    <div
      className={cn(
        'debug-panel fixed bottom-4 right-4 w-96 max-h-96 bg-gray-900 border border-gray-700 rounded-lg shadow-xl z-50 overflow-hidden',
        className,
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-gray-700">
        <h3 className="text-white font-medium text-sm">Live Preview Debug</h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleExportDebugInfo}
            className="text-gray-400 hover:text-white text-xs px-2 py-1 border border-gray-600 rounded"
            title="Export debug info"
          >
            Export
          </button>
          <button
            onClick={onToggle}
            className="text-gray-400 hover:text-white"
            title="Close debug panel"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-700">
        {(['state', 'metrics', 'config', 'logs'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn('px-3 py-2 text-xs font-medium capitalize transition-colors', {
              'text-blue-400 border-b-2 border-blue-400': activeTab === tab,
              'text-gray-400 hover:text-white': activeTab !== tab,
            })}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="p-3 overflow-y-auto max-h-64 text-xs font-mono">
        {activeTab === 'state' && (
          <div className="space-y-2">
            <div className="text-gray-300">
              <div>
                <strong>Enabled:</strong> {state.isEnabled ? 'Yes' : 'No'}
              </div>
              <div>
                <strong>Loading:</strong> {state.isLoading ? 'Yes' : 'No'}
              </div>
              <div>
                <strong>Connected:</strong> {state.isRealTimeConnected ? 'Yes' : 'No'}
              </div>
              <div>
                <strong>Last Update:</strong> {state.lastUpdate?.toLocaleTimeString() || 'Never'}
              </div>
              <div>
                <strong>Error:</strong> {state.error || 'None'}
              </div>
              <div>
                <strong>Concurrent Editing:</strong>{' '}
                {state.concurrentEditingDetected ? 'Yes' : 'No'}
              </div>
              {state.currentSession && (
                <div className="mt-2 p-2 bg-gray-800 rounded">
                  <div>
                    <strong>Session ID:</strong> {state.currentSession.id}
                  </div>
                  <div>
                    <strong>Collection:</strong> {state.currentSession.collection}
                  </div>
                  <div>
                    <strong>Document:</strong> {state.currentSession.documentId}
                  </div>
                  <div>
                    <strong>Expires:</strong> {state.currentSession.expiresAt.toLocaleString()}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'metrics' && (
          <div className="space-y-2 text-gray-300">
            <div>
              <strong>Updates:</strong> {metrics.updateCount}
            </div>
            <div>
              <strong>Avg Update Time:</strong> {metrics.averageUpdateTime.toFixed(2)}ms
            </div>
            <div>
              <strong>Errors:</strong> {metrics.errorCount}
            </div>
            <div>
              <strong>Retries:</strong> {metrics.retryCount}
            </div>
            <div>
              <strong>Real-time Events:</strong> {metrics.realTimeEventCount}
            </div>
            <div>
              <strong>Last Update:</strong>{' '}
              {metrics.lastUpdateTime?.toLocaleTimeString() || 'Never'}
            </div>
          </div>
        )}

        {activeTab === 'config' && (
          <div className="space-y-2 text-gray-300">
            <div>
              <strong>Enabled:</strong> {configuration.enabled ? 'Yes' : 'No'}
            </div>
            <div>
              <strong>Debounce:</strong> {configuration.debounceMs}ms
            </div>
            <div>
              <strong>Max Retries:</strong> {configuration.maxRetries}
            </div>
            <div>
              <strong>Retry Delay:</strong> {configuration.retryDelayMs}ms
            </div>
            <div>
              <strong>Session Timeout:</strong> {configuration.sessionTimeoutMs / 1000}s
            </div>
            <div className="mt-2">
              <strong>Collections:</strong>
              <pre className="mt-1 p-2 bg-gray-800 rounded text-xs overflow-x-auto">
                {JSON.stringify(configuration.collections, null, 2)}
              </pre>
            </div>
          </div>
        )}

        {activeTab === 'logs' && (
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Recent Logs ({logs.length})</span>
              <button onClick={handleClearLogs} className="text-red-400 hover:text-red-300 text-xs">
                Clear
              </button>
            </div>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {logs.length === 0 ? (
                <div className="text-gray-500 italic">No logs available</div>
              ) : (
                logs.map((log, index) => (
                  <div key={index} className="text-xs">
                    <span className="text-gray-500">{log.timestamp.toLocaleTimeString()}</span>
                    <span
                      className={cn('ml-2 font-medium', {
                        'text-red-400': log.level === 'error',
                        'text-yellow-400': log.level === 'warn',
                        'text-blue-400': log.level === 'info',
                        'text-gray-300': log.level === 'debug',
                      })}
                    >
                      [{log.level.toUpperCase()}]
                    </span>
                    <span className="ml-2 text-gray-300">{log.message}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
