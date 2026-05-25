import type { Artifact } from '@/artifacts'

export type ArtifactWidth = 'oneThird' | 'twoThirds' | 'full' | 'half'

export type ArtifactTheme = 'light' | 'dark'

export type ArtifactItem = {
  icon: string
  title: string
  description?: any
  width: ArtifactWidth
  artifact: Artifact
  id?: string | null
}

export type ArtifactBlockProps = {
  blockType: 'artifactBlock'
  theme: ArtifactTheme
  eyebrow?: string
  heading: string
  items?: ArtifactItem[]
}
