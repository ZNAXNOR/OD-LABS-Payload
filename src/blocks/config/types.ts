import type { Block } from 'payload'

/**
 * Represents a category of blocks with metadata
 */
export interface BlockCategory {
  label: string
  description: string
  blocks: Block[]
}

/**
 * Configuration for blocks available to a page collection
 */
export interface PageCollectionBlocks {
  hero?: Block[]
  layout: Block[]
}

/**
 * Assignment of blocks to a specific collection
 */
export interface BlockAssignment {
  collection: string
  hero?: Block[]
  layout: Block[]
}

/**
 * Metadata about a block including its category and availability
 */
export interface BlockMetadata {
  slug: string
  category: string
  label: string
  description: string
  availableIn: string[]
}

/**
 * Map of block slugs to Block configurations
 */
export type BlockMap = Record<string, Block>
