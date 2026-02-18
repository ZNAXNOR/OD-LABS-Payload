'use client'
import { cn } from '@/utilities/ui'
import { Media as MediaType } from '@/payload-types'
import { Media } from '@/components/Media'
import React, { useEffect } from 'react'
import { useHeaderTheme } from '@/providers/HeaderTheme'

export type ServicesHeroHighImpactProps = {
  title: string
  icon?: MediaType | null
  media?: MediaType | null
  className?: string
}

export const ServicesHeroHighImpact: React.FC<ServicesHeroHighImpactProps> = ({
  title,
  icon,
  media,
  className,
}) => {
  const { setHeaderTheme } = useHeaderTheme()

  useEffect(() => {
    setHeaderTheme('dark')
  })

  return (
    <div
      className={cn(
        'relative -mt-[10.4rem] flex flex-col justify-center min-h-[40vh] text-white',
        className,
      )}
      data-theme="dark"
    >
      <div className="container z-10 relative py-24">
        <div className="max-w-[48rem] mx-auto text-center flex flex-col items-center gap-8">
          <div className="uppercase text-sm font-semibold tracking-wider text-white/80">
            Service
          </div>

          {icon && (
            <div className="flex justify-center">
              <Media resource={icon} className="h-16 w-16 invert" />
            </div>
          )}

          <h1 className="text-4xl font-medium tracking-tight md:text-5xl lg:text-6xl max-w-3xl">
            {title}
          </h1>
        </div>
      </div>

      <div className="absolute inset-0 select-none brightness-75">
        {media && typeof media === 'object' && (
          <Media fill imgClassName="-z-10 object-cover" priority resource={media} />
        )}
        <div className="absolute inset-0 pointer-events-none bg-black/50" />
      </div>
    </div>
  )
}
