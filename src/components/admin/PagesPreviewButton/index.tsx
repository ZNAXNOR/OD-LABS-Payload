'use client'
import { PreviewButton, useDocumentInfo, useFormFields } from '@payloadcms/ui'
import React from 'react'

interface PagesPreviewButtonProps {
  // Add any specific props needed
  className?: string
  label?: string
  url?: string
}

export const PagesPreviewButton: React.FC<PagesPreviewButtonProps> = () => {
  const { id } = useDocumentInfo()
  const formData = useFormFields(([fields]) => ({
    pageType: fields.pageType?.value as string,
    slug: fields.slug?.value as string,
    status: fields._status?.value as string,
  }))

  // Get the appropriate preview URL based on page type
  const getPreviewUrl = () => {
    const { pageType, slug } = formData

    if (!slug) return null

    const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

    switch (pageType) {
      case 'blog':
        return `${baseUrl}/blog/${slug}`
      case 'service':
        return `${baseUrl}/services/${slug}`
      case 'legal':
        return `${baseUrl}/legal/${slug}`
      case 'contact':
        return `${baseUrl}/contact/${slug}`
      default:
        return `${baseUrl}/${slug}`
    }
  }

  const previewUrl = getPreviewUrl()

  if (!previewUrl || !id) {
    return null
  }

  return <PreviewButton />
}

export default PagesPreviewButton
