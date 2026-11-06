import type { TextField } from '@payloadcms/plugin-form-builder/types'
import type { FieldErrorsImpl, FieldValues, UseFormRegister } from 'react-hook-form'

import { Input } from '@/components/ui/input'
import React from 'react'

import { Error } from '../Error'
import { FieldLabel } from '../FieldLabel'
import { Width } from '../Width'

export const Text: React.FC<
  TextField & {
    errors: Partial<FieldErrorsImpl>
    register: UseFormRegister<FieldValues>
  }
> = ({ name, defaultValue, errors, label, register, required, width }) => {
  return (
    <Width width={width}>
      <FieldLabel htmlFor={name} label={label} required={required} />
      <Input defaultValue={defaultValue} id={name} type="text" {...register(name, { required })} />
      {errors[name] && <Error name={name} />}
    </Width>
  )
}
