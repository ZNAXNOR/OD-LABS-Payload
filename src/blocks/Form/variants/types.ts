import type { FormFieldBlock, Form as FormType } from '@payloadcms/plugin-form-builder/types'
import type { UseFormReturn } from 'react-hook-form'
import type { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'

// Shared props passed from Component.tsx down to every variant
export type FormVariantProps = {
  form: FormType
  formID?: string | number

  isLoading: boolean
  hasSubmitted?: boolean

  error?: {
    message: string
    status?: string
  }

  formMethods: UseFormReturn<any>

  onSubmit: (data: FormFieldBlock[]) => void
}

// Block-level type (formerly in Component.tsx)
export type FormBlockType = {
  blockName?: string
  blockType?: 'formBlock'
  enableIntro: boolean
  form: FormType
  introContent?: DefaultTypedEditorState
  variant?: 'default' | 'contact'
  trustPanel?: {
    heading?: string
    items?: {
      icon?: string
      title?: string
      description?: string
    }[]
    email?: string
  }
}
