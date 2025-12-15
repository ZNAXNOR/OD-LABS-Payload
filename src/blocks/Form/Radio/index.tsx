import type { RadioField } from '@payloadcms/plugin-form-builder/types'
import type { Control, FieldErrorsImpl } from 'react-hook-form'

import React from 'react'
import { Controller } from 'react-hook-form'

import { Error } from '../Error'
import { Width } from '../Width'

export const Radio: React.FC<
  RadioField & {
    control: Control
    errors: Partial<FieldErrorsImpl>
  }
> = ({ name, control, errors, label, options, required, width, defaultValue }) => {
  return (
    <Width width={width}>
      <div className="border border-neutral-300 dark:border-neutral-700 px-6 py-8 group-first:rounded-t-2xl group-last:rounded-b-2xl bg-transparent">
        <fieldset>
          <legend className="text-base/6 text-neutral-500 dark:text-neutral-400">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </legend>
          <div className="mt-6 grid grid-cols-1 gap-8 sm:grid-cols-2">
            <Controller
              control={control}
              defaultValue={defaultValue}
              name={name}
              rules={{ required }}
              render={({ field: { onChange, value } }) => {
                return (
                  <>
                    {options.map(({ label, value: optionValue }) => {
                      const isChecked = value === optionValue
                      return (
                        <label key={optionValue} className="flex gap-x-3 cursor-pointer">
                          <input
                            type="radio"
                            className="h-6 w-6 flex-none appearance-none rounded-full border border-neutral-950/20 dark:border-white/20 outline-hidden checked:border-[0.5rem] checked:border-od-brand-primary dark:checked:border-od-brand-primary focus-visible:ring-1 focus-visible:ring-od-brand-primary dark:focus-visible:ring-od-brand-primary focus-visible:ring-offset-2 dark:ring-offset-neutral-950"
                            name={name}
                            value={optionValue}
                            checked={isChecked}
                            onChange={() => onChange(optionValue)}
                          />
                          <span className="text-base/6 text-neutral-950 dark:text-white">
                            {label}
                          </span>
                        </label>
                      )
                    })}
                  </>
                )
              }}
            />
          </div>
        </fieldset>
      </div>
      {errors[name] && <Error name={name} />}
    </Width>
  )
}
