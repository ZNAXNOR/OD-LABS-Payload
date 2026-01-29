'use client'
import { GenericRowLabel } from '@/components/admin/RowLabel'

export const ServiceRowLabel = () => {
  return <GenericRowLabel fields={['title', 'icon']} prefix="Service" />
}

export const FeatureRowLabel = () => {
  return <GenericRowLabel fields={['feature']} prefix="Feature" />
}
