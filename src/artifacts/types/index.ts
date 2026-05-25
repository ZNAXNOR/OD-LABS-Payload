export type ArtifactType =
  | 'stackList'
  | 'processFlow'
  | 'codeSnippet'

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
