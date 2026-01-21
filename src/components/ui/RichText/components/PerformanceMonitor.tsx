/**
 * Performance monitoring component for RichText
 * Displays real-time performance metrics and warnings
 */

'use client'

import React, { useState, useEffect } from 'react'
import { performanceMonitor, type PerformanceReport } from '../utils/performanceMonitor'

interface PerformanceMonitorProps {
  enabled?: boolean
  showDetails?: boolean
  updateInterval?: number
  className?: string
}

export const PerformanceMonitor: React.FC<PerformanceMonitorProps> = ({
  enabled = process.env.NODE_ENV === 'development',
  updateInterval = 2000,
  className = '',
}) => {
  const [report, setReport] = useState<PerformanceReport | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (!enabled) return

    const updateReport = () => {
      const newReport = performanceMonitor.generateReport()
      setReport(newReport)
    }

    // Initial update
    updateReport()

    // Set up interval
    const interval = setInterval(updateReport, updateInterval)

    return () => clearInterval(interval)
  }, [enabled, updateInterval])

  if (!enabled || !report) {
    return null
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreBackground = (score: number) => {
    if (score >= 80) return 'bg-green-100'
    if (score >= 60) return 'bg-yellow-100'
    return 'bg-red-100'
  }

  return (
    <div className={`fixed bottom-4 right-4 z-50 ${className}`}>
      {/* Performance Score Badge */}
      <div
        className={`
          ${getScoreBackground(report.score)}
          ${getScoreColor(report.score)}
          px-3 py-2 rounded-lg shadow-lg cursor-pointer
          border border-gray-200 backdrop-blur-sm
          transition-all duration-200 hover:shadow-xl
        `}
        onClick={() => setIsVisible(!isVisible)}
        title="Click to toggle performance details"
      >
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 rounded-full bg-current animate-pulse" />
          <span className="text-sm font-medium">Performance: {report.score}</span>
          {report.warnings.length > 0 && (
            <span className="text-xs bg-red-500 text-white px-1 rounded">
              {report.warnings.length}
            </span>
          )}
        </div>
      </div>

      {/* Detailed Performance Panel */}
      {isVisible && (
        <div className="absolute bottom-full right-0 mb-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 p-4 max-h-96 overflow-y-auto">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold text-gray-800">RichText Performance</h3>
            <button
              onClick={() => setIsVisible(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          {/* Performance Score */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-600">Overall Score</span>
              <span className={`text-lg font-bold ${getScoreColor(report.score)}`}>
                {report.score}/100
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${
                  report.score >= 80
                    ? 'bg-green-500'
                    : report.score >= 60
                      ? 'bg-yellow-500'
                      : 'bg-red-500'
                }`}
                style={{ width: `${report.score}%` }}
              />
            </div>
          </div>

          {/* Current Metrics */}
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Current Metrics</h4>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-600">Render Time:</span>
                <span
                  className={
                    report.metrics.renderTime > report.thresholds.renderTime
                      ? 'text-red-600'
                      : 'text-green-600'
                  }
                >
                  {report.metrics.renderTime.toFixed(2)}ms
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Block Count:</span>
                <span
                  className={
                    report.metrics.blockCount > report.thresholds.blockCount
                      ? 'text-red-600'
                      : 'text-green-600'
                  }
                >
                  {report.metrics.blockCount}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Content Length:</span>
                <span
                  className={
                    report.metrics.contentLength > report.thresholds.contentLength
                      ? 'text-red-600'
                      : 'text-green-600'
                  }
                >
                  {report.metrics.contentLength.toLocaleString()} chars
                </span>
              </div>
              {report.metrics.memoryUsage && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Memory Usage:</span>
                  <span
                    className={
                      report.metrics.memoryUsage > report.thresholds.memoryUsage
                        ? 'text-red-600'
                        : 'text-green-600'
                    }
                  >
                    {report.metrics.memoryUsage.toFixed(2)}MB
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Block Types */}
          {report.metrics.blockTypes.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Block Types</h4>
              <div className="flex flex-wrap gap-1">
                {report.metrics.blockTypes.map((type, index) => (
                  <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                    {type}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Warnings */}
          {report.warnings.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-red-700 mb-2">
                ⚠️ Warnings ({report.warnings.length})
              </h4>
              <div className="space-y-1">
                {report.warnings.map((warning, index) => (
                  <div key={index} className="text-xs text-red-600 bg-red-50 p-2 rounded">
                    {warning}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recommendations */}
          {report.recommendations.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-blue-700 mb-2">💡 Recommendations</h4>
              <div className="space-y-1">
                {report.recommendations.map((recommendation, index) => (
                  <div key={index} className="text-xs text-blue-600 bg-blue-50 p-2 rounded">
                    {recommendation}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex space-x-2 pt-3 border-t border-gray-200">
            <button
              onClick={() => {
                performanceMonitor.clearMetrics()
                setReport(performanceMonitor.generateReport())
              }}
              className="flex-1 px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded hover:bg-gray-200 transition-colors"
            >
              Clear Metrics
            </button>
            <button
              onClick={() => {
                const report = performanceMonitor.generateReport()
                console.log('RichText Performance Report:', report)
              }}
              className="flex-1 px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded hover:bg-blue-200 transition-colors"
            >
              Log Report
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

/**
 * Lightweight performance indicator component
 */
export const PerformanceIndicator: React.FC<{
  enabled?: boolean
  threshold?: number
}> = ({ enabled = process.env.NODE_ENV === 'development', threshold = 100 }) => {
  const [renderTime, setRenderTime] = useState<number>(0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (!enabled) return

    const startTime = performance.now()

    return () => {
      const endTime = performance.now()
      const duration = endTime - startTime
      setRenderTime(duration)
      setIsVisible(duration > threshold)

      // Auto-hide after 3 seconds
      if (duration > threshold) {
        setTimeout(() => setIsVisible(false), 3000)
      }
    }
  }, [enabled, threshold])

  if (!enabled || !isVisible) {
    return null
  }

  return (
    <div className="fixed top-4 right-4 z-50 bg-yellow-100 border border-yellow-300 text-yellow-800 px-3 py-2 rounded-lg shadow-lg">
      <div className="flex items-center space-x-2">
        <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
        <span className="text-sm">Slow render: {renderTime.toFixed(2)}ms</span>
      </div>
    </div>
  )
}

export default PerformanceMonitor
