'use client'

import { cn } from '@/utilities/ui'

interface LoadingIndicatorProps {
  isLoading: boolean
  message?: string
  progress?: number
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export function LoadingIndicator({
  isLoading,
  message = 'Loading...',
  progress,
  className,
  size = 'md',
}: LoadingIndicatorProps) {
  if (!isLoading) return null

  const sizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  }

  const spinnerSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  }

  return (
    <div
      className={cn(
        'loading-indicator flex items-center space-x-2 text-blue-300',
        sizeClasses[size],
        className,
      )}
    >
      <div
        className={cn(
          'animate-spin rounded-full border-2 border-blue-300 border-t-transparent',
          spinnerSizes[size],
        )}
      />

      <div className="flex flex-col">
        <span>{message}</span>

        {typeof progress === 'number' && (
          <div className="mt-1">
            <div className="w-24 h-1 bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-400 transition-all duration-300 ease-out"
                style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
              />
            </div>
            <span className="text-xs text-gray-400 mt-0.5">{Math.round(progress)}%</span>
          </div>
        )}
      </div>
    </div>
  )
}
