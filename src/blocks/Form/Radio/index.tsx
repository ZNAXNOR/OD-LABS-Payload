import { Label } from '@/components/ui/label'
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
          <Label className="flex cursor-pointer items-center gap-3 text-sm font-normal" key={value}>
            <input
              type="radio"
              value={value}
              defaultChecked={defaultValue === value}
              {...register(name, { required })}
            />
            {optionLabel}
          </Label>
        ))}
      </div>
    </fieldset>
    {errors[name] && <Error name={name} />}
  </Width>
)
