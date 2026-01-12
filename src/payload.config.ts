import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'
import dotenv from 'dotenv'

// Plugins
import { plugins } from './plugins'

// Collections
import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Categories } from './collections/Categories'

// Pages
import { Pages } from './pages/Pages'
import { BlogPages } from './pages/Blogs'
import { ServicesPages } from './pages/Services'
import { LegalPages } from './pages/Legal'
import { ContactPages } from './pages/Contacts'

// Globals
import { Header } from './globals/Header/config'
import { Footer } from './globals/Footer/config'
import { ContactGlobal } from './globals/Contact/config'
import { defaultLexical } from './fields/defaultLexical'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

dotenv.config({
  path: path.resolve(dirname, '../.env'),
})

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname, '..'),
    },
    dashboard: {
      widgets: [
        {
          slug: 'viewsChart',
          ComponentPath: 'payload-dashboard-analytics/ui#GlobalViewsChart',
          minWidth: 'full',
        },
        // {
        //   slug: 'topPages',
        //   ComponentPath: 'payload-dashboard-analytics/ui#TopPages',
        //   minWidth: 'full',
        // },
        {
          slug: 'infrastructure',
          ComponentPath: 'src/components/DashboardCollections#DashboardCollections',
          minWidth: 'full',
        },
        {
          slug: 'pages',
          ComponentPath: 'src/components/DashboardCollections#DashboardCollections',
          minWidth: 'full',
        },
        {
          slug: 'globals',
          ComponentPath: 'src/components/DashboardCollections#DashboardCollections',
          minWidth: 'full',
        },
      ],
      defaultLayout: [
        {
          widgetSlug: 'viewsChart',
          width: 'full',
        },
        // {
        //   widgetSlug: 'topPages',
        //   width: 'full',
        // },
        {
          widgetSlug: 'infrastructure',
          width: 'full',
        },
        {
          widgetSlug: 'pages',
          width: 'full',
        },
        {
          widgetSlug: 'globals',
          width: 'full',
        },
      ],
    },
  },
  collections: [
    Users,
    Media,
    Categories,
    Pages,
    BlogPages,
    ServicesPages,
    LegalPages,
    ContactPages,
  ],
  globals: [Header, Footer, ContactGlobal],
  editor: defaultLexical,
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
  }),
  sharp,
  plugins,
})
