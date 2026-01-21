'use client'
import { GenericRowLabel } from '@/components/admin/RowLabel'

export const RowLabel = () => {
  return <GenericRowLabel fields={['label', 'link.label']} prefix="Row" />
}
