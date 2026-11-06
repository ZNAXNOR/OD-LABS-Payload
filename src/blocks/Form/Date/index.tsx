import type { DateField } from '@payloadcms/plugin-form-builder/types'
import type { FieldErrorsImpl, FieldValues, UseFormRegister } from 'react-hook-form'

import { CalendarDays } from 'lucide-react'
import React, { useRef } from 'react'

import { Input } from '@/components/ui/input'

import { Error } from '../Error'
import { FieldLabel } from '../FieldLabel'
import { Width } from '../Width'

export const Date: React.FC<
  DateField & {
    errors: Partial<FieldErrorsImpl>
    register: UseFormRegister<FieldValues>
  }
> = ({ name, defaultValue, errors, label, register, required, width }) => {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const registration = register(name, { required })

  return (
    <Width width={width}>
      <FieldLabel htmlFor={name} label={label} required={required} />
      <div className="relative">
        <Input
          className="h-12 rounded-none border-zinc-800 bg-black pr-12 text-sm text-zinc-100 shadow-none [color-scheme:dark] placeholder:text-zinc-600 focus-visible:ring-1 focus-visible:ring-odl focus-visible:ring-offset-0 [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-100"
          defaultValue={defaultValue}
          id={name}
          type="date"
          {...registration}
          ref={(element) => {
            registration.ref(element)
            inputRef.current = element
          }}
        />
        <button
          aria-label={`Choose ${label || 'date'}`}
          className="absolute inset-y-0 right-0 grid w-12 place-items-center text-zinc-400 transition-colors hover:text-odl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-odl"
          onClick={() => {
            const input = inputRef.current
            if (!input) return
            if (typeof input.showPicker === 'function') input.showPicker()
            else input.focus()
          }}
          type="button"
        >
          <CalendarDays aria-hidden="true" size={17} />
        </button>
      </div>
      {errors[name] && <Error name={name} />}
    </Width>
  )
}
