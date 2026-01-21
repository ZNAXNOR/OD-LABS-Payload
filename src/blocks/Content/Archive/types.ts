import type { ArchiveBlock } from '@/payload-types'

export interface ArchiveBlockProps extends ArchiveBlock {
  className?: string
}

export type PopulateBy = 'collection' | 'selection'
export type ArchiveRelation = 'blogs' | 'services'
