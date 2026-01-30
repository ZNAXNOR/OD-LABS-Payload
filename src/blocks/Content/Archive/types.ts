// Define local type since ArchiveBlock is not in payload-types
interface ArchiveBlock {
  id?: string | null
  blockName?: string | null
  blockType: 'archive'
  introContent?: any
  relationTo?: string
  selectedDocs?: any[]
  limit?: number
  // Add other archive-specific properties as needed
}

export interface ArchiveBlockProps extends ArchiveBlock {
  className?: string
}

export type PopulateBy = 'collection' | 'selection'
export type ArchiveRelation = 'blogs' | 'services'
