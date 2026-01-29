'use client'
import { GenericRowLabel } from '@/components/admin/RowLabel'

export const ColorRowLabel = () => {
  return <GenericRowLabel fields={['color']} prefix="Color" />
}

export const ActionRowLabel = () => {
  return <GenericRowLabel fields={['link.label', 'link.url']} prefix="Action" />
}
