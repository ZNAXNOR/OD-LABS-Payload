import type { StateField } from '@payloadcms/plugin-form-builder/types'
import type { Control, FieldErrorsImpl } from 'react-hook-form'

import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import React from 'react'
import { Controller, useFormContext } from 'react-hook-form'

import { Error } from '../Error'
import { Width } from '../Width'
import { statesByCountry } from './stateOptions'

export const State: React.FC<
  StateField & {
    control: Control
    errors: Partial<FieldErrorsImpl>
  }
> = ({ name, control, errors, label, required, width }) => {
  const { watch, setValue } = useFormContext()
  const selectedCountry = watch('country')

  const filteredStates = (selectedCountry && statesByCountry[selectedCountry]) || []

  React.useEffect(() => {
    setValue(name, '')
  }, [selectedCountry, name, setValue])

  return (
    <Width width={width}>
      <Label htmlFor={name}>
        {label}
        {required && (
          <span className="required">
            * <span className="sr-only">(required)</span>
          </span>
        )}
      </Label>
      <Controller
        control={control}
        defaultValue=""
        name={name}
        render={({ field: { onChange, value } }) => {
          const controlledValue = filteredStates.find((t:any) => t.value === value)

          return (
            <Select onValueChange={(val) => onChange(val)} value={controlledValue?.value || ''}>
              <SelectTrigger className="w-full" id={name}>
                <SelectValue placeholder={label} />
              </SelectTrigger>
              <SelectContent>
                {filteredStates.length > 0 ? (
                  filteredStates.map((state:any) => {
                    return (
                      <SelectItem key={state.value} value={state.value}>
                        {state.label}
                      </SelectItem>
                    )
                  })
                ) : (
                  <SelectItem disabled value="none">
                    No states added for this country. Please let us know if you need it.
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          )
        }}
        rules={{ required }}
      />
      {errors[name] && <Error name={name} />}
    </Width>
  )
}
