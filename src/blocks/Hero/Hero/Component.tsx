import type { HeroBlock as HeroBlockProps } from '@/payload-types'
import { cn } from '@/utilities/ui'
import React from 'react'

export interface HeroComponentProps extends HeroBlockProps {
  className?: string
}

export const HeroComponent: React.FC<HeroComponentProps> = ({
  variant = 'default',
  eyebrow,
  heading,
  subheading,
  media,
  // videoUrl, // Commented out as it's not currently used
  codeSnippet,
  splitLayout,
  gradientConfig,
  actions,
  settings,
  className,
}) => {
  return (
    <section
      className={cn(
        'hero-block relative overflow-hidden',
        {
          'min-h-[400px]': settings?.height === 'small',
          'min-h-[500px]': settings?.height === 'medium',
          'min-h-[600px]': settings?.height === 'large',
          'min-h-screen': settings?.height === 'auto',
        },
        className,
      )}
    >
      {/* Background Media */}
      {media && (
        <div className="absolute inset-0 z-0">{/* Background image/video implementation */}</div>
      )}

      {/* Gradient Background */}
      {variant === 'gradient' && gradientConfig && (
        <div className="absolute inset-0 z-0">{/* Gradient background implementation */}</div>
      )}

      {/* Overlay */}
      {settings?.overlay?.enabled && (
        <div
          className={cn('absolute inset-0 z-10', {
            'bg-black': settings.overlay.color === 'black',
            'bg-white': settings.overlay.color === 'white',
            'bg-primary': settings.overlay.color === 'primary',
          })}
          style={{ opacity: (settings.overlay.opacity || 40) / 100 }}
        />
      )}

      {/* Content */}
      <div className="relative z-20 container mx-auto px-4 py-16 flex items-center min-h-full">
        <div
          className={cn('w-full', {
            'text-center': variant === 'centered',
            'max-w-2xl': variant === 'minimal',
            'grid grid-cols-1 lg:grid-cols-2 gap-8 items-center': variant === 'split',
          })}
        >
          <div
            className={cn({
              'order-2': variant === 'split' && splitLayout?.contentSide === 'right',
            })}
          >
            {eyebrow && <p className="text-sm font-medium text-muted-foreground mb-2">{eyebrow}</p>}

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">{heading}</h1>

            {subheading && (
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl">{subheading}</p>
            )}

            {/* Actions */}
            {actions && actions.length > 0 && (
              <div className="flex flex-wrap gap-4">
                {actions.map((action, index) => (
                  <button
                    key={index}
                    className={cn('px-6 py-3 rounded-lg font-medium transition-colors', {
                      'bg-primary text-primary-foreground hover:bg-primary/90':
                        action.priority === 'primary',
                      'border border-border bg-background hover:bg-accent':
                        action.priority === 'secondary',
                    })}
                  >
                    {action.link?.link?.label || 'Learn More'}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Split Layout Media */}
          {variant === 'split' && (
            <div
              className={cn({
                'order-1': splitLayout?.contentSide === 'right',
              })}
            >
              {/* Split layout media implementation */}
            </div>
          )}

          {/* Code Terminal */}
          {variant === 'codeTerminal' && codeSnippet && (
            <div className="mt-8">
              <div
                className={cn('rounded-lg p-4 font-mono text-sm', {
                  'bg-gray-900 text-green-400': codeSnippet.theme === 'dark',
                  'bg-gray-100 text-gray-800': codeSnippet.theme === 'light',
                })}
              >
                <pre>{codeSnippet.code}</pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
