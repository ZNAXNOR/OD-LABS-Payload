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
            doc.steps = doc.steps
              .filter((step: any) => step?.type !== 'preview')
              .map((step: any) => {
                if (Array.isArray(step?.fields)) {
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
          if (doc?.formLayout === 'multiStep' && !doc?.previewStep?.title) {
            doc.previewStep = {
              title: doc?.previewStepTitle || 'Review & submit',
              ...(doc?.previewStepDescription ? { description: doc.previewStepDescription } : {}),
            }
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
              data.steps = data.steps
                .filter((step: any) => step?.type !== 'preview')
                .map((step: any) => {
                  if (Array.isArray(step?.fields)) {
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
            if (!data?.previewStep?.title) {
              data.previewStep = {
                ...(data?.previewStep || {}),
                title: originalDoc?.previewStep?.title || 'Review & submit',
              }
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
              data.steps = data.steps
                .filter((step: any) => step?.type !== 'preview')
                .map((step: any) => {
                  if (Array.isArray(step?.fields)) {
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
            if (!data?.previewStep?.title) {
              data.previewStep = {
                ...(data?.previewStep || {}),
                title: originalDoc?.previewStep?.title || 'Review & submit',
              }
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
      const placeholderField: Field = {
        name: 'placeholder',
        type: 'text',
        label: 'Placeholder',
        admin: {
          description: 'Placeholder text displayed inside the field when empty.',
        },
      }

      const blockHasField = (fields: any[], fieldName: string): boolean => {
        if (!Array.isArray(fields)) return false
        return fields.some((f: any) => {
          if (!f || typeof f !== 'object') return false
          if ('name' in f && f.name === fieldName) return true
          if (Array.isArray(f.fields)) return blockHasField(f.fields, fieldName)
          if (Array.isArray(f.tabs)) {
            return f.tabs.some((tab: any) => blockHasField(tab.fields, fieldName))
          }
          return false
        })
      }

      const enhanceBlocksWithPlaceholder = (blocks: any[]): any[] => {
        return blocks.map((block) => {
          if (!block || !Array.isArray(block.fields)) return block
          if (blockHasField(block.fields, 'placeholder')) return block
          if (block.slug === 'message') return block
          return {
            ...block,
            fields: [...block.fields, placeholderField],
          }
        })
      }

      const nativeFieldsField = defaultFields.find(
        (field) =>
          'name' in field && field.name === 'fields' && field.type === 'blocks',
      )

      if (
        nativeFieldsField &&
        'blocks' in nativeFieldsField &&
        Array.isArray(nativeFieldsField.blocks)
      ) {
        nativeFieldsField.blocks = enhanceBlocksWithPlaceholder(
          nativeFieldsField.blocks,
        )
      }

      const nativeFieldBlocks =
        nativeFieldsField && 'blocks' in nativeFieldsField
          ? nativeFieldsField.blocks
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
            fields?: unknown[]
          }

          const steps = (Array.isArray(value) ? value : []) as StepItem[]

          if (siblingData?.formLayout === 'multiStep') {
            if (steps.length === 0) {
              return 'Multi-step forms must have at least one step.'
            }

            for (let i = 0; i < steps.length; i++) {
              const step = steps[i]
              if (!Array.isArray(step?.fields) || step.fields.length === 0) {
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
            name: 'fields',
            type: 'blocks',
            label: 'Fields',
            defaultValue: [],
            blocks: nativeFieldBlocks,
            admin: {
              description:
                'These are the same native field types available in a standard Payload form.',
            },
          },
        ],
      }

      const previewStepField: Field = {
        name: 'previewStep',
        type: 'group',
        label: 'Preview Submission Step',
        defaultValue: {
          title: 'Review & submit',
        },
        admin: {
          condition: (_, siblingData) =>
            siblingData?.formLayout === 'multiStep',
          description:
            'Compulsory final stage for multi-step forms where visitors review their answers before submitting.',
        },
        fields: [
          {
            name: 'title',
            type: 'text',
            required: true,
            label: 'Step name',
            defaultValue: 'Review & submit',
            admin: {
              description:
                'Name displayed in the step progress bar and stage header.',
            },
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
            admin: {
              description:
                'Optional introductory text displayed above the submission summary.',
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
            previewStepField,
          ]
        }

        return [field]
      })

      const hasSteps = configuredFields.some(
        (field) => 'name' in field && field.name === 'steps',
      )
      const hasPreviewStep = configuredFields.some(
        (field) => 'name' in field && field.name === 'previewStep',
      )

      return [
        ...configuredFields,
        ...(hasSteps ? [] : [stepsField]),
        ...(hasPreviewStep ? [] : [previewStepField]),
        formLayoutField,
        privacyConsentField,
      ]
    },
  },
})

export const formBuilderPluginConfig = formBuilder
