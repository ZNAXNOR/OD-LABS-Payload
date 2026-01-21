'use client'
import { GenericRowLabel } from '@/components/admin/RowLabel'

export const RowLabel = () => {
  return <GenericRowLabel fields={['label']} prefix="Tab" />
}

export const NavItemRowLabel = () => {
  return (
    <GenericRowLabel
      fields={['defaultLink.link.label', 'featuredLink.label', 'listLinks.tag']}
      prefix="Item"
    />
  )
}
