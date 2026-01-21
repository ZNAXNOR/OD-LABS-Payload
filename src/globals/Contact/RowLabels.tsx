'use client'
import { GenericRowLabel } from '@/components/admin/RowLabel'

export const SocialMediaRowLabel = () => {
  return <GenericRowLabel capitalize={true} fields={['platform', 'label']} prefix="Link" />
}

export const LocationRowLabel = () => {
  return <GenericRowLabel fields={['name', 'label']} prefix="Location" />
}
