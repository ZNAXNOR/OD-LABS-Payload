import type { DateField } from '@payloadcms/plugin-form-builder/types'
import type { FieldErrorsImpl, FieldValues, UseFormRegister } from 'react-hook-form'

import { Input } from '@/components/ui/input'
import React, { useRef } from 'react'
import { CalendarDays } from 'lucide-react'

import { Error } from '../Error'
import { FieldLabel } from '../FieldLabel'
import { Width } from '../Width'

export const Date: React.FC<
  DateField & {
    errors: Partial<FieldErrorsImpl>
    register: UseFormRegister<FieldValues>
  }
> = ({ name, defaultValue, errors, label, register, required, width }) => (
  <Width width={width}>
    <FieldLabel htmlFor={name} label={label} required={required} />
    <Input
      className="h-12 rounded-none border-zinc-800 bg-black text-sm text-zinc-100 shadow-none placeholder:text-zinc-600 focus-visible:ring-1 focus-visible:ring-odl focus-visible:ring-offset-0"
      defaultValue={defaultValue}
      id={name}
      type="date"
      {...register(name, { required })}
    />
    {errors[name] && <Error name={name} />}
  </Width>
)
