'use client'

import type { DateField } from '@payloadcms/plugin-form-builder/types'
import type { Control, FieldErrorsImpl } from 'react-hook-form'

import { CalendarDays, X } from 'lucide-react'
import React, { useState } from 'react'
import { Controller, useFormContext } from 'react-hook-form'

import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/utilities/ui'

import { Error } from '../Error'
import { FieldLabel } from '../FieldLabel'
import { Width } from '../Width'

const NativeDate = globalThis.Date

const formatDateToISO = (date: InstanceType<typeof NativeDate>): string => {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

const parseISODate = (isoString?: unknown): InstanceType<typeof NativeDate> | undefined => {
  if (!isoString || typeof isoString !== 'string') return undefined
  const parts = isoString.split('-').map(Number)
  if (parts.length !== 3 || parts.some((p) => Number.isNaN(p))) return undefined
  const [year, month, day] = parts
  const date = new NativeDate(year, month - 1, day)
  return Number.isNaN(date.getTime()) ? undefined : date
}

const formatDisplayDate = (isoString?: unknown): string => {
  const date = parseISODate(isoString)
  if (!date) return ''
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

const getStartOfToday = (): InstanceType<typeof NativeDate> => {
  const d = new NativeDate()
  d.setHours(0, 0, 0, 0)
  return d
}

export const Date: React.FC<
  DateField & {
    control?: Control<any>
    errors: Partial<FieldErrorsImpl>
    defaultValue?: string
    placeholder?: string
  }
> = ({ control, defaultValue, errors, label, name, placeholder, required, width }) => {
  const [open, setOpen] = useState(false)
  const startOfToday = React.useMemo(() => getStartOfToday(), [])
  const formContext = useFormContext()
  const effectiveControl = control || formContext?.control

  return (
    <Width width={width}>
      <FieldLabel htmlFor={name} label={label} required={required} />
      {effectiveControl ? (
        <Controller
          control={effectiveControl}
          defaultValue={defaultValue || ''}
          name={name}
          rules={{ required: required ? 'This field is required' : false }}
          render={({ field: { onChange, value } }) => {
            const selectedDate = parseISODate(value)
            const hasValue = Boolean(value)

            return (
              <div className="relative">
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <button
                      id={name}
                      type="button"
                      aria-label={label || 'Select date'}
                      className={cn(
                        'group flex h-12 w-full items-center justify-between rounded-none border border-border-default bg-surface-inset px-4 text-sm shadow-none transition-colors text-left',
                        'hover:border-border-default focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-focus-ring focus-visible:ring-offset-0',
                        errors[name] && 'border-error-border/80',
                      )}
                    >
                      <span
                        className={cn(
                          'truncate font-mono text-xs sm:text-sm',
                          hasValue ? 'text-text-primary font-medium' : 'text-text-muted',
                        )}
                      >
                        {hasValue
                          ? formatDisplayDate(value)
                          : placeholder ||
                            (label ? `Select ${label.toLowerCase()}` : 'Select date')}
                      </span>
                      <div className="flex items-center gap-2 shrink-0 pl-2">
                        {hasValue ? (
                          <span
                            role="button"
                            tabIndex={0}
                            aria-label="Clear date"
                            onClick={(e) => {
                              e.stopPropagation()
                              onChange('')
                            }}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.stopPropagation()
                                onChange('')
                              }
                            }}
                            className="p-1 text-text-muted hover:text-text-primary transition-colors focus-visible:outline-none cursor-pointer"
                          >
                            <X className="size-3.5" />
                          </span>
                        ) : null}
                        <CalendarDays
                          aria-hidden="true"
                          className="size-4 text-text-secondary group-hover:text-link transition-colors"
                        />
                      </div>
                    </button>
                  </PopoverTrigger>
                  <PopoverContent
                    align="start"
                    sideOffset={6}
                    className="w-auto p-0 rounded-none border border-border-default bg-surface text-text-primary shadow-2xl"
                  >
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      disabled={{ before: startOfToday }}
                      onSelect={(day) => {
                        if (day) {
                          onChange(formatDateToISO(day))
                        } else {
                          onChange('')
                        }
                        setOpen(false)
                      }}
                      autoFocus
                    />
                    <div className="flex items-center justify-between border-t border-border-default/80 px-6 py-3 bg-surface-inset/40 font-mono text-[11px]">
                      <button
                        type="button"
                        onClick={() => {
                          onChange(formatDateToISO(new NativeDate()))
                          setOpen(false)
                        }}
                        className="text-text-secondary hover:text-link transition-colors uppercase tracking-[0.12em]"
                      >
                        Today
                      </button>
                      {hasValue ? (
                        <button
                          type="button"
                          onClick={() => {
                            onChange('')
                            setOpen(false)
                          }}
                          className="text-text-muted hover:text-text-primary transition-colors uppercase tracking-[0.12em]"
                        >
                          Clear
                        </button>
                      ) : (
                        <span className="text-text-muted uppercase tracking-[0.12em]">
                          No date selected
                        </span>
                      )}
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            )
          }}
        />
      ) : null}
      {errors[name] && <Error name={name} />}
    </Width>
  )
}
