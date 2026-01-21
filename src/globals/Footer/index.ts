import type { GlobalConfig } from 'payload'
import { globalTemplates } from '../templates'
import { fields } from './fields'
import { hooks } from './hooks'
import { access } from './access'

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
