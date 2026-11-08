'use client'

import type { Form as FormType } from '@payloadcms/plugin-form-builder/types'
import type { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { usePathname, useRouter } from 'next/navigation'
import { ContactActions } from '@/components/Contact/ContactActions'
import { SocialLinks } from '@/components/Contact/SocialLinks'
import {
  formatContactActions,
  formatSocialLinks,
  getActionHref,
} from '@/components/Contact/utils'

import RichText from '@/components/RichText'
import { Button } from '@/components/ui/button'
import { getClientSideURL } from '@/utilities/getURL'
import type { ContactSocial } from '@/payload-types'

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
  previewStep?: {
    title?: string | null
    description?: DefaultTypedEditorState | null
  } | null
  previewStepTitle?: string | null
  previewStepDescription?: DefaultTypedEditorState | null
  privacyConsent?: {
    enabled?: boolean | null
    privacyPolicy?:
      number | { id?: number; slug?: string; title?: string } | null
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

type ContactSocialData = ContactSocial & {
  contactPage?: {
    eyebrow?: string | null
    heading?: string | null
    description?: string | null
    formIntroduction?: string | null
  } | null
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
  const [contactSocials, setContactSocials] = useState<ContactSocialData | null>(null)
  const valuesByTab = useRef<Record<number, Record<string, unknown>>>({})
  const configuredForms =
    (variant === 'multi'
      ? multiForms
      : [{ form: singleForm, description: null }]) || []
  const activeEntry = configuredForms[activeTab]
  const activeForm = (
    typeof activeEntry?.form === 'object' && activeEntry.form
      ? activeEntry.form
      : null
  ) as ManagedForm | null
  const isMultiStep = activeForm?.formLayout === 'multiStep'
  const [isLoading, setIsLoading] = useState(false)
  const [hasSubmitted, setHasSubmitted] = useState(false)
  const [error, setError] = useState<string>()
  const router = useRouter()
  const pathname = usePathname()
  const isContactPage = pathname === '/contact'

  const formID = activeForm?.id
  const privacyConsentEnabled = activeForm?.privacyConsent?.enabled !== false
  const privacyPolicy = activeForm?.privacyConsent?.privacyPolicy
  const privacyPolicyDoc =
    typeof privacyPolicy === 'object' && privacyPolicy ? privacyPolicy : null
  const privacyPolicyHref = privacyPolicyDoc?.slug
    ? `/${privacyPolicyDoc.slug}`
    : '/privacy-policy'
  const previewStepTitle =
    activeForm?.previewStep?.title ||
    activeForm?.previewStepTitle ||
    'Review & submit'
  const previewStepDescription =
    activeForm?.previewStep?.description ||
    activeForm?.previewStepDescription ||
    null

  const steps = useMemo<FormStep[]>(() => {
    if (!isMultiStep) return []
    const rawSteps = (activeForm?.steps ?? []).map((step, idx) => ({
      id: step.id || `step-${idx}`,
      title: step.title,
      description: step.description,
      type: 'form' as const,
      fields: step.fields,
    }))
    const previewStage: FormStep = {
      id: 'step-preview',
      title: previewStepTitle,
      description: previewStepDescription,
      type: 'preview',
      fields: [],
    }
    return [...rawSteps, previewStage]
  }, [activeForm?.steps, isMultiStep, previewStepDescription, previewStepTitle])
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
    watch,
  } = formMethods

  const formValues = watch()

  useEffect(() => {
    let cancelled = false
    fetch('/api/globals/contact-socials?depth=1')
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        if (!cancelled && data) setContactSocials(data)
      })
      .catch(() => undefined)
    return () => {
      cancelled = true
    }
  }, [])

  const submit = useCallback(
    async (data: Record<string, unknown>) => {
      if (!formID) return
      setError(undefined)
      setIsLoading(true)
      try {
        const allowedNames = isMultiStep
          ? steps
              .flatMap((step) => step.fields ?? [])
              .flatMap((field) =>
                'name' in field && field.name ? [field.name] : [],
              )
          : (activeForm?.fields ?? []).flatMap((field) =>
              'name' in field && field.name ? [field.name] : [],
            )
        const submissionFields = [
          ...new Set(allowedNames),
          ...(privacyConsentEnabled ? ['privacyConsentAccepted'] : []),
        ]
        const submissionData = [...new Set(submissionFields)]
          .filter((field) => Object.prototype.hasOwnProperty.call(data, field))
          .map((field) => ({ field, value: data[field] ?? '' }))
        const response = await fetch(
          `${getClientSideURL()}/api/form-submissions`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ form: formID, submissionData }),
          },
        )
        const result = await response.json()
        if (!response.ok) {
          setError(
            result.errors?.[0]?.message ||
              'Unable to submit the form. Please try again.',
          )
          return
        }
        setHasSubmitted(true)
        const form = activeForm as FormType
        if (form.confirmationType === 'redirect' && form.redirect?.url)
          router.push(form.redirect.url)
      } catch {
        setError('Something went wrong. Please try again.')
      } finally {
        setIsLoading(false)
      }
    },
    [activeForm, formID, isMultiStep, privacyConsentEnabled, router, steps],
  )

  const getFieldError = useCallback(
    (fieldName: string) => {
      if (!fieldName) return undefined
      if (errors[fieldName]) return errors[fieldName]
      if (fieldName.includes('.')) {
        const parts = fieldName.split('.')
        let current: any = errors
        for (const part of parts) {
          if (!current || typeof current !== 'object') return undefined
          current = current[part]
        }
        return current
      }
      return undefined
    },
    [errors],
  )

  const isStepWithError = useCallback(
    (stepIndex: number): boolean => {
      const step = steps[stepIndex]
      if (!step) return false

      const stepFields = step.fields ?? []
      const hasFieldError = stepFields.some((field) => {
        if (!('name' in field) || !field.name) return false
        return Boolean(getFieldError(field.name))
      })

      if (hasFieldError) return true

      if (privacyConsentEnabled && Boolean(errors.privacyConsentAccepted)) {
        const previewIndex = steps.findIndex((s) => s.type === 'preview')
        if (previewIndex >= 0 && stepIndex === previewIndex) return true
        if (previewIndex === -1 && stepIndex === steps.length - 1) return true
      }

      return false
    },
    [errors.privacyConsentAccepted, getFieldError, privacyConsentEnabled, steps],
  )

  const isStepPartiallyFilled = useCallback(
    (stepIndex: number): boolean => {
      const step = steps[stepIndex]
      if (!step || step.type !== 'form') return false
      const stepFields = step.fields ?? []
      return stepFields.some((field) => {
        if (!('name' in field) || !field.name) return false
        const name = field.name
        let val = formValues[name]
        if (val === undefined && name.includes('.')) {
          const parts = name.split('.')
          let cur: any = formValues
          for (const part of parts) {
            if (cur === undefined || cur === null || typeof cur !== 'object') {
              cur = undefined
              break
            }
            cur = cur[part]
          }
          val = cur
        }
        if (val === undefined || val === null || val === '') return false
        if (Array.isArray(val) && val.length === 0) return false
        return true
      })
    },
    [formValues, steps],
  )

  const advance = async () => {
    if (!currentStep) return
    if (currentStep.type === 'form') {
      const names = (currentStep.fields ?? []).flatMap((field) =>
        'name' in field && field.name ? [field.name] : [],
      )
      const valid = names.length ? await trigger(names) : true
      if (!valid) {
        setCompletedSteps((previous) =>
          previous.filter((s) => s !== activeStep),
        )
        return
      }
    }
    setCompletedSteps((previous) =>
      previous.includes(activeStep) ? previous : [...previous, activeStep],
    )
    const nextStepIndex = Math.min(activeStep + 1, steps.length - 1)
    if (steps[nextStepIndex]?.type === 'preview') {
      const allNames = steps
        .flatMap((s) => s.fields ?? [])
        .flatMap((f) => ('name' in f && f.name ? [f.name] : []))
      if (allNames.length) {
        await trigger(allNames)
      }
    }
    setActiveStep(nextStepIndex)
  }

  const navigateToStep = async (index: number) => {
    if (index < 0 || index >= steps.length || isLoading) return
    if (steps[activeStep]?.type === 'form') {
      const currentStepNames = (steps[activeStep]?.fields ?? []).flatMap((f) =>
        'name' in f && f.name ? [f.name] : [],
      )
      if (currentStepNames.length) {
        await trigger(currentStepNames)
      }
    }
    if (index > activeStep) {
      const priorNames = steps
        .slice(0, index)
        .flatMap((s) => s.fields ?? [])
        .flatMap((f) => ('name' in f && f.name ? [f.name] : []))
      if (priorNames.length) {
        await trigger(priorNames)
      }
    }
    if (steps[index]?.type === 'preview') {
      const allNames = steps
        .flatMap((s) => s.fields ?? [])
        .flatMap((f) => ('name' in f && f.name ? [f.name] : []))
      if (allNames.length) {
        await trigger(allNames)
      }
    }
    setActiveStep(index)
  }

  const renderFields = (formFields: NonNullable<FormType['fields']>) => (
    <div className="grid gap-x-6 gap-y-6 sm:grid-cols-2">
      {formFields.map((field, index) => {
        const Field: React.FC<any> =
          fields?.[field.blockType as keyof typeof fields]
        if (!Field) return null
        return (
          <Field
            key={
              'id' in field && typeof field.id === 'string' ? field.id : index
            }
            form={activeForm}
            {...field}
            {...formMethods}
            control={control}
            errors={errors}
            register={register}
          />
        )
      })}
    </div>
  )

  const renderPreview = () => {
    const getOptionLabel = (field: any, value: unknown) => {
      const options = Array.isArray(field.options) ? field.options : []
      const option = options.find((item: any) => item.value === value)
      return option?.label ?? String(value)
    }

    const anyStepHasError = steps.some((_, idx) => isStepWithError(idx))

    return (
      <div className="space-y-7">
        {anyStepHasError ? (
          <div
            role="alert"
            className="flex items-start gap-3 border border-red-500/50 bg-red-500/10 p-4 text-sm text-red-300"
          >
            <span className="font-mono text-xs uppercase tracking-wider text-red-400 font-bold shrink-0 mt-0.5">
              [Attention]
            </span>
            <div className="flex-1">
              <p className="font-medium text-red-200">
                Some stages have incomplete or invalid information.
              </p>
              <p className="mt-0.5 text-xs text-red-300/80">
                Please review and resolve the highlighted stages before final submission.
              </p>
            </div>
          </div>
        ) : null}

        {steps.map((step, stepIndex) => {
          const stepFields = (step.fields ?? []).filter(
            (field) => 'name' in field && field.name,
          )
          if (!stepFields.length) return null
          const stepHasError = isStepWithError(stepIndex)

          return (
            <section
              className={`border-t border-border pt-4 first:border-t-0 first:pt-0 transition-colors ${
                stepHasError
                  ? 'border-red-500/40 bg-red-500/[0.03] p-4 border'
                  : ''
              }`}
              key={step.id || stepIndex}
            >
              <div className="mb-3 flex items-center justify-between gap-4">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h3 className="font-mono text-xs uppercase tracking-[0.14em]">
                    <span className="text-odl font-semibold">
                      Step {String(stepIndex + 1).padStart(2, '0')}
                    </span>
                    <span className="text-zinc-600 mx-2">—</span>
                    <span className="text-zinc-100 font-medium">
                      {step.title}
                    </span>
                  </h3>
                  {stepHasError ? (
                    <span className="inline-flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.14em] text-red-400 border border-red-500/40 bg-red-500/10 px-2 py-0.5 font-semibold">
                      <span className="size-1.5 rounded-full bg-red-500 animate-pulse" />
                      Action Required
                    </span>
                  ) : null}
                </div>
                <button
                  className={`font-mono text-[9px] uppercase tracking-[0.12em] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-odl ${
                    stepHasError
                      ? 'text-red-400 hover:text-red-300 font-semibold underline underline-offset-4'
                      : 'text-zinc-400 hover:text-odl'
                  }`}
                  onClick={() => navigateToStep(stepIndex)}
                  type="button"
                >
                  {stepHasError ? 'Fix stage →' : 'Edit stage'}
                </button>
              </div>
              <dl
                className={`divide-y divide-border border-y border-border ${
                  stepHasError ? 'divide-red-500/20 border-red-500/30' : ''
                }`}
              >
                {stepFields.map((field: any) => {
                  const value = getValues(field.name)
                  const isEmpty =
                    value === undefined ||
                    value === null ||
                    value === '' ||
                    (Array.isArray(value) && value.length === 0)
                  let displayValue = 'Not provided'
                  if (!isEmpty) {
                    if (field.blockType === 'checkbox')
                      displayValue = value === true ? 'Yes' : 'No'
                    else if (
                      field.blockType === 'radio' ||
                      field.blockType === 'select'
                    )
                      displayValue = getOptionLabel(field, value)
                    else if (Array.isArray(value))
                      displayValue = value
                        .map((item) => getOptionLabel(field, item))
                        .join(', ')
                    else displayValue = String(value)
                  }

                  const fieldError = getFieldError(field.name)
                  const hasFieldErr = Boolean(fieldError)

                  return (
                    <div
                      className="grid grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] gap-4 py-3 sm:gap-6"
                      key={field.name}
                    >
                      <dt
                        className={`text-sm ${
                          hasFieldErr ? 'text-red-400 font-medium' : 'text-zinc-400'
                        }`}
                      >
                        {field.label || field.name}
                        {field.required ? (
                          <span className="ml-1 text-odl">*</span>
                        ) : null}
                      </dt>
                      <dd className="wrap-break-word text-sm">
                        <span
                          className={
                            isEmpty
                              ? 'text-zinc-600 italic'
                              : hasFieldErr
                                ? 'text-red-200 font-medium'
                                : 'text-zinc-100'
                          }
                        >
                          {displayValue}
                        </span>
                        {hasFieldErr ? (
                          <span className="block mt-1 text-xs text-red-400 font-medium">
                            {String(fieldError.message || 'This field is required')}
                          </span>
                        ) : null}
                      </dd>
                    </div>
                  )
                })}
              </dl>
            </section>
          )
        })}
      </div>
    )
  }

  const privacyConsentRegistration = register('privacyConsentAccepted', {
    required: privacyConsentEnabled
      ? 'Please accept the Privacy Policy to submit this inquiry.'
      : false,
  })

  const submitMultiStep = async () => {
    const names = steps
      .flatMap((step) => step.fields ?? [])
      .flatMap((field) => ('name' in field && field.name ? [field.name] : []))
    const valid = await trigger([
      ...names,
      ...(privacyConsentEnabled ? ['privacyConsentAccepted'] : []),
    ])
    if (!valid) {
      setCompletedSteps((previous) =>
        previous.filter((s) => {
          const step = steps[s]
          if (!step) return false
          const hasErr = (step.fields ?? []).some(
            (field) =>
              'name' in field &&
              field.name &&
              Boolean(getFieldState(field.name).error),
          )
          if (hasErr) return false
          if (
            privacyConsentEnabled &&
            Boolean(getFieldState('privacyConsentAccepted').error)
          ) {
            const previewIndex = steps.findIndex((st) => st.type === 'preview')
            if (previewIndex >= 0 && s === previewIndex) return false
            if (previewIndex === -1 && s === steps.length - 1) return false
          }
          return true
        }),
      )
      const firstInvalidStep = steps.findIndex((step, idx) => {
        const hasErr = (step.fields ?? []).some(
          (field) =>
            'name' in field &&
            field.name &&
            Boolean(getFieldState(field.name).error),
        )
        if (hasErr) return true
        if (
          privacyConsentEnabled &&
          Boolean(getFieldState('privacyConsentAccepted').error)
        ) {
          const previewIndex = steps.findIndex((st) => st.type === 'preview')
          if (previewIndex >= 0 && idx === previewIndex) return true
          if (previewIndex === -1 && idx === steps.length - 1) return true
        }
        return false
      })
      if (currentStep?.type !== 'preview' && firstInvalidStep >= 0) {
        setActiveStep(firstInvalidStep)
      }
      return
    }
    setCompletedSteps(steps.map((_, i) => i))
    await submit(getValues())
  }

  const introTitle = isMultiStep ? currentStep?.title : isContactPage ? contactSocials?.contactPage?.heading || activeForm?.title : activeForm?.title
  const introDescription = isMultiStep ? currentStep?.description : isContactPage ? contactSocials?.contactPage?.description || activeEntry?.description : activeEntry?.description
  const introEyebrow = isContactPage ? contactSocials?.contactPage?.eyebrow || 'Enquiry' : 'Enquiry'
  const formattedContactActions = formatContactActions(contactSocials?.contactActions)
  const formattedSocialLinks = formatSocialLinks(contactSocials?.socialLinks)

  return (
    <section className="w-full px-6 py-8 md:px-10 md:py-10">
      {enableIntro && introContent && !hasSubmitted ? (
        <RichText
          className="mb-8 lg:mb-12"
          data={introContent}
          enableGutter={false}
        />
      ) : null}
      <div className="border-border border">
        {variant === 'multi' ? (
          <div
            aria-label="Choose a form"
            className="border-border flex flex-col gap-3 border-b p-5 sm:flex-row md:p-6"
            role="group"
          >
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
                    setError(undefined)
                    setHasSubmitted(false)
                  }}
                  className={`focus-visible:outline-odl flex min-h-24 min-w-0 flex-1 items-center justify-between gap-4 border px-5 py-4 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 ${isSelected ? 'border-odl bg-odl/5' : 'border-zinc-800 hover:border-zinc-600'}`}
                >
                  <span className="min-w-0">
                    <span className="block text-sm leading-6 font-medium text-zinc-100">
                      {tabLabel}
                    </span>
                    {tabDescription ? (
                      <span className="mt-1 block text-xs leading-5 text-zinc-500">
                        {tabDescription}
                      </span>
                    ) : null}
                  </span>
                  <span
                    aria-hidden="true"
                    className={`grid size-5 shrink-0 place-items-center rounded-full border text-[9px] ${isSelected ? 'border-odl text-odl' : 'border-zinc-700 text-transparent'}`}
                  >
                    {isSelected ? '●' : ''}
                  </span>
                </button>
              )
            })}
          </div>
        ) : null}

        <FormProvider {...formMethods}>
          <form onSubmit={handleSubmit(submit)}>
            {isMultiStep && steps.length > 0 ? (
              <div className="border-border border-b px-5 py-6 md:px-8 md:py-7">
                <nav aria-label="Form progress" className="hidden md:block">
                  <ol
                    className="grid items-start gap-0"
                    style={{
                      gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))`,
                    }}
                  >
                    {steps.map((step, index) => {
                      const hasError = !hasSubmitted && isStepWithError(index)
                      const viewing = !hasSubmitted && index === activeStep
                      const completed =
                        hasSubmitted ||
                        (completedSteps.includes(index) && !hasError)
                      const hasFurtherCompleted =
                        !hasSubmitted &&
                        completedSteps.some(
                          (c) => c > index && !isStepWithError(c),
                        )
                      const pending =
                        !hasSubmitted &&
                        !viewing &&
                        !completed &&
                        !hasError &&
                        hasFurtherCompleted
                      const partiallyFilled =
                        !hasSubmitted &&
                        !viewing &&
                        !completed &&
                        !hasError &&
                        !pending &&
                        isStepPartiallyFilled(index)
                      const progressLabel = hasSubmitted
                        ? 'Completed'
                        : hasError
                          ? 'Error'
                          : viewing
                            ? 'Current'
                            : completed
                              ? 'Completed'
                              : pending
                                ? 'Pending'
                                : null
                      const accessible = !hasSubmitted
                      return (
                        <li key={step.id || index} className="min-w-0">
                          <button
                            type="button"
                            disabled={!accessible || isLoading}
                            aria-current={viewing ? 'step' : undefined}
                            aria-invalid={hasError ? true : undefined}
                            onClick={() => navigateToStep(index)}
                            className="group focus-visible:outline-odl w-full text-left focus-visible:outline-2 focus-visible:outline-offset-4 disabled:cursor-default"
                          >
                            <span className="flex items-center">
                              <span
                                className={`grid size-8 shrink-0 place-items-center rounded-full border font-mono text-xs transition-colors ${
                                  hasSubmitted
                                    ? 'border-emerald-700 bg-emerald-500/10 text-emerald-400'
                                    : hasError
                                      ? viewing
                                        ? 'border-red-500 bg-red-500/20 text-red-300 ring-2 ring-red-500/60 font-bold'
                                        : 'border-red-600 bg-red-500/10 text-red-400 font-semibold'
                                      : viewing
                                        ? 'border-white bg-white/5 text-white'
                                        : completed
                                          ? 'border-emerald-700 bg-emerald-500/10 text-emerald-400'
                                          : pending
                                            ? 'border-amber-500/70 bg-amber-500/5 text-amber-400'
                                            : partiallyFilled
                                              ? 'border-zinc-500 bg-zinc-500/10 text-zinc-300'
                                              : 'border-zinc-800 text-zinc-600'
                                }`}
                              >
                                {String(index + 1).padStart(2, '0')}
                              </span>
                              {index < steps.length - 1 ? (
                                <span
                                  aria-hidden="true"
                                  className={`mx-3 h-px flex-1 ${
                                    hasSubmitted || completed
                                      ? 'bg-emerald-700'
                                      : hasError
                                        ? 'bg-red-500/40'
                                        : pending
                                          ? 'bg-amber-500/50'
                                          : partiallyFilled
                                            ? 'bg-zinc-700'
                                            : 'bg-zinc-800'
                                  }`}
                                />
                              ) : null}
                            </span>
                            <span
                              className={`mt-3 block truncate pr-3 text-sm ${
                                hasSubmitted
                                  ? 'text-emerald-400 font-medium'
                                  : hasError
                                    ? 'text-red-400 font-medium group-hover:text-red-300'
                                    : viewing
                                      ? 'font-medium text-white'
                                      : completed
                                        ? 'text-emerald-400 group-hover:text-emerald-300'
                                        : pending
                                          ? 'text-amber-300'
                                          : partiallyFilled
                                            ? 'text-zinc-300 group-hover:text-zinc-100'
                                            : 'text-zinc-500'
                              }`}
                            >
                              {step.title}
                            </span>
                            <span
                              className={`mt-1 block font-mono text-[9px] uppercase tracking-[0.14em] ${
                                hasSubmitted
                                  ? 'text-emerald-500'
                                  : hasError
                                    ? 'text-red-500 font-semibold'
                                    : viewing
                                      ? 'text-zinc-200 font-medium'
                                      : completed
                                        ? 'text-emerald-500'
                                        : pending
                                          ? 'text-amber-400'
                                          : 'text-transparent'
                              }`}
                            >
                              {progressLabel || '\u00A0'}
                            </span>
                          </button>
                        </li>
                      )
                    })}
                  </ol>
                </nav>
                <div className="md:hidden">
                  <div className="mb-3 flex items-end justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-mono text-[10px] tracking-[0.16em] text-zinc-500 uppercase">
                          {activeForm?.title || 'Form'}
                        </p>
                        {hasSubmitted ? (
                          <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-emerald-400 font-semibold">
                            • Completed
                          </span>
                        ) : isStepWithError(activeStep) ? (
                          <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-red-500 font-semibold">
                            • Error
                          </span>
                        ) : null}
                      </div>
                      <h2 className="mt-1 text-base font-medium text-zinc-100">
                        {hasSubmitted ? 'Inquiry received' : currentStep?.title}
                      </h2>
                    </div>
                    <p className="shrink-0 font-mono text-xs text-zinc-500">
                      <span className="text-zinc-100">
                        {String(activeStep + 1).padStart(2, '0')}
                      </span>{' '}
                      / {String(steps.length).padStart(2, '0')}
                    </p>
                  </div>
                  <nav aria-label="Form steps" className="flex gap-1.5">
                    {steps.map((step, index) => {
                      const stepHasError =
                        !hasSubmitted && isStepWithError(index)
                      const isViewing = !hasSubmitted && index === activeStep
                      const isCompleted =
                        hasSubmitted ||
                        (completedSteps.includes(index) && !stepHasError)
                      const hasFurtherCompleted =
                        !hasSubmitted &&
                        completedSteps.some(
                          (c) => c > index && !isStepWithError(c),
                        )
                      const isPending =
                        !hasSubmitted &&
                        !isViewing &&
                        !isCompleted &&
                        !stepHasError &&
                        hasFurtherCompleted
                      const isPartiallyFilled =
                        !hasSubmitted &&
                        !isViewing &&
                        !isCompleted &&
                        !stepHasError &&
                        !isPending &&
                        isStepPartiallyFilled(index)
                      return (
                        <button
                          aria-current={isViewing ? 'step' : undefined}
                          aria-invalid={stepHasError ? true : undefined}
                          aria-label={`Go to step ${index + 1}: ${step.title}`}
                          className={`h-1 min-w-0 flex-1 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-odl ${
                            hasSubmitted || isCompleted
                              ? 'bg-emerald-600'
                              : stepHasError
                                ? 'bg-red-500'
                                : isViewing
                                  ? 'bg-white'
                                  : isPending
                                    ? 'bg-amber-500'
                                    : isPartiallyFilled
                                      ? 'bg-zinc-500'
                                      : 'bg-zinc-800'
                          }`}
                          disabled={hasSubmitted || isLoading}
                          key={step.id || index}
                          onClick={() => navigateToStep(index)}
                          type="button"
                        />
                      )
                    })}
                  </nav>
                  <p className="mt-2 text-xs text-zinc-500">
                    {hasSubmitted ? (
                      'All steps completed'
                    ) : (
                      <>
                        {steps.length - activeStep - 1}{' '}
                        {steps.length - activeStep - 1 === 1 ? 'step' : 'steps'}{' '}
                        remaining
                      </>
                    )}
                  </p>
                </div>
              </div>
            ) : null}

            {steps.length === 0 && isMultiStep ? (
              <p className="text-muted-foreground p-6 text-sm">
                This multi-step form has no steps configured yet. Add steps
                to the selected form in Payload Admin.
              </p>
            ) : (
              <div className="grid lg:grid-cols-[minmax(0,0.35fr)_minmax(0,0.65fr)]">
                <aside className="border-border flex flex-col justify-between gap-10 border-b p-6 md:p-8 lg:min-h-[34rem] lg:border-r lg:border-b-0">
                  <div>
                    <p
                      className={`font-mono text-[10px] uppercase tracking-[0.16em] ${
                        hasSubmitted
                          ? 'text-emerald-400'
                          : isMultiStep && isStepWithError(activeStep)
                            ? 'text-red-400'
                            : 'text-odl'
                      }`}
                    >
                      {hasSubmitted
                        ? 'Success'
                        : isMultiStep
                          ? `Step ${String(activeStep + 1).padStart(2, '0')}${isStepWithError(activeStep) ? ' • Error' : ''}`
                          : introEyebrow}
                    </p>
                    <h2 className="mt-3 text-2xl font-medium leading-tight tracking-tight text-zinc-100 md:text-3xl">
                      {hasSubmitted
                        ? 'Inquiry received'
                        : introTitle || 'Get in touch'}
                    </h2>
                    {hasSubmitted ? (
                      <div className="mt-4 max-w-md text-sm leading-6 text-zinc-400">
                        <p>
                          We have received your submission and will get back to
                          you shortly.
                        </p>
                      </div>
                    ) : introDescription ? (
                      <div className="mt-4 max-w-md text-sm leading-6 text-zinc-400 [&_p]:m-0">
                        {typeof introDescription === 'string' ? (
                          <p>{introDescription}</p>
                        ) : (
                          <RichText
                            data={introDescription}
                            enableGutter={false}
                            enableProse={false}
                          />
                        )}
                      </div>
                    ) : null}
                  </div>

                  {(formattedContactActions.length > 0 ||
                    formattedSocialLinks.length > 0) && (
                    <div className="space-y-6">
                      {formattedContactActions.length > 0 && (
                        <div className="space-y-3">
                          <div className="font-mono text-xs tracking-widest text-zinc-400 uppercase">
                            Contacts
                          </div>
                          <ContactActions actions={formattedContactActions} />
                        </div>
                      )}

                      {formattedSocialLinks.length > 0 && (
                        <div className="space-y-3">
                          <div className="font-mono text-xs tracking-widest text-zinc-400 uppercase">
                            Socials
                          </div>
                          <SocialLinks links={formattedSocialLinks} />
                        </div>
                      )}
                    </div>
                  )}
                </aside>

                <div className="flex min-h-[34rem] min-w-0 flex-col p-5 md:p-8">
                  {hasSubmitted ? (
                    <div className="my-auto flex flex-col justify-center py-8">
                      <div className="border border-emerald-500/30 bg-emerald-500/5 p-6 md:p-8">
                        <div className="mb-4 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-emerald-400 font-semibold">
                          <span className="size-2 rounded-full bg-emerald-500" />
                          Submission Confirmed
                        </div>
                        {activeForm?.confirmationMessage ? (
                          <RichText
                            data={activeForm.confirmationMessage}
                            className="text-zinc-200 [&_h1]:text-zinc-100 [&_h2]:text-zinc-100 [&_h3]:text-zinc-100 [&_p]:text-zinc-300"
                          />
                        ) : (
                          <p className="text-zinc-300">
                            Thank you. Your message has been received.
                          </p>
                        )}
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex-1">
                        {isContactPage &&
                        contactSocials?.contactPage?.formIntroduction ? (
                          <p className="mb-6 max-w-xl text-sm leading-6 text-zinc-400">
                            {contactSocials.contactPage.formIntroduction}
                          </p>
                        ) : null}
                        {!isMultiStep ? (
                          <>
                            {renderFields(activeForm?.fields ?? [])}
                            {privacyConsentEnabled ? (
                              <label className="mt-8 flex cursor-pointer items-start gap-3 py-3 text-sm leading-6 text-zinc-400">
                                <input
                                  type="checkbox"
                                  className="accent-odl mt-1 size-4 shrink-0"
                                  {...privacyConsentRegistration}
                                />
                                <span>
                                  By sending this inquiry, you agree to the{' '}
                                  <a
                                    className="hover:text-odl text-zinc-100 underline underline-offset-4"
                                    href={privacyPolicyHref}
                                    target="_blank"
                                    rel="noreferrer"
                                  >
                                    Privacy Policy
                                  </a>{' '}
                                  and consent to the details in this brief being
                                  used to respond to your enquiry.
                                </span>
                              </label>
                            ) : null}
                            {errors.privacyConsentAccepted ? (
                              <p
                                role="alert"
                                className="mt-2 text-xs text-red-500"
                              >
                                {String(errors.privacyConsentAccepted.message)}
                              </p>
                            ) : null}
                            {error ? (
                              <p
                                role="alert"
                                className="mt-5 text-sm text-red-500"
                              >
                                {error}
                              </p>
                            ) : null}
                          </>
                        ) : (
                          <>
                            {currentStep?.type === 'preview' ? (
                              <>
                                {renderPreview()}
                                {privacyConsentEnabled ? (
                                  <label className="mt-6 flex cursor-pointer items-start gap-3 py-3 text-sm leading-6 text-zinc-400">
                                    <input
                                      type="checkbox"
                                      className="accent-odl mt-1 size-4 shrink-0"
                                      {...privacyConsentRegistration}
                                    />
                                    <span>
                                      By sending this inquiry, you agree to the{' '}
                                      <a
                                        className="hover:text-odl text-zinc-100 underline underline-offset-4"
                                        href={privacyPolicyHref}
                                        target="_blank"
                                        rel="noreferrer"
                                      >
                                        Privacy Policy
                                      </a>{' '}
                                      and consent to the details in this brief
                                      being used to respond to your enquiry.
                                    </span>
                                  </label>
                                ) : null}
                                {errors.privacyConsentAccepted ? (
                                  <p
                                    role="alert"
                                    className="mt-2 text-xs text-red-500"
                                  >
                                    {String(
                                      errors.privacyConsentAccepted.message,
                                    )}
                                  </p>
                                ) : null}
                              </>
                            ) : (
                              <>
                                {renderFields(currentStep?.fields ?? [])}
                                {activeStep === steps.length - 1 &&
                                privacyConsentEnabled ? (
                                  <label className="mt-8 flex cursor-pointer items-start gap-3 py-3 text-sm leading-6 text-zinc-400">
                                    <input
                                      type="checkbox"
                                      className="accent-odl mt-1 size-4 shrink-0"
                                      {...privacyConsentRegistration}
                                    />
                                    <span>
                                      By sending this inquiry, you agree to the{' '}
                                      <a
                                        className="hover:text-odl text-zinc-100 underline underline-offset-4"
                                        href={privacyPolicyHref}
                                        target="_blank"
                                        rel="noreferrer"
                                      >
                                        Privacy Policy
                                      </a>{' '}
                                      and consent to the details in this brief
                                      being used to respond to your enquiry.
                                    </span>
                                  </label>
                                ) : null}
                                {activeStep === steps.length - 1 &&
                                errors.privacyConsentAccepted ? (
                                  <p
                                    role="alert"
                                    className="mt-2 text-xs text-red-500"
                                  >
                                    {String(
                                      errors.privacyConsentAccepted.message,
                                    )}
                                  </p>
                                ) : null}
                              </>
                            )}
                            {error ? (
                              <p
                                role="alert"
                                className="mt-5 text-sm text-red-500"
                              >
                                {error}
                              </p>
                            ) : null}
                          </>
                        )}
                      </div>
                      <div className="border-border mt-auto flex items-center justify-between gap-3 border-t pt-5">
                        <Button
                          type="button"
                          variant="outline"
                          disabled={
                            (isMultiStep ? activeStep === 0 : true) || isLoading
                          }
                          onClick={() =>
                            navigateToStep(Math.max(0, activeStep - 1))
                          }
                        >
                          Back
                        </Button>
                        {!isMultiStep ? (
                          <Button type="submit" disabled={isLoading}>
                            {isLoading
                              ? 'Submitting…'
                              : activeForm?.submitButtonLabel || 'Send enquiry'}
                          </Button>
                        ) : currentStep?.type === 'preview' ||
                          activeStep === steps.length - 1 ? (
                          <Button
                            type="button"
                            disabled={isLoading}
                            onClick={submitMultiStep}
                          >
                            {isLoading
                              ? 'Submitting…'
                              : activeForm?.submitButtonLabel ||
                                'Submit inquiry'}
                          </Button>
                        ) : (
                          <Button
                            type="button"
                            disabled={isLoading}
                            onClick={advance}
                          >
                            Continue
                          </Button>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
          </form>
        </FormProvider>
      </div>
    </section>
  )
}
