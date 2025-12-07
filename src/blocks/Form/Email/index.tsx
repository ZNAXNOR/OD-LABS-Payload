import type { EmailField } from '@payloadcms/plugin-form-builder/types'
import type { FieldErrorsImpl, FieldValues, UseFormRegister } from 'react-hook-form'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import React from 'react'

import { Error } from '../Error'
import { Width } from '../Width'

export const Email: React.FC<
  EmailField & {
    errors: Partial<FieldErrorsImpl>
    register: UseFormRegister<FieldValues>
  }
> = ({ name, defaultValue, errors, label, register, required, width }) => {
  return (
    <Width width={width}>
      <Label htmlFor={name} className="block text-sm/6 font-semibold text-gray-900 dark:text-white">
        {label}

        {required && (
          <span className="required text-red-500">
            * <span className="sr-only">(required)</span>
          </span>
        )}
      </Label>
      <div className="mt-2.5">
        <Input
          defaultValue={defaultValue}
          id={name}
          type="text"
          {...register(name, { pattern: /^\S[^\s@]*@\S+$/, required })}
          className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-od-brand-primary dark:bg-white/5 dark:text-white dark:outline-white/10 dark:placeholder:text-gray-500 dark:focus:outline-od-brand-primary"
        />
      </div>

      {errors[name] && <Error name={name} />}
    </Width>
  )
}
