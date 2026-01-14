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
import { Pages } from './collections/Pages'
import { BlogPages } from './collections/Blogs'
import { ServicesPages } from './collections/Services'
import { LegalPages } from './collections/Legal'
import { ContactPages } from './collections/Contacts'

// Globals
import { Header } from './globals/Header/config'
import { Footer } from './globals/Footer/config'
import { ContactGlobal } from './globals/Contact/config'

// Utilities
import { validateEnv, isDevelopment, isProduction } from './utilities/validateEnv'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

dotenv.config({
  path: path.resolve(dirname, '../.env'),
})

// Validate environment variables
validateEnv()

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
  graphQL: {
    // Query depth limiting for security
    maxComplexity: 1000, // Maximum query complexity score
    disablePlaygroundInProduction: isProduction(), // Disable GraphQL playground in production
  },
  // Global initialization with logging
  onInit: async (payload) => {
    const env = isProduction() ? 'production' : isDevelopment() ? 'development' : 'unknown'
    payload.logger.info(`Payload CMS initialized in ${env} mode`)
    payload.logger.info('GraphQL max complexity: 1000')
    payload.logger.info(`GraphQL playground disabled: ${isProduction()}`)

    // Log configuration warnings in development
    if (isDevelopment()) {
      payload.logger.info('Running in development mode - additional logging enabled')
    }

    // Note: Rate limiting should be implemented at infrastructure level (nginx, API gateway, etc.)
  },
})
