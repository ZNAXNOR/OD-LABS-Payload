/**
 * Error monitoring dashboard for RichText components
 * Development tool for viewing and managing errors
 */

import React, { useState, useEffect } from 'react'
import {
  getErrorLogger,
  type ErrorLogEntry,
  type ErrorSeverity,
  type ErrorCategory,
} from '../utils/errorLogging'

interface ErrorMonitoringDashboardProps {
  enabled?: boolean
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
  minimized?: boolean
  onToggle?: (minimized: boolean) => void
}

export const ErrorMonitoringDashboard: React.FC<ErrorMonitoringDashboardProps> = ({
  enabled = process.env.NODE_ENV === 'development',
  position = 'bottom-right',
  minimized: initialMinimized = true,
  onToggle,
}) => {
  const [minimized, setMinimized] = useState(initialMinimized)
  const [errors, setErrors] = useState<ErrorLogEntry[]>([])
  const [selectedError, setSelectedError] = useState<ErrorLogEntry | null>(null)
  const [filter, setFilter] = useState<{
    severity?: ErrorSeverity
    category?: ErrorCategory
    component?: string
  }>({})
  const [stats, setStats] = useState<any>(null)

  const errorLogger = getErrorLogger()

  // Update errors periodically
  useEffect(() => {
    if (!enabled) return

    const updateErrors = () => {
      const allErrors = errorLogger.getAllErrors()
      setErrors(allErrors)
      setStats(errorLogger.getErrorStats())
    }

    updateErrors()
    const interval = setInterval(updateErrors, 2000)

    return () => clearInterval(interval)
  }, [enabled, errorLogger])

  // Handle toggle
  const handleToggle = () => {
    const newMinimized = !minimized
    setMinimized(newMinimized)
    onToggle?.(newMinimized)
  }

  // Filter errors
  const filteredErrors = errors.filter((error) => {
    if (filter.severity && error.severity !== filter.severity) return false
    if (filter.category && error.category !== filter.category) return false
    if (filter.component && error.context.componentName !== filter.component) return false
    return true
  })

  // Get position styles
  const getPositionStyles = () => {
    const base = {
      position: 'fixed' as const,
      zIndex: 10000,
      fontFamily: 'monospace',
      fontSize: '12px',
    }

    switch (position) {
      case 'top-left':
        return { ...base, top: '10px', left: '10px' }
      case 'top-right':
        return { ...base, top: '10px', right: '10px' }
      case 'bottom-left':
        return { ...base, bottom: '10px', left: '10px' }
      case 'bottom-right':
      default:
        return { ...base, bottom: '10px', right: '10px' }
    }
  }

  // Get severity color
  const getSeverityColor = (severity: ErrorSeverity) => {
    switch (severity) {
      case 'critical':
        return '#dc2626'
      case 'high':
        return '#ea580c'
      case 'medium':
        return '#d97706'
      case 'low':
        return '#65a30d'
      default:
        return '#6b7280'
    }
  }

  // Get category color
  const getCategoryColor = (category: ErrorCategory) => {
    const colors = {
      rendering: '#3b82f6',
      security: '#dc2626',
      performance: '#f59e0b',
      accessibility: '#8b5cf6',
      validation: '#06b6d4',
      network: '#10b981',
      user_interaction: '#f97316',
      configuration: '#6366f1',
      unknown: '#6b7280',
    }
    return colors[category] || colors.unknown
  }

  // Format timestamp
  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString()
  }

  // Clear all errors
  const handleClearErrors = () => {
    errorLogger.clearErrors()
    setErrors([])
    setSelectedError(null)
    setStats(null)
  }

  // Resolve error
  const handleResolveError = (errorId: string) => {
    errorLogger.resolveError(errorId)
    setErrors((prev) =>
      prev.map((e) => (e.id === errorId ? { ...e, resolved: true, resolvedAt: Date.now() } : e)),
    )
  }

  if (!enabled) return null

  return (
    <div style={getPositionStyles()}>
      {/* Minimized view */}
      {minimized && (
        <div
          onClick={handleToggle}
          style={{
            background: stats?.unresolved > 0 ? '#fef3c7' : '#f3f4f6',
            border: `2px solid ${stats?.unresolved > 0 ? '#f59e0b' : '#d1d5db'}`,
            borderRadius: '8px',
            padding: '8px 12px',
            cursor: 'pointer',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          }}
        >
          <div style={{ fontWeight: 'bold', marginBottom: '2px' }}>RichText Errors</div>
          <div style={{ color: '#6b7280' }}>
            {stats ? `${stats.unresolved}/${stats.total}` : '0/0'}
          </div>
        </div>
      )}

      {/* Expanded view */}
      {!minimized && (
        <div
          style={{
            background: '#ffffff',
            border: '1px solid #d1d5db',
            borderRadius: '8px',
            width: '400px',
            maxHeight: '600px',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Header */}
          <div
            style={{
              background: '#f9fafb',
              borderBottom: '1px solid #e5e7eb',
              padding: '12px 16px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div style={{ fontWeight: 'bold' }}>RichText Error Monitor</div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={handleClearErrors}
                style={{
                  background: '#ef4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '4px 8px',
                  cursor: 'pointer',
                  fontSize: '10px',
                }}
              >
                Clear
              </button>
              <button
                onClick={handleToggle}
                style={{
                  background: '#6b7280',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '4px 8px',
                  cursor: 'pointer',
                  fontSize: '10px',
                }}
              >
                −
              </button>
            </div>
          </div>

          {/* Stats */}
          {stats && (
            <div
              style={{
                padding: '12px 16px',
                borderBottom: '1px solid #e5e7eb',
                background: '#fafafa',
              }}
            >
              <div style={{ display: 'flex', gap: '16px', marginBottom: '8px' }}>
                <div>Total: {stats.total}</div>
                <div style={{ color: '#dc2626' }}>Unresolved: {stats.unresolved}</div>
                <div style={{ color: '#16a34a' }}>Recent: {stats.recentErrors}</div>
              </div>
              <div style={{ display: 'flex', gap: '8px', fontSize: '10px' }}>
                <span style={{ color: getSeverityColor('critical') }}>
                  Critical: {stats.bySeverity.critical}
                </span>
                <span style={{ color: getSeverityColor('high') }}>
                  High: {stats.bySeverity.high}
                </span>
                <span style={{ color: getSeverityColor('medium') }}>
                  Medium: {stats.bySeverity.medium}
                </span>
                <span style={{ color: getSeverityColor('low') }}>Low: {stats.bySeverity.low}</span>
              </div>
            </div>
          )}

          {/* Filters */}
          <div
            style={{
              padding: '8px 16px',
              borderBottom: '1px solid #e5e7eb',
              display: 'flex',
              gap: '8px',
              fontSize: '10px',
            }}
          >
            <select
              value={filter.severity || ''}
              onChange={(e) =>
                setFilter((prev) => ({
                  ...prev,
                  severity: (e.target.value as ErrorSeverity) || undefined,
                }))
              }
              style={{ fontSize: '10px', padding: '2px 4px' }}
            >
              <option value="">All Severities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
            <select
              value={filter.category || ''}
              onChange={(e) =>
                setFilter((prev) => ({
                  ...prev,
                  category: (e.target.value as ErrorCategory) || undefined,
                }))
              }
              style={{ fontSize: '10px', padding: '2px 4px' }}
            >
              <option value="">All Categories</option>
              <option value="rendering">Rendering</option>
              <option value="security">Security</option>
              <option value="performance">Performance</option>
              <option value="accessibility">Accessibility</option>
              <option value="validation">Validation</option>
              <option value="network">Network</option>
              <option value="user_interaction">User Interaction</option>
              <option value="configuration">Configuration</option>
            </select>
          </div>

          {/* Error list */}
          <div style={{ flex: 1, overflow: 'auto' }}>
            {filteredErrors.length === 0 ? (
              <div style={{ padding: '16px', textAlign: 'center', color: '#6b7280' }}>
                No errors found
              </div>
            ) : (
              filteredErrors.map((error) => (
                <div
                  key={error.id}
                  onClick={() => setSelectedError(selectedError?.id === error.id ? null : error)}
                  style={{
                    padding: '8px 16px',
                    borderBottom: '1px solid #f3f4f6',
                    cursor: 'pointer',
                    background: selectedError?.id === error.id ? '#f0f9ff' : 'transparent',
                    opacity: error.resolved ? 0.6 : 1,
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          display: 'flex',
                          gap: '8px',
                          alignItems: 'center',
                          marginBottom: '4px',
                        }}
                      >
                        <div
                          style={{
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            background: getSeverityColor(error.severity),
                          }}
                        />
                        <div
                          style={{
                            background: getCategoryColor(error.category),
                            color: 'white',
                            padding: '1px 4px',
                            borderRadius: '2px',
                            fontSize: '9px',
                          }}
                        >
                          {error.category}
                        </div>
                        <div style={{ fontSize: '9px', color: '#6b7280' }}>
                          {error.context.componentName}
                        </div>
                        {error.occurrenceCount > 1 && (
                          <div style={{ fontSize: '9px', color: '#dc2626' }}>
                            ×{error.occurrenceCount}
                          </div>
                        )}
                      </div>
                      <div style={{ fontSize: '11px', marginBottom: '2px' }}>
                        {error.message.length > 60
                          ? `${error.message.substring(0, 60)}...`
                          : error.message}
                      </div>
                      <div style={{ fontSize: '9px', color: '#6b7280' }}>
                        {formatTimestamp(error.lastOccurrence)}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      {!error.resolved && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleResolveError(error.id)
                          }}
                          style={{
                            background: '#16a34a',
                            color: 'white',
                            border: 'none',
                            borderRadius: '2px',
                            padding: '2px 4px',
                            cursor: 'pointer',
                            fontSize: '8px',
                          }}
                        >
                          ✓
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Error details */}
                  {selectedError?.id === error.id && (
                    <div
                      style={{
                        marginTop: '8px',
                        padding: '8px',
                        background: '#f9fafb',
                        borderRadius: '4px',
                        fontSize: '10px',
                      }}
                    >
                      <div style={{ marginBottom: '4px' }}>
                        <strong>Full Message:</strong> {error.message}
                      </div>
                      {error.context.blockType && (
                        <div style={{ marginBottom: '4px' }}>
                          <strong>Block Type:</strong> {error.context.blockType}
                        </div>
                      )}
                      <div style={{ marginBottom: '4px' }}>
                        <strong>Component:</strong> {error.context.componentName}
                      </div>
                      <div style={{ marginBottom: '4px' }}>
                        <strong>Viewport:</strong> {error.context.viewport.width}×
                        {error.context.viewport.height}
                      </div>
                      {error.context.performance && (
                        <div style={{ marginBottom: '4px' }}>
                          <strong>Performance:</strong>{' '}
                          {error.context.performance.renderTime?.toFixed(2)}ms
                        </div>
                      )}
                      {error.stack && (
                        <div style={{ marginTop: '8px' }}>
                          <strong>Stack Trace:</strong>
                          <pre
                            style={{
                              fontSize: '8px',
                              background: '#ffffff',
                              padding: '4px',
                              borderRadius: '2px',
                              overflow: 'auto',
                              maxHeight: '100px',
                              marginTop: '2px',
                            }}
                          >
                            {error.stack}
                          </pre>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default ErrorMonitoringDashboard
