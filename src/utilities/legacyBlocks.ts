import { BLOCK_ASSIGNMENTS, type PageCollectionType } from '@/blocks/config/blockAssignments'

/**
 * Detects if a page contains blocks that are no longer available for its collection type
 *
 * @param collectionType - The page collection type (blogs, services, contacts, legal, pages)
 * @param heroBlocks - Array of hero blocks on the page
 * @param layoutBlocks - Array of layout blocks on the page
 * @returns Object with hasLegacyBlocks flag and array of legacy block types
 */
export function detectLegacyBlocks(
  collectionType: PageCollectionType,
  heroBlocks: any[] = [],
  layoutBlocks: any[] = [],
): {
  hasLegacyBlocks: boolean
  legacyBlockTypes: string[]
  legacyHeroBlocks: string[]
  legacyLayoutBlocks: string[]
} {
  // Get allowed blocks for this collection
  const allowedBlocks = BLOCK_ASSIGNMENTS[collectionType]
  const allowedHeroSlugs = new Set(allowedBlocks.hero?.map((block) => block.slug) || [])
  const allowedLayoutSlugs = new Set(allowedBlocks.layout.map((block) => block.slug))

  // Check hero blocks for legacy blocks
  const legacyHeroBlocks: string[] = []
  heroBlocks.forEach((block) => {
    if (block?.blockType && !allowedHeroSlugs.has(block.blockType)) {
      legacyHeroBlocks.push(block.blockType)
    }
  })

  // Check layout blocks for legacy blocks
  const legacyLayoutBlocks: string[] = []
  layoutBlocks.forEach((block) => {
    if (block?.blockType && !allowedLayoutSlugs.has(block.blockType)) {
      legacyLayoutBlocks.push(block.blockType)
    }
  })

  // Combine all legacy block types
  const legacyBlockTypes = [...new Set([...legacyHeroBlocks, ...legacyLayoutBlocks])]

  return {
    hasLegacyBlocks: legacyBlockTypes.length > 0,
    legacyBlockTypes,
    legacyHeroBlocks,
    legacyLayoutBlocks,
  }
}

/**
 * Formats a user-friendly message about legacy blocks
 *
 * @param legacyBlockTypes - Array of legacy block type slugs
 * @returns Formatted warning message
 */
export function formatLegacyBlockMessage(legacyBlockTypes: string[]): string {
  if (legacyBlockTypes.length === 0) return ''

  const blockList = legacyBlockTypes.join(', ')
  return `This page contains blocks that are no longer available for new additions: ${blockList}. These blocks will continue to render but cannot be added again.`
}
