'use client'
import { GenericRowLabel } from '@/components/admin/RowLabel'

export const TimelineItemRowLabel = () => {
  return <GenericRowLabel fields={['title', 'date']} prefix="Item" />
}
