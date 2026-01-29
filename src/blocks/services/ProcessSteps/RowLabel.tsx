'use client'
import { GenericRowLabel } from '@/components/admin/RowLabel'

export const StepRowLabel = () => {
  return <GenericRowLabel fields={['title', 'duration']} prefix="Step" />
}
