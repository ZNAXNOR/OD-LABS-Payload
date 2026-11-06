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
  description?: DefaultTypedEditorState | null
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
  const configuredForms = (variant === 'multi' ? multiForms : [{ form: singleForm, tabLabel: '', description: '' }]) || []
  const activeEntry = configuredForms[activeTab]
  const activeForm = (typeof activeEntry?.form === 'object' && activeEntry.form ? activeEntry.form : null) as ManagedForm | null
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
        ? steps.flatMap((step) => step.fields ?? []).flatMap((field) => ('name' in field && field.name ? [field.name] : []))
        : (activeForm?.fields ?? []).flatMap((field) => 'name' in field && field.name ? [field.name] : [])
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
      const names = (currentStep.fields ?? []).flatMap((field) => 'name' in field && field.name ? [field.name] : [])
      const valid = names.length ? await trigger(names) : true
      if (!valid) return
    }
    setActiveStep((step) => Math.min(step + 1, steps.length - 1))
  }

  const navigateToStep = (index: number) => {
    if (index >= activeStep || index < 0) return
    setActiveStep(index)
  }

  const renderPreview = () => {
    const fieldsToPreview = steps.flatMap((step) => step.fields ?? [])
    return (
      <dl className="divide-y divide-border border-y border-border">
        {fieldsToPreview.map((field) => {
          if (!('name' in field) || !field.name) return null
          const value = getValues(field.name)
          if (value === undefined || value === '' || value === false) return null
          const displayValue = Array.isArray(value) ? value.join(', ') : String(value)
          return (
            <div className="grid gap-2 py-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]" key={field.name}>
              <dt className="text-sm text-muted-foreground">{field.label || field.name}</dt>
              <dd className="break-words text-sm">{displayValue}</dd>
            </div>
          )
        })}
      </dl>
    )
  }

  return (
    <section className="w-full px-6 py-8 md:px-10 md:py-10">
      {enableIntro && introContent && !hasSubmitted && (
        <RichText className="mb-8 lg:mb-12" data={introContent} enableGutter={false} />
      )}
      <div className="border border-border">
        {!hasSubmitted ? (
          <>
            {variant === 'multi' && (
              <div aria-label="Choose a form" className="flex flex-col gap-3 border-b border-border p-5 sm:flex-row md:p-6" role="group">
                {configuredForms.map((entry, index) => {
                  const isSelected = activeTab === index
                  return (
                    <button
                      key={index}
                      type="button"
                      aria-pressed={isSelected}
                      onClick={() => {
                        valuesByTab.current[activeTab] = formMethods.getValues()
                        setActiveTab(index)
                        reset(valuesByTab.current[index] ?? {})
                        formMethods.clearErrors()
                        setActiveStep(0)
                        setError(undefined)
                        setHasSubmitted(false)
                      }}
                      className={`flex min-h-24 min-w-0 flex-1 items-center justify-between gap-4 border px-5 py-4 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-odl ${isSelected ? 'border-odl bg-odl/5' : 'border-zinc-800 hover:border-zinc-600'}`}
                    >
                      <span className="min-w-0">
                        <span className="block text-sm font-medium leading-6 text-zinc-100">{entry.tabLabel || (typeof entry.form === 'object' && entry.form ? entry.form.title : 'Form')}</span>
                        {entry.description ? <span className="mt-1 block text-xs leading-5 text-zinc-500">{entry.description}</span> : null}
                      </span>
                      <span aria-hidden="true" className={`shrink-0 text-lg ${isSelected ? 'text-odl' : 'text-zinc-600'}`}>{isSelected ? '●' : '○'}</span>
                    </button>
                  )
                })}
              </div>
            )}
            <FormProvider {...formMethods}>
              <form onSubmit={handleSubmit(submit)} className="p-5 md:p-8">
                {!isMultiStep ? (
                  <>
                    {activeEntry?.description && variant === 'multi' ? <p className="mb-8 text-sm leading-6 text-muted-foreground">{activeEntry.description}</p> : null}
                    <div className="grid gap-x-6 gap-y-6 sm:grid-cols-2">
                      {activeForm?.fields?.map((field, index) => {
                        const Field: React.FC<any> = fields?.[field.blockType as keyof typeof fields]
                        if (!Field) return null
                        return <Field key={('id' in field && typeof field.id === 'string' ? field.id : index)} form={activeForm} {...field} {...formMethods} control={control} errors={errors} register={register} />
                      })}
                    </div>
                    <div className="mt-8"><Button type="submit" disabled={isLoading}>{isLoading ? 'Submitting…' : activeForm?.submitButtonLabel || 'Send enquiry'}</Button></div>
                  </>
                ) : (
                  <>
                    {steps.length === 0 ? (
                      <p className="text-sm text-muted-foreground">This multi-step form has no steps configured yet. Add steps to the selected form in Payload Admin.</p>
                    ) : (
                      <>
                        <div className="mb-8">
                          <nav aria-label="Form progress" className="hidden md:block">
                            <ol className="grid items-start" style={{ gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))` }}>
                              {steps.map((step, index) => {
                                const completed = index < activeStep
                                const current = index === activeStep
                                return (
                                  <li key={step.id || index} className="min-w-0">
                                    <button
                                      type="button"
                                      disabled={!completed || isLoading}
                                      aria-current={current ? 'step' : undefined}
                                      onClick={() => navigateToStep(index)}
                                      className="group w-full text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-odl disabled:cursor-default"
                                    >
                                      <span className="flex items-center">
                                        <span className={`grid size-8 shrink-0 place-items-center rounded-full border font-mono text-xs transition-colors ${completed ? 'border-odl bg-odl/5 text-odl' : current ? 'border-odl text-odl' : 'border-zinc-800 text-zinc-600'}`}>
                                          {completed ? '✓' : String(index + 1).padStart(2, '0')}
                                        </span>
                                        {index < steps.length - 1 ? <span aria-hidden="true" className={`mx-3 h-px flex-1 ${completed ? 'bg-odl' : 'bg-zinc-800'}`} /> : null}
                                      </span>
                                      <span className={`mt-3 block truncate pr-3 text-sm ${current ? 'font-medium text-zinc-100' : completed ? 'text-zinc-300 group-hover:text-zinc-100' : 'text-zinc-500'}`}>{step.title}</span>
                                      <span className={`mt-1 block font-mono text-[9px] uppercase tracking-[0.14em] ${current ? 'text-odl' : 'text-zinc-600'}`}>{completed ? 'Complete' : current ? 'Current' : 'Upcoming'}</span>
                                    </button>
                                  </li>
                                )
                              })}
                            </ol>
                          </nav>
                          <div className="md:hidden">
                            <div className="mb-3 flex items-end justify-between gap-4">
                              <div>
                                <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-zinc-500">Project inquiry</p>
                                <h2 className="mt-1 text-base font-medium text-zinc-100">{currentStep?.title}</h2>
                              </div>
                              <p className="shrink-0 font-mono text-xs text-zinc-500"><span className="text-zinc-100">{String(activeStep + 1).padStart(2, '0')}</span> / {String(steps.length).padStart(2, '0')}</p>
                            </div>
                            <div className="flex gap-1.5" role="progressbar" aria-label="Form progress" aria-valuemin={1} aria-valuemax={steps.length} aria-valuenow={activeStep + 1}>
                              {steps.map((step, index) => <span key={step.id || index} className={`h-1 flex-1 ${index <= activeStep ? 'bg-odl' : 'bg-zinc-800'}`} />)}
                            </div>
                            <p className="mt-2 text-xs text-zinc-500">{steps.length - activeStep - 1} {steps.length - activeStep - 1 === 1 ? 'step' : 'steps'} remaining</p>
                          </div>
                        </div>
                        <div className="mb-6 border-b border-border pb-5 md:mb-8">
                          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-zinc-500">Step {String(activeStep + 1).padStart(2, '0')}</p>
                          <h2 className="mt-2 text-xl font-medium tracking-tight text-zinc-100 md:text-2xl">{currentStep?.title}</h2>
                          {currentStep?.description ? <div className="mt-2 text-sm leading-6 text-zinc-500 [&_p]:m-0"><RichText data={currentStep.description} enableGutter={false} enableProse={false} /></div> : null}
                        </div>
                        {currentStep?.type === 'preview' ? renderPreview() : (
                          <div className="grid gap-x-6 gap-y-6 sm:grid-cols-2">
                            {(currentStep?.fields ?? []).map((field, index) => {
                              const Field: React.FC<any> = fields?.[field.blockType as keyof typeof fields]
                              if (!Field) return null
                              return <Field key={('id' in field && typeof field.id === 'string' ? field.id : index)} form={activeForm} {...field} {...formMethods} control={control} errors={errors} register={register} />
                            })}
                          </div>
                        )}
                        {error ? <p role="alert" className="mt-5 text-sm text-red-500">{error}</p> : null}
                        <div className="mt-8 flex items-center justify-between gap-3 border-t border-border pt-5">
                          <Button type="button" variant="outline" disabled={activeStep === 0 || isLoading} onClick={() => setActiveStep((step) => Math.max(0, step - 1))}>Back</Button>
                          {activeStep < steps.length - 1 ? <Button type="button" disabled={isLoading} onClick={advance}>Continue</Button> : <Button type="button" disabled={isLoading} onClick={handleSubmit(submit)}>{isLoading ? 'Submitting…' : activeForm?.submitButtonLabel || 'Submit inquiry'}</Button>}
                        </div>
                      </>
                    )}
                  </>
                )}
              </form>
            </FormProvider>
          </>
        ) : (
          <div className="p-6 md:p-8">{activeForm?.confirmationMessage ? <RichText data={activeForm.confirmationMessage} /> : <p>Thank you. Your message has been received.</p>}</div>
        )}
      </div>
    </section>
  )
}
