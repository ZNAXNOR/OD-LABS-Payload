'use client'

import React from 'react'
import RichText from '@/components/RichText'
import { FormRenderer } from '../components/FormRenderer'
import type { FormVariantProps } from './types'

type Props = FormVariantProps & {
  enableIntro?: boolean
  introContent?: any
}

export function DefaultForm({ enableIntro, introContent, ...formProps }: Props) {
  return (
    <div className="container lg:max-w-3xl">
      {enableIntro && introContent && !formProps.hasSubmitted && (
        <RichText className="mb-8 lg:mb-12" data={introContent} enableGutter={false} />
      )}

      <div className="p-4 lg:p-6 border border-border rounded-[0.8rem]">
        <FormRenderer {...formProps} />
      </div>
    </div>
  )
}
