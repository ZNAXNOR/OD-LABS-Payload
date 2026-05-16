export type ComparisonItem = {
  title: string
  description: string
  id?: string | null
}

export type ComparisonColumn = {
  title: string
  items?: ComparisonItem[]
}

export type ComparisonBlockProps = {
  blockType: 'comparison'
  variant: 'large' | 'cards'
  eyebrow?: string
  heading: string
  intro?: string
  left: ComparisonColumn
  right: ComparisonColumn
  note?: any
}
