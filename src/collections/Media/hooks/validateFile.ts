import type { BeforeValidateHook } from 'payload'

export const validateFile: BeforeValidateHook = ({ req }) => {
  const file = req.file
  if (file) {
    const allowedMimeTypes = [
      'image/png',
      'image/jpeg',
      'image/webp',
      'image/gif',
      'image/svg+xml',
    ]
    const maxFileSize = 5 * 1024 * 1024 // 5MB

    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new Error(
        `Invalid file type: ${file.mimetype}. Only PNG, JPEG, WEBP, GIF, and SVG files are allowed.`,
      )
    }

    if (file.size > maxFileSize) {
      throw new Error(`File size cannot exceed 5MB.`)
    }
  }
}
