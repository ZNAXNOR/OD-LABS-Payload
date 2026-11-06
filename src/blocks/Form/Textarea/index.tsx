import type { TextField } from '@payloadcms/plugin-form-builder/types'
import type { FieldErrorsImpl, FieldValues, UseFormRegister } from 'react-hook-form'

import { Textarea as TextAreaComponent } from '@/components/ui/textarea'
import React from 'react'

import { Error } from '../Error'
import { FieldLabel } from '../FieldLabel'
import { Width } from '../Width'

export const Textarea: React.FC<
  TextField & {
    placeholder?: string
    errors: Partial<FieldErrorsImpl>
    register: UseFormRegister<FieldValues>
    rows?: number
  }
> = ({ name, defaultValue, errors, label, placeholder, register, required, rows = 3, width }) => {
  return (
    <Width width={width}>
      <FieldLabel htmlFor={name} label={label} required={required} />

      <TextAreaComponent
        className="min-h-32 rounded-none border-zinc-800 bg-black text-sm text-zinc-100 shadow-none placeholder:text-zinc-600 focus-visible:ring-1 focus-visible:ring-odl focus-visible:ring-offset-0"
        defaultValue={defaultValue}
        id={name}
        placeholder={placeholder || ''}
        rows={rows}
        {...register(name, { required: required })}
      />

      {errors[name] && <Error name={name} />}
    </Width>
  )
}
