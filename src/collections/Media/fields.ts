import type { Field } from 'payload'
import { specializedFields } from '../fields'

export const fields: Field[] = [
  specializedFields.media.alt,
  specializedFields.media.caption,
  specializedFields.media.focalPoint,
]
