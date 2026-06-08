'use client'

import React from 'react'
import { FormProvider } from 'react-hook-form'
import RichText from '@/components/RichText'
import { Button } from '@/components/ui/button'

import { fields } from '../fields'
import type { FormVariantProps } from '../variants/types'

export function FormRenderer({
  form,
  formID,
  formMethods,
  onSubmit,
  isLoading,
  hasSubmitted,
  error,
}: FormVariantProps) {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = formMethods

  const { confirmationType, confirmationMessage, submitButtonLabel } = form

  return (
    <FormProvider {...formMethods}>
      {!isLoading && hasSubmitted && confirmationType === 'message' && (
        <RichText data={confirmationMessage} />
      )}

      {isLoading && !hasSubmitted && <p>Loading, please wait...</p>}

      {error && <div>{`${error.status || '500'}: ${error.message || ''}`}</div>}

      {!hasSubmitted && (
        <form id={String(formID)} onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-12 gap-6 mb-6">
            {form.fields?.map((field, index) => {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const Field: React.FC<any> = fields?.[field.blockType as keyof typeof fields]

              // eslint-disable-next-line no-console
              console.log('Form field:', field)

              if (Field) {
                return (
                  <Field
                    key={index}
                    form={form}
                    {...field}
                    {...formMethods}
                    control={control}
                    errors={errors}
                    register={register}
                  />
                )
              }
              return null
            })}
          </div>

          <Button form={String(formID)} type="submit" variant="default">
            {submitButtonLabel}
          </Button>
        </form>
      )}
    </FormProvider>
  )
}
