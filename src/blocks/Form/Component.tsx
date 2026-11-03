'use client'

import type { Form as FormType } from '@payloadcms/plugin-form-builder/types'
import type { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'
import React, { useCallback, useMemo, useRef, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'

import RichText from '@/components/RichText'
import { Button } from '@/components/ui/button'
import { getClientSideURL } from '@/utilities/getURL'

import { fields } from './fields'

type FormStep = {
  id?: string | null
  title: string
  description?: string | null
  type: 'form' | 'preview'
  fields?: FormType['fields'] | null
}

type ManagedForm = FormType & {
  formLayout?: 'standard' | 'multiStep' | null
  steps?: FormStep[] | null
}

type MultiFormItem = {
  form?: FormType | number | null
  tabLabel: string
  description?: string | null
}

type ManagedFormBlock = {
  blockName?: string
  blockType?: 'formBlock'
  variant?: 'single' | 'multi' | null
  singleForm?: ManagedForm | number | null
  multiForms?: MultiFormItem[] | null
  enableIntro?: boolean | null
  introContent?: DefaultTypedEditorState
}

export type FormBlockType = ManagedFormBlock

export const FormBlock: React.FC<{ id?: string } & FormBlockType> = ({
  enableIntro,
  introContent,
  variant = 'single',
  singleForm,
  multiForms = [],
}) => {
  const [activeTab, setActiveTab] = useState(0)
  const valuesByTab = useRef<Record<number, Record<string, unknown>>>({})
  const configuredForms = variant === 'multi'
    ? multiForms
    : [{ form: singleForm, tabLabel: '', description: '' }]
  const activeEntry = configuredForms[activeTab]
  const activeForm = (typeof activeEntry?.form === 'object' ? activeEntry.form : null) as ManagedForm | null
  const isMultiStep = activeForm?.formLayout === 'multiStep'
  const [activeStep, setActiveStep] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [hasSubmitted, setHasSubmitted] = useState(false)
  const [error, setError] = useState<string>()
  const router = useRouter()

  const formID = activeForm?.id
  const steps = useMemo(
    () => (activeForm?.steps ?? []).filter((step) => step.type === 'form' || step.type === 'preview'),
    [activeForm?.steps],
  )
  const currentStep = steps[activeStep]
  const formMethods = useForm<Record<string, unknown>>({
    shouldUnregister: false,
    defaultValues: {},
    mode: 'onTouched',
  })
  const {
    control,
    formState: { errors },
    handleSubmit,
    register,
    trigger,
    getValues,
    reset,
  } = formMethods

  const submit = useCallback(async (data: Record<string, unknown>) => {
    if (!formID) return
    setError(undefined)
    setIsLoading(true)
    try {
      const allowedNames = isMultiStep
        ? steps
            .flatMap((step) => step.fields ?? [])
            .flatMap((field) => ('name' in field && field.name ? [field.name] : []))
        : (activeForm?.fields ?? []).flatMap((field) =>
            'name' in field && field.name ? [field.name] : [],
          )
      const submissionData = [...new Set(allowedNames)]
        .filter((field) => Object.prototype.hasOwnProperty.call(data, field))
        .map((field) => ({ field, value: data[field] ?? '' }))
      const response = await fetch(`${getClientSideURL()}/api/form-submissions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ form: formID, submissionData }),
      })
      const result = await response.json()
      if (!response.ok) {
        setError(result.errors?.[0]?.message || 'Unable to submit the form. Please try again.')
        return
      }
      setHasSubmitted(true)
      const form = activeForm as FormType
      if (form.confirmationType === 'redirect' && form.redirect?.url) router.push(form.redirect.url)
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }, [activeForm, formID, isMultiStep, router, steps])

  const advance = async () => {
    if (!currentStep) return
    if (currentStep.type === 'form') {
      const names = (currentStep.fields ?? []).flatMap((field) =>
        'name' in field && field.name ? [field.name] : [],
      )
      const valid = names.length ? await trigger(names) : true
      if (!valid) return
    }
    setActiveStep((step) => Math.min(step + 1, steps.length - 1))
  }

  const renderPreview = () => {
    const fieldsToPreview = steps.flatMap((step) => step.fields ?? [])
    return (
      <dl className="divide-y divide-border border-y border-border">
        {fieldsToPreview.map((field, index) => {
          if (!('name' in field) || !field.name) return null
          const value = getValues(field.name)
          if (value === undefined || value === '' || value === false) return null
          const displayValue = Array.isArray(value) ? value.join(', ') : String(value)
          return (
            <div className="grid gap-2 py-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]" key={field.id ?? field.name ?? index}>
              <dt className="text-sm text-muted-foreground">{field.label || field.name}</dt>
              <dd className="text-sm break-words">{displayValue}</dd>
            </div>
          )
        })}
      </dl>
    )
  }

  return (
    <section className="w-full">
      {enableIntro && introContent && !hasSubmitted && (
        <RichText className="mb-8 lg:mb-12" data={introContent} enableGutter={false} />
      )}
      <div className="border border-border">
        {!hasSubmitted ? (
          <>
            {variant === 'multi' && (
              <div className="flex flex-col gap-3 border-b border-border p-5 sm:flex-row md:p-6" role="tablist" aria-label="Available forms">
                {configuredForms.map((entry, index) => (
                  <button
                    key={index}
                    type="button"
                    role="tab"
                    aria-selected={activeTab === index}
                    onClick={() => { valuesByTab.current[activeTab] = formMethods.getValues(); setActiveTab(index); reset(valuesByTab.current[index] ?? {}); formMethods.clearErrors(); setActiveStep(0); setError(undefined); setHasSubmitted(false) }}
                    className={`min-h-24 min-w-0 flex-1 border-r border-border px-5 py-4 text-left transition-colors last:border-r-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-odl ${activeTab === index ? 'border-odl bg-odl/5' : 'hover:border-zinc-600'}`}
                  >
                    <span className="block text-sm font-medium leading-6 text-zinc-100">{entry.tabLabel || (typeof entry.form === 'object' ? entry.form.title : 'Form')}</span>
                    {activeTab === index ? <span aria-hidden="true" className="mt-3 block text-xs text-odl">●</span> : <span aria-hidden="true" className="mt-3 block text-xs text-zinc-600">○</span>}
                  </button>
                ))}
              </div>
            )}
            {activeEntry?.description && variant === 'multi' ? <p className="border-b border-border px-5 py-4 text-sm text-muted-foreground md:px-8">{activeEntry.description}</p> : null}
            <FormProvider {...formMethods}>
              <form onSubmit={handleSubmit(submit)} className="p-5 md:p-8">
                {!isMultiStep ? (
                  <>
                    {activeForm?.fields?.map((field, index) => {
                      const Field: React.FC<any> = fields?.[field.blockType as keyof typeof fields]
                      if (!Field) return null
                      return <div className="mb-6 last:mb-0" key={field.id ?? index}><Field form={activeForm} {...field} {...formMethods} control={control} errors={errors} register={register} /></div>
                    })}
                    <div className="mt-8"><Button type="submit" disabled={isLoading}>{isLoading ? 'Submitting…' : activeForm?.submitButtonLabel || 'Send enquiry'}</Button></div>
                  </>
                ) : (
                  <>
                    {steps.length === 0 ? (
                      <p className="text-sm text-muted-foreground">This multi-step form has no steps configured yet. Add steps to the selected form in Payload Admin.</p>
                    ) : (
                      <>
                        <div className="mb-8">
                          <div className="mb-3 flex items-center justify-between gap-4">
                            <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Step {String(activeStep + 1).padStart(2, '0')} / {String(steps.length).padStart(2, '0')}</p>
                            <p className="text-sm">{currentStep?.title}</p>
                          </div>
                          <div className="flex gap-1" aria-hidden="true">
                            {steps.map((step, index) => <div key={step.key || index} className={`h-1 flex-1 ${index <= activeStep ? 'bg-foreground' : 'bg-border'}`} />)}
                          </div>
                        </div>
                        {currentStep?.description ? <p className="mb-6 text-sm text-muted-foreground">{currentStep.description}</p> : null}
                        {currentStep?.type === 'preview' ? renderPreview() : (
                          <div className="grid gap-6 sm:grid-cols-2">
                            {(currentStep?.fields ?? []).map((field, index) => {
                              const Field: React.FC<any> = fields?.[field.blockType as keyof typeof fields]
                              if (!Field) return null
                              return (
                                <div
                                  className={field.blockType === 'textarea' || field.blockType === 'message' ? 'sm:col-span-2' : ''}
                                  key={field.id ?? index}
                                >
                                  <Field
                                    form={activeForm}
                                    {...field}
                                    {...formMethods}
                                    control={control}
                                    errors={errors}
                                    register={register}
                                  />
                                </div>
                              )
                            })}
                          </div>
                        )}
                        {error ? <p role="alert" className="mt-5 text-sm text-red-500">{error}</p> : null}
                        <div className="mt-8 flex items-center justify-between gap-3 border-t border-border pt-5">
                          <Button type="button" variant="outline" disabled={activeStep === 0 || isLoading} onClick={() => setActiveStep((step) => Math.max(0, step - 1))}>Back</Button>
                          {activeStep < steps.length - 1 ? (
                            <Button type="button" disabled={isLoading} onClick={advance}>Continue</Button>
                          ) : (
                            <Button type="button" disabled={isLoading} onClick={handleSubmit(submit)}>{isLoading ? 'Submitting…' : activeForm?.submitButtonLabel || 'Submit inquiry'}</Button>
                          )}
                        </div>
                      </>
                    )}
                  </>
                )}
              </form>
            </FormProvider>
          </>
        ) : (
          <div className="p-6 md:p-8">
            {activeForm?.confirmationMessage ? <RichText data={activeForm.confirmationMessage} /> : <p>Thank you. Your message has been received.</p>}
          </div>
        )}
      </div>
    </section>
  )
}
