'use client'
import { SaveButton } from '@payloadcms/ui'
import React from 'react'

interface PagesSaveButtonProps {
  // Add any specific props needed
  className?: string
  label?: string
}

export const PagesSaveButton: React.FC<PagesSaveButtonProps> = (props) => {
  return <SaveButton {...props} />
}

export default PagesSaveButton
