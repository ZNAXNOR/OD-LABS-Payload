import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

class FunctionalityDocumenter {
  constructor() {
    this.projectRoot = process.cwd()
    this.analysisDir = path.join(this.projectRoot, 'restructure-analysis')
    this.functionality = {
      timestamp: new Date().toISOString(),
      collections: {},
      components: {},
      blocks: {},
      utilities: {},
      pages: {},
      globals: {},
      hooks: {},
      access: {},
      fields: {},
      providers: {},
      icons: {},
      workflows: {},
    }
  }

  async run() {
    console.log('📝 Documenting current functionality...')

    try {
      await this.documentPayloadCollections()
      await this.documentComponents()
      await this.documentBlocks()
      await this.documentUtilities()
      await this.documentPages()
      await this.documentGlobals()
      await this.documentHooks()
      await this.documentAccess()
      await this.documentFields()
      await this.documentProviders()
      await this.documentWorkflows()
      await this.generateFunctionalityReport()

      console.log('✅ Functionality documentation completed!')
    } catch (error) {
      console.error('❌ Error during functionality documentation:', error.message)
    }
  }

  async documentPayloadCollections() {
    console.log('📚 Documenting Payload collections...')

    const collectionsDir = path.join(this.projectRoot, 'src', 'collections')
    if (!fs.existsSync(collectionsDir)) return

    const files = fs.readdirSync(collectionsDir)

    for (const file of files) {
      if (file.endsWith('.ts') && !file.includes('.test.')) {
        const filePath = path.join(collectionsDir, file)
        const content = fs.readFileSync(filePath, 'utf8')

        const collectionName = file.replace('.ts', '')
        this.functionality.collections[collectionName] = {
          file: file,
          path: `src/collections/${file}`,
          features: this.extractCollectionFeatures(content),
          fields: this.extractFields(content),
          hooks: this.extractHookReferences(content),
          access: this.extractAccessReferences(content),
          config: this.extractCollectionConfig(content),
        }
      }
    }
  }

  extractCollectionFeatures(content) {
    const features = []

    if (content.includes('auth: true')) features.push('Authentication')
    if (content.includes('upload:')) features.push('File Upload')
    if (content.includes('versions:')) features.push('Versioning')
    if (content.includes('drafts:')) features.push('Drafts')
    if (content.includes('timestamps:')) features.push('Timestamps')
    if (content.includes('admin:')) features.push('Admin Configuration')
    if (content.includes('hooks:')) features.push('Lifecycle Hooks')
    if (content.includes('access:')) features.push('Access Control')

    return features
  }

  extractFields(content) {
    const fields = []
    const fieldRegex = /{\s*name:\s*['"`]([^'"`]+)['"`],\s*type:\s*['"`]([^'"`]+)['"`]/g
    let match

    while ((match = fieldRegex.exec(content)) !== null) {
      fields.push({
        name: match[1],
        type: match[2],
      })
    }

    return fields
  }

  extractHookReferences(content) {
    const hooks = []
    const hookTypes = [
      'beforeValidate',
      'beforeChange',
      'afterChange',
      'beforeRead',
      'afterRead',
      'beforeDelete',
      'afterDelete',
    ]

    hookTypes.forEach((hookType) => {
      if (content.includes(`${hookType}:`)) {
        hooks.push(hookType)
      }
    })

    return hooks
  }

  extractAccessReferences(content) {
    const access = []
    const accessTypes = ['create', 'read', 'update', 'delete', 'admin']

    accessTypes.forEach((accessType) => {
      if (content.includes(`${accessType}:`)) {
        access.push(accessType)
      }
    })

    return access
  }

  extractCollectionConfig(content) {
    const config = {}

    // Extract slug
    const slugMatch = content.match(/slug:\s*['"`]([^'"`]+)['"`]/)
    if (slugMatch) config.slug = slugMatch[1]

    // Extract admin config
    const adminMatch = content.match(/admin:\s*{([^}]+)}/)
    if (adminMatch) {
      const adminConfig = adminMatch[1]
      if (adminConfig.includes('useAsTitle:')) {
        const titleMatch = adminConfig.match(/useAsTitle:\s*['"`]([^'"`]+)['"`]/)
        if (titleMatch) config.useAsTitle = titleMatch[1]
      }
    }

    return config
  }

  async documentComponents() {
    console.log('🧩 Documenting React components...')

    const componentsDir = path.join(this.projectRoot, 'src', 'components')
    if (!fs.existsSync(componentsDir)) return

    this.scanComponentsDirectory(componentsDir, 'src/components')
  }

  scanComponentsDirectory(dir, basePath) {
    const items = fs.readdirSync(dir)

    for (const item of items) {
      const fullPath = path.join(dir, item)
      const stat = fs.statSync(fullPath)

      if (stat.isDirectory()) {
        this.scanComponentsDirectory(fullPath, path.join(basePath, item))
      } else if (item.endsWith('.tsx') || item.endsWith('.ts')) {
        const content = fs.readFileSync(fullPath, 'utf8')
        const relativePath = path.join(basePath, item)

        const componentInfo = {
          file: item,
          path: relativePath,
          type: this.determineComponentType(content, relativePath),
          exports: this.extractExports(content),
          imports: this.extractImports(content),
          hooks: this.extractReactHooks(content),
          props: this.extractProps(content),
          features: this.extractComponentFeatures(content),
        }

        this.functionality.components[relativePath] = componentInfo
      }
    }
  }

  determineComponentType(content, path) {
    if (content.includes("'use client'")) return 'Client Component'
    if (path.includes('/ui/')) return 'UI Component'
    if (path.includes('/blocks/')) return 'Block Component'
    if (path.includes('/layout/')) return 'Layout Component'
    if (path.includes('/forms/')) return 'Form Component'
    if (path.includes('/admin/')) return 'Admin Component'
    if (/export\s+(?:default\s+)?(?:function|const)\s+[A-Z]\w*/.test(content))
      return 'React Component'
    return 'Utility/Helper'
  }

  extractExports(content) {
    const exports = []
    const exportRegex =
      /export\s+(?:default\s+)?(?:const|let|var|function|class|interface|type)\s+(\w+)/g
    let match

    while ((match = exportRegex.exec(content)) !== null) {
      exports.push(match[1])
    }

    return exports
  }

  extractImports(content) {
    const imports = []
    const importRegex =
      /import\s+(?:(?:\{[^}]*\}|\*\s+as\s+\w+|\w+)(?:\s*,\s*(?:\{[^}]*\}|\*\s+as\s+\w+|\w+))*\s+from\s+)?['"`]([^'"`]+)['"`]/g
    let match

    while ((match = importRegex.exec(content)) !== null) {
      imports.push(match[1])
    }

    return imports
  }

  extractReactHooks(content) {
    const hooks = []
    const hookRegex = /(use[A-Z]\w*)\s*\(/g
    let match

    while ((match = hookRegex.exec(content)) !== null) {
      if (!hooks.includes(match[1])) {
        hooks.push(match[1])
      }
    }

    return hooks
  }

  extractProps(content) {
    const props = []

    // Extract interface/type definitions for props
    const propsRegex = /(?:interface|type)\s+(\w*Props)\s*{([^}]+)}/g
    let match

    while ((match = propsRegex.exec(content)) !== null) {
      const propsName = match[1]
      const propsBody = match[2]

      // Extract individual prop names
      const propNames = propsBody.match(/(\w+)(?:\?)?:/g)
      if (propNames) {
        props.push({
          interface: propsName,
          properties: propNames.map((p) => p.replace(/[?:]/g, '')),
        })
      }
    }

    return props
  }

  extractComponentFeatures(content) {
    const features = []

    if (content.includes('useState')) features.push('State Management')
    if (content.includes('useEffect')) features.push('Side Effects')
    if (content.includes('useContext')) features.push('Context Usage')
    if (content.includes('useMemo')) features.push('Memoization')
    if (content.includes('useCallback')) features.push('Callback Optimization')
    if (content.includes('forwardRef')) features.push('Ref Forwarding')
    if (content.includes('memo(')) features.push('Component Memoization')
    if (content.includes('Suspense')) features.push('Suspense Boundary')
    if (content.includes('ErrorBoundary')) features.push('Error Boundary')
    if (content.includes('form')) features.push('Form Handling')
    if (content.includes('onClick') || content.includes('onSubmit')) features.push('Event Handling')

    return features
  }

  async documentBlocks() {
    console.log('🧱 Documenting content blocks...')

    const blocksDir = path.join(this.projectRoot, 'src', 'blocks')
    if (!fs.existsSync(blocksDir)) return

    this.scanBlocksDirectory(blocksDir, 'src/blocks')
  }

  scanBlocksDirectory(dir, basePath) {
    const items = fs.readdirSync(dir)

    for (const item of items) {
      const fullPath = path.join(dir, item)
      const stat = fs.statSync(fullPath)

      if (stat.isDirectory()) {
        this.scanBlocksDirectory(fullPath, path.join(basePath, item))
      } else if (item.endsWith('.ts') || item.endsWith('.tsx')) {
        const content = fs.readFileSync(fullPath, 'utf8')
        const relativePath = path.join(basePath, item)

        const blockInfo = {
          file: item,
          path: relativePath,
          type: this.determineBlockType(content, relativePath),
          config: this.extractBlockConfig(content),
          fields: this.extractFields(content),
          features: this.extractBlockFeatures(content),
        }

        this.functionality.blocks[relativePath] = blockInfo
      }
    }
  }

  determineBlockType(content, path) {
    if (path.includes('/hero/')) return 'Hero Block'
    if (path.includes('/content/')) return 'Content Block'
    if (path.includes('/services/')) return 'Services Block'
    if (path.includes('/portfolio/')) return 'Portfolio Block'
    if (path.includes('/technical/')) return 'Technical Block'
    if (path.includes('/cta/')) return 'Call-to-Action Block'
    if (path.includes('/layout/')) return 'Layout Block'
    if (content.includes('Block')) return 'Content Block'
    if (content.includes('Component')) return 'Block Component'
    return 'Block Configuration'
  }

  extractBlockConfig(content) {
    const config = {}

    // Extract block slug
    const slugMatch = content.match(/slug:\s*['"`]([^'"`]+)['"`]/)
    if (slugMatch) config.slug = slugMatch[1]

    // Extract interface name
    const interfaceMatch = content.match(/interfaceName:\s*['"`]([^'"`]+)['"`]/)
    if (interfaceMatch) config.interfaceName = interfaceMatch[1]

    // Extract labels
    const labelMatch = content.match(/label:\s*['"`]([^'"`]+)['"`]/)
    if (labelMatch) config.label = labelMatch[1]

    return config
  }

  extractBlockFeatures(content) {
    const features = []

    if (content.includes('fields:')) features.push('Custom Fields')
    if (content.includes('admin:')) features.push('Admin Configuration')
    if (content.includes('Component')) features.push('React Component')
    if (content.includes('validate:')) features.push('Validation')
    if (content.includes('condition:')) features.push('Conditional Logic')
    if (content.includes('hooks:')) features.push('Field Hooks')

    return features
  }

  async documentUtilities() {
    console.log('🔧 Documenting utility functions...')

    const utilitiesDir = path.join(this.projectRoot, 'src', 'utilities')
    if (!fs.existsSync(utilitiesDir)) return

    const files = fs.readdirSync(utilitiesDir)

    for (const file of files) {
      if (file.endsWith('.ts') && !file.includes('.test.')) {
        const filePath = path.join(utilitiesDir, file)
        const content = fs.readFileSync(filePath, 'utf8')

        const utilityInfo = {
          file: file,
          path: `src/utilities/${file}`,
          functions: this.extractFunctions(content),
          exports: this.extractExports(content),
          imports: this.extractImports(content),
          purpose: this.determineUtilityPurpose(content, file),
          features: this.extractUtilityFeatures(content),
        }

        this.functionality.utilities[file] = utilityInfo
      }
    }
  }

  extractFunctions(content) {
    const functions = []
    const functionRegex = /(?:export\s+)?(?:async\s+)?function\s+(\w+)\s*\(([^)]*)\)/g
    const arrowFunctionRegex = /(?:export\s+)?const\s+(\w+)\s*=\s*(?:async\s+)?\(([^)]*)\)\s*=>/g

    let match

    // Regular functions
    while ((match = functionRegex.exec(content)) !== null) {
      functions.push({
        name: match[1],
        params: match[2]
          .split(',')
          .map((p) => p.trim())
          .filter((p) => p),
        type: 'function',
      })
    }

    // Arrow functions
    while ((match = arrowFunctionRegex.exec(content)) !== null) {
      functions.push({
        name: match[1],
        params: match[2]
          .split(',')
          .map((p) => p.trim())
          .filter((p) => p),
        type: 'arrow function',
      })
    }

    return functions
  }

  determineUtilityPurpose(content, filename) {
    const name = filename.toLowerCase()

    if (name.includes('validation')) return 'Validation'
    if (name.includes('format')) return 'Formatting'
    if (name.includes('api')) return 'API Utilities'
    if (name.includes('media')) return 'Media Handling'
    if (name.includes('slug')) return 'Slug Generation'
    if (name.includes('error')) return 'Error Handling'
    if (name.includes('auth')) return 'Authentication'
    if (name.includes('access')) return 'Access Control'
    if (name.includes('revalidat')) return 'Cache Revalidation'
    if (name.includes('graphql')) return 'GraphQL Utilities'
    if (name.includes('ui')) return 'UI Utilities'

    return 'General Utilities'
  }

  extractUtilityFeatures(content) {
    const features = []

    if (content.includes('async')) features.push('Async Operations')
    if (content.includes('fetch')) features.push('HTTP Requests')
    if (content.includes('localStorage')) features.push('Local Storage')
    if (content.includes('sessionStorage')) features.push('Session Storage')
    if (content.includes('cookie')) features.push('Cookie Handling')
    if (content.includes('validate')) features.push('Validation Logic')
    if (content.includes('sanitize')) features.push('Data Sanitization')
    if (content.includes('transform')) features.push('Data Transformation')
    if (content.includes('cache')) features.push('Caching')
    if (content.includes('revalidate')) features.push('Cache Revalidation')

    return features
  }

  async documentPages() {
    console.log('📄 Documenting page collections...')

    const pagesDir = path.join(this.projectRoot, 'src', 'pages')
    if (!fs.existsSync(pagesDir)) return

    this.scanPagesDirectory(pagesDir, 'src/pages')
  }

  scanPagesDirectory(dir, basePath) {
    const items = fs.readdirSync(dir)

    for (const item of items) {
      const fullPath = path.join(dir, item)
      const stat = fs.statSync(fullPath)

      if (stat.isDirectory()) {
        this.scanPagesDirectory(fullPath, path.join(basePath, item))
      } else if (item.endsWith('.ts') && !item.includes('.test.')) {
        const content = fs.readFileSync(fullPath, 'utf8')
        const relativePath = path.join(basePath, item)

        const pageInfo = {
          file: item,
          path: relativePath,
          type: this.determinePageType(relativePath),
          config: this.extractCollectionConfig(content),
          fields: this.extractFields(content),
          hooks: this.extractHookReferences(content),
          features: this.extractCollectionFeatures(content),
        }

        this.functionality.pages[relativePath] = pageInfo
      }
    }
  }

  determinePageType(path) {
    if (path.includes('/Blogs/')) return 'Blog Pages'
    if (path.includes('/Services/')) return 'Service Pages'
    if (path.includes('/Legal/')) return 'Legal Pages'
    if (path.includes('/Contacts/')) return 'Contact Pages'
    if (path.includes('/Pages/')) return 'General Pages'
    if (path.includes('/shared/')) return 'Shared Page Utilities'
    return 'Page Collection'
  }

  async documentGlobals() {
    console.log('🌐 Documenting global configurations...')

    const globalsDir = path.join(this.projectRoot, 'src', 'globals')
    if (!fs.existsSync(globalsDir)) return

    this.scanGlobalsDirectory(globalsDir, 'src/globals')
  }

  scanGlobalsDirectory(dir, basePath) {
    const items = fs.readdirSync(dir)

    for (const item of items) {
      const fullPath = path.join(dir, item)
      const stat = fs.statSync(fullPath)

      if (stat.isDirectory()) {
        this.scanGlobalsDirectory(fullPath, path.join(basePath, item))
      } else if (item.endsWith('.ts') || item.endsWith('.tsx')) {
        const content = fs.readFileSync(fullPath, 'utf8')
        const relativePath = path.join(basePath, item)

        const globalInfo = {
          file: item,
          path: relativePath,
          type: this.determineGlobalType(content, relativePath),
          config: this.extractGlobalConfig(content),
          fields: this.extractFields(content),
          features: this.extractGlobalFeatures(content),
        }

        this.functionality.globals[relativePath] = globalInfo
      }
    }
  }

  determineGlobalType(content, path) {
    if (path.includes('/Header/')) return 'Header Global'
    if (path.includes('/Footer/')) return 'Footer Global'
    if (path.includes('/Contact/')) return 'Contact Global'
    if (content.includes('GlobalConfig')) return 'Global Configuration'
    if (content.includes('Component')) return 'Global Component'
    return 'Global Utility'
  }

  extractGlobalConfig(content) {
    const config = {}

    // Extract slug
    const slugMatch = content.match(/slug:\s*['"`]([^'"`]+)['"`]/)
    if (slugMatch) config.slug = slugMatch[1]

    // Extract label
    const labelMatch = content.match(/label:\s*['"`]([^'"`]+)['"`]/)
    if (labelMatch) config.label = labelMatch[1]

    return config
  }

  extractGlobalFeatures(content) {
    const features = []

    if (content.includes('fields:')) features.push('Custom Fields')
    if (content.includes('admin:')) features.push('Admin Configuration')
    if (content.includes('access:')) features.push('Access Control')
    if (content.includes('hooks:')) features.push('Lifecycle Hooks')
    if (content.includes('Component')) features.push('React Component')

    return features
  }

  async documentHooks() {
    console.log('🪝 Documenting Payload hooks...')

    const hooksDir = path.join(this.projectRoot, 'src', 'hooks')
    if (!fs.existsSync(hooksDir)) return

    const files = fs.readdirSync(hooksDir)

    for (const file of files) {
      if (file.endsWith('.ts') && !file.includes('.test.')) {
        const filePath = path.join(hooksDir, file)
        const content = fs.readFileSync(filePath, 'utf8')

        const hookInfo = {
          file: file,
          path: `src/hooks/${file}`,
          functions: this.extractFunctions(content),
          type: this.determineHookType(content, file),
          features: this.extractHookFeatures(content),
        }

        this.functionality.hooks[file] = hookInfo
      }
    }
  }

  determineHookType(content, filename) {
    if (filename.includes('transaction')) return 'Transaction Hook'
    if (content.includes('beforeChange')) return 'Before Change Hook'
    if (content.includes('afterChange')) return 'After Change Hook'
    if (content.includes('beforeValidate')) return 'Before Validate Hook'
    if (content.includes('afterRead')) return 'After Read Hook'
    return 'Custom Hook'
  }

  extractHookFeatures(content) {
    const features = []

    if (content.includes('req.payload')) features.push('Local API Usage')
    if (content.includes('transaction')) features.push('Transaction Safety')
    if (content.includes('revalidate')) features.push('Cache Revalidation')
    if (content.includes('validate')) features.push('Validation Logic')
    if (content.includes('async')) features.push('Async Operations')

    return features
  }

  async documentAccess() {
    console.log('🔐 Documenting access control...')

    const accessDir = path.join(this.projectRoot, 'src', 'access')
    if (!fs.existsSync(accessDir)) return

    const files = fs.readdirSync(accessDir)

    for (const file of files) {
      if (file.endsWith('.ts') && !file.includes('.test.')) {
        const filePath = path.join(accessDir, file)
        const content = fs.readFileSync(filePath, 'utf8')

        const accessInfo = {
          file: file,
          path: `src/access/${file}`,
          functions: this.extractFunctions(content),
          type: this.determineAccessType(content, file),
          features: this.extractAccessFeatures(content),
        }

        this.functionality.access[file] = accessInfo
      }
    }
  }

  determineAccessType(content, filename) {
    if (filename.includes('anyone')) return 'Public Access'
    if (filename.includes('authenticated')) return 'Authenticated Access'
    if (filename.includes('rbac')) return 'Role-Based Access'
    if (filename.includes('admin')) return 'Admin Access'
    return 'Access Control Function'
  }

  extractAccessFeatures(content) {
    const features = []

    if (content.includes('user?.roles')) features.push('Role-Based Control')
    if (content.includes('user?.id')) features.push('User-Specific Control')
    if (content.includes('req.user')) features.push('Request-Based Control')
    if (content.includes('published')) features.push('Publication Status Control')

    return features
  }

  async documentFields() {
    console.log('📝 Documenting field configurations...')

    const fieldsDir = path.join(this.projectRoot, 'src', 'fields')
    if (!fs.existsSync(fieldsDir)) return

    const files = fs.readdirSync(fieldsDir)

    for (const file of files) {
      if (file.endsWith('.ts') && !file.includes('.test.')) {
        const filePath = path.join(fieldsDir, file)
        const content = fs.readFileSync(filePath, 'utf8')

        const fieldInfo = {
          file: file,
          path: `src/fields/${file}`,
          exports: this.extractExports(content),
          type: this.determineFieldType(content, file),
          features: this.extractFieldFeatures(content),
        }

        this.functionality.fields[file] = fieldInfo
      }
    }
  }

  determineFieldType(content, filename) {
    if (filename.includes('link')) return 'Link Field'
    if (filename.includes('richText')) return 'Rich Text Field'
    if (filename.includes('block')) return 'Block Field'
    if (filename.includes('lexical')) return 'Lexical Editor Field'
    return 'Custom Field Configuration'
  }

  extractFieldFeatures(content) {
    const features = []

    if (content.includes('validate:')) features.push('Validation')
    if (content.includes('admin:')) features.push('Admin Configuration')
    if (content.includes('hooks:')) features.push('Field Hooks')
    if (content.includes('access:')) features.push('Field Access Control')
    if (content.includes('localized:')) features.push('Localization')

    return features
  }

  async documentProviders() {
    console.log('🔌 Documenting React providers...')

    const providersDir = path.join(this.projectRoot, 'src', 'providers')
    if (!fs.existsSync(providersDir)) return

    this.scanProvidersDirectory(providersDir, 'src/providers')
  }

  scanProvidersDirectory(dir, basePath) {
    const items = fs.readdirSync(dir)

    for (const item of items) {
      const fullPath = path.join(dir, item)
      const stat = fs.statSync(fullPath)

      if (stat.isDirectory()) {
        this.scanProvidersDirectory(fullPath, path.join(basePath, item))
      } else if (item.endsWith('.tsx') || item.endsWith('.ts')) {
        const content = fs.readFileSync(fullPath, 'utf8')
        const relativePath = path.join(basePath, item)

        const providerInfo = {
          file: item,
          path: relativePath,
          type: this.determineProviderType(content, relativePath),
          exports: this.extractExports(content),
          features: this.extractProviderFeatures(content),
        }

        this.functionality.providers[relativePath] = providerInfo
      }
    }
  }

  determineProviderType(content, path) {
    if (path.includes('/Theme/')) return 'Theme Provider'
    if (path.includes('/Header/')) return 'Header Theme Provider'
    if (content.includes('Context')) return 'Context Provider'
    if (content.includes('Provider')) return 'React Provider'
    return 'Provider Component'
  }

  extractProviderFeatures(content) {
    const features = []

    if (content.includes('createContext')) features.push('Context Creation')
    if (content.includes('useContext')) features.push('Context Consumption')
    if (content.includes('useState')) features.push('State Management')
    if (content.includes('useEffect')) features.push('Side Effects')
    if (content.includes('children')) features.push('Children Wrapping')

    return features
  }

  async documentWorkflows() {
    console.log('⚡ Documenting key workflows...')

    // Document key application workflows based on the analysis
    this.functionality.workflows = {
      'Content Management': {
        description: 'Creating and managing content through Payload CMS',
        components: ['Collections', 'Blocks', 'Fields', 'Admin Interface'],
        flow: [
          'User accesses admin panel',
          'Selects collection (Pages, Blogs, Services, etc.)',
          'Creates/edits content using blocks',
          'Saves with validation and hooks',
          'Content is published and revalidated',
        ],
      },
      'Frontend Rendering': {
        description: 'Rendering content on the frontend',
        components: ['Next.js Pages', 'Components', 'Blocks', 'Utilities'],
        flow: [
          'Next.js page requests data',
          'Payload API returns content',
          'Blocks are rendered as components',
          'Utilities handle formatting and media',
          'Page is served to user',
        ],
      },
      'User Authentication': {
        description: 'User login and access control',
        components: ['Users Collection', 'Access Control', 'Hooks'],
        flow: [
          'User attempts login',
          'Credentials validated',
          'JWT token generated',
          'Access control applied',
          'User session maintained',
        ],
      },
      'Media Management': {
        description: 'Uploading and managing media files',
        components: ['Media Collection', 'Upload Hooks', 'Media Components'],
        flow: [
          'User uploads file',
          'File processed and stored',
          'Media record created',
          'Thumbnails generated',
          'Media available for use',
        ],
      },
    }
  }

  async generateFunctionalityReport() {
    console.log('📋 Generating functionality documentation report...')

    const report = {
      metadata: {
        timestamp: this.functionality.timestamp,
        projectRoot: this.projectRoot,
        documentationVersion: '1.0.0',
      },
      functionality: this.functionality,
      summary: this.generateFunctionalitySummary(),
    }

    // Write detailed functionality report
    fs.writeFileSync(
      path.join(this.analysisDir, 'functionality-documentation.json'),
      JSON.stringify(report, null, 2),
    )

    // Write human-readable documentation
    const documentation = this.generateFunctionalityMarkdown(report)
    fs.writeFileSync(path.join(this.analysisDir, 'functionality-documentation.md'), documentation)

    console.log('📊 Functionality documentation reports generated!')
  }

  generateFunctionalitySummary() {
    return {
      collections: Object.keys(this.functionality.collections).length,
      components: Object.keys(this.functionality.components).length,
      blocks: Object.keys(this.functionality.blocks).length,
      utilities: Object.keys(this.functionality.utilities).length,
      pages: Object.keys(this.functionality.pages).length,
      globals: Object.keys(this.functionality.globals).length,
      hooks: Object.keys(this.functionality.hooks).length,
      access: Object.keys(this.functionality.access).length,
      fields: Object.keys(this.functionality.fields).length,
      providers: Object.keys(this.functionality.providers).length,
      workflows: Object.keys(this.functionality.workflows).length,
    }
  }

  generateFunctionalityMarkdown(report) {
    return `# Functionality Documentation

Generated: ${report.metadata.timestamp}

## Overview

This document provides comprehensive documentation of all functionality in the PayloadCMS project before restructuring. Use this as a reference to ensure no functionality is lost during the restructuring process.

## Summary

- **Collections**: ${report.summary.collections}
- **Components**: ${report.summary.components}
- **Blocks**: ${report.summary.blocks}
- **Utilities**: ${report.summary.utilities}
- **Pages**: ${report.summary.pages}
- **Globals**: ${report.summary.globals}
- **Hooks**: ${report.summary.hooks}
- **Access Control**: ${report.summary.access}
- **Fields**: ${report.summary.fields}
- **Providers**: ${report.summary.providers}
- **Workflows**: ${report.summary.workflows}

## Collections

${Object.entries(report.functionality.collections)
  .map(
    ([name, info]) => `
### ${name}
- **File**: \`${info.path}\`
- **Features**: ${info.features.join(', ') || 'None'}
- **Fields**: ${info.fields.length} fields
- **Hooks**: ${info.hooks.join(', ') || 'None'}
- **Access Control**: ${info.access.join(', ') || 'None'}
- **Configuration**: ${JSON.stringify(info.config, null, 2)}
`,
  )
  .join('\n')}

## Components

${Object.entries(report.functionality.components)
  .slice(0, 20)
  .map(
    ([path, info]) => `
### ${path}
- **Type**: ${info.type}
- **Exports**: ${info.exports.join(', ') || 'None'}
- **React Hooks**: ${info.hooks.join(', ') || 'None'}
- **Features**: ${info.features.join(', ') || 'None'}
`,
  )
  .join('\n')}

${Object.keys(report.functionality.components).length > 20 ? `\n*... and ${Object.keys(report.functionality.components).length - 20} more components*` : ''}

## Blocks

${Object.entries(report.functionality.blocks)
  .map(
    ([path, info]) => `
### ${path}
- **Type**: ${info.type}
- **Configuration**: ${JSON.stringify(info.config, null, 2)}
- **Fields**: ${info.fields.length} fields
- **Features**: ${info.features.join(', ') || 'None'}
`,
  )
  .join('\n')}

## Utilities

${Object.entries(report.functionality.utilities)
  .map(
    ([name, info]) => `
### ${name}
- **Purpose**: ${info.purpose}
- **Functions**: ${info.functions.length} functions
- **Exports**: ${info.exports.join(', ') || 'None'}
- **Features**: ${info.features.join(', ') || 'None'}
`,
  )
  .join('\n')}

## Pages

${Object.entries(report.functionality.pages)
  .map(
    ([path, info]) => `
### ${path}
- **Type**: ${info.type}
- **Configuration**: ${JSON.stringify(info.config, null, 2)}
- **Features**: ${info.features.join(', ') || 'None'}
`,
  )
  .join('\n')}

## Globals

${Object.entries(report.functionality.globals)
  .map(
    ([path, info]) => `
### ${path}
- **Type**: ${info.type}
- **Configuration**: ${JSON.stringify(info.config, null, 2)}
- **Features**: ${info.features.join(', ') || 'None'}
`,
  )
  .join('\n')}

## Hooks

${Object.entries(report.functionality.hooks)
  .map(
    ([name, info]) => `
### ${name}
- **Type**: ${info.type}
- **Functions**: ${info.functions.map((f) => f.name).join(', ') || 'None'}
- **Features**: ${info.features.join(', ') || 'None'}
`,
  )
  .join('\n')}

## Access Control

${Object.entries(report.functionality.access)
  .map(
    ([name, info]) => `
### ${name}
- **Type**: ${info.type}
- **Functions**: ${info.functions.map((f) => f.name).join(', ') || 'None'}
- **Features**: ${info.features.join(', ') || 'None'}
`,
  )
  .join('\n')}

## Fields

${Object.entries(report.functionality.fields)
  .map(
    ([name, info]) => `
### ${name}
- **Type**: ${info.type}
- **Exports**: ${info.exports.join(', ') || 'None'}
- **Features**: ${info.features.join(', ') || 'None'}
`,
  )
  .join('\n')}

## Providers

${Object.entries(report.functionality.providers)
  .map(
    ([path, info]) => `
### ${path}
- **Type**: ${info.type}
- **Exports**: ${info.exports.join(', ') || 'None'}
- **Features**: ${info.features.join(', ') || 'None'}
`,
  )
  .join('\n')}

## Key Workflows

${Object.entries(report.functionality.workflows)
  .map(
    ([name, workflow]) => `
### ${name}
**Description**: ${workflow.description}

**Components**: ${workflow.components.join(', ')}

**Flow**:
${workflow.flow.map((step, index) => `${index + 1}. ${step}`).join('\n')}
`,
  )
  .join('\n')}

## Preservation Checklist

Use this checklist during restructuring to ensure all functionality is preserved:

### Collections
${Object.keys(report.functionality.collections)
  .map((name) => `- [ ] ${name} collection functionality preserved`)
  .join('\n')}

### Key Components
${Object.keys(report.functionality.components)
  .slice(0, 10)
  .map((path) => `- [ ] ${path} component functionality preserved`)
  .join('\n')}

### Blocks
${Object.keys(report.functionality.blocks)
  .slice(0, 10)
  .map((path) => `- [ ] ${path} block functionality preserved`)
  .join('\n')}

### Utilities
${Object.keys(report.functionality.utilities)
  .map((name) => `- [ ] ${name} utility functions preserved`)
  .join('\n')}

### Workflows
${Object.keys(report.functionality.workflows)
  .map((name) => `- [ ] ${name} workflow preserved`)
  .join('\n')}

---

*This documentation serves as the definitive reference for all functionality that must be preserved during the PayloadCMS project restructuring.*
`
  }
}

// Run the functionality documenter
const documenter = new FunctionalityDocumenter()
documenter.run().catch(console.error)

export default FunctionalityDocumenter
