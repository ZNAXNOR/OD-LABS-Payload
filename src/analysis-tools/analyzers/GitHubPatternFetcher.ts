/**
 * GitHub Pattern Fetcher
 * Fetches block configurations from official Payload CMS repositories
 * Implements caching and rate limit handling
 */

import { retryWithBackoff } from '../utils'
import type { OfficialPattern, Block } from '../types'
import * as fs from 'fs/promises'
import * as path from 'path'

export interface GitHubConfig {
  token?: string
  cacheDir?: string
  cacheTTL?: number // Time to live in milliseconds
}

export interface GitHubRateLimit {
  limit: number
  remaining: number
  reset: number // Unix timestamp
}

export interface GitHubFileContent {
  name: string
  path: string
  content: string
  sha: string
}

const DEFAULT_CACHE_DIR = '.cache/github-patterns'
const DEFAULT_CACHE_TTL = 24 * 60 * 60 * 1000 // 24 hours
const GITHUB_API_BASE = 'https://api.github.com'

export class GitHubPatternFetcher {
  private config: Required<GitHubConfig>
  private rateLimit: GitHubRateLimit | null = null

  constructor(config: GitHubConfig = {}) {
    this.config = {
      token: config.token || process.env.GITHUB_TOKEN || '',
      cacheDir: config.cacheDir || DEFAULT_CACHE_DIR,
      cacheTTL: config.cacheTTL || DEFAULT_CACHE_TTL,
    }
  }

  /**
   * Fetch official patterns from Payload CMS repositories
   */
  async fetchOfficialPatterns(): Promise<OfficialPattern[]> {
    const patterns: OfficialPattern[] = []

    // Fetch from payloadcms/website
    try {
      const websitePatterns = await this.fetchPatternsFromRepo(
        'payloadcms',
        'website',
        'src/blocks',
      )
      patterns.push(...websitePatterns)
    } catch (error) {
      console.warn('Failed to fetch patterns from payloadcms/website:', error)
    }

    // Fetch from payloadcms/public-demo
    try {
      const demoPatterns = await this.fetchPatternsFromRepo(
        'payloadcms',
        'public-demo',
        'src/blocks',
      )
      patterns.push(...demoPatterns)
    } catch (error) {
      console.warn('Failed to fetch patterns from payloadcms/public-demo:', error)
    }

    return patterns
  }

  /**
   * Fetch patterns from a specific repository
   */
  private async fetchPatternsFromRepo(
    owner: string,
    repo: string,
    blocksPath: string,
  ): Promise<OfficialPattern[]> {
    const source = `${owner}/${repo}` as 'payloadcms/website' | 'payloadcms/public-demo'

    // Check cache first
    const cacheKey = `${owner}-${repo}-${blocksPath.replace(/\//g, '-')}`
    const cached = await this.getCachedPatterns(cacheKey)
    if (cached) {
      return cached.map((p) => ({ ...p, source }))
    }

    // Fetch directory contents
    const files = await this.fetchDirectoryContents(owner, repo, blocksPath)

    const patterns: OfficialPattern[] = []

    for (const file of files) {
      if (file.type === 'dir') {
        // Check for config.ts in subdirectory
        const configPath = `${file.path}/config.ts`
        try {
          const configContent = await this.fetchFileContent(owner, repo, configPath)
          const pattern = await this.parseBlockConfig(configContent, file.name, source)
          if (pattern) {
            patterns.push(pattern)
          }
        } catch (error) {
          // Config file doesn't exist or couldn't be parsed
          continue
        }
      } else if (file.name === 'config.ts' || file.name.endsWith('.config.ts')) {
        // Direct config file
        try {
          const configContent = await this.fetchFileContent(owner, repo, file.path)
          const blockName = path.basename(path.dirname(file.path))
          const pattern = await this.parseBlockConfig(configContent, blockName, source)
          if (pattern) {
            patterns.push(pattern)
          }
        } catch (error) {
          continue
        }
      }
    }

    // Cache the results
    await this.cachePatterns(cacheKey, patterns)

    return patterns
  }

  /**
   * Fetch directory contents from GitHub
   */
  private async fetchDirectoryContents(
    owner: string,
    repo: string,
    path: string,
  ): Promise<Array<{ name: string; path: string; type: 'file' | 'dir' }>> {
    const url = `${GITHUB_API_BASE}/repos/${owner}/${repo}/contents/${path}`

    const response = await this.makeGitHubRequest(url)

    if (!Array.isArray(response)) {
      throw new Error('Expected directory contents to be an array')
    }

    return response.map((item: any) => ({
      name: item.name,
      path: item.path,
      type: item.type === 'dir' ? 'dir' : 'file',
    }))
  }

  /**
   * Fetch file content from GitHub
   */
  private async fetchFileContent(owner: string, repo: string, filePath: string): Promise<string> {
    const url = `${GITHUB_API_BASE}/repos/${owner}/${repo}/contents/${filePath}`

    const response = await this.makeGitHubRequest(url)

    if (!response.content) {
      throw new Error('File content not found')
    }

    // Decode base64 content
    return Buffer.from(response.content, 'base64').toString('utf-8')
  }

  /**
   * Make authenticated GitHub API request with rate limit handling
   */
  private async makeGitHubRequest(url: string): Promise<any> {
    // Check rate limit before making request
    if (this.rateLimit && this.rateLimit.remaining === 0) {
      const resetTime = this.rateLimit.reset * 1000
      const now = Date.now()
      if (now < resetTime) {
        const waitTime = resetTime - now
        console.log(`Rate limit exceeded. Waiting ${Math.ceil(waitTime / 1000)}s...`)
        await new Promise((resolve) => setTimeout(resolve, waitTime))
      }
    }

    return retryWithBackoff(
      async () => {
        const headers: Record<string, string> = {
          Accept: 'application/vnd.github.v3+json',
          'User-Agent': 'PayloadCMS-Block-Analyzer',
        }

        if (this.config.token) {
          headers.Authorization = `Bearer ${this.config.token}`
        }

        const response = await fetch(url, { headers })

        // Update rate limit info
        this.updateRateLimit(response.headers)

        if (!response.ok) {
          if (response.status === 403) {
            const rateLimitRemaining = response.headers.get('x-ratelimit-remaining')
            if (rateLimitRemaining === '0') {
              throw new Error('GitHub API rate limit exceeded')
            }
          }
          throw new Error(`GitHub API error: ${response.status} ${response.statusText}`)
        }

        return response.json()
      },
      {
        maxRetries: 3,
        initialDelay: 1000,
        maxDelay: 10000,
        backoffFactor: 2,
      },
    )
  }

  /**
   * Update rate limit information from response headers
   */
  private updateRateLimit(headers: Headers): void {
    const limit = headers.get('x-ratelimit-limit')
    const remaining = headers.get('x-ratelimit-remaining')
    const reset = headers.get('x-ratelimit-reset')

    if (limit && remaining && reset) {
      this.rateLimit = {
        limit: parseInt(limit, 10),
        remaining: parseInt(remaining, 10),
        reset: parseInt(reset, 10),
      }
    }
  }

  /**
   * Parse block configuration from TypeScript source
   */
  private async parseBlockConfig(
    source: string,
    blockName: string,
    repoSource: 'payloadcms/website' | 'payloadcms/public-demo',
  ): Promise<OfficialPattern | null> {
    try {
      // Extract block configuration object
      // This is a simplified parser - in production, use TypeScript compiler API
      const blockMatch = source.match(
        /export\s+const\s+\w+\s*:\s*Block\s*=\s*({[\s\S]*?})\s*(?:export|$)/m,
      )

      if (!blockMatch) {
        return null
      }

      // Extract slug
      const slugMatch = source.match(/slug:\s*['"]([^'"]+)['"]/m)
      const slug = slugMatch?.[1] || blockName

      // Extract features (simplified detection)
      const features: string[] = []

      if (source.includes('validate:')) features.push('custom-validation')
      if (source.includes('hooks:')) features.push('hooks')
      if (source.includes('access:')) features.push('access-control')
      if (source.includes('admin:')) features.push('admin-config')
      if (source.includes('condition:')) features.push('conditional-fields')
      if (source.includes("type: 'array'")) features.push('array-fields')
      if (source.includes("type: 'group'")) features.push('group-fields')
      if (source.includes("type: 'blocks'")) features.push('nested-blocks')
      if (source.includes("type: 'relationship'")) features.push('relationships')
      if (source.includes("type: 'upload'")) features.push('uploads')
      if (source.includes('interfaceName:')) features.push('typescript-interface')

      // Create a simplified Block object
      // In production, this should use proper TypeScript parsing
      const block: Block = {
        slug,
        fields: [], // Would be extracted with proper parsing
      }

      return {
        source: repoSource,
        blockSlug: slug,
        config: block,
        features,
      }
    } catch (error) {
      console.warn(`Failed to parse block config for ${blockName}:`, error)
      return null
    }
  }

  /**
   * Get cached patterns if available and not expired
   */
  private async getCachedPatterns(cacheKey: string): Promise<OfficialPattern[] | null> {
    try {
      const cacheFile = path.join(this.config.cacheDir, `${cacheKey}.json`)
      const stats = await fs.stat(cacheFile)

      // Check if cache is expired
      const age = Date.now() - stats.mtimeMs
      if (age > this.config.cacheTTL) {
        return null
      }

      const content = await fs.readFile(cacheFile, 'utf-8')
      return JSON.parse(content)
    } catch (error) {
      // Cache doesn't exist or is invalid
      return null
    }
  }

  /**
   * Cache patterns to disk
   */
  private async cachePatterns(cacheKey: string, patterns: OfficialPattern[]): Promise<void> {
    try {
      // Ensure cache directory exists
      await fs.mkdir(this.config.cacheDir, { recursive: true })

      const cacheFile = path.join(this.config.cacheDir, `${cacheKey}.json`)
      await fs.writeFile(cacheFile, JSON.stringify(patterns, null, 2), 'utf-8')
    } catch (error) {
      console.warn('Failed to cache patterns:', error)
    }
  }

  /**
   * Get current rate limit status
   */
  getRateLimit(): GitHubRateLimit | null {
    return this.rateLimit
  }

  /**
   * Clear all cached patterns
   */
  async clearCache(): Promise<void> {
    try {
      await fs.rm(this.config.cacheDir, { recursive: true, force: true })
    } catch (error) {
      console.warn('Failed to clear cache:', error)
    }
  }
}
