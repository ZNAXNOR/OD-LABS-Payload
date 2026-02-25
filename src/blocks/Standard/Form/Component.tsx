import React from 'react'
import type { Form as FormType } from '@payloadcms/plugin-form-builder/types'
import { FormBlock as DefaultFormBlock } from './Default_Form/Component'
import { Contact2 as ContactDetailFormBlock } from './ContactDetail_Form/Component'

export type FormBlockType = {
  blockName?: string
  blockType?: 'formBlock'
  form: FormType
  style?: 'default' | 'contactDetail'
  title?: string
  description?: string
  contactDetails?: {
    phone?: string
    email?: string
    websiteLabel?: string
    websiteUrl?: string
    features?: Array<{
      feature?: string
      id?: string
    }>
  }
  className?: string
}

export const FormBlock: React.FC<FormBlockType & { id?: string }> = (props) => {
  const { style = 'default' } = props

  if (style === 'contactDetail') {
    return <ContactDetailFormBlock {...props} />
  }

  return <DefaultFormBlock {...props} />
}