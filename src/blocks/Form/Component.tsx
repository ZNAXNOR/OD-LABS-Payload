'use client'

import type { Form as FormType } from '@payloadcms/plugin-form-builder/types'
import type { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
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
  privacyConsent?: {
    enabled?: boolean | null
    privacyPolicy?: number | { id?: number; slug?: string; title?: string } | null
  } | null
}

type MultiFormItem = {
  form?: FormType | number | null
  tabLabel?: string | null
  description?: DefaultTypedEditorState | string | null
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

const extractTextFromLexical = (node: any): string => {
  if (!node) return ''
  if (typeof node.text === 'string') return node.text
  if (Array.isArray(node.children)) {
    return node.children.map(extractTextFromLexical).join('')
  }
  return ''
}

const getTabLabel = (entry?: MultiFormItem | null): string => {
  if (!entry) return 'Form'
  if (entry.tabLabel) return entry.tabLabel

  if (entry.description && typeof entry.description === 'object') {
    const children = (entry.description as any)?.root?.children
    if (Array.isArray(children)) {
      const heading = children.find((child: any) => child?.type === 'heading')
      if (heading) {
        const text = extractTextFromLexical(heading).trim()
        if (text) return text
      }
    }
  }

  if (typeof entry.form === 'object' && entry.form?.title) {
    return entry.form.title
  }

  return 'Form'
}

const getTabDescription = (entry?: MultiFormItem | null): string | null => {
  if (!entry?.description) return null
  if (typeof entry.description === 'string') return entry.description

  const children = (entry.description as any)?.root?.children
  if (Array.isArray(children)) {
    const paragraph = children.find((child: any) => child?.type === 'paragraph')
    if (paragraph) {
      const text = extractTextFromLexical(paragraph).trim()
      if (text) return text
    }
  }

  return null
}
type ContactSocialData = {
  contactActions?:
    | {
        label?: string
        href?: string
        link?: {
          type?: 'reference' | 'custom' | null
          newTab?: boolean | null
          url?: string | null
          reference?: {
            relationTo?: string | null
            value?: any
          } | null
        } | null
        description?: string
        enabled?: boolean
        actionType?: string
      }[]
    | null
  socialLinks?:
    | {
        profile?: 'omkar-dalvi' | 'od-labs' | string
        platform?: string
        url?: string
        enabled?: boolean
      }[]
    | null
}

const getActionHref = (action?: any): string => {
  if (!action) return '#'
  if (action.link) {
    if (action.link.type === 'custom') {
      return action.link.url || '#'
    }
    if (action.link.type === 'reference' && action.link.reference?.value) {
      const refVal = action.link.reference.value
      if (typeof refVal === 'object' && refVal?.slug) {
        const relationTo = action.link.reference.relationTo
        return `${relationTo && relationTo !== 'pages' ? `/${relationTo}` : ''}/${refVal.slug}`
      }
      if (typeof refVal === 'string') return `/${refVal}`
    }
    if (action.link.url) return action.link.url
  }
  return action.href || '#'
}

const platformMarks: Record<string, string> = {
  linkedin: 'in', x: 'X', github: 'GH', instagram: 'IG', youtube: 'YT', facebook: 'f', threads: '@',
}

export const FormBlock: React.FC<{ id?: string } & FormBlockType> = ({
  enableIntro,
  introContent,
  variant = 'single',
  singleForm,
  multiForms = [],
}) => {
  const [activeTab, setActiveTab] = useState(0)
  const [activeStep, setActiveStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const [furthestStep, setFurthestStep] = useState(0)
  const [contactSocials, setContactSocials] = useState<ContactSocialData | null>(null)
  const valuesByTab = useRef<Record<number, Record<string, unknown>>>({})
  const configuredForms = (variant === 'multi' ? multiForms : [{ form: singleForm, description: null }]) || []
  const activeEntry = configuredForms[activeTab]
  const activeForm = (typeof activeEntry?.form === 'object' && activeEntry.form ? activeEntry.form : null) as ManagedForm | null
  const isMultiStep = activeForm?.formLayout === 'multiStep'
  const [isLoading, setIsLoading] = useState(false)
  const [hasSubmitted, setHasSubmitted] = useState(false)
  const [error, setError] = useState<string>()
  const router = useRouter()

  const formID = activeForm?.id
  const privacyConsentEnabled = activeForm?.privacyConsent?.enabled !== false
  const privacyPolicy = activeForm?.privacyConsent?.privacyPolicy
  const privacyPolicyDoc = typeof privacyPolicy === 'object' && privacyPolicy ? privacyPolicy : null
  const privacyPolicyHref = privacyPolicyDoc?.slug ? `/${privacyPolicyDoc.slug}` : '/privacy-policy'
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
    getFieldState,
  } = formMethods

  useEffect(() => {
    let cancelled = false
    fetch('/api/globals/contact-socials?depth=1')
      .then((response) => response.ok ? response.json() : null)
      .then((data) => { if (!cancelled && data) setContactSocials(data) })
      .catch(() => undefined)
    return () => { cancelled = true }
  }, [])

  const submit = useCallback(async (data: Record<string, unknown>) => {
    if (!formID) return
    setError(undefined)
    setIsLoading(true)
    try {
      const allowedNames = isMultiStep
        ? steps.flatMap((step) => step.fields ?? []).flatMap((field) => ('name' in field && field.name ? [field.name] : []))
        : (activeForm?.fields ?? []).flatMap((field) => 'name' in field && field.name ? [field.name] : [])
      const submissionFields = [
        ...new Set(allowedNames),
        ...(privacyConsentEnabled ? ['privacyConsentAccepted'] : []),
      ]
      const submissionData = [...new Set(submissionFields)]
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
  }, [activeForm, formID, isMultiStep, privacyConsentEnabled, router, steps])

  const advance = async () => {
    if (!currentStep) return
    if (currentStep.type === 'form') {
      const names = (currentStep.fields ?? []).flatMap((field) => 'name' in field && field.name ? [field.name] : [])
      const valid = names.length ? await trigger(names) : true
      if (!valid) return
    }
    setCompletedSteps((previous) => previous.includes(activeStep) ? previous : [...previous, activeStep])
    setFurthestStep((previous) => Math.max(previous, activeStep + 1))
    setActiveStep((step) => Math.min(step + 1, steps.length - 1))
  }

  const navigateToStep = (index: number) => {
    if (index < 0 || index >= steps.length || isLoading) return
    setActiveStep(index)
  }

  const renderFields = (formFields: NonNullable<FormType['fields']>) => (
    <div className="grid gap-x-6 gap-y-6 sm:grid-cols-2">
      {formFields.map((field, index) => {
        const Field: React.FC<any> = fields?.[field.blockType as keyof typeof fields]
        if (!Field) return null
        return <Field key={('id' in field && typeof field.id === 'string' ? field.id : index)} form={activeForm} {...field} {...formMethods} control={control} errors={errors} register={register} />
      })}
    </div>
  )

  const renderPreview = () => {
    const fieldsToPreview = steps.flatMap((step, stepIndex) => (step.fields ?? []).map((field) => ({ field, stepIndex })))
    const getOptionLabel = (field: any, value: unknown) => {
      const options = Array.isArray(field.options) ? field.options : []
      const option = options.find((item: any) => item.value === value)
      return option?.label ?? String(value)
    }

    return (
      <div className="border-y border-border">
        <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,2fr)_auto] gap-3 border-b border-border py-3 font-mono text-[10px] uppercase tracking-[0.14em] text-zinc-500 sm:gap-6">
          <span>Field</span><span>Response</span><span>Edit</span>
        </div>
        {fieldsToPreview.map(({ field, stepIndex }, index) => {
          if (!('name' in field) || !field.name) return null
          const value = getValues(field.name)
          const isEmpty = value === undefined || value === null || value === '' || (Array.isArray(value) && value.length === 0)
          let displayValue = 'Not provided'
          if (!isEmpty) {
            if (field.blockType === 'checkbox') displayValue = value === true ? 'Yes' : 'No'
            else if (field.blockType === 'radio' || field.blockType === 'select') displayValue = getOptionLabel(field, value)
            else if (Array.isArray(value)) displayValue = value.map((item) => getOptionLabel(field, item)).join(', ')
            else displayValue = String(value)
          }
          return (
            <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,2fr)_auto] items-start gap-3 py-3 sm:gap-6" key={field.name || index}>
              <dt className="text-sm text-zinc-400">{field.label || field.name}{field.required ? <span className="ml-1 text-odl">*</span> : null}</dt>
              <dd className={`wrap-break-word text-sm ${isEmpty ? 'text-zinc-600 italic' : 'text-zinc-100'}`}>{displayValue}</dd>
              <button className="font-mono text-[9px] uppercase tracking-[0.12em] text-zinc-500 transition-colors hover:text-odl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-odl" onClick={() => setActiveStep(stepIndex)} type="button">Edit</button>
            </div>
          )
        })}
      </div>
    )
  }

  const privacyConsentRegistration = register('privacyConsentAccepted', {
    required: privacyConsentEnabled ? 'Please accept the Privacy Policy to submit this inquiry.' : false,
  })

  const submitMultiStep = async () => {
    const names = steps.flatMap((step) => step.fields ?? []).flatMap((field) => ('name' in field && field.name ? [field.name] : []))
    const valid = await trigger([...names, ...(privacyConsentEnabled ? ['privacyConsentAccepted'] : [])])
    if (!valid) {
      const firstInvalidStep = steps.findIndex((step) =>
        (step.fields ?? []).some((field) => 'name' in field && field.name && Boolean(getFieldState(field.name).error)),
      )
      if (firstInvalidStep >= 0) setActiveStep(firstInvalidStep)
      else if (privacyConsentEnabled) setActiveStep(steps.findIndex((step) => step.type === 'preview') >= 0 ? steps.findIndex((step) => step.type === 'preview') : activeStep)
      return
    }
    await submit(getValues())
  }

  const introTitle = isMultiStep ? currentStep?.title : activeForm?.title
  const introDescription = isMultiStep ? currentStep?.description : activeEntry?.description
  const contactActions = (contactSocials?.contactActions ?? []).filter((item) => {
    if (item.enabled === false) return false
    const href = getActionHref(item)
    return Boolean((href && href !== '#') || item.href)
  })
  const socialLinks = (contactSocials?.socialLinks ?? []).filter((item) => item.enabled !== false && item.url)

  return (
    <section className="w-full px-6 py-8 md:px-10 md:py-10">
      {enableIntro && introContent && !hasSubmitted ? <RichText className="mb-8 lg:mb-12" data={introContent} enableGutter={false} /> : null}
      <div className="border border-border">
        {!hasSubmitted ? (
          <>
            {variant === 'multi' ? (
              <div aria-label="Choose a form" className="flex flex-col gap-3 border-b border-border p-5 sm:flex-row md:p-6" role="group">
                {configuredForms.map((entry, index) => {
                  const isSelected = activeTab === index
                  const tabLabel = getTabLabel(entry)
                  const tabDescription = getTabDescription(entry)
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
                        setCompletedSteps([])
                        setFurthestStep(0)
                        setError(undefined)
                        setHasSubmitted(false)
                      }}
                      className={`flex min-h-24 min-w-0 flex-1 items-center justify-between gap-4 border px-5 py-4 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-odl ${isSelected ? 'border-odl bg-odl/5' : 'border-zinc-800 hover:border-zinc-600'}`}
                    >
                      <span className="min-w-0">
                        <span className="block text-sm font-medium leading-6 text-zinc-100">{tabLabel}</span>
                        {tabDescription ? <span className="mt-1 block text-xs leading-5 text-zinc-500">{tabDescription}</span> : null}
                      </span>
                      <span aria-hidden="true" className={`grid size-5 shrink-0 place-items-center rounded-full border text-[9px] ${isSelected ? 'border-odl text-odl' : 'border-zinc-700 text-transparent'}`}>{isSelected ? '●' : ''}</span>
                    </button>
                  )
                })}
              </div>
            ) : null}

            <FormProvider {...formMethods}>
              <form onSubmit={handleSubmit(submit)}>
                {isMultiStep && steps.length > 0 ? (
                  <div className="border-b border-border px-5 py-6 md:px-8 md:py-7">
                    <nav aria-label="Form progress" className="hidden md:block">
                      <ol className="grid items-start gap-0" style={{ gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))` }}>
                        {steps.map((step, index) => {
                          const completed = completedSteps.includes(index)
                          const current = index === furthestStep && !completed
                          const viewing = index === activeStep
                          const accessible = true
                          return (
                            <li key={step.id || index} className="min-w-0">
                              <button
                                type="button"
                                disabled={!accessible || isLoading}
                                aria-current={current ? 'step' : undefined}
                                onClick={() => navigateToStep(index)}
                                className="group w-full text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-odl disabled:cursor-default"
                              >
                                <span className="flex items-center">
                                  <span className={`grid size-8 shrink-0 place-items-center rounded-full border font-mono text-xs transition-colors ${completed ? 'border-emerald-700 bg-emerald-500/10 text-emerald-400' : viewing || current ? 'border-odl bg-odl/5 text-odl' : 'border-zinc-800 text-zinc-600'}`}>
                                    {String(index + 1).padStart(2, '0')}
                                  </span>
                                  {index < steps.length - 1 ? <span aria-hidden="true" className={`mx-3 h-px flex-1 ${completed ? 'bg-emerald-700' : 'bg-zinc-800'}`} /> : null}
                                </span>
                                <span className={`mt-3 block truncate pr-3 text-sm ${viewing || current ? 'font-medium text-zinc-100' : completed ? 'text-emerald-400 group-hover:text-emerald-300' : 'text-zinc-500'}`}>{step.title}</span>
                                <span className={`mt-1 block font-mono text-[9px] uppercase tracking-[0.14em] ${completed ? 'text-emerald-500' : current ? 'text-odl' : viewing ? 'text-odl' : 'text-zinc-600'}`}>{completed ? 'Complete' : current ? 'Current' : viewing ? 'Viewing' : 'Upcoming'}</span>
                              </button>
                            </li>
                          )
                        })}
                      </ol>
                    </nav>
                    <div className="md:hidden">
                      <div className="mb-3 flex items-end justify-between gap-4">
                        <div>
                          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-zinc-500">{activeForm?.title || 'Form'}</p>
                          <h2 className="mt-1 text-base font-medium text-zinc-100">{currentStep?.title}</h2>
                        </div>
                        <p className="shrink-0 font-mono text-xs text-zinc-500"><span className="text-zinc-100">{String(activeStep + 1).padStart(2, '0')}</span> / {String(steps.length).padStart(2, '0')}</p>
                      </div>
                      <nav aria-label="Form steps" className="flex gap-1.5">
                        {steps.map((step, index) => (
                          <button
                            aria-current={index === activeStep ? 'step' : undefined}
                            aria-label={`Go to step ${index + 1}: ${step.title}`}
                            className={`h-1 min-w-0 flex-1 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-odl ${completedSteps.includes(index) ? 'bg-emerald-600' : index <= furthestStep ? 'bg-odl' : 'bg-zinc-800'}`}
                            disabled={isLoading}
                            key={step.id || index}
                            onClick={() => navigateToStep(index)}
                            type="button"
                          />
                        ))}
                      </nav>
                      <p className="mt-2 text-xs text-zinc-500">{steps.length - activeStep - 1} {steps.length - activeStep - 1 === 1 ? 'step' : 'steps'} remaining</p>
                    </div>
                  </div>
                ) : null}

                {steps.length === 0 && isMultiStep ? (
                  <p className="p-6 text-sm text-muted-foreground">This multi-step form has no steps configured yet. Add steps to the selected form in Payload Admin.</p>
                ) : (
                  <div className="grid lg:grid-cols-[minmax(0,0.35fr)_minmax(0,0.65fr)]">
                    <aside className="flex flex-col justify-between gap-10 border-b border-border p-6 md:p-8 lg:min-h-[34rem] lg:border-b-0 lg:border-r">
                      <div>
                        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-odl">{isMultiStep ? `Step ${String(activeStep + 1).padStart(2, '0')}` : 'Enquiry'}</p>
                        <h2 className="mt-3 text-2xl font-medium leading-tight tracking-tight text-zinc-100 md:text-3xl">{introTitle || 'Get in touch'}</h2>
                        {introDescription ? (
                          <div className="mt-4 max-w-md text-sm leading-6 text-zinc-400 [&_p]:m-0">
                            {typeof introDescription === 'string' ? <p>{introDescription}</p> : <RichText data={introDescription} enableGutter={false} enableProse={false} />}
                          </div>
                        ) : null}
                      </div>

                      <div className="space-y-5">
                        {contactActions.length > 0 ? (
                          <div className="grid gap-2">
                            {contactActions.map((action, index) => {
                              const href = getActionHref(action)
                              const target = action.link?.newTab ? '_blank' : undefined
                              const rel = action.link?.newTab ? 'noreferrer noopener' : undefined
                              return (
                                <a
                                  key={index}
                                  href={href}
                                  target={target}
                                  rel={rel}
                                  className="flex min-h-14 items-center justify-between gap-4 border border-zinc-800 px-4 py-3 text-sm text-zinc-200 transition-colors hover:border-odl hover:bg-odl/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-odl"
                                >
                                  <span>{action.label}</span>
                                  <span aria-hidden="true" className="text-odl">↗</span>
                                </a>
                              )
                            })}
                          </div>
                        ) : null}
                        {socialLinks.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {socialLinks.map((social, index) => {
                              const key = (social.platform || '').toLowerCase()
                              const profileLabel = social.profile === 'od-labs' ? 'OD LABS' : 'Omkar Dalvi'
                              const label = `${profileLabel} · ${social.platform || 'Social profile'}`
                              return (
                                <a
                                  key={index}
                                  href={social.url || '#'}
                                  target="_blank"
                                  rel="noreferrer"
                                  aria-label={label}
                                  title={label}
                                  className="grid size-11 place-items-center border border-zinc-800 font-mono text-xs text-zinc-400 transition-colors hover:border-odl hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-odl"
                                >
                                  {platformMarks[key] || key.slice(0, 2).toUpperCase()}
                                </a>
                              )
                            })}
                          </div>
                        ) : null}
                      </div>
                    </aside>

                    <div className="flex min-h-[34rem] min-w-0 flex-col p-5 md:p-8">
                      <div className="flex-1">
                        {!isMultiStep ? (
                          <>
                            {renderFields(activeForm?.fields ?? [])}
                            {privacyConsentEnabled ? (
                              <label className="mt-8 flex cursor-pointer items-start gap-3 border-t border-border pt-5 text-sm leading-6 text-zinc-400">
                                <input type="checkbox" className="mt-1 size-4 shrink-0 accent-[var(--color-odl)]" {...privacyConsentRegistration} />
                                <span>By sending this inquiry, you agree to the <a className="text-zinc-100 underline underline-offset-4 hover:text-odl" href={privacyPolicyHref} target="_blank" rel="noreferrer">Privacy Policy</a> and consent to the details in this brief being used to respond to your enquiry.</span>
                              </label>
                            ) : null}
                            {errors.privacyConsentAccepted ? <p role="alert" className="mt-2 text-xs text-red-500">{String(errors.privacyConsentAccepted.message)}</p> : null}
                            {error ? <p role="alert" className="mt-5 text-sm text-red-500">{error}</p> : null}
                          </>
                        ) : (
                          <>
                            {currentStep?.type === 'preview' ? (
                              <>
                                {renderPreview()}
                                {privacyConsentEnabled ? (
                                  <label className="mt-6 flex cursor-pointer items-start gap-3 border-t border-border pt-5 text-sm leading-6 text-zinc-400">
                                    <input type="checkbox" className="mt-1 size-4 shrink-0 accent-[var(--color-odl)]" {...privacyConsentRegistration} />
                                    <span>By sending this inquiry, you agree to the <a className="text-zinc-100 underline underline-offset-4 hover:text-odl" href={privacyPolicyHref} target="_blank" rel="noreferrer">Privacy Policy</a> and consent to the details in this brief being used to respond to your enquiry.</span>
                                  </label>
                                ) : null}
                                {errors.privacyConsentAccepted ? <p role="alert" className="mt-2 text-xs text-red-500">{String(errors.privacyConsentAccepted.message)}</p> : null}
                              </>
                            ) : (
                              <>
                                {renderFields(currentStep?.fields ?? [])}
                                {activeStep === steps.length - 1 && privacyConsentEnabled ? (
                                  <label className="mt-8 flex cursor-pointer items-start gap-3 border-t border-border pt-5 text-sm leading-6 text-zinc-400">
                                    <input type="checkbox" className="mt-1 size-4 shrink-0 accent-[var(--color-odl)]" {...privacyConsentRegistration} />
                                    <span>By sending this inquiry, you agree to the <a className="text-zinc-100 underline underline-offset-4 hover:text-odl" href={privacyPolicyHref} target="_blank" rel="noreferrer">Privacy Policy</a> and consent to the details in this brief being used to respond to your enquiry.</span>
                                  </label>
                                ) : null}
                                {activeStep === steps.length - 1 && errors.privacyConsentAccepted ? <p role="alert" className="mt-2 text-xs text-red-500">{String(errors.privacyConsentAccepted.message)}</p> : null}
                              </>
                            )}
                            {error ? <p role="alert" className="mt-5 text-sm text-red-500">{error}</p> : null}
                          </>
                        )}
                      </div>
                      <div className="mt-auto flex items-center justify-between gap-3 border-t border-border pt-5">
                        <Button type="button" variant="outline" disabled={(isMultiStep ? activeStep === 0 : true) || isLoading} onClick={() => setActiveStep((step) => Math.max(0, step - 1))}>Back</Button>
                        {!isMultiStep ? (
                          <Button type="submit" disabled={isLoading}>{isLoading ? 'Submitting…' : activeForm?.submitButtonLabel || 'Send enquiry'}</Button>
                        ) : currentStep?.type === 'preview' || activeStep === steps.length - 1 ? (
                          <Button type="button" disabled={isLoading} onClick={submitMultiStep}>{isLoading ? 'Submitting…' : activeForm?.submitButtonLabel || 'Submit inquiry'}</Button>
                        ) : (
                          <Button type="button" disabled={isLoading} onClick={advance}>Continue</Button>
                        )}
                      </div>
                    </div>
                  </div>
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
