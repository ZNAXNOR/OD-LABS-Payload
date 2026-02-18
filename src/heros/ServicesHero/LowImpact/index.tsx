import { cn } from '@/utilities/ui'
import { Media as MediaType } from '@/payload-types'
import { Media } from '@/components/Media'
import React from 'react'

export type ServicesHeroLowImpactProps = {
  title: string
  description?: string | null
  icon?: MediaType | null
  alignment?: 'left' | 'center' | null
  className?: string
}

export const ServicesHeroLowImpact: React.FC<ServicesHeroLowImpactProps> = ({
  title,
  description,
  icon,
  alignment = 'left',
  className,
}) => {
  const isCenter = alignment === 'center'

  return (
    <div className={cn('container mb-16', className)}>
      <div className={cn('max-w-[48rem] mx-auto', isCenter ? 'text-center' : 'text-left')}>
        <div className="uppercase text-sm mb-6 font-semibold tracking-wider text-muted-foreground/80">
          Service
        </div>

        {icon && (
          <div className={cn('flex mb-8', isCenter ? 'justify-center' : 'justify-start')}>
            <div className="rounded-full bg-muted p-6">
              <Media resource={icon} className="h-16 w-16 dark:invert" />
            </div>
          </div>
        )}

        <div className={cn('space-y-6', isCenter && 'flex flex-col items-center')}>
          <h1 className="text-4xl font-medium tracking-tight md:text-5xl lg:text-6xl">{title}</h1>
          {description && (
            <p
              className={cn('text-xl leading-relaxed text-muted-foreground', isCenter && 'mx-auto')}
            >
              {description}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
