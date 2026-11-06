import { formBuilderPlugin } from '@payloadcms/plugin-form-builder'
import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  ParagraphFeature,
  TextStateFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import { wrapEmailHtml } from '@/email/template'
import { textStateConfig } from '@/fields/textStateConfig'
import type { Field, Plugin } from 'payload'

export const formBuilder: Plugin = formBuilderPlugin({
  fields: {
    date: true,
    payment: false,
    radio: true,
  },
  beforeEmail: (emailsToSend, { doc }: any) =>
    emailsToSend.map((email) => {
      let bodyHtml = email.html || ''

      // Resolve Form Submission ID
      const submissionID = String(doc.id || '')

      // Resolve Form ID safely
      const formID = String(
        typeof doc.form === 'object' && doc.form !== null
          ? doc.form.id
          : doc.form || '',
      )

      // Perform replacements
      if (bodyHtml) {
        bodyHtml = bodyHtml
          // Handles {{formSubmissionID}}
          .replace(/{{formSubmissionID}}/g, submissionID)
      }

      return {
        ...email,
        html: wrapEmailHtml({
          title: email.subject,
          bodyHtml,
        }),
      }
    }),
  formOverrides: {
    hooks: {
      afterRead: [
        ({ doc }) => {
          if (Array.isArray(doc?.steps)) {
            doc.steps = doc.steps.map((step: any) => {
              if (step?.type === 'preview') {
                step.fields = []
              } else if (Array.isArray(step?.fields)) {
                step.fields = step.fields.filter(
                  (block: any) =>
                    block &&
                    typeof block === 'object' &&
                    typeof block.blockType === 'string' &&
                    Boolean(block.blockType),
                )
              } else {
                step.fields = []
              }
              return step
            })
          }
          return doc
        },
      ],
      beforeValidate: [
        ({ data, originalDoc }) => {
          if (!data) return data

          const formLayout = data.formLayout ?? originalDoc?.formLayout

          if (formLayout === 'multiStep') {
            if (Array.isArray(data.steps)) {
              data.steps = data.steps.map((step: any) => {
                if (step?.type === 'preview') {
                  step.fields = []
                } else if (Array.isArray(step?.fields)) {
                  step.fields = step.fields.filter(
                    (block: any) =>
                      block &&
                      typeof block === 'object' &&
                      typeof block.blockType === 'string' &&
                      Boolean(block.blockType),
                  )
                } else {
                  step.fields = []
                }
                return step
              })
            }
            // Multi-step forms organize their field blocks inside `steps`.
            // Top-level `fields` is kept empty to prevent primary key ID conflicts in Postgres forms_blocks_* tables.
            data.fields = []
          } else {
            data.steps = []
          }

          return data
        },
      ],
      beforeChange: [
        ({ data, originalDoc }) => {
          if (!data) return data

          const formLayout = data.formLayout ?? originalDoc?.formLayout

          if (formLayout === 'multiStep') {
            if (Array.isArray(data.steps)) {
              data.steps = data.steps.map((step: any) => {
                if (step?.type === 'preview') {
                  step.fields = []
                } else if (Array.isArray(step?.fields)) {
                  step.fields = step.fields.filter(
                    (block: any) =>
                      block &&
                      typeof block === 'object' &&
                      typeof block.blockType === 'string' &&
                      Boolean(block.blockType),
                  )
                } else {
                  step.fields = []
                }
                return step
              })
            }
            data.fields = []
            return data
          }

          return {
            ...data,
            steps: [],
            fields: data.fields ?? originalDoc?.fields ?? [],
          }
        },
      ],
    },
    fields: ({ defaultFields }) => {
      const nativeFieldsField = defaultFields.find(
        (field) =>
          'name' in field && field.name === 'fields' && field.type === 'blocks',
      )
      const nativeFieldBlocks =
        nativeFieldsField && 'blocks' in nativeFieldsField
          ? nativeFieldsField.blocks.map((block) => ({
              ...block,
              fields: Array.isArray(block.fields)
                ? [...block.fields]
                : block.fields,
            }))
          : []

      const stepsField: Field = {
        name: 'steps',
        type: 'array',
        label: 'Form Steps',
        defaultValue: [],
        admin: {
          condition: (_, siblingData) =>
            siblingData?.formLayout === 'multiStep',
          description:
            'Add steps in the order visitors should complete them. Each step uses the native Payload Form Builder field types.',
        },
        validate: (value, { siblingData }: any) => {
          type StepItem = {
            title?: string
            description?: string
            type?: 'form' | 'preview'
            fields?: unknown[]
          }

          const steps = (Array.isArray(value) ? value : []) as StepItem[]

          if (siblingData?.formLayout === 'multiStep') {
            if (steps.length === 0) {
              return 'Multi-step forms must have at least one step.'
            }

            for (let i = 0; i < steps.length; i++) {
              const step = steps[i]
              if (
                step?.type === 'form' &&
                (!Array.isArray(step?.fields) || step.fields.length === 0)
              ) {
                return `Step ${i + 1} ("${step?.title || 'Untitled'}") must have at least one field.`
              }
            }
          }

          if (!Array.isArray(value)) return true

          const names = steps
            .flatMap((step) => (Array.isArray(step?.fields) ? step.fields : []))
            .flatMap((field) =>
              field &&
              typeof field === 'object' &&
              'name' in field &&
              typeof field.name === 'string'
                ? [field.name]
                : [],
            )

          return (
            new Set(names).size === names.length ||
            'Each field name must be unique across all form steps.'
          )
        },
        fields: [
          {
            name: 'title',
            type: 'text',
            required: true,
            label: 'Step title',
          },
          {
            name: 'description',
            type: 'richText',
            label: 'Step description',
            editor: lexicalEditor({
              features: ({ rootFeatures }) => [
                ...rootFeatures,
                HeadingFeature({
                  enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'],
                }),
                FixedToolbarFeature(),
                InlineToolbarFeature(),
              ],
            }),
          },
          {
            name: 'type',
            type: 'select',
            required: true,
            defaultValue: 'form',
            options: [
              { label: 'Form fields', value: 'form' },
              { label: 'Preview submission', value: 'preview' },
            ],
          },
          {
            name: 'fields',
            type: 'blocks',
            label: 'Fields',
            defaultValue: [],
            blocks: nativeFieldBlocks,
            admin: {
              condition: (_, siblingData) => siblingData?.type === 'form',
              description:
                'These are the same native field types available in a standard Payload form.',
            },
          },
        ],
      }

      const privacyConsentField: Field = {
        name: 'privacyConsent',
        type: 'group',
        label: 'Privacy consent',
        defaultValue: { enabled: true },
        fields: [
          {
            name: 'enabled',
            type: 'checkbox',
            label: 'Require privacy consent',
            defaultValue: true,
            admin: {
              description: 'Enabled by default. Visitors must accept this consent before submitting the form.',
            },
          },
          {
            name: 'privacyPolicy',
            type: 'relationship',
            relationTo: 'legal-pages',
            label: 'Privacy Policy page',
            validate: (value: unknown, { siblingData }: any) =>
              siblingData?.enabled === false || Boolean(value) || 'Select the Privacy Policy page used by this form.',
            filterOptions: {
              documentType: { equals: 'privacy-policy' },
            },
            admin: {
              condition: (_, siblingData) => siblingData?.enabled === true,
              description: 'Select the published Privacy Policy page linked in the consent statement.',
            },
          },
        ],
      }

      const formLayoutField: Field = {
        name: 'formLayout',
        type: 'select',
        label: 'Form layout',
        defaultValue: 'standard',
        required: true,
        options: [
          { label: 'Standard Form', value: 'standard' },
          { label: 'Multi-step Form', value: 'multiStep' },
        ],
        admin: {
          position: 'sidebar',
          description:
            'Standard forms use the Fields editor. Multi-step forms organize those same Payload Form Builder fields into steps.',
        },
      }

      const configuredFields = defaultFields.flatMap((field) => {
        if ('name' in field && field.name === 'confirmationMessage') {
          return [
            {
              ...field,
              editor: lexicalEditor({
                features: ({ rootFeatures }) => [
                  ...rootFeatures,
                  FixedToolbarFeature(),
                  HeadingFeature({
                    enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'],
                  }),
                ],
              }),
            },
          ]
        }

        if (
          'name' in field &&
          field.name === 'fields' &&
          field.type === 'blocks'
        ) {
          return [
            {
              ...field,
              admin: {
                ...field.admin,
                condition: (_: any, siblingData: any) =>
                  siblingData?.formLayout === 'standard',
              },
            },
            stepsField,
          ]
        }

        return [field]
      })

      const hasSteps = configuredFields.some(
        (field) => 'name' in field && field.name === 'steps',
      )

      return [
        ...configuredFields,
        ...(hasSteps ? [] : [stepsField]),
        formLayoutField,
        privacyConsentField,
      ]
    },
  },
})

export const formBuilderPluginConfig = formBuilder
