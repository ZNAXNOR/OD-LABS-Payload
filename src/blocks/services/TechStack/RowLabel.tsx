'use client'
import { GenericRowLabel } from '@/components/admin/RowLabel'

export const TechnologyRowLabel = () => {
  return <GenericRowLabel fields={['name', 'category']} prefix="Tech" />
}
