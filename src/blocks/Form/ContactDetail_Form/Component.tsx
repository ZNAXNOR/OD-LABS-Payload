'use client'
import React, { useCallback, useState } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import type { FormFieldBlock } from '@payloadcms/plugin-form-builder/types'

import { cn } from '@/utilities/ui'
import { getClientSideURL } from '@/utilities/getURL'
import { Button } from '../Elements/Button'
import { fields } from '../fields'
import type { FormBlockType } from '../Component'
import { ChevronsUpIcon, DecorativeSvg } from './Icons'
import { Mail, Globe, Phone } from 'lucide-react'

const Contact2: React.FC<FormBlockType & { id?: string }> = (props) => {
  const {
    title = 'Get in Touch',
    description,
    contactDetails = {},
    form: formFromProps,
    form: { id: formID, confirmationMessage, confirmationType, redirect, submitButtonLabel } = {},
    className,
  } = props

  const {
    phone,
    email = 'hi@shadcnblocks.com',
    websiteLabel,
    websiteUrl,
    features = [],
  } = contactDetails

  const formMethods = useForm({
    defaultValues: formFromProps?.fields,
  })
  const {
    control,
    formState: { errors },
    handleSubmit,
    register,
  } = formMethods

  const [isLoading, setIsLoading] = useState(false)
  const [hasSubmitted, setHasSubmitted] = useState<boolean>()
  const [error, setError] = useState<{ message: string; status?: string } | undefined>()
  const router = useRouter()

  const onSubmit = useCallback(
    (data: FormFieldBlock[]) => {
      let loadingTimerID: ReturnType<typeof setTimeout>
      const submitForm = async () => {
        setError(undefined)

        const dataToSend = Object.entries(data).map(([name, value]) => ({
          field: name,
          value,
        }))

        // delay loading indicator by 1s
        loadingTimerID = setTimeout(() => {
          setIsLoading(true)
        }, 1000)

        try {
          const req = await fetch(`${getClientSideURL()}/api/form-submissions`, {
            body: JSON.stringify({
              form: formID,
              submissionData: dataToSend,
            }),
            headers: {
              'Content-Type': 'application/json',
            },
            method: 'POST',
          })

          const res = await req.json()

          clearTimeout(loadingTimerID)

          if (req.status >= 400) {
            setIsLoading(false)

            setError({
              message: res.errors?.[0]?.message || 'Internal Server Error',
              status: res.status,
            })

            return
          }

          setIsLoading(false)
          setHasSubmitted(true)

          if (confirmationType === 'redirect' && redirect) {
            const { url } = redirect
            if (url) router.push(url)
          }
        } catch (err) {
          console.warn(err)
          setIsLoading(false)
          setError({
            message: 'Something went wrong.',
          })
        }
      }

      void submitForm()
    },
    [router, formID, redirect, confirmationType],
  )

  const displayFeatures = features

  return (
    <section className={cn('py-32', className)}>
      <div className="container">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-10 lg:flex-row lg:gap-20">
          <div className="mx-auto flex w-full max-w-lg flex-col justify-between gap-15">
            <div className="relative w-fit">
              <h1 className="text-6xl font-semibold tracking-tight lg:text-7xl">{title}</h1>
              <DecorativeSvg className="absolute -top-2 -right-5 size-5 text-red-500 md:size-6" />
              <DecorativeSvg className="absolute -bottom-2 -left-5 size-5 rotate-180 text-red-500 md:size-6" />
            </div>

            <ul className="space-y-6">
              {displayFeatures.map((item, idx) => (
                <li key={idx} className="flex items-center gap-8 text-base text-foreground/50">
                  <div className="flex size-6 items-center justify-center bg-red-100 text-red-500">
                    <ChevronsUpIcon className="size-5" />
                  </div>
                  {item.feature}
                </li>
              ))}
            </ul>

            <div className="flex flex-row flex-wrap gap-x-10 gap-y-4 items-center mt-6">
              {email && (
                <a
                  href={`mailto:${email}`}
                  className="flex items-center gap-2 text-3xl font-medium tracking-tight hover:text-red-500 transition-colors"
                >
                  {email}
                </a>
              )}
              {websiteUrl && (
                <a
                  href={websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-lg text-muted-foreground underline hover:text-foreground transition-colors"
                >
                  <Globe className="size-5 text-red-500" />
                  {websiteLabel || websiteUrl}
                </a>
              )}
              {phone && (
                <div className="flex items-center gap-2 text-lg text-muted-foreground">
                  <Phone className="size-5 text-red-500" />
                  {phone}
                </div>
              )}
            </div>
          </div>

          <div className="mx-auto flex max-w-3xl flex-col gap-6 rounded-lg border p-10 w-full">
            <FormProvider {...formMethods}>
              {!isLoading && hasSubmitted && confirmationType === 'message' && (
                <div className="text-center py-10">
                  <h2 className="text-2xl font-bold mb-4 text-green-600">Successfully Sent!</h2>
                  <p className="text-muted-foreground">
                    Thank you for your message. We will get back to you soon.
                  </p>
                </div>
              )}
              {isLoading && !hasSubmitted && <p>Loading, please wait...</p>}
              {error && (
                <div className="text-red-500 mb-4">{`${error.status || '500'}: ${error.message || ''}`}</div>
              )}
              {!hasSubmitted && (
                <form id={formID} onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                  <div className="grid gap-4">
                    {formFromProps &&
                      formFromProps.fields &&
                      formFromProps.fields?.map((field, index) => {
                        const Field: React.FC<any> =
                          fields?.[field.blockType as keyof typeof fields]
                        if (Field) {
                          return (
                            <div className="w-full" key={index}>
                              <Field
                                form={formFromProps}
                                {...field}
                                {...formMethods}
                                control={control}
                                errors={errors}
                                register={register}
                              />
                            </div>
                          )
                        }
                        return null
                      })}
                  </div>

                  <Button form={formID} type="submit" variant="default" className="w-full mt-4">
                    {submitButtonLabel || 'Send Message'}
                  </Button>
                </form>
              )}
            </FormProvider>
          </div>
        </div>
      </div>
    </section>
  )
}

export { Contact2 }
