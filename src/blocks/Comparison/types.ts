export type ComparisonItem = {
  icon: 'architecture' | 'foundation' | 'communication' | 'speed' | 'groups' | 'experiment'
  title: string
  description?: any
  id?: string | null
}

export type ComparisonColumn = {
  title: string
  items?: ComparisonItem[]
}

export type ComparisonBlockProps = {
  blockType: 'comparison'

  variant: 'splitPanel' | 'cards'

  positiveSide: 'left' | 'right'

  eyebrow?: string
  heading: string
  intro?: string

  left: ComparisonColumn
  right: ComparisonColumn

  note?: any
}
