/**
 * Development Server Integration for Identifier Validation
 *
 * This module provides real-time identifier validation during development
 * through middleware and WebSocket connections.
 *
 * Requirements addressed: 6.2, 7.1, 7.4
 */

import type { Config } from 'payload'
import { DevelopmentWarningChecker, formatWarningsForConsole } from './developmentWarnings'

/**
 * Development server configuration
 */
export interface DevServerConfig {
  /** Whether to enable real-time validation */
  enabled: boolean
  /** Port for validation WebSocket server */
  wsPort?: number
  /** Whether to show warnings in browser console */
  showInBrowser: boolean
  /** Whether to validate on config changes */
  validateOnChange: boolean
  /** Debounce delay for validation (ms) */
  debounceDelay: number
}

/**
 * Default development server configuration
 */
export const DEFAULT_DEV_CONFIG: DevServerConfig = {
  enabled: process.env.NODE_ENV === 'development',
  wsPort: 3001,
  showInBrowser: true,
  validateOnChange: true,
  debounceDelay: 500,
}

/**
 * Development validation server
 */
export class DevValidationServer {
  private checker: DevelopmentWarningChecker
  private config: DevServerConfig
  private lastValidation: number = 0
  private validationTimeout?: NodeJS.Timeout

  constructor(config: Partial<DevServerConfig> = {}) {
    this.config = { ...DEFAULT_DEV_CONFIG, ...config }
    this.checker = new DevelopmentWarningChecker()
  }

  /**
   * Create Express middleware for validation endpoints
   */
  createMiddleware() {
    return (req: any, res: any, next: any) => {
      // Validation endpoint
      if (req.path === '/_payload/validate-identifiers') {
        this.handleValidationRequest(req, res)
        return
      }

      // Real-time validation status
      if (req.path === '/_payload/validation-status') {
        this.handleStatusRequest(req, res)
        return
      }

      // Inject validation client script
      if (req.path === '/_payload/validation-client.js') {
        this.handleClientScript(req, res)
        return
      }

      next()
    }
  }

  /**
   * Handle validation API request
   */
  private async handleValidationRequest(req: any, res: any) {
    try {
      const payloadConfig = req.payload?.config
      if (!payloadConfig) {
        res.status(400).json({
          success: false,
          error: 'Payload config not available',
        })
        return
      }

      const warnings = this.checker.checkPayloadConfig(payloadConfig)
      const formatted = formatWarningsForConsole(warnings)

      res.json({
        success: true,
        warnings,
        formatted,
        timestamp: new Date().toISOString(),
        count: {
          total: warnings.length,
          errors: warnings.filter((w) => w.severity === 'error').length,
          warnings: warnings.filter((w) => w.severity === 'warning').length,
          info: warnings.filter((w) => w.severity === 'info').length,
        },
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      })
    }
  }

  /**
   * Handle validation status request
   */
  private handleStatusRequest(_req: any, res: any) {
    res.json({
      enabled: this.config.enabled,
      lastValidation: this.lastValidation,
      config: this.config,
    })
  }

  /**
   * Serve client-side validation script
   */
  private handleClientScript(_req: any, res: any) {
    const clientScript = this.generateClientScript()
    res.setHeader('Content-Type', 'application/javascript')
    res.send(clientScript)
  }

  /**
   * Generate client-side validation script
   */
  private generateClientScript(): string {
    return `
(function() {
  'use strict';
  
  const CONFIG = ${JSON.stringify(this.config)};
  
  if (!CONFIG.enabled || !CONFIG.showInBrowser) {
    return;
  }
  
  let lastCheck = 0;
  let checkTimeout;
  
  // Validation function
  async function validateIdentifiers() {
    try {
      const response = await fetch('/_payload/validate-identifiers');
      const result = await response.json();
      
      if (result.success && result.warnings.length > 0) {
        console.group('⚠️ Payload Identifier Warnings');
        console.log(result.formatted);
        console.groupEnd();
        
        // Show browser notification if supported
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification('Payload CMS: Identifier Warnings', {
            body: \`Found \${result.count.total} identifier warnings\`,
            icon: '/favicon.ico',
            tag: 'payload-validation'
          });
        }
      }
      
      lastCheck = Date.now();
    } catch (error) {
      console.warn('Payload identifier validation failed:', error);
    }
  }
  
  // Debounced validation
  function scheduleValidation() {
    clearTimeout(checkTimeout);
    checkTimeout = setTimeout(validateIdentifiers, CONFIG.debounceDelay);
  }
  
  // Initial validation
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', scheduleValidation);
  } else {
    scheduleValidation();
  }
  
  // Periodic validation (every 30 seconds)
  setInterval(() => {
    if (Date.now() - lastCheck > 30000) {
      scheduleValidation();
    }
  }, 30000);
  
  // Request notification permission
  if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission();
  }
  
  console.log('🔍 Payload identifier validation enabled');
})();
`
  }

  /**
   * Validate configuration with debouncing
   */
  validateWithDebounce(payloadConfig: Config) {
    if (!this.config.enabled || !this.config.validateOnChange) {
      return
    }

    clearTimeout(this.validationTimeout)
    this.validationTimeout = setTimeout(() => {
      this.validateImmediate(payloadConfig)
    }, this.config.debounceDelay)
  }

  /**
   * Immediate validation without debouncing
   */
  validateImmediate(payloadConfig: Config) {
    try {
      const warnings = this.checker.checkPayloadConfig(payloadConfig)
      this.lastValidation = Date.now()

      if (warnings.length > 0) {
        console.log('\n🔍 Payload Identifier Validation:')
        console.log(formatWarningsForConsole(warnings))
      }
    } catch (error) {
      console.warn('Identifier validation error:', error)
    }
  }
}

/**
 * Create development validation integration
 */
export function createDevValidationIntegration(config?: Partial<DevServerConfig>) {
  const server = new DevValidationServer(config)

  return {
    /**
     * Express middleware
     */
    middleware: server.createMiddleware(),

    /**
     * Payload onInit hook
     */
    onInit: (payload: any) => {
      if (server['config'].enabled) {
        console.log('🔍 Payload identifier validation enabled for development')
        server.validateImmediate(payload.config)
      }
    },

    /**
     * Configuration change handler
     */
    onConfigChange: (payloadConfig: Config) => {
      server.validateWithDebounce(payloadConfig)
    },

    /**
     * Manual validation trigger
     */
    validate: (payloadConfig: Config) => {
      server.validateImmediate(payloadConfig)
    },
  }
}

/**
 * Next.js integration helper
 */
export function addValidationToNextConfig(nextConfig: any = {}) {
  return {
    ...nextConfig,
    async rewrites() {
      const existingRewrites = (await nextConfig.rewrites?.()) || []

      return {
        ...existingRewrites,
        beforeFiles: [
          ...(existingRewrites.beforeFiles || []),
          {
            source: '/_payload/validate-identifiers',
            destination: '/api/_payload/validate-identifiers',
          },
          {
            source: '/_payload/validation-status',
            destination: '/api/_payload/validation-status',
          },
          {
            source: '/_payload/validation-client.js',
            destination: '/api/_payload/validation-client.js',
          },
        ],
      }
    },
  }
}

/**
 * Webpack plugin for development warnings
 */
export class DevValidationWebpackPlugin {
  private server: DevValidationServer

  constructor(config?: Partial<DevServerConfig>) {
    this.server = new DevValidationServer(config)
  }

  apply(compiler: any) {
    if (process.env.NODE_ENV !== 'development') {
      return
    }

    compiler.hooks.watchRun.tapAsync('DevValidationWebpackPlugin', (callback: Function) => {
      // Validate on file changes
      try {
        const payloadConfigPath = require.resolve('./src/payload.config.ts')
        delete require.cache[payloadConfigPath]
        const payloadConfig = require(payloadConfigPath).default

        this.server.validateImmediate(payloadConfig)
      } catch (error) {
        // Silently ignore if config can't be loaded
      }

      callback()
    })

    compiler.hooks.compilation.tap('DevValidationWebpackPlugin', (_compilation: any) => {
      _compilation.hooks.processWarnings.tap('DevValidationWebpackPlugin', (warnings: any[]) => {
        // Add identifier warnings to webpack output
        try {
          const payloadConfig = require('./src/payload.config.ts').default
          const identifierWarnings = this.server['checker'].checkPayloadConfig(payloadConfig)

          for (const warning of identifierWarnings) {
            if (warning.severity === 'error') {
              _compilation.errors.push(new Error(`[Identifier] ${warning.message}`))
            } else if (warning.severity === 'warning') {
              warnings.push(`[Identifier] ${warning.message}`)
            }
          }
        } catch (error) {
          // Silently ignore if config can't be loaded
        }

        return warnings
      })
    })
  }
}

/**
 * File watcher for configuration changes
 */
export function createConfigWatcher(callback: (config: Config) => void) {
  if (process.env.NODE_ENV !== 'development') {
    return
  }

  const fs = require('fs')
  const path = require('path')

  const configPath = path.resolve('./src/payload.config.ts')

  let watchTimeout: NodeJS.Timeout

  fs.watchFile(configPath, { interval: 1000 }, () => {
    clearTimeout(watchTimeout)
    watchTimeout = setTimeout(async () => {
      try {
        // Clear require cache
        delete require.cache[configPath]

        // Reload config
        const configModule = await import(configPath + '?t=' + Date.now())
        const config = configModule.default || configModule

        callback(config)
      } catch (error) {
        console.warn('Failed to reload Payload config:', error)
      }
    }, 500)
  })

  return () => {
    fs.unwatchFile(configPath)
  }
}

/**
 * Browser console integration
 */
export function addBrowserConsoleIntegration() {
  if (typeof window === 'undefined') {
    return
  }

  // Add global validation function
  ;(window as any).validatePayloadIdentifiers = async () => {
    try {
      const response = await fetch('/_payload/validate-identifiers')
      const result = await response.json()

      if (result.success) {
        console.log(result.formatted)
        return result.warnings
      } else {
        console.error('Validation failed:', result.error)
      }
    } catch (error) {
      console.error('Validation request failed:', error)
    }
  }

  console.log('💡 Run validatePayloadIdentifiers() to check identifier compliance')
}
