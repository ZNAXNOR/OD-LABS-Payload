import type { TextField } from '@payloadcms/plugin-form-builder/types'
import type { FieldErrorsImpl, FieldValues, UseFormRegister } from 'react-hook-form'

import { Input } from '@/components/ui/input'
import React from 'react'

import { Error } from '../Error'
import { FieldLabel } from '../FieldLabel'
import { Width } from '../Width'
export const Number: React.FC<
  TextField & {
    errors: Partial<FieldErrorsImpl>
    register: UseFormRegister<FieldValues>
    placeholder?: string
  }
> = ({ name, defaultValue, errors, label, placeholder, register, required, width }) => {
  return (
    <Width width={width}>
      <FieldLabel htmlFor={name} label={label} required={required} />
      <Input
        className="h-12 rounded-none border-zinc-800 bg-black text-sm text-zinc-100 shadow-none placeholder:text-zinc-600 focus-visible:ring-1 focus-visible:ring-odl focus-visible:ring-offset-0"
        defaultValue={defaultValue}
        id={name}
        placeholder={placeholder || ''}
        type="number"
        {...register(name, { required })}
      />
      {errors[name] && <Error name={name} />}
    </Width>
  )
}
