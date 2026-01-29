'use client'
import { GenericRowLabel } from '@/components/admin/RowLabel'

export const StepRowLabel = () => {
  return <GenericRowLabel fields={['step']} prefix="Step" />
}

export const TechnologyRowLabel = () => {
  return <GenericRowLabel fields={['technology']} prefix="Tech" />
}

export const MetricRowLabel = () => {
  return <GenericRowLabel fields={['label', 'value']} prefix="Metric" />
}
