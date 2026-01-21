import type { Block } from 'payload'
import { getBlockBySlug } from '@/fields/blockEmbedding'

// Generate a unique ID for duplicated blocks
export function generateBlockId(): string {
  return `block_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

// Deep clone an object, handling special cases for block data
export function deepCloneBlockData(data: any): any {
  if (data === null || typeof data !== 'object') {
    return data
  }

  if (data instanceof Date) {
    return new Date(data.getTime())
  }

  if (Array.isArray(data)) {
    return data.map((item) => deepCloneBlockData(item))
  }

  const cloned: any = {}
  for (const key in data) {
    if (data.hasOwnProperty(key)) {
      // Skip certain fields that shouldn't be duplicated
      if (key === 'id' || key === '_id' || key === 'createdAt' || key === 'updatedAt') {
        continue
      }
      cloned[key] = deepCloneBlockData(data[key])
    }
  }

  return cloned
}

// Duplicate a block with new ID and cleaned data
export function duplicateBlock(blockData: any): any {
  const clonedData = deepCloneBlockData(blockData)

  // Generate new ID
  const newId = generateBlockId()

  // Update the block data
  const duplicatedBlock = {
    ...clonedData,
    id: newId,
    blockType: blockData.blockType, // Preserve block type
  }

  // Handle special fields that might need updating
  if (duplicatedBlock.blockName) {
    duplicatedBlock.blockName = `${duplicatedBlock.blockName} (Copy)`
  }

  return duplicatedBlock
}

// Validate that a block can be duplicated
export function canDuplicateBlock(blockSlug: string): boolean {
  const block = getBlockBySlug(blockSlug)
  if (!block) return false

  // Check if block has any restrictions on duplication
  // This could be extended to check for specific block types that shouldn't be duplicated
  const nonDuplicableBlocks: string[] = [
    // Add any block slugs that shouldn't be duplicated
    // For example: 'unique-header', 'singleton-footer'
  ]

  return !nonDuplicableBlocks.includes(blockSlug)
}

// Get a user-friendly name for the duplicated block
export function getDuplicatedBlockName(originalData: any, block?: Block): string {
  // Try to get a meaningful name from the block data
  const possibleNameFields = ['title', 'heading', 'name', 'label']

  for (const field of possibleNameFields) {
    if (originalData[field]) {
      return `${originalData[field]} (Copy)`
    }
  }

  // Fallback to block type name
  const blockName = block?.labels?.singular || block?.slug || 'Block'
  return `${blockName} (Copy)`
}

// Batch duplicate multiple blocks
export function duplicateBlocks(blocksData: any[]): any[] {
  return blocksData.map((blockData) => duplicateBlock(blockData))
}

// Update references in duplicated blocks (for blocks that reference other blocks)
export function updateBlockReferences(
  duplicatedBlocks: any[],
  originalToNewIdMap: Map<string, string>,
): any[] {
  return duplicatedBlocks.map((block) => {
    // This is a simplified implementation
    // In a real scenario, you'd need to traverse the block data and update any references
    // to other blocks using the originalToNewIdMap

    // Example: if a block has a field that references another block by ID
    if (block.relatedBlockId && originalToNewIdMap.has(block.relatedBlockId)) {
      block.relatedBlockId = originalToNewIdMap.get(block.relatedBlockId)
    }

    return block
  })
}

// Duplicate a block with all its nested blocks (if any)
export function duplicateBlockWithNested(blockData: any): {
  duplicated: any
  idMap: Map<string, string>
} {
  const idMap = new Map<string, string>()

  function duplicateRecursive(data: any): any {
    if (!data || typeof data !== 'object') {
      return data
    }

    if (Array.isArray(data)) {
      return data.map((item) => duplicateRecursive(item))
    }

    const duplicated = deepCloneBlockData(data)

    // If this looks like a block with an ID, generate a new one
    if (data.id && (data.blockType || data.blockName)) {
      const newId = generateBlockId()
      idMap.set(data.id, newId)
      duplicated.id = newId
    }

    // Recursively process nested objects
    for (const key in duplicated) {
      if (duplicated.hasOwnProperty(key)) {
        duplicated[key] = duplicateRecursive(duplicated[key])
      }
    }

    return duplicated
  }

  const duplicated = duplicateRecursive(blockData)

  return { duplicated, idMap }
}

// Export types for TypeScript support
export interface BlockDuplicationResult {
  success: boolean
  duplicatedBlock?: any
  error?: string
}

export interface BatchDuplicationResult {
  success: boolean
  duplicatedBlocks: any[]
  errors: string[]
}

// Main duplication function with error handling
export function duplicateBlockSafely(blockData: any): BlockDuplicationResult {
  try {
    if (!blockData) {
      return {
        success: false,
        error: 'No block data provided',
      }
    }

    if (!blockData.blockType) {
      return {
        success: false,
        error: 'Block type is required for duplication',
      }
    }

    if (!canDuplicateBlock(blockData.blockType)) {
      return {
        success: false,
        error: 'This block type cannot be duplicated',
      }
    }

    const duplicatedBlock = duplicateBlock(blockData)

    return {
      success: true,
      duplicatedBlock,
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred during duplication',
    }
  }
}
