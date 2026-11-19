import type { CountryField } from '@payloadcms/plugin-form-builder/types'
import type { Control, FieldErrorsImpl } from 'react-hook-form'

import {
  Select,
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
import { countryOptions } from './options'

export const Country: React.FC<
  CountryField & {
    control: Control
    errors: Partial<FieldErrorsImpl>
    placeholder?: string
  }
> = ({ name, control, errors, label, placeholder, required, width }) => {
  return (
    <Width width={width}>
      <FieldLabel htmlFor={name} label={label} required={required} />
      <Controller
        control={control}
        defaultValue=""
        name={name}
        render={({ field: { onChange, value } }) => {
          const controlledValue = countryOptions.find((t) => t.value === value)

          return (
            <Select onValueChange={(val) => onChange(val)} value={controlledValue?.value}>
              <SelectTrigger className="h-12 w-full rounded-none border-border-default bg-surface-inset text-sm text-text-primary shadow-none focus:ring-1 focus:ring-focus-ring focus:ring-offset-0" id={name}>
                <SelectValue placeholder={placeholder || label} />
              </SelectTrigger>
              <SelectContent className="rounded-none border-border-default bg-surface text-text-primary">
                {countryOptions.map(({ label, value }) => {
                  return (
                    <SelectItem className="rounded-none focus:bg-surface-subtle focus:text-text-primary" key={value} value={value}>
                      {label}
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>
          )
        }}
        rules={{ required }}
      />
      {errors[name] && <Error name={name} />}
    </Width>
  )
}
