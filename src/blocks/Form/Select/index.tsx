import type { SelectField } from '@payloadcms/plugin-form-builder/types'
import type { Control, FieldErrorsImpl } from 'react-hook-form'

import {
  Select as SelectComponent,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import React from 'react'
import { Controller } from 'react-hook-form'

import { Error } from '../Error'
import { FieldLabel } from '../FieldLabel'
import { Width } from '../Width'

export const Select: React.FC<
  SelectField & {
    control: Control
    errors: Partial<FieldErrorsImpl>
    placeholder?: string
  }
> = ({ name, control, errors, label, options, placeholder, required, width, defaultValue }) => {
  return (
    <Width width={width}>
      <FieldLabel htmlFor={name} label={label} required={required} />
      <Controller
        control={control}
        defaultValue={defaultValue}
        name={name}
        render={({ field: { onChange, value } }) => {
          const controlledValue = options.find((t) => t.value === value)

          return (
            <SelectComponent onValueChange={(val) => onChange(val)} value={controlledValue?.value}>
              <SelectTrigger className="h-12 w-full rounded-none border-zinc-800 bg-black text-sm text-zinc-200 shadow-none focus:ring-1 focus:ring-odl focus:ring-offset-0" id={name}>
                <SelectValue placeholder={placeholder || label} />
              </SelectTrigger>
              <SelectContent className="rounded-none border-zinc-800 bg-zinc-950 text-zinc-200">
                {options.map(({ label, value }) => {
                  return (
                    <SelectItem className="rounded-none focus:bg-zinc-800 focus:text-white" key={value} value={value}>
                      {label}
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </SelectComponent>
          )
        }}
        rules={{ required }}
      />
      {errors[name] && <Error name={name} />}
    </Width>
  )
}
