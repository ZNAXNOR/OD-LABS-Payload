/**
 * User-friendly error messages for RichText components
 * Provides clear, actionable error messages for end users
 */

import React from 'react'
import type { ErrorSeverity, ErrorCategory } from './errorLogging'

// User-friendly error message configuration
export interface UserFriendlyErrorConfig {
  showTechnicalDetails: boolean
  showRetryButton: boolean
  showContactSupport: boolean
  supportEmail?: string
  supportUrl?: string
  customMessages?: Partial<Record<ErrorCategory, string>>
  locale?: string
}

// Error message context
export interface ErrorMessageContext {
  severity: ErrorSeverity
  category: ErrorCategory
  originalMessage: string
  componentName: string
  blockType?: string
  canRetry: boolean
  retryCount: number
  timestamp: number
  userAgent?: string
}

// Default configuration
const defaultConfig: UserFriendlyErrorConfig = {
  showTechnicalDetails: false,
  showRetryButton: true,
  showContactSupport: true,
  locale: 'en',
}

/**
 * User-friendly error message generator
 */
export class UserFriendlyErrorMessages {
  private config: UserFriendlyErrorConfig

  constructor(config: Partial<UserFriendlyErrorConfig> = {}) {
    this.config = { ...defaultConfig, ...config }
  }

  /**
   * Generate user-friendly error message
   */
  generateMessage(context: ErrorMessageContext): {
    title: string
    message: string
    suggestion: string
    icon: string
    color: string
    actions: Array<{
      label: string
      action: string
      primary?: boolean
    }>
  } {
    const { category, severity } = context

    // Get base message template
    const template = this.getMessageTemplate(category, severity)

    // Customize message based on context
    const customizedMessage = this.customizeMessage(template, context)

    // Generate actions
    const actions = this.generateActions(context)

    return {
      ...customizedMessage,
      actions,
    }
  }

  /**
   * Get message template based on category and severity
   */
  private getMessageTemplate(category: ErrorCategory, severity: ErrorSeverity) {
    const templates = {
      rendering: {
        low: {
          title: 'Minor Display Issue',
          message: 'Some content may not display perfectly, but the page is still functional.',
          suggestion: 'You can continue using the page normally. The issue should resolve itself.',
          icon: '⚠️',
          color: '#f59e0b',
        },
        medium: {
          title: 'Content Display Problem',
          message: 'Some content is having trouble displaying properly.',
          suggestion: 'Try refreshing the page or check your internet connection.',
          icon: '⚠️',
          color: '#f59e0b',
        },
        high: {
          title: 'Content Loading Error',
          message: "We're having trouble loading some content on this page.",
          suggestion:
            'Please refresh the page. If the problem continues, try again in a few minutes.',
          icon: '❌',
          color: '#ef4444',
        },
        critical: {
          title: 'Page Loading Failed',
          message: "We're unable to load this page right now.",
          suggestion:
            'Please refresh the page or try again later. If the problem persists, contact support.',
          icon: '🚫',
          color: '#dc2626',
        },
      },
      security: {
        low: {
          title: 'Security Notice',
          message: 'We detected potentially unsafe content and have taken precautions.',
          suggestion: 'The content has been safely handled. You can continue browsing.',
          icon: '🛡️',
          color: '#3b82f6',
        },
        medium: {
          title: 'Content Blocked',
          message: 'Some content was blocked for your security.',
          suggestion: 'This is normal security behavior. Contact support if needed.',
          icon: '🚫',
          color: '#f59e0b',
        },
        high: {
          title: 'Security Alert',
          message: 'Potentially dangerous content was blocked.',
          suggestion:
            'This content may be harmful. Please contact support if you believe this is an error.',
          icon: '⚠️',
          color: '#dc2626',
        },
        critical: {
          title: 'Critical Security Threat',
          message: 'A serious security threat was detected and blocked.',
          suggestion: 'Please contact support immediately if you believe this is an error.',
          icon: '🚨',
          color: '#dc2626',
        },
      },
      performance: {
        low: {
          title: 'Performance Notice',
          message: 'The page is loading a bit slower than usual.',
          suggestion: 'This should not affect your experience significantly.',
          icon: '⏱️',
          color: '#f59e0b',
        },
        medium: {
          title: 'Slow Loading',
          message: 'The page is taking longer to load than expected.',
          suggestion: 'Please be patient while we load the content.',
          icon: '⏳',
          color: '#f59e0b',
        },
        high: {
          title: 'Performance Issue',
          message: 'The page is experiencing performance problems.',
          suggestion: 'Try refreshing the page or check your internet connection.',
          icon: '🐌',
          color: '#ef4444',
        },
        critical: {
          title: 'Severe Performance Issue',
          message: 'The page is unable to load due to performance problems.',
          suggestion: 'Please try again later or contact support.',
          icon: '🚫',
          color: '#dc2626',
        },
      },
      accessibility: {
        low: {
          title: 'Accessibility Notice',
          message: 'Some accessibility features may not be working optimally.',
          suggestion: 'The page should still be usable with assistive technologies.',
          icon: '♿',
          color: '#3b82f6',
        },
        medium: {
          title: 'Accessibility Issue',
          message: 'Some accessibility features are not working properly.',
          suggestion: 'Please contact support if you need assistance.',
          icon: '⚠️',
          color: '#f59e0b',
        },
        high: {
          title: 'Accessibility Problem',
          message: 'Important accessibility features are not working.',
          suggestion: 'Please contact support for assistance with accessing this content.',
          icon: '❌',
          color: '#ef4444',
        },
        critical: {
          title: 'Accessibility Failure',
          message: 'This content may not be accessible with assistive technologies.',
          suggestion: 'Please contact support immediately for an accessible alternative.',
          icon: '🚫',
          color: '#dc2626',
        },
      },
      validation: {
        low: {
          title: 'Validation Warning',
          message: 'Some content may not be formatted correctly.',
          suggestion: 'This should not affect the functionality.',
          icon: '⚠️',
          color: '#f59e0b',
        },
        medium: {
          title: 'Validation Error',
          message: 'Some content failed validation checks.',
          suggestion: 'Please check your input and try again.',
          icon: '❌',
          color: '#f59e0b',
        },
        high: {
          title: 'Validation Failure',
          message: 'The content could not be validated.',
          suggestion: 'Please review your input and correct any errors.',
          icon: '🚫',
          color: '#ef4444',
        },
        critical: {
          title: 'Critical Validation Error',
          message: 'The content contains serious validation errors.',
          suggestion: 'Please contact support for assistance.',
          icon: '🚨',
          color: '#dc2626',
        },
      },
      network: {
        low: {
          title: 'Network Notice',
          message: 'Your connection seems a bit slow.',
          suggestion: 'Content may take a moment longer to load.',
          icon: '📶',
          color: '#f59e0b',
        },
        medium: {
          title: 'Connection Issue',
          message: 'There seems to be a problem with your internet connection.',
          suggestion: 'Please check your connection and try again.',
          icon: '📡',
          color: '#f59e0b',
        },
        high: {
          title: 'Network Error',
          message: 'Unable to connect to our servers.',
          suggestion: 'Please check your internet connection and try again.',
          icon: '🌐',
          color: '#ef4444',
        },
        critical: {
          title: 'Connection Failed',
          message: 'Cannot establish a connection to our servers.',
          suggestion: 'Please check your internet connection or try again later.',
          icon: '🚫',
          color: '#dc2626',
        },
      },
      user_interaction: {
        low: {
          title: 'Interaction Notice',
          message: 'Some interactive features may not be working perfectly.',
          suggestion: 'Try refreshing the page if you experience issues.',
          icon: '👆',
          color: '#f59e0b',
        },
        medium: {
          title: 'Interaction Problem',
          message: 'Some buttons or links may not be responding.',
          suggestion: 'Please try refreshing the page.',
          icon: '🖱️',
          color: '#f59e0b',
        },
        high: {
          title: 'Interaction Error',
          message: 'Interactive features are not working properly.',
          suggestion: 'Please refresh the page or try again later.',
          icon: '❌',
          color: '#ef4444',
        },
        critical: {
          title: 'Interaction Failure',
          message: 'The page is not responding to user interactions.',
          suggestion: 'Please refresh the page or contact support.',
          icon: '🚫',
          color: '#dc2626',
        },
      },
      configuration: {
        low: {
          title: 'Configuration Notice',
          message: 'Some settings may not be applied correctly.',
          suggestion: 'The page should still function normally.',
          icon: '⚙️',
          color: '#f59e0b',
        },
        medium: {
          title: 'Configuration Issue',
          message: 'There is a problem with the page configuration.',
          suggestion: 'Please try refreshing the page.',
          icon: '🔧',
          color: '#f59e0b',
        },
        high: {
          title: 'Configuration Error',
          message: 'The page configuration is incorrect.',
          suggestion: 'Please contact support if the problem persists.',
          icon: '❌',
          color: '#ef4444',
        },
        critical: {
          title: 'Configuration Failure',
          message: 'Critical configuration errors prevent the page from working.',
          suggestion: 'Please contact support immediately.',
          icon: '🚫',
          color: '#dc2626',
        },
      },
      unknown: {
        low: {
          title: 'Minor Issue',
          message: 'Something unexpected happened, but it should not affect your experience.',
          suggestion: 'You can continue using the page normally.',
          icon: '❓',
          color: '#f59e0b',
        },
        medium: {
          title: 'Unexpected Issue',
          message: 'Something unexpected happened.',
          suggestion: 'Please try refreshing the page.',
          icon: '❓',
          color: '#f59e0b',
        },
        high: {
          title: 'Unknown Error',
          message: 'An unexpected error occurred.',
          suggestion: 'Please refresh the page or try again later.',
          icon: '❌',
          color: '#ef4444',
        },
        critical: {
          title: 'Critical Error',
          message: 'A serious unexpected error occurred.',
          suggestion: 'Please contact support if the problem persists.',
          icon: '🚫',
          color: '#dc2626',
        },
      },
    }

    return templates[category]?.[severity] || templates.rendering.medium
  }

  /**
   * Customize message based on context
   */
  private customizeMessage(template: any, context: ErrorMessageContext) {
    let { title, message, suggestion, icon, color } = template
    const { blockType, componentName, retryCount } = context

    // Add block type to message if available
    if (blockType) {
      message = message.replace('content', `${blockType} content`)
    }

    // Add component context
    if (componentName && componentName !== 'unknown') {
      message += ` (in ${componentName})`
    }

    // Modify suggestion based on retry count
    if (retryCount > 0) {
      suggestion = `You've tried ${retryCount} time${retryCount > 1 ? 's' : ''}. ${suggestion}`
    }

    // Use custom messages if provided
    if (this.config.customMessages?.[context.category]) {
      message = this.config.customMessages[context.category]
    }

    return { title, message, suggestion, icon, color }
  }

  /**
   * Generate action buttons
   */
  private generateActions(context: ErrorMessageContext) {
    const actions: Array<{ label: string; action: string; primary?: boolean }> = []

    // Retry button
    if (this.config.showRetryButton && context.canRetry && context.retryCount < 3) {
      actions.push({
        label: context.retryCount > 0 ? 'Try Again' : 'Retry',
        action: 'retry',
        primary: true,
      })
    }

    // Refresh button
    actions.push({
      label: 'Refresh Page',
      action: 'refresh',
      primary: actions.length === 0,
    })

    // Contact support
    if (this.config.showContactSupport) {
      const supportLabel = this.config.supportEmail ? 'Email Support' : 'Contact Support'
      actions.push({
        label: supportLabel,
        action: 'contact-support',
      })
    }

    // Technical details toggle
    if (this.config.showTechnicalDetails) {
      actions.push({
        label: 'Show Details',
        action: 'show-details',
      })
    }

    return actions
  }

  /**
   * Get localized message
   */
  getLocalizedMessage(context: ErrorMessageContext): string {
    // Simple localization - in a real app, you'd use a proper i18n library
    const locale = this.config.locale || 'en'

    if (locale === 'es') {
      return this.getSpanishMessage(context)
    } else if (locale === 'fr') {
      return this.getFrenchMessage(context)
    }

    return this.generateMessage(context).message
  }

  private getSpanishMessage(context: ErrorMessageContext): string {
    const spanishMessages = {
      rendering: 'Hay un problema mostrando el contenido.',
      security: 'Contenido bloqueado por seguridad.',
      performance: 'La página está cargando lentamente.',
      accessibility: 'Problema de accesibilidad detectado.',
      validation: 'Error de validación en el contenido.',
      network: 'Problema de conexión a internet.',
      user_interaction: 'Las funciones interactivas no responden.',
      configuration: 'Error de configuración.',
      unknown: 'Ha ocurrido un error inesperado.',
    }

    return spanishMessages[context.category] || spanishMessages.unknown
  }

  private getFrenchMessage(context: ErrorMessageContext): string {
    const frenchMessages = {
      rendering: "Il y a un problème avec l'affichage du contenu.",
      security: 'Contenu bloqué pour des raisons de sécurité.',
      performance: 'La page se charge lentement.',
      accessibility: "Problème d'accessibilité détecté.",
      validation: 'Erreur de validation du contenu.',
      network: 'Problème de connexion internet.',
      user_interaction: 'Les fonctions interactives ne répondent pas.',
      configuration: 'Erreur de configuration.',
      unknown: "Une erreur inattendue s'est produite.",
    }

    return frenchMessages[context.category] || frenchMessages.unknown
  }
}

/**
 * Error message component
 */
interface ErrorMessageProps {
  context: ErrorMessageContext
  config?: Partial<UserFriendlyErrorConfig>
  onAction?: (action: string) => void
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ context, config = {}, onAction }) => {
  const errorMessages = new UserFriendlyErrorMessages(config)
  const { title, message, suggestion, icon, color, actions } =
    errorMessages.generateMessage(context)

  const handleAction = (action: string) => {
    switch (action) {
      case 'retry':
        onAction?.('retry')
        break
      case 'refresh':
        window.location.reload()
        break
      case 'contact-support':
        if (config.supportEmail) {
          window.location.href = `mailto:${config.supportEmail}`
        } else if (config.supportUrl) {
          window.open(config.supportUrl, '_blank')
        }
        break
      case 'show-details':
        onAction?.('show-details')
        break
      default:
        onAction?.(action)
    }
  }

  return (
    <div
      className="error-message"
      style={{
        border: `2px solid ${color}`,
        borderRadius: '8px',
        padding: '16px',
        margin: '16px 0',
        backgroundColor: `${color}10`,
      }}
    >
      <div
        className="error-header"
        style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}
      >
        <span style={{ fontSize: '24px', marginRight: '8px' }}>{icon}</span>
        <h3 style={{ margin: 0, color }}>{title}</h3>
      </div>

      <p style={{ margin: '8px 0', color: '#333' }}>{message}</p>
      <p style={{ margin: '8px 0', fontSize: '14px', color: '#666' }}>{suggestion}</p>

      {actions.length > 0 && (
        <div
          className="error-actions"
          style={{ marginTop: '16px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}
        >
          {actions.map((action, index) => (
            <button
              key={index}
              onClick={() => handleAction(action.action)}
              style={{
                padding: '8px 16px',
                border: action.primary ? 'none' : `1px solid ${color}`,
                backgroundColor: action.primary ? color : 'transparent',
                color: action.primary ? 'white' : color,
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px',
              }}
            >
              {action.label}
            </button>
          ))}
        </div>
      )}

      {config.showTechnicalDetails && (
        <details style={{ marginTop: '16px' }}>
          <summary style={{ cursor: 'pointer', color }}>Technical Details</summary>
          <pre
            style={{
              fontSize: '12px',
              backgroundColor: '#f5f5f5',
              padding: '8px',
              borderRadius: '4px',
              overflow: 'auto',
              marginTop: '8px',
            }}
          >
            {JSON.stringify(context, null, 2)}
          </pre>
        </details>
      )}
    </div>
  )
}

/**
 * Hook for using error messages
 */
export const useErrorMessages = (config?: Partial<UserFriendlyErrorConfig>) => {
  const errorMessages = React.useMemo(() => new UserFriendlyErrorMessages(config), [config])

  return {
    generateMessage: (context: ErrorMessageContext) => errorMessages.generateMessage(context),
    getLocalizedMessage: (context: ErrorMessageContext) =>
      errorMessages.getLocalizedMessage(context),
  }
}

/**
 * Default error message generator instance
 */
export const defaultErrorMessages = new UserFriendlyErrorMessages()

/**
 * Helper function to create error context
 */
export const createErrorContext = (
  severity: ErrorSeverity,
  category: ErrorCategory,
  originalMessage: string,
  componentName: string,
  options: Partial<ErrorMessageContext> = {},
): ErrorMessageContext => ({
  severity,
  category,
  originalMessage,
  componentName,
  canRetry: true,
  retryCount: 0,
  timestamp: Date.now(),
  ...options,
})
