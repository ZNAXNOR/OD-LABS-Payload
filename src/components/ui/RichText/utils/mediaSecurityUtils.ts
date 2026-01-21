/**
 * Media security utilities for RichText components
 * Provides comprehensive security validation for media content
 */

import { sanitizeUrl, sanitizeText } from './contentSanitization'

// Media security configuration
export interface MediaSecurityConfig {
  // File type restrictions
  allowedImageTypes?: string[]
  allowedVideoTypes?: string[]
  allowedAudioTypes?: string[]
  blockedFileTypes?: string[]

  // Size restrictions
  maxImageSize?: number // in bytes
  maxVideoSize?: number
  maxAudioSize?: number
  maxFileSize?: number

  // Dimension restrictions
  maxImageWidth?: number
  maxImageHeight?: number
  maxVideoWidth?: number
  maxVideoHeight?: number

  // Source validation
  allowedDomains?: string[]
  blockedDomains?: string[]
  requireHttps?: boolean
  allowDataUris?: boolean
  allowBlobUrls?: boolean

  // Content validation
  validateImageHeaders?: boolean
  scanForMalware?: boolean
  checkFileSignatures?: boolean

  // Security features
  enableCSP?: boolean
  enableSandboxing?: boolean
  stripMetadata?: boolean

  // Logging and monitoring
  logSecurityEvents?: boolean
  blockOnThreat?: boolean
}

// Default media security configuration
export const DEFAULT_MEDIA_SECURITY_CONFIG: MediaSecurityConfig = {
  allowedImageTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'],
  allowedVideoTypes: ['video/mp4', 'video/webm', 'video/ogg'],
  allowedAudioTypes: ['audio/mp3', 'audio/wav', 'audio/ogg', 'audio/aac'],
  blockedFileTypes: [
    'application/x-executable',
    'application/x-msdownload',
    'application/x-msdos-program',
  ],

  maxImageSize: 10 * 1024 * 1024, // 10MB
  maxVideoSize: 100 * 1024 * 1024, // 100MB
  maxAudioSize: 50 * 1024 * 1024, // 50MB
  maxFileSize: 100 * 1024 * 1024, // 100MB

  maxImageWidth: 4096,
  maxImageHeight: 4096,
  maxVideoWidth: 1920,
  maxVideoHeight: 1080,

  allowedDomains: [],
  blockedDomains: [],
  requireHttps: false,
  allowDataUris: true,
  allowBlobUrls: true,

  validateImageHeaders: true,
  scanForMalware: false,
  checkFileSignatures: true,

  enableCSP: true,
  enableSandboxing: true,
  stripMetadata: false,

  logSecurityEvents: true,
  blockOnThreat: true,
}

// Strict media security configuration
export const STRICT_MEDIA_SECURITY_CONFIG: MediaSecurityConfig = {
  ...DEFAULT_MEDIA_SECURITY_CONFIG,
  allowedImageTypes: ['image/jpeg', 'image/png', 'image/webp'],
  allowedVideoTypes: ['video/mp4'],
  allowedAudioTypes: ['audio/mp3'],

  maxImageSize: 5 * 1024 * 1024, // 5MB
  maxVideoSize: 50 * 1024 * 1024, // 50MB
  maxAudioSize: 25 * 1024 * 1024, // 25MB

  requireHttps: true,
  allowDataUris: false,
  allowBlobUrls: false,

  validateImageHeaders: true,
  checkFileSignatures: true,
  stripMetadata: true,

  blockOnThreat: true,
}

// Media security assessment result
export interface MediaSecurityAssessment {
  isSecure: boolean
  threatLevel: 'none' | 'low' | 'medium' | 'high' | 'critical'
  threats: Array<{
    type: string
    severity: 'low' | 'medium' | 'high' | 'critical'
    description: string
    recommendation: string
  }>
  sanitizedSrc?: string
  blockedReasons: string[]
  warnings: string[]
  metadata?: {
    fileType?: string
    fileSize?: number
    dimensions?: { width: number; height: number }
    duration?: number
  }
}

// File signature patterns for validation
const FILE_SIGNATURES = {
  // Images
  'image/jpeg': [
    [0xff, 0xd8, 0xff], // JPEG
  ],
  'image/png': [
    [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a], // PNG
  ],
  'image/gif': [
    [0x47, 0x49, 0x46, 0x38, 0x37, 0x61], // GIF87a
    [0x47, 0x49, 0x46, 0x38, 0x39, 0x61], // GIF89a
  ],
  'image/webp': [
    [0x52, 0x49, 0x46, 0x46, null, null, null, null, 0x57, 0x45, 0x42, 0x50], // RIFF...WEBP
  ],

  // Videos
  'video/mp4': [
    [null, null, null, null, 0x66, 0x74, 0x79, 0x70], // ....ftyp
  ],
  'video/webm': [
    [0x1a, 0x45, 0xdf, 0xa3], // WebM
  ],

  // Audio
  'audio/mp3': [
    [0x49, 0x44, 0x33], // ID3
    [0xff, 0xfb], // MP3 frame header
  ],
  'audio/wav': [
    [0x52, 0x49, 0x46, 0x46, null, null, null, null, 0x57, 0x41, 0x56, 0x45], // RIFF...WAVE
  ],
}

// Dangerous file signatures to block
const DANGEROUS_SIGNATURES = [
  [0x4d, 0x5a], // PE executable (MZ)
  [0x50, 0x4b, 0x03, 0x04], // ZIP (could contain executables)
  [0x50, 0x4b, 0x05, 0x06], // ZIP empty
  [0x50, 0x4b, 0x07, 0x08], // ZIP spanned
  [0x7f, 0x45, 0x4c, 0x46], // ELF executable
  [0xca, 0xfe, 0xba, 0xbe], // Mach-O executable
]

/**
 * Validate file signature against expected type
 */
export const validateFileSignature = (
  buffer: ArrayBuffer,
  expectedType: string,
): { isValid: boolean; detectedType?: string; confidence: number } => {
  const bytes = new Uint8Array(buffer.slice(0, 16)) // Check first 16 bytes

  // Check for dangerous signatures first
  for (const signature of DANGEROUS_SIGNATURES) {
    if (matchesSignature(bytes, signature)) {
      return {
        isValid: false,
        detectedType: 'executable',
        confidence: 0.9,
      }
    }
  }

  // Check expected type
  const expectedSignatures = FILE_SIGNATURES[expectedType as keyof typeof FILE_SIGNATURES]
  if (expectedSignatures) {
    for (const signature of expectedSignatures) {
      if (matchesSignature(bytes, signature)) {
        return {
          isValid: true,
          detectedType: expectedType,
          confidence: 0.95,
        }
      }
    }
  }

  // Check all known signatures to detect actual type
  for (const [type, signatures] of Object.entries(FILE_SIGNATURES)) {
    for (const signature of signatures) {
      if (matchesSignature(bytes, signature)) {
        return {
          isValid: type === expectedType,
          detectedType: type,
          confidence: 0.8,
        }
      }
    }
  }

  return {
    isValid: false,
    confidence: 0.1,
  }
}

/**
 * Check if bytes match a signature pattern
 */
const matchesSignature = (bytes: Uint8Array, signature: (number | null)[]): boolean => {
  if (bytes.length < signature.length) return false

  for (let i = 0; i < signature.length; i++) {
    if (signature[i] !== null && bytes[i] !== signature[i]) {
      return false
    }
  }

  return true
}

/**
 * Assess media URL security
 */
export const assessMediaUrlSecurity = async (
  src: string,
  mediaType: 'image' | 'video' | 'audio' | 'file',
  config: MediaSecurityConfig = DEFAULT_MEDIA_SECURITY_CONFIG,
): Promise<MediaSecurityAssessment> => {
  const threats: MediaSecurityAssessment['threats'] = []
  const warnings: string[] = []
  const blockedReasons: string[] = []
  let threatLevel: MediaSecurityAssessment['threatLevel'] = 'none'

  if (!src || typeof src !== 'string') {
    return {
      isSecure: false,
      threatLevel: 'high',
      threats: [
        {
          type: 'invalid_src',
          severity: 'high',
          description: 'Invalid or empty media source',
          recommendation: 'Provide a valid media URL',
        },
      ],
      blockedReasons: ['Invalid source'],
      warnings: [],
    }
  }

  // Handle data URIs
  if (src.startsWith('data:')) {
    if (!config.allowDataUris) {
      threats.push({
        type: 'data_uri_blocked',
        severity: 'medium',
        description: 'Data URIs are not allowed',
        recommendation: 'Use external media URLs instead',
      })
      threatLevel = 'medium'
      blockedReasons.push('Data URIs blocked')
    } else {
      // Validate data URI format and content
      const dataUriMatch = src.match(/^data:([^;]+);base64,(.+)$/)
      if (!dataUriMatch) {
        threats.push({
          type: 'invalid_data_uri',
          severity: 'high',
          description: 'Invalid data URI format',
          recommendation: 'Use properly formatted data URIs',
        })
        threatLevel = 'high'
        blockedReasons.push('Invalid data URI')
      } else {
        const [, mimeType, base64Data] = dataUriMatch

        // Check MIME type
        const allowedTypes = getAllowedTypes(mediaType, config)
        if (mimeType && !allowedTypes.includes(mimeType)) {
          threats.push({
            type: 'disallowed_mime_type',
            severity: 'medium',
            description: `MIME type not allowed: ${mimeType}`,
            recommendation: 'Use allowed media types',
          })
          if (threatLevel === 'none') threatLevel = 'medium'
          warnings.push('Disallowed MIME type')
        }

        // Check data size
        if (base64Data) {
          const dataSize = (base64Data.length * 3) / 4 // Approximate decoded size
          const maxSize = getMaxSize(mediaType, config)
          if (maxSize && dataSize > maxSize) {
            threats.push({
              type: 'excessive_size',
              severity: 'low',
              description: `Data URI size exceeds limit (${dataSize}/${maxSize} bytes)`,
              recommendation: 'Use smaller media files or external URLs',
            })
            if (threatLevel === 'none') threatLevel = 'low'
            warnings.push('Large data URI')
          }
        }
      } // Close the else block for dataUriMatch
    } // Close the else block for config.allowDataUris

    return {
      isSecure: threats.length === 0,
      threatLevel,
      threats,
      sanitizedSrc: threats.length === 0 ? src : undefined,
      blockedReasons,
      warnings,
    }
  }

  // Handle blob URLs
  if (src.startsWith('blob:')) {
    if (!config.allowBlobUrls) {
      threats.push({
        type: 'blob_url_blocked',
        severity: 'medium',
        description: 'Blob URLs are not allowed',
        recommendation: 'Use external media URLs instead',
      })
      threatLevel = 'medium'
      blockedReasons.push('Blob URLs blocked')
    }

    return {
      isSecure: threats.length === 0,
      threatLevel,
      threats,
      sanitizedSrc: threats.length === 0 ? src : undefined,
      blockedReasons,
      warnings,
    }
  }

  // Validate and sanitize URL
  const sanitizedUrl = sanitizeUrl(src, ['https', 'http'])
  if (!sanitizedUrl) {
    threats.push({
      type: 'invalid_url',
      severity: 'high',
      description: 'Invalid or dangerous URL',
      recommendation: 'Use a valid, safe URL',
    })
    threatLevel = 'high'
    blockedReasons.push('Invalid URL')
  }

  try {
    const url = new URL(sanitizedUrl || src)

    // HTTPS requirement
    if (config.requireHttps && url.protocol !== 'https:') {
      threats.push({
        type: 'insecure_protocol',
        severity: 'medium',
        description: 'Non-HTTPS protocol used for media',
        recommendation: 'Use HTTPS URLs for secure media delivery',
      })
      if (threatLevel === 'none') threatLevel = 'medium'
      warnings.push('Non-HTTPS media URL')
    }

    // Domain validation
    const hostname = url.hostname.toLowerCase()

    if (config.blockedDomains?.some((domain) => hostname.endsWith(domain.toLowerCase()))) {
      threats.push({
        type: 'blocked_domain',
        severity: 'high',
        description: `Media domain is blocked: ${hostname}`,
        recommendation: 'Use an allowed domain for media',
      })
      if (threatLevel === 'none' || threatLevel === 'medium') threatLevel = 'high'
      blockedReasons.push('Blocked domain')
    }

    if (
      config.allowedDomains?.length &&
      !config.allowedDomains.some((domain) => hostname.endsWith(domain.toLowerCase()))
    ) {
      threats.push({
        type: 'domain_not_allowed',
        severity: 'medium',
        description: `Media domain not in allowed list: ${hostname}`,
        recommendation: 'Use an allowed domain for media',
      })
      if (threatLevel === 'none') threatLevel = 'medium'
      blockedReasons.push('Domain not allowed')
    }

    // Check for suspicious patterns in URL
    if (url.pathname.includes('..') || url.pathname.includes('%2e%2e')) {
      threats.push({
        type: 'path_traversal',
        severity: 'high',
        description: 'URL contains path traversal patterns',
        recommendation: 'Use clean, direct media URLs',
      })
      if (threatLevel === 'none' || threatLevel === 'medium') threatLevel = 'high'
      blockedReasons.push('Path traversal detected')
    }
  } catch (error) {
    threats.push({
      type: 'url_parse_error',
      severity: 'medium',
      description: 'Failed to parse media URL',
      recommendation: 'Check URL format and syntax',
    })
    if (threatLevel === 'none') threatLevel = 'medium'
    warnings.push('URL parsing failed')
  }

  return {
    isSecure: threats.length === 0 || (threatLevel === 'none' && !config.blockOnThreat),
    threatLevel,
    threats,
    sanitizedSrc: sanitizedUrl,
    blockedReasons,
    warnings,
  }
}

/**
 * Validate media file content
 */
export const validateMediaFile = async (
  file: File | ArrayBuffer,
  expectedType: string,
  config: MediaSecurityConfig = DEFAULT_MEDIA_SECURITY_CONFIG,
): Promise<MediaSecurityAssessment> => {
  const threats: MediaSecurityAssessment['threats'] = []
  const warnings: string[] = []
  const blockedReasons: string[] = []
  let threatLevel: MediaSecurityAssessment['threatLevel'] = 'none'

  let buffer: ArrayBuffer
  let fileSize: number

  if (file instanceof File) {
    buffer = await file.arrayBuffer()
    fileSize = file.size
  } else {
    buffer = file
    fileSize = buffer.byteLength
  }

  // Check file size
  const maxSize = getMaxSizeForType(expectedType, config)
  if (maxSize && fileSize > maxSize) {
    threats.push({
      type: 'excessive_file_size',
      severity: 'medium',
      description: `File size exceeds limit (${fileSize}/${maxSize} bytes)`,
      recommendation: 'Use smaller media files',
    })
    if (threatLevel === 'none') threatLevel = 'medium'
    warnings.push('Large file size')
  }

  // Validate file signature
  if (config.checkFileSignatures) {
    const signatureValidation = validateFileSignature(buffer, expectedType)

    if (!signatureValidation.isValid) {
      if (signatureValidation.detectedType === 'executable') {
        threats.push({
          type: 'executable_file',
          severity: 'critical',
          description: 'File appears to be an executable',
          recommendation: 'Do not upload executable files',
        })
        threatLevel = 'critical'
        blockedReasons.push('Executable file detected')
      } else if (signatureValidation.detectedType) {
        threats.push({
          type: 'type_mismatch',
          severity: 'medium',
          description: `File type mismatch: expected ${expectedType}, detected ${signatureValidation.detectedType}`,
          recommendation: 'Ensure file type matches the expected format',
        })
        if (threatLevel === 'none') threatLevel = 'medium'
        warnings.push('File type mismatch')
      } else {
        threats.push({
          type: 'unknown_file_type',
          severity: 'low',
          description: 'Could not determine file type from signature',
          recommendation: 'Verify file is a valid media file',
        })
        if (threatLevel === 'none') threatLevel = 'low'
        warnings.push('Unknown file type')
      }
    }
  }

  // Check for embedded scripts in SVG files
  if (expectedType === 'image/svg+xml') {
    const svgContent = new TextDecoder().decode(buffer)

    if (svgContent.includes('<script') || svgContent.includes('javascript:')) {
      threats.push({
        type: 'svg_script_injection',
        severity: 'high',
        description: 'SVG contains embedded scripts',
        recommendation: 'Remove scripts from SVG files or use rasterized images',
      })
      if (threatLevel === 'none' || threatLevel === 'low' || threatLevel === 'medium')
        threatLevel = 'high'
      blockedReasons.push('SVG script injection')
    }

    if (svgContent.includes('xlink:href') && svgContent.includes('data:')) {
      threats.push({
        type: 'svg_data_uri',
        severity: 'medium',
        description: 'SVG contains data URIs',
        recommendation: 'Review data URIs in SVG for security',
      })
      if (threatLevel === 'none') threatLevel = 'medium'
      warnings.push('SVG data URIs')
    }
  }

  // Additional validation for image files
  if (expectedType.startsWith('image/') && config.validateImageHeaders) {
    try {
      // Basic image dimension validation would go here
      // This is a simplified check - in practice, you'd use a proper image library
      const metadata = await extractImageMetadata(buffer, expectedType)

      if (metadata.width && metadata.height) {
        if (config.maxImageWidth && metadata.width > config.maxImageWidth) {
          threats.push({
            type: 'excessive_width',
            severity: 'low',
            description: `Image width exceeds limit (${metadata.width}/${config.maxImageWidth}px)`,
            recommendation: 'Resize image to acceptable dimensions',
          })
          if (threatLevel === 'none') threatLevel = 'low'
          warnings.push('Large image width')
        }

        if (config.maxImageHeight && metadata.height > config.maxImageHeight) {
          threats.push({
            type: 'excessive_height',
            severity: 'low',
            description: `Image height exceeds limit (${metadata.height}/${config.maxImageHeight}px)`,
            recommendation: 'Resize image to acceptable dimensions',
          })
          if (threatLevel === 'none') threatLevel = 'low'
          warnings.push('Large image height')
        }
      }
    } catch (error) {
      warnings.push('Could not extract image metadata')
    }
  }

  return {
    isSecure: threats.length === 0 || (threatLevel === 'none' && !config.blockOnThreat),
    threatLevel,
    threats,
    blockedReasons,
    warnings,
    metadata: {
      fileType: expectedType,
      fileSize,
    },
  }
}

/**
 * Generate secure media attributes
 */
export const generateSecureMediaAttributes = (
  mediaType: 'img' | 'video' | 'audio',
  src: string,
  config: MediaSecurityConfig = DEFAULT_MEDIA_SECURITY_CONFIG,
): Record<string, any> => {
  const attrs: Record<string, any> = {}

  // Basic security attributes
  if (config.enableCSP) {
    attrs['data-csp-protected'] = 'true'
  }

  // Sandboxing for iframes (if applicable)
  if (config.enableSandboxing && mediaType === 'video') {
    attrs.sandbox = 'allow-scripts allow-same-origin'
  }

  // Referrer policy for privacy
  attrs.referrerPolicy = 'no-referrer-when-downgrade'

  // Loading strategy
  attrs.loading = 'lazy'
  attrs.decoding = 'async'

  // Security headers
  if (src.startsWith('https://')) {
    attrs.crossOrigin = 'anonymous'
  }

  // Media-specific attributes
  switch (mediaType) {
    case 'img':
      attrs.alt = attrs.alt || '' // Ensure alt text exists
      break
    case 'video':
      attrs.controls = true
      attrs.preload = 'metadata'
      // Disable autoplay for security and UX
      attrs.autoPlay = false
      break
    case 'audio':
      attrs.controls = true
      attrs.preload = 'metadata'
      attrs.autoPlay = false
      break
  }

  return attrs
}

/**
 * Sanitize media alt text and captions
 */
export const sanitizeMediaText = (text: string): string => {
  return sanitizeText(text, 200) // Limit to 200 characters
}

/**
 * Helper functions
 */
const getAllowedTypes = (mediaType: string, config: MediaSecurityConfig): string[] => {
  switch (mediaType) {
    case 'image':
      return config.allowedImageTypes || []
    case 'video':
      return config.allowedVideoTypes || []
    case 'audio':
      return config.allowedAudioTypes || []
    default:
      return []
  }
}

const getMaxSize = (mediaType: string, config: MediaSecurityConfig): number | undefined => {
  switch (mediaType) {
    case 'image':
      return config.maxImageSize
    case 'video':
      return config.maxVideoSize
    case 'audio':
      return config.maxAudioSize
    default:
      return config.maxFileSize
  }
}

const getMaxSizeForType = (mimeType: string, config: MediaSecurityConfig): number | undefined => {
  if (mimeType.startsWith('image/')) {
    return config.maxImageSize
  } else if (mimeType.startsWith('video/')) {
    return config.maxVideoSize
  } else if (mimeType.startsWith('audio/')) {
    return config.maxAudioSize
  }
  return config.maxFileSize
}

/**
 * Extract basic image metadata (simplified implementation)
 */
const extractImageMetadata = async (
  buffer: ArrayBuffer,
  mimeType: string,
): Promise<{ width?: number; height?: number }> => {
  // This is a simplified implementation
  // In practice, you'd use a proper image parsing library

  const bytes = new Uint8Array(buffer)

  if (mimeType === 'image/png') {
    // PNG: width and height are at bytes 16-23
    if (bytes.length >= 24) {
      const width =
        ((bytes[16] || 0) << 24) |
        ((bytes[17] || 0) << 16) |
        ((bytes[18] || 0) << 8) |
        (bytes[19] || 0)
      const height =
        ((bytes[20] || 0) << 24) |
        ((bytes[21] || 0) << 16) |
        ((bytes[22] || 0) << 8) |
        (bytes[23] || 0)
      return { width, height }
    }
  } else if (mimeType === 'image/jpeg') {
    // JPEG: more complex parsing required
    // This is a very simplified version
    for (let i = 0; i < bytes.length - 8; i++) {
      if (bytes[i] === 0xff && bytes[i + 1] === 0xc0) {
        const height = ((bytes[i + 5] || 0) << 8) | (bytes[i + 6] || 0)
        const width = ((bytes[i + 7] || 0) << 8) | (bytes[i + 8] || 0)
        return { width, height }
      }
    }
  }

  return {}
}

/**
 * Create media security middleware
 */
export const createMediaSecurityMiddleware = (
  config: MediaSecurityConfig = DEFAULT_MEDIA_SECURITY_CONFIG,
) => {
  return async (
    src: string,
    mediaType: 'image' | 'video' | 'audio' | 'file',
  ): Promise<{
    src: string | null
    attributes: Record<string, any>
    warnings: string[]
  }> => {
    const assessment = await assessMediaUrlSecurity(src, mediaType, config)

    if (!assessment.isSecure && config.blockOnThreat) {
      if (config.logSecurityEvents) {
        console.warn('Media blocked by security middleware:', {
          src: src.substring(0, 100),
          mediaType,
          threats: assessment.threats.map((t) => t.type),
          threatLevel: assessment.threatLevel,
        })
      }

      return {
        src: null,
        attributes: {},
        warnings: assessment.warnings,
      }
    }

    const attributes = generateSecureMediaAttributes(
      mediaType as 'img' | 'video' | 'audio',
      assessment.sanitizedSrc || src,
      config,
    )

    return {
      src: assessment.sanitizedSrc || src,
      attributes,
      warnings: assessment.warnings,
    }
  } // End of returned async function
} // End of createMediaSecurityMiddleware function
