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
  },
  collections: [Users, Media, Pages, BlogPages, ServicesPages, LegalPages, ContactPages],
  globals: [Header, Footer, ContactGlobal],
  editor: lexicalEditor(),
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
