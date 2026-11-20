'use client'

import React from 'react'

import { useTheme } from '..'
import type { ThemePreference } from '../types'

type BaseTheme = 'system' | 'light' | 'dark'
type Variant = 'standard' | 'contrast'

const baseOptions: {
  value: BaseTheme
  label: string
  description: string
  preview: 'auto' | 'light' | 'dark'
}[] = [
  { value: 'system', label: 'System', description: 'Follow your device preference', preview: 'auto' },
  { value: 'light', label: 'Light', description: 'A bright, neutral appearance', preview: 'light' },
  { value: 'dark', label: 'Dark', description: 'A restrained, dark appearance', preview: 'dark' },
]

const getBaseTheme = (preference: ThemePreference): BaseTheme => {
  if (preference === 'auto') return 'system'
  return preference.startsWith('od-dark') ? 'dark' : 'light'
}

const getVariant = (preference: ThemePreference): Variant =>
  preference.endsWith('-contrast') ? 'contrast' : 'standard'

export const ThemeSelector: React.FC = () => {
  const { setTheme, preference } = useTheme()
  const selectedBase = getBaseTheme(preference)
  const selectedVariant = getVariant(preference)

  const selectBase = (value: BaseTheme) => {
    if (value === 'system') {
      setTheme(null)
      return
    }
    setTheme(value === 'dark' ? 'od-dark' : 'od-light')
  }

  const selectVariant = (variant: Variant) => {
    if (selectedBase === 'light') {
      setTheme(variant === 'contrast' ? 'od-light-contrast' : 'od-light')
    } else if (selectedBase === 'dark') {
      setTheme(variant === 'contrast' ? 'od-dark-contrast' : 'od-dark')
    }
  }

  const previewFor = (base: BaseTheme) => {
    if (base === 'system') return 'auto'
    if (selectedBase !== base || selectedVariant === 'standard') return base
    return base === 'light' ? 'light-contrast' : 'dark-contrast'
  }

  return (
    <fieldset className="min-w-0">
      <legend className="mb-1 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-text-muted">
        Appearance
      </legend>
      <p className="mb-3 text-xs text-text-secondary">Choose how OD LABS looks.</p>

      <div className="grid grid-cols-3 gap-2 sm:gap-3" role="radiogroup" aria-label="Colour scheme">
        {baseOptions.map(({ value, label, description }) => {
          const selected = selectedBase === value
          const preview = previewFor(value)
          return (
            <label
              className="group flex min-w-0 cursor-pointer flex-col gap-2 rounded-md border border-border-default bg-surface-raised p-2 transition-colors hover:border-brand-hover has-[:checked]:border-brand-hover has-[:checked]:bg-brand-subtle focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-focus-ring sm:gap-3 sm:p-3"
              key={value}
            >
              <input
                checked={selected}
                className="sr-only"
                name="od-appearance-theme"
                onChange={() => selectBase(value)}
                type="radio"
                value={value}
              />
              <span
                aria-hidden="true"
                className="od-theme-preview relative block aspect-[16/10] overflow-hidden rounded-sm"
                data-preview={preview}
              >
                <span className="od-theme-preview__divider" />
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
                  className="mt-0.5 flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full border border-border-strong group-has-[:checked]:border-brand-hover group-has-[:checked]:bg-brand-hover"
                >
                  {selected ? <span className="h-1.5 w-1.5 rounded-full bg-white" /> : null}
                </span>
              </span>
            </label>
          )
        })}
      </div>

      {selectedBase !== 'system' ? (
        <fieldset className="mt-4 border-t border-border-default pt-3">
          <legend className="mb-2 text-xs font-medium text-text-secondary">
            {selectedBase === 'light' ? 'Light appearance' : 'Dark appearance'} variant
          </legend>
          <div className="grid grid-cols-2 gap-2" role="radiogroup" aria-label="Contrast level">
            {([
              { value: 'standard', label: 'Standard', description: 'Balanced contrast' },
              { value: 'contrast', label: 'High contrast', description: 'Stronger boundaries and text' },
            ] as const).map(({ value, label, description }) => {
              const selected = selectedVariant === value
              return (
                <label
                  className="flex cursor-pointer items-center justify-between gap-2 rounded-sm border border-border-default px-3 py-2 text-left transition-colors hover:border-brand-hover has-[:checked]:border-brand-hover has-[:checked]:bg-brand-subtle focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-focus-ring"
                  key={value}
                >
                  <input
                    checked={selected}
                    className="sr-only"
                    name="od-appearance-contrast"
                    onChange={() => selectVariant(value)}
                    type="radio"
                    value={value}
                  />
                  <span>
                    <span className="block text-xs font-medium text-text-primary">{label}</span>
                    <span className="mt-0.5 block text-[10px] text-text-muted">{description}</span>
                  </span>
                  <span
                    aria-hidden="true"
                    className="flex size-3.5 shrink-0 items-center justify-center rounded-full border border-border-strong"
                  >
                    {selected ? <span className="size-1.5 rounded-full bg-brand-hover" /> : null}
                  </span>
                </label>
              )
            })}
          </div>
        </fieldset>
      ) : (
        <p className="mt-3 text-[11px] text-text-muted">
          System mode follows your device setting and uses the standard appearance.
        </p>
      )}
    </fieldset>
  )
}
