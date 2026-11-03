'use client'

import type { Form as FormType } from '@payloadcms/plugin-form-builder/types'
import type { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'
import React, { useCallback, useMemo, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'

import RichText from '@/components/RichText'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { getClientSideURL } from '@/utilities/getURL'

import { fields } from './fields'

type StepField = {
  name: string
  label: string
  type: 'text' | 'email' | 'textarea' | 'select' | 'radio' | 'checkbox' | 'date' | 'number'
  required?: boolean | null
  placeholder?: string | null
  helpText?: string | null
  defaultValue?: string | boolean | null
  options?: { label: string; value: string }[] | null
}

type FormStep = {
  key: string
  title: string
  description?: string | null
  type: 'form' | 'preview'
  fields?: StepField[] | null
}

type ManagedForm = FormType & {
  steps?: FormStep[] | null
}

type ManagedFormBlock = {
  blockName?: string
  blockType?: 'formBlock'
  enableIntro?: boolean | null
  introContent?: DefaultTypedEditorState
  generalForm?: FormType | null
  projectInquiryForm?: ManagedForm | null
  form?: FormType | null
}

export type FormBlockType = ManagedFormBlock

export const FormBlock: React.FC<{ id?: string } & FormBlockType> = ({
  enableIntro,
  introContent,
  generalForm: generalFormFromProps,
  projectInquiryForm,
  form: legacyForm,
}) => {
  const generalForm = generalFormFromProps ?? legacyForm
  const [mode, setMode] = useState<'general' | 'projectInquiry'>('general')
  const [activeStep, setActiveStep] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [hasSubmitted, setHasSubmitted] = useState(false)
  const [error, setError] = useState<string>()
  const router = useRouter()

  const activeForm = mode === 'general' ? generalForm : projectInquiryForm
  const formID = activeForm?.id
  const steps = useMemo(
    () => (projectInquiryForm?.steps ?? []).filter((step) => step.type === 'form' || step.type === 'preview'),
    [projectInquiryForm?.steps],
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
    setValue,
  } = formMethods

  const submit = useCallback(async (data: Record<string, unknown>) => {
    if (!formID) return
    setError(undefined)
    setIsLoading(true)
    try {
      const allowedNames = mode === 'general'
        ? (generalForm?.fields ?? []).map((field) => field.name)
        : steps.flatMap((step) => step.fields ?? []).map((field) => field.name)
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
  }, [activeForm, formID, generalForm?.fields, mode, router, steps])

  const advance = async () => {
    if (!currentStep) return
    if (currentStep.type === 'form') {
      const names = (currentStep.fields ?? []).map((field) => field.name)
      const valid = names.length ? await trigger(names) : true
      if (!valid) return
    }
    setActiveStep((step) => Math.min(step + 1, steps.length - 1))
  }

  const renderManagedField = (field: StepField) => {
    const common = {
      id: field.name,
      ...register(field.name, {
        required: field.required ? `${field.label} is required.` : false,
        ...(field.type === 'email' ? {
          pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email address.' },
        } : {}),
      }),
    }
    const label = (
      <Label htmlFor={field.name} className="mb-2 block text-sm">
        {field.label}{field.required ? <span aria-hidden="true"> *</span> : null}
      </Label>
    )
    const errorMessage = errors[field.name]?.message
    return (
      <div className="space-y-2" key={field.name}>
        {field.type !== 'checkbox' && label}
        {field.type === 'textarea' ? (
          <Textarea {...common} placeholder={field.placeholder ?? ''} />
        ) : field.type === 'select' ? (
          <Select onValueChange={(value) => setValue(field.name, value, { shouldValidate: true })}>
            <SelectTrigger id={field.name} className="w-full"><SelectValue placeholder={field.placeholder || 'Select an option'} /></SelectTrigger>
            <SelectContent>{(field.options ?? []).map((option) => <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>)}</SelectContent>
          </Select>
        ) : field.type === 'radio' ? (
          <div className="grid gap-2">
            {(field.options ?? []).map((option) => (
              <label className="flex items-center gap-3 border border-border px-3 py-3 text-sm" key={option.value}>
                <input type="radio" value={option.value} {...register(field.name, { required: field.required ? `${field.label} is required.` : false })} />
                {option.label}
              </label>
            ))}
          </div>
        ) : field.type === 'checkbox' ? (
          <label className="flex items-center gap-3 text-sm">
            <input type="checkbox" className="sr-only" {...register(field.name, { required: field.required ? `${field.label} is required.` : false })} />
            <Checkbox checked={Boolean(getValues(field.name))} onCheckedChange={(checked) => setValue(field.name, checked, { shouldValidate: true })} />
            <span>{field.label}{field.required ? ' *' : ''}</span>
          </label>
        ) : (
          <Input {...common} type={field.type} placeholder={field.placeholder ?? ''} />
        )}
        {field.helpText ? <p className="text-xs text-muted-foreground">{field.helpText}</p> : null}
        {errorMessage ? <p role="alert" className="text-sm text-red-500">{String(errorMessage)}</p> : null}
      </div>
    )
  }

  const renderPreview = () => {
    const fieldsToPreview = steps.flatMap((step) => step.fields ?? [])
    return (
      <dl className="divide-y divide-border border-y border-border">
        {fieldsToPreview.map((field) => {
          const value = getValues(field.name)
          if (value === undefined || value === '' || value === false) return null
          const displayValue = Array.isArray(value) ? value.join(', ') : String(value)
          return (
            <div className="grid gap-2 py-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]" key={field.name}>
              <dt className="text-sm text-muted-foreground">{field.label}</dt>
              <dd className="text-sm break-words">{displayValue}</dd>
            </div>
          )
        })}
      </dl>
    )
  }

  const renderGeneralFields = () => (
    <div className="space-y-6">
      {generalForm?.fields?.map((field, index) => {
        const Field: React.FC<any> = fields?.[field.blockType as keyof typeof fields]
        if (!Field) return null
        return <div className="mb-6 last:mb-0" key={field.id ?? index}><Field form={generalForm} {...field} {...formMethods} control={control} errors={errors} register={register} /></div>
      })}
    </div>
  )

  return (
    <section className="w-full">
      {enableIntro && introContent && !hasSubmitted && (
        <RichText className="mb-8 lg:mb-12" data={introContent} enableGutter={false} />
      )}
      <div className="border border-border">
        {!hasSubmitted ? (
          <>
            <div className="grid grid-cols-2 border-b border-border" role="tablist" aria-label="Contact form type">
              <button type="button" role="tab" aria-selected={mode === 'general'} onClick={() => { setMode('general'); setActiveStep(0); setError(undefined) }} className={`px-4 py-4 text-left text-sm transition-colors ${mode === 'general' ? 'bg-foreground text-background' : 'text-foreground hover:bg-muted'}`}>
                <span className="block font-mono text-[10px] uppercase tracking-widest opacity-70">01</span>
                General Enquiry
              </button>
              <button type="button" role="tab" aria-selected={mode === 'projectInquiry'} onClick={() => { setMode('projectInquiry'); setActiveStep(0); setError(undefined) }} className={`border-l border-border px-4 py-4 text-left text-sm transition-colors ${mode === 'projectInquiry' ? 'bg-foreground text-background' : 'text-foreground hover:bg-muted'}`}>
                <span className="block font-mono text-[10px] uppercase tracking-widest opacity-70">02</span>
                Project Inquiry
              </button>
            </div>
            <FormProvider {...formMethods}>
              <form onSubmit={handleSubmit(submit)} className="p-5 md:p-8">
                {mode === 'general' ? (
                  <>
                    {renderGeneralFields()}
                    <div className="mt-8"><Button type="submit" disabled={isLoading}>{isLoading ? 'Submitting…' : generalForm.submitButtonLabel || 'Send enquiry'}</Button></div>
                  </>
                ) : (
                  <>
                    {steps.length === 0 ? (
                      <p className="text-sm text-muted-foreground">Project Inquiry has no steps configured yet. Add steps to the selected form in Payload Admin.</p>
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
                            {(currentStep?.fields ?? []).map((field) => <div className={field.type === 'textarea' ? 'sm:col-span-2' : ''} key={field.name}>{renderManagedField(field)}</div>)}
                          </div>
                        )}
                        {error ? <p role="alert" className="mt-5 text-sm text-red-500">{error}</p> : null}
                        <div className="mt-8 flex items-center justify-between gap-3 border-t border-border pt-5">
                          <Button type="button" variant="outline" disabled={activeStep === 0 || isLoading} onClick={() => setActiveStep((step) => Math.max(0, step - 1))}>Back</Button>
                          {activeStep < steps.length - 1 ? (
                            <Button type="button" disabled={isLoading} onClick={advance}>Continue</Button>
                          ) : (
                            <Button type="button" disabled={isLoading} onClick={handleSubmit(submit)}>{isLoading ? 'Submitting…' : projectInquiryForm.submitButtonLabel || 'Submit inquiry'}</Button>
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
            {activeForm.confirmationMessage ? <RichText data={activeForm.confirmationMessage} /> : <p>Thank you. Your message has been received.</p>}
          </div>
        )}
      </div>
    </section>
  )
}
