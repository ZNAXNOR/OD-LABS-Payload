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
import { Width } from '../Width'
import { cn } from '@/utilities/ui'

export const Select: React.FC<
  SelectField & {
    control: Control
    errors: Partial<FieldErrorsImpl>
  }
> = ({ name, control, errors, label, options, required, width, defaultValue }) => {
  return (
    <Width width={width}>
      <Controller
        control={control}
        defaultValue={defaultValue}
        name={name}
        rules={{ required }}
        render={({ field: { onChange, value } }) => {
          const controlledValue = options.find((t) => t.value === value)
          const isFilled = value !== undefined && value !== null && value !== ''

          return (
            <div className="relative z-0 transition-all focus-within:z-10">
              <SelectComponent
                onValueChange={(val) => onChange(val)}
                value={controlledValue?.value}
              >
                <SelectTrigger
                  id={name}
                  className="peer block w-full h-auto border border-neutral-300 dark:border-neutral-700 bg-transparent px-6 pt-12 pb-4 text-base/6 text-neutral-950 dark:text-white transition group-first:rounded-t-2xl group-last:rounded-b-2xl focus:border-od-brand-primary dark:focus:border-od-brand-primary focus:ring-0 focus:outline-hidden text-left"
                >
                  <SelectValue placeholder="" />
                </SelectTrigger>
                <SelectContent>
                  {options.map(({ label, value }) => {
                    return (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </SelectComponent>
              <label
                htmlFor={name}
                className={cn(
                  'pointer-events-none absolute top-6 left-6 -mt-3 origin-left text-base/6 transition-all duration-200',
                  isFilled
                    ? '-translate-y-4 scale-75 font-semibold text-neutral-950 dark:text-white'
                    : 'text-neutral-500 dark:text-neutral-400 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:font-semibold peer-focus:text-od-brand-primary dark:peer-focus:text-od-brand-primary',
                )}
              >
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
              </label>
              {errors[name] && <Error name={name} />}
            </div>
          )
        }}
      />
    </Width>
  )
}
