'use client'

import React from 'react'

import { useTheme } from '..'
import type { Theme, ThemePreference } from '../types'

const themeOptions: {
  value: ThemePreference
  label: string
  description: string
  preview: 'auto' | 'light' | 'dark' | 'dark-contrast' | 'light-contrast'
}[] = [
  { value: 'auto', label: 'System', description: 'Follow device setting', preview: 'auto' },
  { value: 'od-light', label: 'Light', description: 'Original light palette', preview: 'light' },
  { value: 'od-dark', label: 'Dark', description: 'Original charcoal palette', preview: 'dark' },
  { value: 'od-light-contrast', label: 'Light contrast', description: 'Higher contrast', preview: 'light-contrast' },
  { value: 'od-dark-contrast', label: 'Dark contrast', description: 'Higher contrast', preview: 'dark-contrast' },
]

export const ThemeSelector: React.FC = () => {
  const { setTheme, preference } = useTheme()

  const selectTheme = (value: ThemePreference) => {
    setTheme(value === 'auto' ? null : (value as Theme))
  }

  return (
    <fieldset className="min-w-0">
      <legend className="mb-1 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-text-muted">
        Appearance
      </legend>
      <p className="mb-3 text-xs text-text-secondary">Choose how OD LABS looks.</p>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {themeOptions.map(({ value, label, description, preview }) => {
          const selected = preference === value
          return (
            <label
              className="group flex min-w-0 cursor-pointer flex-col gap-3 rounded-md border border-border-default bg-surface-raised p-3 transition-colors hover:border-brand has-[:checked]:border-brand has-[:checked]:bg-brand-subtle focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-focus-ring"
              key={value}
            >
              <input
                checked={selected}
                className="sr-only"
                name="od-appearance-theme"
                onChange={() => selectTheme(value)}
                type="radio"
                value={value}
              />
              <span
                aria-hidden="true"
                className="od-theme-preview relative block aspect-[16/10] overflow-hidden rounded-sm border border-black/10"
                data-preview={preview}
              >
                <span className="od-theme-preview__rail" />
                <span className="od-theme-preview__top" />
                <span className="od-theme-preview__content">
                  <span />
                  <span />
                  <span />
                </span>
                <span className="od-theme-preview__accent" />
              </span>
              <span className="flex items-start justify-between gap-1">
                <span className="min-w-0">
                  <span className="block text-xs font-semibold text-text-primary">{label}</span>
                  <span className="mt-0.5 block text-[10px] leading-tight text-text-muted">{description}</span>
                </span>
                <span
                  aria-hidden="true"
                  className="mt-0.5 flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full border border-border-strong group-has-[:checked]:border-brand group-has-[:checked]:bg-brand"
                >
                  {selected ? <span className="h-1.5 w-1.5 rounded-full bg-white" /> : null}
                </span>
              </span>
            </label>
          )
        })}
      </div>
    </fieldset>
  )
}
