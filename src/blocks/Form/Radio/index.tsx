import type { RadioField } from '@payloadcms/plugin-form-builder/types'
import type { FieldErrorsImpl, FieldValues, UseFormRegister } from 'react-hook-form'

import React from 'react'

import { Error } from '../Error'
import { FieldLabel } from '../FieldLabel'
import { Width } from '../Width'

export const Radio: React.FC<
  RadioField & {
    errors: Partial<FieldErrorsImpl>
    register: UseFormRegister<FieldValues>
  }
> = ({ name, defaultValue, errors, label, options, register, required, width }) => (
  <Width width={width}>
    <fieldset>
      <legend className="mb-3 text-sm font-medium"><FieldLabel label={label} required={required} /></legend>
      <div className="grid gap-3">
        {options.map(({ label: optionLabel, value }) => (
          <label className="group flex cursor-pointer items-center gap-3 text-sm font-normal text-zinc-300" key={value}>
            <input
              type="radio"
              className="size-4 shrink-0 appearance-none rounded-full border border-zinc-600 bg-black transition-colors checked:border-odl checked:bg-odl checked:ring-2 checked:ring-odl/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-odl"
              value={value}
              defaultChecked={defaultValue === value}
              {...register(name, { required })}
            />
            {optionLabel}
          </label>
        ))}
      </div>
    </fieldset>
    {errors[name] && <Error name={name} />}
  </Width>
)
