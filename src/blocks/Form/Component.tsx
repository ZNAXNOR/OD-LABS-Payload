import type { FormFieldBlock, Form as FormType } from '@payloadcms/plugin-form-builder/types'
import { getCachedGlobal } from '@/utilities/getGlobals'
import { FormBlockClient } from './Component.client'
import type { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'
import React from 'react'
import type { Contact } from '@/payload-types'

export type FormBlockType = {
  blockName?: string
  blockType?: 'formBlock'
  enableIntro: boolean
  form: FormType
  introContent?: DefaultTypedEditorState
  appearance?: 'default' | 'split'
  splitContent?: DefaultTypedEditorState
  enableContactInfo?: boolean
}

export const FormBlock: React.FC<
  {
    id?: string
  } & FormBlockType
> = async (props) => {
  let contactData: Contact | null = null

  if (props.appearance === 'split' && props.enableContactInfo) {
    contactData = (await getCachedGlobal('contact', 1)()) as Contact
  }

  return <FormBlockClient {...props} contact={contactData} />
}
