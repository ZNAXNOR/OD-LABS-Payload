import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import dotenv from 'dotenv'
import path from 'path'
import { buildConfig } from 'payload'
import sharp from 'sharp'
import { fileURLToPath } from 'url'

// Plugins
import { plugins } from './plugins'

// Collections - organized by type
import { Media } from './collections/Media'
import { SocialMedia } from './collections/SocialMedia'
import { Users } from './collections/Users'

// Page Collections - organized by content type
import { BlogPages } from './pages/Blogs'
import { ContactPages } from './pages/Contacts'
import { LegalPages } from './pages/Legal'
import { Pages } from './pages/Pages'
import { ServicesPages } from './pages/Services'

// Globals - organized by functionality
import { ContactGlobal } from './globals/Contact'
import { Footer } from './globals/Footer'
import { Header } from './globals/Header'

// Utilities
import { isDevelopment, isProduction, validateEnv } from './utilities/validateEnv'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

dotenv.config({
  path: path.resolve(dirname, '../.env'),
})

// Validate environment variables
validateEnv()

// Development validation integration
// const devValidation = createDevValidationIntegration({
//   enabled: isDevelopment(),
//   showInBrowser: true,
//   validateOnChange: true,
//   debounceDelay: 500,
// })

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname, '..'),
    },
    // Consistent admin configuration
    meta: {
      titleSuffix: '- Admin',
    },
  },
  // Collections organized by type and purpose
  collections: [
    // Core collections
    Users,
    Media,
    SocialMedia,
    // Content collections
    Pages,
    BlogPages,
    ServicesPages,
    LegalPages,
    ContactPages,
  ],
  // Globals organized by functionality
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
    // Consistent database configuration
    migrationDir: path.resolve(dirname, 'migrations'),
    push: isDevelopment(), // Enable auto-push in development, disable in production
  }),
  sharp,
  plugins,
  // Consistent GraphQL configuration
  graphQL: {
    maxComplexity: 1000, // Maximum query complexity score
    disablePlaygroundInProduction: isProduction(), // Disable GraphQL playground in production
    schemaOutputFile: path.resolve(dirname, 'generated-schema.graphql'),
  },
  // Consistent CORS configuration
  cors: [
    process.env.PAYLOAD_PUBLIC_SERVER_URL || 'http://localhost:3000',
    ...(process.env.ALLOWED_ORIGINS?.split(',') || []),
  ].filter(Boolean),
  // Consistent CSRF configuration
  csrf: [
    process.env.PAYLOAD_PUBLIC_SERVER_URL || 'http://localhost:3000',
    ...(process.env.ALLOWED_ORIGINS?.split(',') || []),
  ].filter(Boolean),
  // Global initialization with consistent logging
  onInit: async (payload) => {
    const env = isProduction() ? 'production' : isDevelopment() ? 'development' : 'unknown'
    payload.logger.info(`Payload CMS initialized in ${env} mode`)
    payload.logger.info(`Collections: ${payload.config.collections?.length || 0}`)
    payload.logger.info(`Globals: ${payload.config.globals?.length || 0}`)
    payload.logger.info(
      `GraphQL max complexity: ${payload.config.graphQL?.maxComplexity || 'default'}`,
    )
    payload.logger.info(`GraphQL playground disabled: ${isProduction()}`)

    // Log configuration warnings in development
    if (isDevelopment()) {
      payload.logger.info('Running in development mode - additional logging enabled')

      // Validate required environment variables
      const requiredEnvVars = ['DATABASE_URL', 'PAYLOAD_SECRET']
      const missingVars = requiredEnvVars.filter((varName) => !process.env[varName])

      if (missingVars.length > 0) {
        payload.logger.warn(`Missing environment variables: ${missingVars.join(', ')}`)
      }

      // Initialize development validation
      // devValidation.onInit(payload)
    }

    // Production-specific initialization
    if (isProduction()) {
      payload.logger.info('Production mode - enhanced security enabled')
    }
  },
})
