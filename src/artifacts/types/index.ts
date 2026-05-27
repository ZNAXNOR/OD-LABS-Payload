export type ArtifactType =
  | 'stackList'
  | 'processFlow'
  | 'codeSnippet'
  | 'ad'

export type ArtifactPresentation = {
  showContainer?: boolean
  showTitle?: boolean
  showIcon?: boolean
  compact?: boolean
  theme?: 'light' | 'dark'
}

export type StackListRow = {
  label: string
  value: string
  id?: string | null
}

export type ProcessFlowStep = {
  label: string
  id?: string | null
  icon?: string | null
  highlight?: boolean | null
}

export type StackListArtifactData = {
  rows?: StackListRow[]
}

export type ProcessFlowArtifactData = {
  steps?: ProcessFlowStep[]
}

export type CodeSnippetArtifactData = {
  code: string
}

export type ArchitectureDiagramLayout =
  | 'row'
  | 'columns'
  | 'split'

export type ArchitectureDiagramVariant =
  | 'primary'
  | 'secondary'
  | 'highlight'

export type ArchitectureDiagramItem = {
  label: string
  id?: string | null
}

export type ArchitectureDiagramSection = {
  layout: ArchitectureDiagramLayout

  variant?: ArchitectureDiagramVariant

  /** Items for row / columns layout */
  items?: ArchitectureDiagramItem[]

  /** Left region items for split layout */
  left?: ArchitectureDiagramItem[]

  /** Right region items for split layout */
  right?: ArchitectureDiagramItem[]

  id?: string | null
}

export type ArchitectureDiagramArtifactData = {
  title?: string

  sections?: ArchitectureDiagramSection[]
}

export type Artifact =
  | {
      type: 'stackList'
      data: StackListArtifactData
    }
  | {
      type: 'processFlow'
      data: ProcessFlowArtifactData
    }
  | {
      type: 'codeSnippet'
      data: CodeSnippetArtifactData
    }
  | {
      type: 'ad'
      data: ArchitectureDiagramArtifactData
    }
