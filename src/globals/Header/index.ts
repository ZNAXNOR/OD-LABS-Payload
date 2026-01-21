import type { GlobalConfig } from 'payload'
import { globalTemplates } from '../templates'
import { fields } from './fields'
import { hooks } from './hooks'
import { access } from './access'

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
