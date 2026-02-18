'use client'
import { cn } from '@/utilities/ui'
import { Media as MediaType } from '@/payload-types'
import { Media } from '@/components/Media'
import React, { useEffect } from 'react'
import { useHeaderTheme } from '@/providers/HeaderTheme'

export type ServicesHeroMediumImpactProps = {
  title: string
  icon?: MediaType | null
  className?: string
}

export const ServicesHeroMediumImpact: React.FC<ServicesHeroMediumImpactProps> = ({
  title,
  icon,
  className,
}) => {
  const { setHeaderTheme } = useHeaderTheme()

  useEffect(() => {
    setHeaderTheme('light')
  })

  return (
    <div
      className={cn(
        'relative -mt-[10.4rem] bg-muted flex flex-col justify-center min-h-[35vh] mb-16',
        className,
      )}
    >
      <div className="container pt-[10.4rem] pb-16">
        <div className="max-w-[48rem] mx-auto flex flex-col items-center">
          <div className="uppercase text-sm mb-6 font-semibold tracking-wider text-muted-foreground/80 w-full text-center">
            Service
          </div>

          <div className="flex items-center justify-center gap-8 pb-12">
            {icon && (
              <div className="flex-shrink-0">
                <Media resource={icon} className="h-12 w-12 dark:invert" />
              </div>
            )}
            <h1 className="text-4xl font-medium tracking-tight md:text-5xl lg:text-6xl text-center">
              {title}
            </h1>
          </div>
        </div>
      </div>
    </div>
  )
}
