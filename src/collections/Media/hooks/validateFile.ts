import type { BeforeValidateHook } from 'payload'

export const validateFile: BeforeValidateHook = ({ req }) => {
  const file = req.file
  if (file) {
    // SVGs are disallowed due to the risk of XSS attacks.
    // They can contain executable JavaScript.
    const allowedMimeTypes = ['image/png', 'image/jpeg', 'image/webp', 'image/gif']
    const maxFileSize = 5 * 1024 * 1024 // 5MB

    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new Error(
        `Invalid file type: ${file.mimetype}. Only PNG, JPEG, WEBP, and GIF files are allowed.`,
      )
    }

    if (file.size > maxFileSize) {
      throw new Error(`File size cannot exceed 5MB.`)
    }
  }
}
