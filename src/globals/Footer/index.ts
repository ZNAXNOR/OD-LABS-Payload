import type { GlobalConfig } from 'payload'
import { globalTemplates } from '../templates'
import { access } from './access'
import { fields } from './fields'
import { hooks } from './hooks'

export const Footer: GlobalConfig = globalTemplates.createNavigationGlobal({
  slug: 'footer',
  label: 'Footer',
  fields,
  access,
  hooks,
  admin: {
    description: 'Configure the site footer navigation and content',
  },
})
