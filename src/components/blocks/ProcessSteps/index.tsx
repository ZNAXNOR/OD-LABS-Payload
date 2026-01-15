import React from 'react'
import type { ProcessStepsBlock as ProcessStepsBlockType } from '@/payload-types'
import { cn } from '@/utilities/ui'
import * as LucideIcons from 'lucide-react'

interface ProcessStepsBlockProps {
  block: ProcessStepsBlockType
  className?: string
}

export const ProcessStepsBlock: React.FC<ProcessStepsBlockProps> = ({ block, className }) => {
  const {
    heading,
    description,
    layout = 'vertical',
    style = 'numbered',
    steps,
    showConnectors = true,
  } = block

  const getIcon = (iconName?: string, index?: number) => {
    if (style === 'icons' && iconName) {
      const Icon = (LucideIcons as any)[iconName]
      if (Icon) {
        return <Icon className="w-8 h-8" />
      }
    }
    // Default to numbered
    return <span className="text-2xl font-bold">{(index || 0) + 1}</span>
  }

  const renderVerticalLayout = () => (
    <div className="space-y-8">
      {steps?.map((step, index) => (
        <div key={index} className="flex gap-6">
          {/* Icon/Number */}
          <div
            className={cn(
              'flex-shrink-0 w-16 h-16 rounded-full flex items-center justify-center',
              'bg-brand-primary text-white',
              style === 'timeline' && 'relative',
            )}
          >
            {getIcon(step.icon || undefined, index)}
            {/* Timeline Connector */}
            {style === 'timeline' && showConnectors && index < (steps?.length || 0) - 1 && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 w-0.5 h-8 bg-brand-primary/30" />
            )}
          </div>

          {/* Content */}
          <div className="flex-1 pb-8">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-xl font-semibold text-zinc-900 dark:text-white">{step.title}</h3>
              {step.duration && (
                <span className="px-3 py-1 rounded-full text-sm bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                  {step.duration}
                </span>
              )}
            </div>
            <p className="text-zinc-600 dark:text-zinc-400 mb-3">{step.description}</p>
            {step.details && (
              <p className="text-sm text-zinc-500 dark:text-zinc-500">{step.details}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  )

  const renderHorizontalLayout = () => (
    <div className="relative">
      {/* Connector Line */}
      {showConnectors && style === 'timeline' && (
        <div className="absolute top-8 left-0 right-0 h-0.5 bg-brand-primary/30 hidden md:block" />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {steps?.map((step, index) => (
          <div key={index} className="relative">
            {/* Icon/Number */}
            <div
              className={cn(
                'w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto relative z-10',
                'bg-brand-primary text-white',
              )}
            >
              {getIcon(step.icon || undefined, index)}
            </div>

            {/* Content */}
            <div className="text-center">
              <div className="flex flex-col items-center gap-2 mb-2">
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
                  {step.title}
                </h3>
                {step.duration && (
                  <span className="px-3 py-1 rounded-full text-sm bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                    {step.duration}
                  </span>
                )}
              </div>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-2">{step.description}</p>
              {step.details && (
                <p className="text-xs text-zinc-500 dark:text-zinc-500">{step.details}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const renderGridLayout = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {steps?.map((step, index) => (
        <div
          key={index}
          className={cn(
            'p-6 rounded-lg border-2 border-zinc-200 dark:border-zinc-800',
            'hover:border-brand-primary dark:hover:border-brand-primary transition-colors',
            'bg-white dark:bg-zinc-900',
          )}
        >
          {/* Icon/Number */}
          <div
            className={cn(
              'w-12 h-12 rounded-full flex items-center justify-center mb-4',
              'bg-brand-primary text-white',
            )}
          >
            {getIcon(step.icon || undefined, index)}
          </div>

          {/* Content */}
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">{step.title}</h3>
              {step.duration && (
                <span className="px-3 py-1 rounded-full text-xs bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                  {step.duration}
                </span>
              )}
            </div>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-2">{step.description}</p>
            {step.details && (
              <p className="text-xs text-zinc-500 dark:text-zinc-500">{step.details}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  )

  return (
    <section className={cn('py-16 px-4', className)}>
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        {(heading || description) && (
          <div className="text-center mb-12">
            {heading && (
              <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-white mb-4">
                {heading}
              </h2>
            )}
            {description && (
              <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
                {description}
              </p>
            )}
          </div>
        )}

        {/* Steps Display */}
        {layout === 'vertical' && renderVerticalLayout()}
        {layout === 'horizontal' && renderHorizontalLayout()}
        {layout === 'grid' && renderGridLayout()}
      </div>
    </section>
  )
}

export default ProcessStepsBlock
