'use client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { useLivePreview } from '@/providers/LivePreview'
import { cn } from '@/utilities/ui'
import { useCallback, useEffect, useState } from 'react'

interface PerformanceMetricsProps {
  className?: string
  showDetailed?: boolean
  showCharts?: boolean
  refreshInterval?: number
}

interface PerformanceData {
  timestamp: Date
  updateTime: number
  errorCount: number
  retryCount: number
}

export function PerformanceMetrics({
  className,
  showDetailed = false,
  showCharts = false,
  refreshInterval = 1000,
}: PerformanceMetricsProps) {
  const { state, metrics } = useLivePreview()
  const [performanceHistory, setPerformanceHistory] = useState<PerformanceData[]>([])
  const [currentTime, setCurrentTime] = useState(new Date())

  // Update current time for real-time display
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date())
    }, refreshInterval)

    return () => clearInterval(interval)
  }, [refreshInterval])

  // Track performance history
  useEffect(() => {
    if (metrics.lastUpdateTime) {
      const newData: PerformanceData = {
        timestamp: metrics.lastUpdateTime,
        updateTime: metrics.averageUpdateTime,
        errorCount: metrics.errorCount,
        retryCount: metrics.retryCount,
      }

      setPerformanceHistory((prev) => {
        const updated = [...prev, newData]
        // Keep only last 50 entries
        return updated.slice(-50)
      })
    }
  }, [metrics.lastUpdateTime, metrics.averageUpdateTime, metrics.errorCount, metrics.retryCount])

  // Format time display
  const formatTime = useCallback((date: Date | null) => {
    if (!date) return 'Never'
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    }).format(date)
  }, [])

  // Format duration
  const formatDuration = useCallback((ms: number) => {
    if (ms < 1000) return `${ms.toFixed(0)}ms`
    if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`
    return `${(ms / 60000).toFixed(1)}m`
  }, [])

  // Calculate time since last update
  const getTimeSinceLastUpdate = useCallback(() => {
    if (!metrics.lastUpdateTime) return 'Never'
    const diff = currentTime.getTime() - metrics.lastUpdateTime.getTime()
    return formatDuration(diff)
  }, [metrics.lastUpdateTime, currentTime, formatDuration])

  // Get performance status
  const getPerformanceStatus = useCallback(() => {
    if (metrics.averageUpdateTime < 500) {
      return { status: 'Excellent', color: 'text-green-600', bgColor: 'bg-green-100' }
    }
    if (metrics.averageUpdateTime < 1000) {
      return { status: 'Good', color: 'text-blue-600', bgColor: 'bg-blue-100' }
    }
    if (metrics.averageUpdateTime < 2000) {
      return { status: 'Fair', color: 'text-yellow-600', bgColor: 'bg-yellow-100' }
    }
    return { status: 'Poor', color: 'text-red-600', bgColor: 'bg-red-100' }
  }, [metrics.averageUpdateTime])

  // Calculate success rate
  const getSuccessRate = useCallback(() => {
    const totalAttempts = metrics.updateCount + metrics.errorCount
    if (totalAttempts === 0) return 100
    return ((metrics.updateCount / totalAttempts) * 100).toFixed(1)
  }, [metrics.updateCount, metrics.errorCount])

  // Get trend indicator
  const getTrendIndicator = useCallback(() => {
    if (performanceHistory.length < 2) return null

    const recent = performanceHistory.slice(-5)
    const older = performanceHistory.slice(-10, -5)

    if (recent.length === 0 || older.length === 0) return null

    const recentAvg = recent.reduce((sum, item) => sum + item.updateTime, 0) / recent.length
    const olderAvg = older.reduce((sum, item) => sum + item.updateTime, 0) / older.length

    const improvement = ((olderAvg - recentAvg) / olderAvg) * 100

    if (Math.abs(improvement) < 5) return { trend: 'stable', icon: '→', color: 'text-gray-600' }
    if (improvement > 0) return { trend: 'improving', icon: '↗', color: 'text-green-600' }
    return { trend: 'degrading', icon: '↘', color: 'text-red-600' }
  }, [performanceHistory])

  const performanceStatus = getPerformanceStatus()
  const trendIndicator = getTrendIndicator()

  return (
    <div className={cn('space-y-3', className)}>
      {/* Basic Metrics */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="space-y-1">
          <div className="flex justify-between">
            <span className="text-blue-600">Updates:</span>
            <span className="font-mono text-blue-900">{metrics.updateCount}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-blue-600">Avg Time:</span>
            <span className="font-mono text-blue-900">
              {formatDuration(metrics.averageUpdateTime)}
            </span>
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex justify-between">
            <span className="text-blue-600">Success Rate:</span>
            <span className="font-mono text-blue-900">{getSuccessRate()}%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-blue-600">Last Update:</span>
            <span className="font-mono text-blue-900">{getTimeSinceLastUpdate()} ago</span>
          </div>
        </div>
      </div>

      {/* Performance Status */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-blue-600">Performance:</span>
        <div className="flex items-center gap-1">
          <span
            className={cn(
              'px-2 py-1 rounded-full text-xs font-medium',
              performanceStatus.bgColor,
              performanceStatus.color,
            )}
          >
            {performanceStatus.status}
          </span>
          {trendIndicator && (
            <span
              className={cn('text-xs font-mono', trendIndicator.color)}
              title={`Performance is ${trendIndicator.trend}`}
            >
              {trendIndicator.icon}
            </span>
          )}
        </div>
      </div>

      {/* Real-time Events */}
      {metrics.realTimeEventCount > 0 && (
        <div className="flex justify-between text-xs">
          <span className="text-blue-600">RT Events:</span>
          <span className="font-mono text-blue-900">{metrics.realTimeEventCount}</span>
        </div>
      )}

      {/* Error and Retry Information */}
      {(metrics.errorCount > 0 || metrics.retryCount > 0) && (
        <div className="grid grid-cols-2 gap-2 text-xs">
          {metrics.errorCount > 0 && (
            <div className="flex justify-between">
              <span className="text-red-600">Errors:</span>
              <span className="font-mono text-red-800">{metrics.errorCount}</span>
            </div>
          )}
          {metrics.retryCount > 0 && (
            <div className="flex justify-between">
              <span className="text-yellow-600">Retries:</span>
              <span className="font-mono text-yellow-800">{metrics.retryCount}</span>
            </div>
          )}
        </div>
      )}

      {/* Detailed Metrics */}
      {showDetailed && (
        <Card className="bg-white/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-blue-800">Detailed Metrics</CardTitle>
          </CardHeader>
          <CardContent className="pt-0 space-y-2">
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-blue-600">Session Active:</span>
                <span className="ml-1 text-blue-900">{state.isEnabled ? 'Yes' : 'No'}</span>
              </div>
              <div>
                <span className="text-blue-600">Real-time:</span>
                <span className="ml-1 text-blue-900">
                  {state.isRealTimeConnected ? 'Connected' : 'Disconnected'}
                </span>
              </div>
              <div>
                <span className="text-blue-600">Loading:</span>
                <span className="ml-1 text-blue-900">{state.isLoading ? 'Yes' : 'No'}</span>
              </div>
              <div>
                <span className="text-blue-600">Concurrent:</span>
                <span className="ml-1 text-blue-900">
                  {state.concurrentEditingDetected ? 'Detected' : 'None'}
                </span>
              </div>
            </div>

            {state.currentSession && (
              <div className="pt-2 border-t border-blue-200">
                <div className="text-xs font-medium text-blue-800 mb-1">Session Info</div>
                <div className="space-y-1 text-xs">
                  <div>
                    <span className="text-blue-600">Collection:</span>
                    <span className="ml-1 text-blue-900 capitalize">
                      {state.currentSession.collection}
                    </span>
                  </div>
                  <div>
                    <span className="text-blue-600">Document:</span>
                    <span className="ml-1 text-blue-900 font-mono text-xs">
                      {state.currentSession.documentId}
                    </span>
                  </div>
                  <div>
                    <span className="text-blue-600">Expires:</span>
                    <span className="ml-1 text-blue-900">
                      {formatTime(state.currentSession.expiresAt)}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Simple Chart */}
      {showCharts && performanceHistory.length > 1 && (
        <Card className="bg-white/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-blue-800">Performance Trend</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="h-16 flex items-end justify-between gap-1">
              {performanceHistory.slice(-20).map((data, index) => {
                const height = Math.max(4, Math.min(60, (data.updateTime / 2000) * 60))
                const color =
                  data.updateTime < 500
                    ? 'bg-green-400'
                    : data.updateTime < 1000
                      ? 'bg-blue-400'
                      : data.updateTime < 2000
                        ? 'bg-yellow-400'
                        : 'bg-red-400'

                return (
                  <div
                    key={index}
                    className={cn('w-2 rounded-t', color)}
                    style={{ height: `${height}px` }}
                    title={`${formatDuration(data.updateTime)} at ${formatTime(data.timestamp)}`}
                  />
                )
              })}
            </div>
            <div className="flex justify-between text-xs text-blue-600 mt-1">
              <span>Older</span>
              <span>Recent</span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
