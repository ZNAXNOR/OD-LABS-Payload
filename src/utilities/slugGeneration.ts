import type { CollectionBeforeValidateHook, PayloadRequest } from 'payload'

/**
 * Enhanced slug generation utilities with validation and uniqueness checking
 */

/**
 * Configuration options for slug generation
 */
export interface SlugGenerationOptions {
  /** Field to generate slug from (default: 'title') */
  sourceField?: string
  /** Maximum length of generated slug (default: 100) */
  maxLength?: number
  /** Whether to enforce uniqueness (default: true) */
  enforceUniqueness?: boolean
  /** Custom slug transformation function */
  transform?: (text: string) => string
  /** Reserved slugs that cannot be used */
  reservedSlugs?: string[]
  /** Whether to update slug on title changes (default: false) */
  updateOnChange?: boolean
}

/**
 * Default reserved slugs that should not be used
 */
const DEFAULT_RESERVED_SLUGS = [
  'admin',
  'api',
  'auth',
  'login',
  'logout',
  'register',
  'dashboard',
  'settings',
  'profile',
  'account',
  'home',
  'index',
  'search',
  'sitemap',
  'robots',
  'favicon',
  'manifest',
  'sw',
  'service-worker',
  '_next',
  'static',
  'public',
  'assets',
  'media',
  'uploads',
  'files',
  'images',
  'css',
  'js',
  'fonts',
  'icons',
]

/**
 * Generate a URL-safe slug from text
 */
export function generateSlugFromText(
  text: string,
  options: Omit<SlugGenerationOptions, 'sourceField' | 'enforceUniqueness'> = {},
): string {
  const { maxLength = 100, transform, reservedSlugs = [] } = options

  if (!text || typeof text !== 'string') {
    throw new Error('Text is required for slug generation')
  }

  let slug = text.trim()

  // Apply custom transformation if provided
  if (transform) {
    slug = transform(slug)
  } else {
    // Default transformation
    slug = slug
      .toLowerCase()
      // Replace accented characters with their base equivalents
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      // Replace spaces and special characters with hyphens
      .replace(/[^a-z0-9]+/g, '-')
      // Remove leading/trailing hyphens
      .replace(/^-+|-+$/g, '')
      // Replace multiple consecutive hyphens with single hyphen
      .replace(/-{2,}/g, '-')
  }

  // Truncate to max length
  if (slug.length > maxLength) {
    slug = slug.substring(0, maxLength).replace(/-+$/, '')
  }

  // Check against reserved slugs
  const allReservedSlugs = [...DEFAULT_RESERVED_SLUGS, ...reservedSlugs]
  if (allReservedSlugs.includes(slug)) {
    throw new Error(`Slug "${slug}" is reserved and cannot be used`)
  }

  if (!slug) {
    throw new Error('Generated slug is empty')
  }

  return slug
}

/**
 * Check if a slug is unique within a collection
 */
export async function isSlugUnique(
  slug: string,
  collection: string,
  req: PayloadRequest,
  excludeId?: string | number,
): Promise<boolean> {
  try {
    const query: any = { slug: { equals: slug } }

    // Exclude current document if updating
    if (excludeId) {
      query.id = { not_equals: excludeId }
    }

    const result = await req.payload.count({
      collection: collection as any, // Type assertion for collection slug
      where: query,
      req, // Maintain transaction context
    })

    return result.totalDocs === 0
  } catch (error) {
    req.payload.logger.error(`Error checking slug uniqueness: ${error}`)
    return false
  }
}

/**
 * Generate a unique slug by appending numbers if necessary
 *
 * This function handles race conditions by:
 * 1. Checking if the base slug is unique
 * 2. Trying numbered suffixes (slug-1, slug-2, etc.) up to maxRetries
 * 3. Falling back to a timestamp suffix if all retries fail
 *
 * The database unique constraint serves as the final safeguard against duplicates.
 *
 * @param baseSlug - The base slug to make unique
 * @param collection - The collection to check uniqueness against
 * @param req - The Payload request object (maintains transaction context)
 * @param excludeId - Optional document ID to exclude from uniqueness check (for updates)
 * @param maxRetries - Maximum number of numbered suffixes to try (default: 10)
 * @returns A unique slug
 */
export async function generateUniqueSlug(
  baseSlug: string,
  collection: string,
  req: PayloadRequest,
  excludeId?: string | number,
  maxRetries = 10,
): Promise<string> {
  let slug = baseSlug
  let counter = 1

  // Check if base slug is unique
  if (await isSlugUnique(slug, collection, req, excludeId)) {
    return slug
  }

  // Try appending numbers until we find a unique slug
  while (counter <= maxRetries) {
    const candidateSlug = `${baseSlug}-${counter}`

    if (await isSlugUnique(candidateSlug, collection, req, excludeId)) {
      req.payload.logger.info(`Generated unique slug "${candidateSlug}" after ${counter} attempts`)
      return candidateSlug
    }

    counter++
  }

  // If we can't find a unique slug after maxRetries attempts,
  // append a timestamp to ensure uniqueness
  const timestamp = Date.now().toString(36) // Base36 for shorter string
  const timestampSlug = `${baseSlug}-${timestamp}`

  req.payload.logger.warn(
    `Could not find unique slug after ${maxRetries} attempts, using timestamp: ${timestampSlug}`,
  )

  return timestampSlug
}

/**
 * Validate a slug format
 */
export function validateSlugFormat(slug: string): { isValid: boolean; errors: string[] } {
  const errors: string[] = []

  if (!slug) {
    errors.push('Slug is required')
    return { isValid: false, errors }
  }

  if (typeof slug !== 'string') {
    errors.push('Slug must be a string')
    return { isValid: false, errors }
  }

  // Check length
  if (slug.length < 1) {
    errors.push('Slug must be at least 1 character long')
  }

  if (slug.length > 100) {
    errors.push('Slug must be no more than 100 characters long')
  }

  // Check format
  if (!/^[a-z0-9-]+$/.test(slug)) {
    errors.push('Slug can only contain lowercase letters, numbers, and hyphens')
  }

  // Check for leading/trailing hyphens
  if (slug.startsWith('-') || slug.endsWith('-')) {
    errors.push('Slug cannot start or end with a hyphen')
  }

  // Check for consecutive hyphens
  if (slug.includes('--')) {
    errors.push('Slug cannot contain consecutive hyphens')
  }

  // Check against reserved slugs
  if (DEFAULT_RESERVED_SLUGS.includes(slug)) {
    errors.push(`Slug "${slug}" is reserved and cannot be used`)
  }

  return { isValid: errors.length === 0, errors }
}

/**
 * Create a slug generation hook for collections
 */
export function createSlugGenerationHook(
  collection: string,
  options: SlugGenerationOptions = {},
): CollectionBeforeValidateHook {
  const {
    sourceField = 'title',
    maxLength = 100,
    enforceUniqueness = true,
    transform,
    reservedSlugs = [],
    updateOnChange = false,
  } = options

  return async ({ data, operation, req, originalDoc }) => {
    try {
      const shouldGenerateSlug =
        (operation === 'create' && data?.[sourceField] && !data?.slug) ||
        (operation === 'update' &&
          updateOnChange &&
          data?.[sourceField] &&
          data?.[sourceField] !== originalDoc?.[sourceField])

      if (shouldGenerateSlug) {
        // Generate base slug from source field
        const baseSlug = generateSlugFromText(data[sourceField], {
          maxLength,
          transform,
          reservedSlugs,
        })

        // Generate unique slug if uniqueness is enforced
        if (enforceUniqueness) {
          data.slug = await generateUniqueSlug(
            baseSlug,
            collection,
            req,
            operation === 'update' ? originalDoc?.id : undefined,
          )
        } else {
          data.slug = baseSlug
        }

        req.payload.logger.info(
          `Generated slug "${data.slug}" for ${collection} from "${data[sourceField]}"`,
        )
      }

      // Validate existing slug if provided
      if (data?.slug) {
        const validation = validateSlugFormat(data.slug)
        if (!validation.isValid) {
          throw new Error(`Invalid slug format: ${validation.errors.join(', ')}`)
        }

        // Check uniqueness for manually provided slugs
        if (enforceUniqueness && (operation === 'create' || data.slug !== originalDoc?.slug)) {
          const isUnique = await isSlugUnique(
            data.slug,
            collection,
            req,
            operation === 'update' ? originalDoc?.id : undefined,
          )

          if (!isUnique) {
            throw new Error(`Slug "${data.slug}" is already in use`)
          }
        }
      }

      return data
    } catch (error) {
      req.payload.logger.error(`Slug generation error for ${collection}: ${error}`)
      throw error
    }
  }
}

/**
 * Utility function to sanitize user input for slug generation
 */
export function sanitizeSlugInput(input: string): string {
  if (!input || typeof input !== 'string') {
    return ''
  }

  return (
    input
      .trim()
      .toLowerCase()
      // Remove HTML tags
      .replace(/<[^>]*>/g, '')
      // Remove extra whitespace
      .replace(/\s+/g, ' ')
  )
}

/**
 * Get slug suggestions based on a title
 */
export function getSlugSuggestions(title: string, count = 5): string[] {
  if (!title) return []

  const suggestions: string[] = []
  const baseSlug = generateSlugFromText(title)

  suggestions.push(baseSlug)

  // Generate variations
  const words = title.toLowerCase().split(/\s+/)

  if (words.length > 1) {
    // First word only
    const firstWord = words[0]
    if (firstWord) {
      suggestions.push(generateSlugFromText(firstWord))
    }

    // Last word only
    const lastWord = words[words.length - 1]
    if (lastWord) {
      suggestions.push(generateSlugFromText(lastWord))
    }

    // First two words
    if (words.length > 2) {
      suggestions.push(generateSlugFromText(words.slice(0, 2).join(' ')))
    }

    // Acronym from first letters
    if (words.length > 2) {
      const acronym = words.map((word) => word.charAt(0)).join('')
      suggestions.push(generateSlugFromText(acronym))
    }
  }

  // Remove duplicates and limit count
  return Array.from(new Set(suggestions)).slice(0, count)
}
