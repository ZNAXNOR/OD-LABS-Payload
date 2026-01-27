'use client'
import { GenericRowLabel } from '@/components/admin/RowLabel'

export const RowLabel = () => {
  return <GenericRowLabel fields={['label', 'link.label']} prefix="Row" />
}

export const NavItemRowLabel = () => {
  return <GenericRowLabel fields={['link.label', 'link.reference.title']} prefix="Nav" />
}

export const SocialMediaRowLabel = () => {
  return <GenericRowLabel fields={['platform', 'label']} prefix="Social" />
}
