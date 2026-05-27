import type { Artifact } from '@/artifacts'

export type ServiceShowcaseTag = {
  icon: string
  text: string
}

export type ServiceShowcaseCTA = {
  type?: 'custom' | 'reference' | null
  label: string
  newTab?: boolean | null
  url?: string | null
  reference?: {
    relationTo: 'pages' | 'posts'
    value: string | any
  } | null
}

export type ServiceShowcaseItem = {
  number?: string
  tag: ServiceShowcaseTag
  title: string
  timeline: string
  deliverables?: string[]
  cta?: ServiceShowcaseCTA
  challenge?: any
  approach?: any
  artifact?: Artifact
  capabilities?: {
    id?: string | null
    capability: string
  }[]
  id?: string | null
}

export type ServiceShowcaseBlockProps = {
  blockType: 'serviceShowcase'
  items?: ServiceShowcaseItem[]
}
