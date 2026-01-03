'use client'
import React from 'react'
import type { Header as HeaderType } from '@/payload-types'
import { cn } from '@/utilities/ui'
import { MenuLeft } from './MenuLeft'
import { MenuMiddle } from './MenuMiddle'
import { MenuRight } from './MenuRight'

interface MegaMenuProps {
  tabs: NonNullable<HeaderType['tabs']>
  openDropdown: number | null
  setOpenDropdown: (index: number | null) => void
}

export function MegaMenu({ tabs, openDropdown, setOpenDropdown }: MegaMenuProps) {
  const [direction, setDirection] = React.useState<'left' | 'right' | null>(null)
  const prevIndex = React.useRef<number | null>(null)
  const [height, setHeight] = React.useState<number>(0)
  const containerRefs = React.useRef<(HTMLDivElement | null)[]>([])

  React.useEffect(() => {
    if (openDropdown === null) {
      setDirection(null)
      setHeight(0)
    } else {
      if (prevIndex.current !== null) {
        setDirection(openDropdown > prevIndex.current ? 'right' : 'left')
      }
      const activeRef = containerRefs.current[openDropdown]
      if (activeRef) {
        setHeight(activeRef.offsetHeight)
      }
    }
    prevIndex.current = openDropdown
  }, [openDropdown])

  // Update height if content changes (e.g. images loading)
  React.useEffect(() => {
    const activeRef = openDropdown !== null ? containerRefs.current[openDropdown] : null
    if (!activeRef) return

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setHeight(entry.target.clientHeight)
      }
    })

    observer.observe(activeRef)
    return () => observer.disconnect()
  }, [openDropdown])

  return (
    <div
      className={cn(
        'absolute top-full left-0 right-0 w-full transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] z-10',
        openDropdown !== null && tabs[openDropdown]?.enableDropdown
          ? 'opacity-100 translate-y-0 visible'
          : 'opacity-0 -translate-y-full invisible pointer-events-none',
      )}
    >
      <div
        className="bg-zinc-900 border-b border-zinc-800 backdrop-blur-3xl overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]"
        style={{ height: openDropdown !== null && tabs[openDropdown]?.enableDropdown ? height : 0 }}
        onMouseEnter={() => openDropdown !== null && setOpenDropdown(openDropdown)}
        onMouseLeave={() => setOpenDropdown(null)}
      >
        <div className="relative">
          {tabs.map((tab, i) => {
            if (!tab.enableDropdown || !tab.dropdown) return null

            const active = openDropdown === i

            return (
              <div
                key={i}
                ref={(el) => {
                  containerRefs.current[i] = el
                }}
                className={cn(
                  'transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] w-full',
                  active
                    ? 'opacity-100 translate-x-0 relative z-10'
                    : cn(
                        'opacity-0 absolute inset-0 pointer-events-none',
                        direction === 'right'
                          ? '-translate-x-12'
                          : direction === 'left'
                            ? 'translate-x-12'
                            : '',
                      ),
                )}
              >
                <div className="container mx-auto px-6 py-12">
                  <div className="grid grid-cols-10 gap-24">
                    <MenuLeft
                      label={tab.label}
                      dropdown={tab.dropdown}
                      active={active}
                      direction={direction}
                    />
                    <MenuMiddle dropdown={tab.dropdown} active={active} direction={direction} />
                    <MenuRight dropdown={tab.dropdown} active={active} direction={direction} />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
