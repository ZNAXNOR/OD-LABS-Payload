'use client'
import { GenericRowLabel } from '@/components/RowLabel'

export const RowLabel = () => {
  return <GenericRowLabel fields={['label', 'link.label']} prefix="Row" />
}
