'use client'

import { BookOpenText } from 'lucide-react'
import React, { useEffect, useState } from 'react'

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
    <details className="group relative">
      <summary
        aria-label="Open appearance and reading settings"
        className="flex h-10 w-10 cursor-pointer list-none items-center justify-center rounded-md text-text-secondary transition-colors hover:bg-surface-subtle hover:text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring [&::-webkit-details-marker]:hidden"
      >
        <BookOpenText aria-hidden="true" className="h-5 w-5" />
      </summary>
      <div className="fixed bottom-4 left-22 z-[100] w-64 rounded-lg border border-border-default bg-surface-overlay p-4 text-text-primary shadow-xl">
        <div className="mb-4">
          <ThemeSelector />
        </div>
        <fieldset className="mb-4">
          <legend className="mb-2 text-xs font-medium text-text-secondary">Reading text size</legend>
          <div className="grid grid-cols-3 gap-1">
            {sizes.map(({ value, label }) => (
              <button
                aria-pressed={preferences.size === value}
                className="rounded border border-border-default px-2 py-1.5 text-xs hover:bg-surface-subtle aria-pressed:border-border-interactive aria-pressed:bg-surface-subtle focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
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
          <legend className="mb-2 text-xs font-medium text-text-secondary">Reading width</legend>
          <div className="grid grid-cols-3 gap-1">
            {widths.map(({ value, label }) => (
              <button
                aria-pressed={preferences.width === value}
                className="rounded border border-border-default px-2 py-1.5 text-xs hover:bg-surface-subtle aria-pressed:border-border-interactive aria-pressed:bg-surface-subtle focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
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
    </details>
  )
}
