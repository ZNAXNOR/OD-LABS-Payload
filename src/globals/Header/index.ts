import type { GlobalConfig } from 'payload'
import { globalTemplates } from '../templates'
import { access } from './access'
import { fields } from './fields'
import { hooks } from './hooks'

export const Header: GlobalConfig = globalTemplates.createNavigationGlobal({
  slug: 'header',
  label: 'Header',
  fields,
  access,
  hooks,
  admin: {
    description: 'Configure the site header navigation and branding',
  },
})
