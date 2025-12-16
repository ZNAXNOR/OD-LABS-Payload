'use client'
import type { FormFieldBlock, Form as FormType } from '@payloadcms/plugin-form-builder/types'

import { useRouter } from 'next/navigation'
import React, { useCallback, useState } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import RichText from '@/components/RichText'
import { Button } from '@/components/ui/button'
import type { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'

import { fields } from './fields'
import { getClientSideURL } from '@/utilities/getURL'
import type { Contact } from '@/payload-types'
import type { FormBlockType } from './Component'
import { Divider } from '@/components/Divider'
import { SocialIcon } from '@/components/SocialIcon'

export const FormBlockClient: React.FC<
  {
    id?: string
    contact?: Contact | null
  } & FormBlockType
> = (props) => {
  const {
    enableIntro,
    form: formFromProps,
    form: { id: formID, confirmationMessage, confirmationType, redirect, submitButtonLabel } = {},
    introContent,
    appearance,
    splitContent,
    enableContactInfo,
    contact,
  } = props

  const formMethods = useForm({
    defaultValues: formFromProps.fields,
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

            const redirectUrl = url

            if (redirectUrl) router.push(redirectUrl)
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

  const FormContent = (
    <FormProvider {...formMethods}>
      {!isLoading && hasSubmitted && confirmationType === 'message' && (
        <RichText data={confirmationMessage} />
      )}
      {isLoading && !hasSubmitted && <p>Loading, please wait...</p>}
      {error && <div>{`${error.status || '500'}: ${error.message || ''}`}</div>}
      {!hasSubmitted && (
        <form id={formID} onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-6">
          <div className="mb-8">
            {introContent && <RichText data={introContent} enableGutter={false} />}
          </div>

          <div className="isolate -space-y-px rounded-2xl bg-white/50 dark:bg-white/5 backdrop-blur-3xl">
            {formFromProps &&
              formFromProps.fields &&
              formFromProps.fields.map((field, index) => {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const Field: React.FC<any> = fields?.[field.blockType as keyof typeof fields]
                if (Field) {
                  return (
                    <React.Fragment key={index}>
                      <Field
                        form={formFromProps}
                        {...field}
                        {...formMethods}
                        register={register}
                        errors={errors}
                        control={control}
                      />
                    </React.Fragment>
                  )
                }
                return null
              })}
          </div>

          <Button
            type="submit"
            size="lg"
            variant="default"
            className="mt-8 w-full bg-od-brand-primary text-white hover:bg-od-brand-primary/90"
            disabled={isLoading}
          >
            {isLoading ? 'Sending...' : submitButtonLabel}
          </Button>
        </form>
      )}
    </FormProvider>
  )

  if (appearance === 'split') {
    return (
      <div className="mx-auto max-w-7xl px-6 lg:px-8 mt-8 mb-8">
        <div className="mx-auto max-w-2xl lg:max-w-none">
          <div className="grid grid-cols-1 gap-x-8 gap-y-8 lg:grid-cols-2">
            {/* Left/Content Side */}
            <div>
              {splitContent && (
                <RichText className="mb-8 intro-content" data={splitContent} enableGutter={false} />
              )}

              {enableContactInfo && contact && (
                <div className="mt-4">
                  {/* Offices */}
                  {contact.offices && contact.offices.length > 0 && (
                    <>
                      <h2 className="font-display text-base font-semibold text-neutral-950 dark:text-white">
                        Our offices
                      </h2>
                      <ul role="list" className="mt-6 grid grid-cols-1 gap-8 sm:grid-cols-2">
                        {contact.offices.map((office, index) => (
                          <li key={index}>
                            <address className="text-sm not-italic text-neutral-600 dark:text-neutral-300">
                              <strong className="text-neutral-950 dark:text-white">
                                {office.label}
                              </strong>
                              <br />
                              {office.street}
                              <br />
                              {office.city}, {office.country}
                            </address>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}

                  {/* Email */}
                  {contact.email && (
                    <div className="mt-8">
                      <Divider className="mt-8 pt-8" />
                      <h2 className="font-display text-base font-semibold text-neutral-950 dark:text-white mt-6">
                        Email us
                      </h2>
                      <dl className="mt-6 grid grid-cols-1 gap-8 text-sm sm:grid-cols-2">
                        <div>
                          <dt className="font-semibold text-neutral-950 dark:text-white">
                            Contact
                          </dt>
                          <dd>
                            <a
                              className="text-neutral-600 dark:text-neutral-300 hover:text-neutral-950 dark:hover:text-white"
                              href={`mailto:${contact.email}`}
                            >
                              {contact.email}
                            </a>
                          </dd>
                        </div>
                      </dl>
                    </div>
                  )}

                  {/* Socials */}
                  {contact.socialLinks && contact.socialLinks.length > 0 && (
                    <div className="mt-8">
                      <Divider className="mt-8 pt-8" />
                      <h2 className="font-display text-base font-semibold text-neutral-950 dark:text-white mt-6">
                        Follow us
                      </h2>
                      <ul
                        role="list"
                        className="flex gap-x-10 text-neutral-950 dark:text-white mt-6"
                      >
                        {contact.socialLinks.map((link, index) => (
                          <li key={index}>
                            <a
                              aria-label={link.platform}
                              className="transition hover:text-neutral-700 dark:hover:text-neutral-300"
                              href={link.url}
                            >
                              <SocialIcon platform={link.platform} />
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Right/Form Side - In split view, we often want form on the right or user-configurable (defaults to right in grid flow) */}
            <div className="lg:order-last">{FormContent}</div>
          </div>
        </div>
      </div>
    )
  }

  // Default Centered Layout
  return (
    <div className="container lg:max-w-[48rem]">
      {enableIntro && introContent && !hasSubmitted && (
        <RichText className="mb-8 lg:mb-12" data={introContent} enableGutter={false} />
      )}
      {FormContent}
    </div>
  )
}
