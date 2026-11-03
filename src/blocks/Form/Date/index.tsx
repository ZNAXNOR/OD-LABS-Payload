import type { DateField } from '@payloadcms/plugin-form-builder/types'
import type { FieldErrorsImpl, FieldValues, UseFormRegister } from 'react-hook-form'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import React from 'react'

import { Error } from '../Error'
import { Width } from '../Width'

export const Date: React.FC<
  DateField & {
    errors: Partial<FieldErrorsImpl>
    register: UseFormRegister<FieldValues>
  }
> = ({ name, defaultValue, errors, label, register, required, width }) => (
  <Width width={width}>
    <Label htmlFor={name}>
      {label}
      {required && <span className="required">* <span className="sr-only">(required)</span></span>}
    </Label>
    <Input
      defaultValue={defaultValue}
      id={name}
      type="date"
      {...register(name, { required })}
    />
    {errors[name] && <Error name={name} />}
  </Width>
)
