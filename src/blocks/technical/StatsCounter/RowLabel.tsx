'use client'
import { GenericRowLabel } from '@/components/admin/RowLabel'

export const StatRowLabel = () => {
  return <GenericRowLabel fields={['label', 'value']} prefix="Stat" />
}
