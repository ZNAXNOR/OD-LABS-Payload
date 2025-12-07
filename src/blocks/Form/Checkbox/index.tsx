import type { CheckboxField } from '@payloadcms/plugin-form-builder/types'
import type { FieldErrorsImpl, FieldValues, UseFormRegister } from 'react-hook-form'

import { useFormContext } from 'react-hook-form'

import { Checkbox as CheckboxUi } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
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
      <div className="flex gap-x-4">
        <div className="flex h-6 items-center">
          <div className="group relative inline-flex w-8 shrink-0 rounded-full bg-gray-200 p-px inset-ring inset-ring-gray-900/5 outline-offset-2 outline-od-brand-primary transition-colors duration-200 ease-in-out has-[:checked]:bg-od-brand-primary has-focus-visible:outline-2 dark:bg-white/5 dark:inset-ring-white/10 dark:outline-od-brand-primary dark:has-[:checked]:bg-od-brand-primary">
            <span className="size-4 rounded-full bg-white shadow-xs ring-1 ring-gray-900/5 transition-transform duration-200 ease-in-out group-has-[:checked]:translate-x-3.5" />
            <input
              id={name}
              type="checkbox"
              aria-label={typeof label === 'string' ? label : 'Toggle'}
              defaultChecked={defaultValue}
              {...props}
              onChange={(e) => {
                setValue(props.name, e.target.checked)
              }}
              className="absolute inset-0 appearance-none focus:outline-hidden cursor-pointer"
            />
          </div>
        </div>
        <Label htmlFor={name} className="text-sm/6 text-gray-600 dark:text-gray-400">
          <span dangerouslySetInnerHTML={{ __html: label as string }} />
          {required && (
            <span className="required text-red-500">
              * <span className="sr-only">(required)</span>
            </span>
          )}
        </Label>
      </div>
      {errors[name] && <Error name={name} />}
    </Width>
  )
}
