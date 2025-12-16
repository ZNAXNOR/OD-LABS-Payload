import type { TextField } from '@payloadcms/plugin-form-builder/types'
import type { Control, FieldErrorsImpl, FieldValues } from 'react-hook-form'

import React from 'react'
import { Controller } from 'react-hook-form'
import PhoneInput from 'react-phone-number-input/input'

import { Error } from '../Error'
import { Width } from '../Width'

export const Telephone: React.FC<
  TextField & {
    control: Control<FieldValues, any>
    errors: Partial<FieldErrorsImpl>
  }
> = ({ name, control, errors, label, width, required }) => {
  return (
    <Width width={width}>
      <div className="relative z-0 transition-all focus-within:z-10">
        <Controller
          control={control}
          name={name}
          rules={{ required }}
          render={({ field: { onChange, value } }) => (
            <PhoneInput
              id={name}
              placeholder=" "
              className="peer block w-full border border-neutral-300 dark:border-neutral-700 bg-transparent px-6 pt-12 pb-4 text-base/6 text-neutral-950 dark:text-white transition group-first:rounded-t-2xl group-last:rounded-b-2xl focus:border-od-brand-primary dark:focus:border-od-brand-primary focus:ring-0 focus:outline-hidden"
              value={value as string}
              onChange={onChange}
            />
          )}
        />
        <label
          htmlFor={name}
          className="pointer-events-none absolute top-1/2 left-6 -mt-3 origin-left text-base/6 transition-all duration-200 -translate-y-4 scale-75 font-semibold text-neutral-950 dark:text-white peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-placeholder-shown:font-normal peer-placeholder-shown:text-neutral-500 dark:peer-placeholder-shown:text-neutral-400 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:font-semibold peer-focus:text-gray-900 dark:peer-focus:text-gray-100"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        {errors[name] && <Error name={name} />}
      </div>
    </Width>
  )
}
