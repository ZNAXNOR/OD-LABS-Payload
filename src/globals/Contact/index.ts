import type { GlobalConfig } from 'payload'
import { globalTemplates } from '../templates'
import { fields } from './fields'
import { hooks } from './hooks'
import { access } from './access'

export const ContactGlobal: GlobalConfig = globalTemplates.createSettingsGlobal({
  slug: 'contact',
  label: 'Contact Information',
  fields,
  access,
  hooks,
  admin: {
    description: 'Configure global contact information and social media',
  },
})
