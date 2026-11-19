'use client'

import { BookOpenText, X } from 'lucide-react'
import React, { useEffect, useState } from 'react'

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { ThemeSelector } from '@/providers/Theme/ThemeSelector'

type ReadingSize = 'small' | 'standard' | 'large'
type ReadingWidth = 'narrow' | 'standard' | 'wide'

type Preferences = {
  size: ReadingSize
  width: ReadingWidth
}

const STORAGE_KEY = 'od-reading-preferences'
const DEFAULTS: Preferences = { size: 'standard', width: 'standard' }

const isSize = (value: unknown): value is ReadingSize =>
  value === 'small' || value === 'standard' || value === 'large'

const isWidth = (value: unknown): value is ReadingWidth =>
  value === 'narrow' || value === 'standard' || value === 'wide'

const applyPreferences = ({ size, width }: Preferences) => {
  const root = document.documentElement
  root.dataset.readingSize = size
  root.dataset.readingWidth = width
}

export const AppearanceControls: React.FC = () => {
  const [open, setOpen] = useState(false)
  const [preferences, setPreferences] = useState<Preferences>(DEFAULTS)

  useEffect(() => {
    try {
      const stored = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '{}')
      const next = {
        size: isSize(stored.size) ? stored.size : DEFAULTS.size,
        width: isWidth(stored.width) ? stored.width : DEFAULTS.width,
      }
      setPreferences(next)
      applyPreferences(next)
    } catch {
      applyPreferences(DEFAULTS)
    }
  }, [])

  const update = (next: Preferences) => {
    setPreferences(next)
    applyPreferences(next)
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  }

  const sizes: { value: ReadingSize; label: string }[] = [
    { value: 'small', label: 'Small' },
    { value: 'standard', label: 'Standard' },
    { value: 'large', label: 'Large' },
  ]
  const widths: { value: ReadingWidth; label: string }[] = [
    { value: 'narrow', label: 'Narrow' },
    { value: 'standard', label: 'Standard' },
    { value: 'wide', label: 'Wide' },
  ]

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          aria-label="Open appearance and reading settings"
          aria-expanded={open}
          className="flex h-10 w-10 items-center justify-center rounded-md text-text-secondary transition-colors hover:bg-surface-subtle hover:text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
          type="button"
        >
          <BookOpenText aria-hidden="true" className="h-5 w-5" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="z-[1000] max-h-[min(82vh,48rem)] w-[min(58rem,75vw)] max-w-[calc(100vw-2rem)] overflow-y-auto rounded-md border border-border-default bg-surface-overlay p-5 sm:p-6 text-text-primary shadow-2xl"
        side="right"
        sideOffset={12}
      >
        <div className="mb-4 flex items-center justify-between border-b border-border-default pb-3">
          <div>
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-brand">OD LABS / DISPLAY</p>
            <h2 className="mt-1 text-sm font-semibold text-text-primary">Display settings</h2>
          </div>
          <button
            aria-label="Close display settings"
            className="rounded p-1 text-text-muted hover:bg-surface-subtle hover:text-text-primary"
            onClick={() => setOpen(false)}
            type="button"
          >
            <X aria-hidden="true" className="h-4 w-4" />
          </button>
        </div>

        <div className="mb-5">
          <ThemeSelector />
        </div>

        <div className="border-t border-border-default pt-4">
          <p className="mb-3 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-text-muted">
            Reading
          </p>
          <fieldset className="mb-4">
            <legend className="mb-2 text-xs font-medium text-text-secondary">Text size</legend>
            <div className="grid grid-cols-3 gap-1">
              {sizes.map(({ value, label }) => (
                <button
                  aria-pressed={preferences.size === value}
                  className="rounded-sm border border-border-default px-2 py-1.5 text-xs text-text-primary hover:bg-surface-subtle aria-pressed:border-brand aria-pressed:bg-brand-subtle focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
                  key={value}
                  onClick={() => update({ ...preferences, size: value })}
                  type="button"
                >
                  {label}
                </button>
              ))}
            </div>
          </fieldset>
          <fieldset>
            <legend className="mb-2 text-xs font-medium text-text-secondary">Content width</legend>
            <div className="grid grid-cols-3 gap-1">
              {widths.map(({ value, label }) => (
                <button
                  aria-pressed={preferences.width === value}
                  className="rounded-sm border border-border-default px-2 py-1.5 text-xs text-text-primary hover:bg-surface-subtle aria-pressed:border-brand aria-pressed:bg-brand-subtle focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
                  key={value}
                  onClick={() => update({ ...preferences, width: value })}
                  type="button"
                >
                  {label}
                </button>
              ))}
            </div>
          </fieldset>
        </div>
      </PopoverContent>
    </Popover>
  )
}
