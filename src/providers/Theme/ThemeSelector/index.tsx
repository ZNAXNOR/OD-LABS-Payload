'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import React from 'react'

import type { Theme } from '../types'
import { useTheme } from '..'

const themeOptions: { value: Theme; label: string }[] = [
  { value: 'od-dark', label: 'OD Dark' },
  { value: 'od-light', label: 'OD Light' },
  { value: 'od-dark-contrast', label: 'OD Dark High Contrast' },
  { value: 'od-light-contrast', label: 'OD Light High Contrast' },
]

export const ThemeSelector: React.FC = () => {
  const { setTheme, preference } = useTheme()

  const onThemeChange = (value: string) => {
    if (value === 'auto') {
      setTheme(null)
      return
    }

    setTheme(value as Theme)
  }

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-text-secondary" id="theme-select-label">
        Appearance
      </label>
      <Select onValueChange={onThemeChange} value={preference}>
        <SelectTrigger aria-labelledby="theme-select-label" className="w-full">
          <SelectValue placeholder="Select theme" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="auto">Auto (system)</SelectItem>
          {themeOptions.map(({ value, label }) => (
            <SelectItem key={value} value={value}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
