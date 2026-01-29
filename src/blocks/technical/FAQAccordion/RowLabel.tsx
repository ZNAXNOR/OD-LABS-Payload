'use client'
import { GenericRowLabel } from '@/components/admin/RowLabel'

export const FAQRowLabel = () => {
  return <GenericRowLabel fields={['question', 'category']} prefix="FAQ" />
}
