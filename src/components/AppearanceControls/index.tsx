'use client'

import { BookOpenText, X } from 'lucide-react'
import React, { useEffect, useState } from 'react'

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { ThemeSelector } from '@/providers/Theme/ThemeSelector'

type ReadingSize = 'small' | 'standard' | 'large'
type ReadingWidth = 'narrow' | 'standard' | 'wide'
type SettingsTab = 'appearance' | 'reading'

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
  const [activeTab, setActiveTab] = useState<SettingsTab>('appearance')
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

  const handleTabKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return
    event.preventDefault()
    const nextTab: SettingsTab =
      event.key === 'Home' || (event.key === 'ArrowLeft' && activeTab === 'reading')
        ? 'appearance'
        : 'reading'
    setActiveTab(nextTab)
    document.getElementById(`display-tab-${nextTab}`)?.focus()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          aria-label="Open appearance and reading settings"
          aria-expanded={open}
          className="flex h-10 w-10 items-center justify-center rounded-md text-text-secondary transition-colors hover:bg-surface-subtle hover:text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
          type="button"
        >
          <BookOpenText aria-hidden="true" className="h-5 w-5" />
        </button>
      </DialogTrigger>

      <DialogContent
        aria-describedby="display-settings-description"
        className="z-[1101] flex max-h-[calc(100dvh-1rem)] w-[calc(100vw-1rem)] max-w-[58rem] flex-col gap-0 overflow-hidden border-border-default bg-surface-overlay p-0 text-text-primary shadow-2xl sm:max-h-[min(88dvh,48rem)]"
        overlayClassName="z-[1100]"
        showCloseButton={false}
      >
        <header className="flex shrink-0 items-center justify-between border-b border-border-default px-4 py-3 sm:px-6">
          <div>
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-brand">
              OD LABS / DISPLAY
            </p>
            <DialogTitle className="mt-1 text-sm font-semibold text-text-primary">
              Display settings
            </DialogTitle>
            <DialogDescription id="display-settings-description" className="sr-only">
              Configure the site colour scheme and reading preferences.
            </DialogDescription>
          </div>
          <DialogClose asChild>
            <button
              aria-label="Close display settings"
              className="rounded p-2 text-text-muted transition-colors hover:bg-surface-subtle hover:text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
              type="button"
            >
              <X aria-hidden="true" className="h-4 w-4" />
            </button>
          </DialogClose>
        </header>

        <div
          aria-label="Display settings sections"
          className="flex shrink-0 gap-1 border-b border-border-default px-4 sm:px-6"
          onKeyDown={handleTabKeyDown}
          role="tablist"
        >
          <button
            aria-controls="display-panel-appearance"
            aria-selected={activeTab === 'appearance'}
            className="border-b-2 px-3 py-3 text-xs font-medium transition-colors aria-selected:border-brand-hover aria-selected:text-text-primary border-transparent text-text-secondary hover:text-text-primary focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-focus-ring"
            id="display-tab-appearance"
            onClick={() => setActiveTab('appearance')}
            role="tab"
            tabIndex={activeTab === 'appearance' ? 0 : -1}
            type="button"
          >
            Appearance
          </button>
          <button
            aria-controls="display-panel-reading"
            aria-selected={activeTab === 'reading'}
            className="border-b-2 border-transparent px-3 py-3 text-xs font-medium text-text-secondary transition-colors hover:text-text-primary aria-selected:border-brand-hover aria-selected:text-text-primary focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-focus-ring"
            id="display-tab-reading"
            onClick={() => setActiveTab('reading')}
            role="tab"
            tabIndex={activeTab === 'reading' ? 0 : -1}
            type="button"
          >
            Reading
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-6">
          <section
            aria-labelledby="display-tab-appearance"
            className={activeTab === 'appearance' ? 'block' : 'hidden'}
            id="display-panel-appearance"
            role="tabpanel"
            tabIndex={0}
          >
            <ThemeSelector />
          </section>

          <section
            aria-labelledby="display-tab-reading"
            className={activeTab === 'reading' ? 'block' : 'hidden'}
            id="display-panel-reading"
            role="tabpanel"
            tabIndex={0}
          >
            <p className="mb-4 text-xs text-text-secondary">
              Adjust the typography and reading width of supported article content.
            </p>
            <fieldset className="mb-5">
              <legend className="mb-2 text-xs font-medium text-text-secondary">Text size</legend>
              <div className="grid grid-cols-3 gap-2">
                {sizes.map(({ value, label }) => (
                  <button
                    aria-pressed={preferences.size === value}
                    className="rounded-sm border border-border-default px-2 py-2 text-xs text-text-primary transition-colors hover:border-brand-hover hover:bg-surface-subtle aria-pressed:border-brand-hover aria-pressed:bg-brand-subtle focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
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
              <div className="grid grid-cols-3 gap-2">
                {widths.map(({ value, label }) => (
                  <button
                    aria-pressed={preferences.width === value}
                    className="rounded-sm border border-border-default px-2 py-2 text-xs text-text-primary transition-colors hover:border-brand-hover hover:bg-surface-subtle aria-pressed:border-brand-hover aria-pressed:bg-brand-subtle focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
                    key={value}
                    onClick={() => update({ ...preferences, width: value })}
                    type="button"
                  >
                    {label}
                  </button>
                ))}
              </div>
            </fieldset>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  )
}
