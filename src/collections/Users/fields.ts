import type { Field } from 'payload'
import { specializedFields } from '../fields'

export const fields: Field[] = [
  // Email added by default
  specializedFields.user.firstName,
  specializedFields.user.lastName,
  specializedFields.user.roles,
  specializedFields.user.lastLoginAt,
  specializedFields.user.loginAttempts,
  specializedFields.user.lockUntil,
]
