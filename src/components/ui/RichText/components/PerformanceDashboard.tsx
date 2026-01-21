/**
 * Performance dashboard component for RichText development
 * Provides comprehensive performance analysis and testing tools
 */

'use client'

import React, { useState, useEffect } from 'react'
import { performanceMonitor, type PerformanceReport } from '../utils/performanceMonitor'
import { runQuickBenchmark, runLoadTest, type BenchmarkResult } from '../utils/performanceBenchmark'

interface PerformanceDashboardProps {
  enabled?: boolean
  className?: string
}

export const PerformanceDashboard: React.FC<PerformanceDashboardProps> = ({
  enabled = process.env.NODE_ENV === 'development',
  className = '',
}) => {
  const [isVisible, setIsVisible] = useState(false)
  const [activeTab, setActiveTab] = useState<'monitor' | 'benchmark' | 'history'>('monitor')
  const [report, setReport] = useState<PerformanceReport | null>(null)
  const [benchmarkResult, setBenchmarkResult] = useState<BenchmarkResult | null>(null)
  const [isRunningBenchmark, setIsRunningBenchmark] = useState(false)
  const [benchmarkProgress, setBenchmarkProgress] = useState('')

  useEffect(() => {
    if (!enabled) return

    const updateReport = () => {
      const newReport = performanceMonitor.generateReport()
      setReport(newReport)
    }

    updateReport()
    const interval = setInterval(updateReport, 2000)

    return () => clearInterval(interval)
  }, [enabled])

  const runBenchmark = async (type: 'quick' | 'load') => {
    setIsRunningBenchmark(true)
    setBenchmarkProgress('Starting benchmark...')

    try {
      const result = type === 'quick' ? await runQuickBenchmark() : await runLoadTest()

      setBenchmarkResult(result)
      setBenchmarkProgress('Benchmark completed!')
      setActiveTab('benchmark')
    } catch (error) {
      console.error('Benchmark failed:', error)
      setBenchmarkProgress('Benchmark failed!')
    } finally {
      setIsRunningBenchmark(false)
      setTimeout(() => setBenchmarkProgress(''), 3000)
    }
  }

  if (!enabled) {
    return null
  }

  return (
    <>
      {/* Dashboard Toggle Button */}
      <button
        onClick={() => setIsVisible(!isVisible)}
        className={`
          fixed bottom-20 right-4 z-50 
          bg-blue-600 hover:bg-blue-700 text-white 
          px-4 py-2 rounded-lg shadow-lg
          transition-all duration-200
          ${className}
        `}
        title="Open Performance Dashboard"
      >
        📊 Performance
      </button>

      {/* Dashboard Panel */}
      {isVisible && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-6xl h-5/6 flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-800">RichText Performance Dashboard</h2>
              <button
                onClick={() => setIsVisible(false)}
                className="text-gray-500 hover:text-gray-700 text-xl"
              >
                ✕
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-200">
              {[
                { id: 'monitor', label: 'Live Monitor', icon: '📈' },
                { id: 'benchmark', label: 'Benchmark', icon: '🏃' },
                { id: 'history', label: 'History', icon: '📊' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`
                    px-6 py-3 font-medium transition-colors
                    ${
                      activeTab === tab.id
                        ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                        : 'text-gray-600 hover:text-gray-800'
                    }
                  `}
                >
                  {tab.icon} {tab.label}
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-auto p-6">
              {activeTab === 'monitor' && <MonitorTab report={report} />}

              {activeTab === 'benchmark' && (
                <BenchmarkTab
                  result={benchmarkResult}
                  isRunning={isRunningBenchmark}
                  progress={benchmarkProgress}
                  onRunBenchmark={runBenchmark}
                />
              )}

              {activeTab === 'history' && <HistoryTab />}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

const MonitorTab: React.FC<{ report: PerformanceReport | null }> = ({ report }) => {
  if (!report) {
    return <div className="text-center text-gray-500">Loading performance data...</div>
  }

  return (
    <div className="space-y-6">
      {/* Performance Score */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-800">Performance Score</h3>
          <div
            className={`text-3xl font-bold ${
              report.score >= 80
                ? 'text-green-600'
                : report.score >= 60
                  ? 'text-yellow-600'
                  : 'text-red-600'
            }`}
          >
            {report.score}/100
          </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className={`h-3 rounded-full transition-all duration-500 ${
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

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Render Time"
          value={`${report.metrics.renderTime.toFixed(2)}ms`}
          threshold={report.thresholds.renderTime || 100}
          current={report.metrics.renderTime}
          icon="⚡"
        />
        <MetricCard
          title="Block Count"
          value={report.metrics.blockCount.toString()}
          threshold={report.thresholds.blockCount || 20}
          current={report.metrics.blockCount}
          icon="🧱"
        />
        <MetricCard
          title="Content Length"
          value={`${(report.metrics.contentLength / 1000).toFixed(1)}k chars`}
          threshold={(report.thresholds.contentLength || 10000) / 1000}
          current={report.metrics.contentLength / 1000}
          icon="📝"
        />
        {report.metrics.memoryUsage && (
          <MetricCard
            title="Memory Usage"
            value={`${report.metrics.memoryUsage.toFixed(2)}MB`}
            threshold={report.thresholds.memoryUsage || 50}
            current={report.metrics.memoryUsage}
            icon="💾"
          />
        )}
      </div>

      {/* Block Types */}
      {report.metrics.blockTypes.length > 0 && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-semibold text-gray-700 mb-3">Active Block Types</h4>
          <div className="flex flex-wrap gap-2">
            {report.metrics.blockTypes.map((type, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
              >
                {type}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Warnings and Recommendations */}
      {(report.warnings.length > 0 || report.recommendations.length > 0) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {report.warnings.length > 0 && (
            <div className="bg-red-50 p-4 rounded-lg">
              <h4 className="font-semibold text-red-700 mb-3 flex items-center">
                ⚠️ Warnings ({report.warnings.length})
              </h4>
              <div className="space-y-2">
                {report.warnings.map((warning, index) => (
                  <div key={index} className="text-sm text-red-600 bg-red-100 p-2 rounded">
                    {warning}
                  </div>
                ))}
              </div>
            </div>
          )}

          {report.recommendations.length > 0 && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-700 mb-3 flex items-center">
                💡 Recommendations
              </h4>
              <div className="space-y-2">
                {report.recommendations.map((recommendation, index) => (
                  <div key={index} className="text-sm text-blue-600 bg-blue-100 p-2 rounded">
                    {recommendation}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

const BenchmarkTab: React.FC<{
  result: BenchmarkResult | null
  isRunning: boolean
  progress: string
  onRunBenchmark: (type: 'quick' | 'load') => void
}> = ({ result, isRunning, progress, onRunBenchmark }) => {
  return (
    <div className="space-y-6">
      {/* Benchmark Controls */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Run Benchmark</h3>
        <div className="flex space-x-4">
          <button
            onClick={() => onRunBenchmark('quick')}
            disabled={isRunning}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            Quick Benchmark (20 iterations)
          </button>
          <button
            onClick={() => onRunBenchmark('load')}
            disabled={isRunning}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
          >
            Load Test (1000 iterations)
          </button>
        </div>
        {progress && (
          <div className="mt-4 text-sm text-gray-600">
            {isRunning && <span className="animate-pulse">🔄 </span>}
            {progress}
          </div>
        )}
      </div>

      {/* Benchmark Results */}
      {result && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Benchmark Summary</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {result.summary.averageRenderTime.toFixed(2)}ms
                </div>
                <div className="text-sm text-gray-600">Avg Render Time</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {result.summary.p95RenderTime.toFixed(2)}ms
                </div>
                <div className="text-sm text-gray-600">95th Percentile</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {result.summary.averageMemoryUsage.toFixed(2)}MB
                </div>
                <div className="text-sm text-gray-600">Avg Memory</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-600">
                  {result.summary.totalIterations}
                </div>
                <div className="text-sm text-gray-600">Total Tests</div>
              </div>
            </div>
          </div>

          {/* Recommendations */}
          {result.recommendations.length > 0 && (
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h4 className="font-semibold text-yellow-700 mb-3">📋 Benchmark Recommendations</h4>
              <div className="space-y-2">
                {result.recommendations.map((recommendation, index) => (
                  <div key={index} className="text-sm text-yellow-600 bg-yellow-100 p-2 rounded">
                    {recommendation}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

const HistoryTab: React.FC = () => {
  const [metrics, setMetrics] = useState<any[]>([])

  useEffect(() => {
    const allMetrics = performanceMonitor.getMetrics()
    setMetrics(allMetrics.slice(-50)) // Last 50 measurements
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-800">Performance History</h3>
        <button
          onClick={() => {
            performanceMonitor.clearMetrics()
            setMetrics([])
          }}
          className="px-3 py-1 bg-red-100 text-red-700 text-sm rounded hover:bg-red-200"
        >
          Clear History
        </button>
      </div>

      {metrics.length === 0 ? (
        <div className="text-center text-gray-500 py-8">No performance history available</div>
      ) : (
        <div className="bg-gray-50 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left">Time</th>
                  <th className="px-4 py-2 text-left">Render Time</th>
                  <th className="px-4 py-2 text-left">Blocks</th>
                  <th className="px-4 py-2 text-left">Content</th>
                  <th className="px-4 py-2 text-left">Memory</th>
                </tr>
              </thead>
              <tbody>
                {metrics.map((metric, index) => (
                  <tr key={index} className="border-t border-gray-200">
                    <td className="px-4 py-2">{new Date(metric.timestamp).toLocaleTimeString()}</td>
                    <td className="px-4 py-2">
                      <span className={metric.renderTime > 100 ? 'text-red-600' : 'text-green-600'}>
                        {metric.renderTime.toFixed(2)}ms
                      </span>
                    </td>
                    <td className="px-4 py-2">{metric.blockCount}</td>
                    <td className="px-4 py-2">{(metric.contentLength / 1000).toFixed(1)}k</td>
                    <td className="px-4 py-2">
                      {metric.memoryUsage ? `${metric.memoryUsage.toFixed(2)}MB` : 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

const MetricCard: React.FC<{
  title: string
  value: string
  threshold: number
  current: number
  icon: string
}> = ({ title, value, threshold, current, icon }) => {
  const isOverThreshold = current > threshold

  return (
    <div
      className={`p-4 rounded-lg border-2 ${
        isOverThreshold ? 'border-red-200 bg-red-50' : 'border-green-200 bg-green-50'
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-600">{title}</span>
        <span className="text-lg">{icon}</span>
      </div>
      <div className={`text-xl font-bold ${isOverThreshold ? 'text-red-600' : 'text-green-600'}`}>
        {value}
      </div>
      <div className="text-xs text-gray-500 mt-1">
        Threshold: {threshold}
        {title.includes('Time') ? 'ms' : title.includes('Memory') ? 'MB' : ''}
      </div>
    </div>
  )
}

export default PerformanceDashboard
