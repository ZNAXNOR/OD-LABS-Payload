'use client'
import { GenericRowLabel } from '@/components/admin/RowLabel'

export const ProjectRowLabel = () => {
  return <GenericRowLabel fields={['title', 'category']} prefix="Project" />
}

export const TechnologyRowLabel = () => {
  return <GenericRowLabel fields={['technology']} prefix="Tech" />
}

export const CategoryRowLabel = () => {
  return <GenericRowLabel fields={['category']} prefix="Category" />
}
