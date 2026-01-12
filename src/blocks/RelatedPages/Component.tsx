import clsx from 'clsx'
import React from 'react'
import { RichText } from '@/components/RichText'

import type { Page, BlogPage, ServicePage, LegalPage, ContactPage } from '@/payload-types'

import { Card } from '@/components/Card'
import { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'

export type RelatedPagesProps = {
  className?: string
  docs?: Page[] | BlogPage[] | ServicePage[] | LegalPage[] | ContactPage[]
  introContent?: DefaultTypedEditorState
}

export const RelatedPages: React.FC<RelatedPagesProps> = (props) => {
  const { className, docs, introContent } = props

  return (
    <div className={clsx('lg:container', className)}>
      {introContent && <RichText content={introContent} />}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 items-stretch">
        {docs?.map((doc, index) => {
          if (typeof doc === 'string') return null

          return <Card key={index} doc={doc} relationTo="pages" showCategories />
        })}
      </div>
    </div>
  )
}
