'use client'
import React, { useEffect, useRef, useState } from 'react'
import * as LucideIcons from 'lucide-react'

type Stat = {
  value: number
  prefix?: string
  suffix?: string
  label: string
  description?: string
  icon?: string
}

type StatsCounterBlockProps = {
  block: {
    blockType: 'statsCounter'
    heading?: string
    layout: 'row' | 'grid'
    animateOnScroll: boolean
    duration: number
    stats: Stat[]
  }
}

function useCountUp(end: number, duration: number, shouldStart: boolean) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!shouldStart) return

    let startTime: number | null = null
    let animationFrame: number

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime
      const progress = Math.min((currentTime - startTime) / duration, 1)

      setCount(Math.floor(progress * end))

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      }
    }

    animationFrame = requestAnimationFrame(animate)

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame)
      }
    }
  }, [end, duration, shouldStart])

  return count
}

function StatItem({
  stat,
  duration,
  animateOnScroll,
}: {
  stat: Stat
  duration: number
  animateOnScroll: boolean
}) {
  const [isVisible, setIsVisible] = useState(!animateOnScroll)
  const ref = useRef<HTMLDivElement>(null)
  const count = useCountUp(stat.value, duration, isVisible)

  useEffect(() => {
    if (!animateOnScroll) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 },
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [animateOnScroll])

  const getIcon = (iconName: string) => {
    const Icon = (LucideIcons as any)[iconName]
    return Icon ? <Icon className="h-6 w-6" /> : null
  }

  return (
    <div ref={ref} className="text-center">
      {stat.icon && (
        <div className="mb-3 flex justify-center text-brand-primary">{getIcon(stat.icon)}</div>
      )}
      <div className="text-4xl md:text-5xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
        {stat.prefix}
        {count}
        {stat.suffix}
      </div>
      <div className="text-lg font-medium text-zinc-700 dark:text-zinc-300 mb-1">{stat.label}</div>
      {stat.description && (
        <div className="text-sm text-zinc-600 dark:text-zinc-400">{stat.description}</div>
      )}
    </div>
  )
}

export function StatsCounterBlock({ block }: StatsCounterBlockProps) {
  const { heading, layout, animateOnScroll, duration, stats } = block

  const layoutClass =
    layout === 'grid'
      ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'
      : 'flex flex-wrap justify-center gap-12 md:gap-16'

  return (
    <section className="py-16 bg-zinc-50 dark:bg-zinc-900">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {heading && (
            <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-zinc-100 text-center mb-12">
              {heading}
            </h2>
          )}

          <div className={layoutClass}>
            {stats.map((stat, index) => (
              <StatItem
                key={index}
                stat={stat}
                duration={duration}
                animateOnScroll={animateOnScroll}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
