export type ArtifactWidth = 'oneThird' | 'twoThirds' | 'full' | 'half'

export type ArtifactTheme = 'light' | 'dark'

export type ArtifactType = 'stackList' | 'processFlow' | 'codeSnippet'

export type StackListRow = {
  label: string
  value: string
  id?: string | null
}

export type ProcessFlowStep = {
  label: string
  icon?: 'GitCommitHorizontal' | 'FlaskConical' | 'Rocket' | null
  highlight?: boolean | null
  id?: string | null
}

export type StackListArtifact = {
  rows?: StackListRow[]
}

export type ProcessFlowArtifact = {
  steps?: ProcessFlowStep[]
}

export type CodeSnippetArtifact = {
  code: string
}

export type ArtifactItem = {
  icon: string
  title: string
  description?: any
  width: ArtifactWidth
  artifactType: ArtifactType
  stackList?: StackListArtifact
  processFlow?: ProcessFlowArtifact
  codeSnippet?: CodeSnippetArtifact
  id?: string | null
}

export type ArtifactBlockProps = {
  blockType: 'artifactBlock'
  theme: ArtifactTheme
  eyebrow?: string
  heading: string
  items?: ArtifactItem[]
}
