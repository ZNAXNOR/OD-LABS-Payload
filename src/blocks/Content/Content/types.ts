// Define local type since ContentBlock is not in payload-types
interface ContentBlock {
  id?: string | null
  blockName?: string | null
  blockType: 'content'
  columns?: any[]
  gap?: 'small' | 'medium' | 'large'
  alignment?: 'top' | 'center' | 'bottom'
  // Add other content-specific properties as needed
}

export interface ContentBlockProps extends ContentBlock {
  className?: string
}

export type ColumnWidth = 'oneThird' | 'half' | 'twoThirds' | 'full' | 'auto'
export type ColumnGap = 'none' | 'small' | 'medium' | 'large'
export type ColumnAlignment = 'top' | 'center' | 'bottom'
export type ColumnBackgroundColor = 'none' | 'white' | 'zinc-50' | 'zinc-100' | 'brand-primary'
export type ColumnPadding = 'none' | 'small' | 'medium' | 'large'
