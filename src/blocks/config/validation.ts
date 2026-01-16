import type { Block, Field } from 'payload'

/**
 * Validation utilities for block configurations
 *
 * These utilities help detect and prevent common block configuration errors,
 * particularly issues with nested blocks that can cause runtime errors.
 */

/**
 * Validates a block configuration for common issues
 *
 * This function checks for:
 * - Empty nested blocks arrays (blocks: [])
 * - Undefined or null blocks in nested arrays
 * - Circular references (block containing itself)
 *
 * @param block - The block configuration to validate
 * @param options - Validation options
 * @param options.throwOnError - If true, throws errors instead of logging warnings (default: false)
 * @param options.checkCircularRefs - If true, checks for circular references (default: true)
 * @returns Object with validation results
 *
 * @example
 * ```typescript
 * const result = validateBlockConfiguration(ContainerBlock)
 * if (!result.isValid) {
 *   console.warn('Block has configuration issues:', result.warnings)
 * }
 * ```
 *
 * **Validates: Requirements 6.4**
 */
export function validateBlockConfiguration(
  block: Block,
  options: {
    throwOnError?: boolean
    checkCircularRefs?: boolean
  } = {},
): {
  isValid: boolean
  warnings: string[]
  errors: string[]
} {
  const { throwOnError = false, checkCircularRefs = true } = options
  const warnings: string[] = []
  const errors: string[] = []

  // Validate block has required properties
  if (!block) {
    const error = 'Block is undefined or null'
    errors.push(error)
    if (throwOnError) {
      throw new Error(error)
    }
    return { isValid: false, warnings, errors }
  }

  if (!block.slug) {
    const error = `Block is missing required 'slug' property`
    errors.push(error)
    if (throwOnError) {
      throw new Error(error)
    }
    return { isValid: false, warnings, errors }
  }

  if (!block.fields || !Array.isArray(block.fields)) {
    const error = `Block "${block.slug}" is missing required 'fields' array`
    errors.push(error)
    if (throwOnError) {
      throw new Error(error)
    }
    return { isValid: false, warnings, errors }
  }

  // Find nested blocks field
  const nestedBlocksField = block.fields.find(
    (field): field is Field & { type: 'blocks'; blocks?: Block[] } =>
      'type' in field && field.type === 'blocks' && 'name' in field && field.name === 'blocks',
  )

  if (nestedBlocksField) {
    // Check for empty blocks array
    if ('blocks' in nestedBlocksField && Array.isArray(nestedBlocksField.blocks)) {
      const nestedBlocks = nestedBlocksField.blocks

      if (nestedBlocks.length === 0) {
        const warning =
          `Block "${block.slug}" has an empty nested blocks array (blocks: []). ` +
          `This may cause "Cannot read properties of undefined (reading 'map')" errors. ` +
          `Either remove the blocks field or populate it with valid block references.`
        warnings.push(warning)
        console.warn(`[Block Validation Warning] ${warning}`)
      } else {
        // Check for undefined/null blocks in the array
        nestedBlocks.forEach((nestedBlock, index) => {
          if (!nestedBlock) {
            const error =
              `Block "${block.slug}" has undefined or null block at index ${index} in nested blocks array. ` +
              `All blocks in the array must be valid Block configurations.`
            errors.push(error)
            if (throwOnError) {
              throw new Error(error)
            }
          } else if (!nestedBlock.slug) {
            const error = `Block "${block.slug}" has invalid block at index ${index} in nested blocks array: missing 'slug' property.`
            errors.push(error)
            if (throwOnError) {
              throw new Error(error)
            }
          }
        })

        // Check for circular references
        if (checkCircularRefs) {
          const hasCircularRef = nestedBlocks.some(
            (nestedBlock) => nestedBlock && nestedBlock.slug === block.slug,
          )

          if (hasCircularRef) {
            const error =
              `Circular reference detected: Block "${block.slug}" includes itself in nested blocks array. ` +
              `This will cause infinite recursion and should be avoided.`
            errors.push(error)
            if (throwOnError) {
              throw new Error(error)
            }
          }
        }
      }
    }
  }

  const isValid = errors.length === 0

  // Log summary if there are issues
  if (!isValid || warnings.length > 0) {
    console.log(`[Block Validation] Block "${block.slug}":`, {
      isValid,
      warningCount: warnings.length,
      errorCount: errors.length,
    })
  }

  return { isValid, warnings, errors }
}

/**
 * Validates multiple block configurations
 *
 * @param blocks - Array of blocks to validate
 * @param options - Validation options
 * @returns Object with validation results for all blocks
 *
 * @example
 * ```typescript
 * const results = validateBlockConfigurations([HeroBlock, ContentBlock, ContainerBlock])
 * if (!results.allValid) {
 *   console.error('Some blocks have configuration issues')
 * }
 * ```
 */
export function validateBlockConfigurations(
  blocks: Block[],
  options: {
    throwOnError?: boolean
    checkCircularRefs?: boolean
  } = {},
): {
  allValid: boolean
  results: Array<{
    slug: string
    isValid: boolean
    warnings: string[]
    errors: string[]
  }>
} {
  const results = blocks.map((block) => {
    const validation = validateBlockConfiguration(block, options)
    return {
      slug: block.slug || 'unknown',
      ...validation,
    }
  })

  const allValid = results.every((result) => result.isValid)

  return { allValid, results }
}

/**
 * Validates that a nested blocks field is properly configured
 *
 * This is a focused validation specifically for nested blocks fields,
 * useful when you want to validate just the nested blocks configuration
 * without validating the entire block.
 *
 * @param blockSlug - The slug of the parent block (for error messages)
 * @param nestedBlocks - The array of nested blocks to validate
 * @returns Object with validation results
 *
 * @example
 * ```typescript
 * const result = validateNestedBlocksField('container', [ContentBlock, MediaBlock])
 * if (!result.isValid) {
 *   console.error('Nested blocks configuration is invalid')
 * }
 * ```
 */
export function validateNestedBlocksField(
  blockSlug: string,
  nestedBlocks: Block[] | undefined,
): {
  isValid: boolean
  warnings: string[]
  errors: string[]
} {
  const warnings: string[] = []
  const errors: string[] = []

  if (!nestedBlocks) {
    // undefined is valid - means no nested blocks field
    return { isValid: true, warnings, errors }
  }

  if (!Array.isArray(nestedBlocks)) {
    const error = `Block "${blockSlug}" nested blocks is not an array`
    errors.push(error)
    return { isValid: false, warnings, errors }
  }

  if (nestedBlocks.length === 0) {
    const warning =
      `Block "${blockSlug}" has an empty nested blocks array. ` +
      `This may cause runtime errors. Consider removing the blocks field or populating it.`
    warnings.push(warning)
    console.warn(`[Nested Blocks Validation] ${warning}`)
  }

  nestedBlocks.forEach((block, index) => {
    if (!block) {
      const error = `Block "${blockSlug}" has undefined or null block at index ${index}`
      errors.push(error)
    } else if (!block.slug) {
      const error = `Block "${blockSlug}" has invalid block at index ${index}: missing slug`
      errors.push(error)
    } else if (block.slug === blockSlug) {
      const error = `Block "${blockSlug}" contains itself at index ${index} (circular reference)`
      errors.push(error)
    }
  })

  return {
    isValid: errors.length === 0,
    warnings,
    errors,
  }
}
