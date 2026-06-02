export type ArtifactType = 'stackList' | 'processFlow' | 'codeSnippet' | 'ad'

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

export type ArchitectureDiagramLayout = 'row' | 'columns' | 'split'

export type ArchitectureDiagramVariant = 'primary' | 'secondary' | 'highlight'

export type ArchitectureDiagramItem = {
  label: string
  id?: string | null
}

export type ArchitectureDiagramRowSection = {
  id?: string | null
  layout: 'row'
  variant: ArchitectureDiagramVariant
  items: ArchitectureDiagramItem[]
}

export type ArchitectureDiagramColumnsSection = {
  id?: string | null
  layout: 'columns'
  variant: ArchitectureDiagramVariant
  items: ArchitectureDiagramItem[]
}

export type ArchitectureDiagramSplitSection = {
  id?: string | null
  layout: 'split'
  /** Left items array */
  left: ArchitectureDiagramItem[]
  /** Variant for the left side — shares the `variant` column with row/columns via conditional */
  variant: ArchitectureDiagramVariant
  /** Right items array */
  right: ArchitectureDiagramItem[]
  /** Whether right side renders as a stack or a 2-column grid */
  right_layout: 'stack' | 'grid'
}

export type ArchitectureDiagramSection =
  | ArchitectureDiagramRowSection
  | ArchitectureDiagramColumnsSection
  | ArchitectureDiagramSplitSection

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
