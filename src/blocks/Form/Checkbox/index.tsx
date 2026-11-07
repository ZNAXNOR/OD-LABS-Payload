import type { CheckboxField } from '@payloadcms/plugin-form-builder/types'
import type { FieldErrorsImpl, FieldValues, UseFormRegister } from 'react-hook-form'

import { useFormContext } from 'react-hook-form'

import { Checkbox as CheckboxUi } from '@/components/ui/checkbox'
import React from 'react'

import { Error } from '../Error'
import { Width } from '../Width'

export const Checkbox: React.FC<
  CheckboxField & {
    errors: Partial<FieldErrorsImpl>
    register: UseFormRegister<FieldValues>
  }
> = ({ name, defaultValue, errors, label, register, required, width }) => {
  const props = register(name, { required: required })
  const { setValue } = useFormContext()

  return (
    <Width width={width}>
      <div className="flex items-center gap-2">
        <CheckboxUi
          defaultChecked={defaultValue}
          className="size-4 rounded-none border-zinc-600 bg-black data-[state=checked]:border-odl data-[state=checked]:bg-odl data-[state=checked]:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-odl focus-visible:ring-0"
          id={name}
          {...props}
          onCheckedChange={(checked) => {
            setValue(props.name, checked)
          }}
        />
        <label htmlFor={name} className="cursor-pointer text-sm font-medium leading-5 text-zinc-300">{label}<span className={`ml-2 font-mono text-[9px] font-normal uppercase tracking-[0.14em] ${required ? 'text-odl' : 'text-zinc-500'}`}>{required ? 'Required' : 'Optional'}</span></label>
      </div>
      {errors[name] && <Error name={name} />}
    </Width>
  )
}
