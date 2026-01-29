'use client'
import { GenericRowLabel } from '@/components/admin/RowLabel'

export const TierRowLabel = () => {
  return <GenericRowLabel fields={['name', 'price']} prefix="Tier" />
}

export const FeatureRowLabel = () => {
  return <GenericRowLabel fields={['text']} prefix="Feature" />
}
