/**
 * Security-focused error boundary utilities for RichText components
 * Provides enhanced error handling with security monitoring and threat detection
 */

import React from 'react'
import {
  BlockErrorBoundary,
  type ErrorBoundaryProps,
  type ErrorFallbackProps,
} from '../converters/errorBoundary'
import { logSecurityIssue, createErrorBoundaryLogger } from './errorLogging'

// Security error types
export type SecurityErrorType =
  | 'xss_attempt'
  | 'content_injection'
  | 'malicious_script'
  | 'unsafe_content'
  | 'validation_failure'
  | 'sanitization_error'
  | 'media_security_violation'
  | 'link_security_violation'
  | 'unknown_security_threat'

// Security error context
export interface SecurityErrorContext {
  errorType: SecurityErrorType
  threatLevel: 'low' | 'medium' | 'high' | 'critical'
  blockedContent?: string
  sanitizedContent?: string
  originalError?: Error
  securityRules?: string[]
  userAgent?: string
  timestamp: number
  sessionId?: string
}

// Enhanced error boundary props with security features
export interface SecurityErrorBoundaryProps extends ErrorBoundaryProps {
  enableSecurityMonitoring?: boolean
  enableThreatDetection?: boolean
  securityLevel?: 'strict' | 'moderate' | 'permissive'
  onSecurityThreat?: (context: SecurityErrorContext) => void
  blockOnSecurityThreat?: boolean
  logSecurityEvents?: boolean
  reportToSecurityService?: boolean
}

// Security error fallback props
export interface SecurityErrorFallbackProps extends ErrorFallbackProps {
  securityContext?: SecurityErrorContext
  isSecurityThreat?: boolean
  threatLevel?: SecurityErrorContext['threatLevel']
}

/**
 * Enhanced error boundary with security monitoring
 */
export class SecurityErrorBoundary extends BlockErrorBoundary {
  private securityProps: SecurityErrorBoundaryProps

  constructor(props: SecurityErrorBoundaryProps) {
    super(props)
    this.securityProps = props
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Call parent implementation first
    super.componentDidCatch(error, errorInfo)

    // Log error using error logging system
    const errorBoundaryLogger = createErrorBoundaryLogger(
      this.props.blockType || 'SecurityErrorBoundary',
      this.props.blockType,
    )
    errorBoundaryLogger(error, errorInfo)

    // Security-specific error handling
    if (this.securityProps.enableSecurityMonitoring) {
      this.handleSecurityError(error, errorInfo)
    }
  }

  private handleSecurityError = (error: Error, errorInfo: React.ErrorInfo) => {
    const securityContext = this.analyzeSecurityThreat(error, errorInfo)

    if (securityContext) {
      // Log security event using error logging system
      logSecurityIssue({
        componentName: this.props.blockType || 'SecurityErrorBoundary',
        blockType: this.props.blockType,
        threatType: securityContext.errorType,
        threatLevel: securityContext.threatLevel as 'low' | 'medium' | 'high' | 'critical',
        blockedContent: securityContext.blockedContent,
        additionalData: {
          securityRules: securityContext.securityRules,
          userAgent: securityContext.userAgent,
          sessionId: securityContext.sessionId,
        },
      })

      // Log security event
      if (this.securityProps.logSecurityEvents) {
        this.logSecurityEvent(securityContext)
      }

      // Report to security service
      if (this.securityProps.reportToSecurityService) {
        this.reportSecurityThreat(securityContext)
      }

      // Call security threat handler
      if (this.securityProps.onSecurityThreat) {
        this.securityProps.onSecurityThreat(securityContext)
      }

      // Block rendering if configured
      if (this.securityProps.blockOnSecurityThreat && securityContext.threatLevel === 'critical') {
        this.setState({
          hasError: true,
          error: new Error('Content blocked due to security threat'),
        })
      }
    }
  }

  private analyzeSecurityThreat = (
    error: Error,
    errorInfo: React.ErrorInfo,
  ): SecurityErrorContext | null => {
    const errorMessage = error.message.toLowerCase()
    const componentStack = errorInfo.componentStack?.toLowerCase() || ''

    // Detect XSS attempts
    if (
      errorMessage.includes('script') ||
      errorMessage.includes('javascript:') ||
      errorMessage.includes('onerror') ||
      errorMessage.includes('onclick')
    ) {
      return {
        errorType: 'xss_attempt',
        threatLevel: 'critical',
        originalError: error,
        timestamp: Date.now(),
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
      }
    }

    // Detect content injection
    if (
      errorMessage.includes('injection') ||
      errorMessage.includes('eval') ||
      errorMessage.includes('document.write')
    ) {
      return {
        errorType: 'content_injection',
        threatLevel: 'high',
        originalError: error,
        timestamp: Date.now(),
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
      }
    }

    // Detect malicious scripts
    if (
      componentStack.includes('script') ||
      componentStack.includes('iframe') ||
      componentStack.includes('object') ||
      componentStack.includes('embed')
    ) {
      return {
        errorType: 'malicious_script',
        threatLevel: 'high',
        originalError: error,
        timestamp: Date.now(),
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
      }
    }

    // Detect validation failures
    if (
      errorMessage.includes('validation') ||
      errorMessage.includes('sanitization') ||
      errorMessage.includes('blocked') ||
      errorMessage.includes('security')
    ) {
      return {
        errorType: 'validation_failure',
        threatLevel: 'medium',
        originalError: error,
        timestamp: Date.now(),
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
      }
    }

    // Check for suspicious patterns
    const suspiciousPatterns = [
      /data:.*base64/i,
      /javascript:/i,
      /vbscript:/i,
      /on\w+\s*=/i,
      /<script/i,
      /eval\s*\(/i,
    ]

    for (const pattern of suspiciousPatterns) {
      if (pattern.test(errorMessage) || pattern.test(componentStack)) {
        return {
          errorType: 'unsafe_content',
          threatLevel: 'high',
          originalError: error,
          timestamp: Date.now(),
          userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
        }
      }
    }

    return null
  }

  private logSecurityEvent = (context: SecurityErrorContext) => {
    console.warn('[SecurityErrorBoundary] Security threat detected:', {
      errorType: context.errorType,
      threatLevel: context.threatLevel,
      timestamp: new Date(context.timestamp).toISOString(),
      blockType: this.props.blockType,
      userAgent: context.userAgent,
      sessionId: context.sessionId,
    })

    // Log to browser console with appropriate level
    const logLevel =
      context.threatLevel === 'critical'
        ? 'error'
        : context.threatLevel === 'high'
          ? 'warn'
          : 'info'

    console[logLevel]('[SecurityErrorBoundary] Security event details:', context)
  }

  private reportSecurityThreat = (context: SecurityErrorContext) => {
    // Report to analytics/monitoring service
    if (typeof window !== 'undefined' && (window as any).gtag) {
      ;(window as any).gtag('event', 'security_threat', {
        event_category: 'security',
        event_label: context.errorType,
        custom_map: {
          threatLevel: context.threatLevel,
          blockType: this.props.blockType,
          timestamp: context.timestamp,
        },
      })
    }

    // Report to security monitoring service (placeholder)
    if (typeof fetch !== 'undefined') {
      fetch('/api/security/report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'security_threat',
          context: {
            ...context,
            // Remove sensitive data
            originalError: context.originalError?.message,
            blockedContent: context.blockedContent?.substring(0, 100),
          },
        }),
      }).catch((error) => {
        console.warn('Failed to report security threat:', error)
      })
    }
  }
}

/**
 * Security-aware error fallback component
 */
export const SecurityErrorFallback: React.FC<SecurityErrorFallbackProps> = ({
  retry,
  blockType,
  securityContext,
  isSecurityThreat = false,
  threatLevel = 'low',
}) => {
  const getSecurityMessage = () => {
    if (!isSecurityThreat || !securityContext) {
      return 'A rendering error occurred.'
    }

    switch (securityContext.errorType) {
      case 'xss_attempt':
        return 'Potential XSS attack detected and blocked.'
      case 'content_injection':
        return 'Content injection attempt detected and blocked.'
      case 'malicious_script':
        return 'Malicious script detected and blocked.'
      case 'unsafe_content':
        return 'Unsafe content detected and blocked.'
      case 'validation_failure':
        return 'Content validation failed.'
      case 'sanitization_error':
        return 'Content sanitization error occurred.'
      case 'media_security_violation':
        return 'Media security violation detected.'
      case 'link_security_violation':
        return 'Link security violation detected.'
      default:
        return 'Security threat detected and blocked.'
    }
  }

  const getSecurityIcon = () => {
    if (!isSecurityThreat) {
      return (
        <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
            clipRule="evenodd"
          />
        </svg>
      )
    }

    return (
      <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
        <path
          fillRule="evenodd"
          d="M10 1l9 17H1L10 1zM9 13v2h2v-2H9zm0-8v6h2V5H9z"
          clipRule="evenodd"
        />
      </svg>
    )
  }

  const getBorderColor = () => {
    if (!isSecurityThreat) return 'border-red-200'

    switch (threatLevel) {
      case 'critical':
        return 'border-red-500'
      case 'high':
        return 'border-orange-400'
      case 'medium':
        return 'border-yellow-400'
      default:
        return 'border-red-200'
    }
  }

  const getBackgroundColor = () => {
    if (!isSecurityThreat) return 'bg-red-50'

    switch (threatLevel) {
      case 'critical':
        return 'bg-red-100'
      case 'high':
        return 'bg-orange-50'
      case 'medium':
        return 'bg-yellow-50'
      default:
        return 'bg-red-50'
    }
  }

  const getTextColor = () => {
    if (!isSecurityThreat) return 'text-red-800'

    switch (threatLevel) {
      case 'critical':
        return 'text-red-900'
      case 'high':
        return 'text-orange-800'
      case 'medium':
        return 'text-yellow-800'
      default:
        return 'text-red-800'
    }
  }

  return (
    <div className={`p-4 border ${getBorderColor()} ${getBackgroundColor()} rounded-md mb-4`}>
      <div className="flex items-start">
        <div className="flex-shrink-0">{getSecurityIcon()}</div>
        <div className="ml-3 flex-1">
          <h3 className={`text-sm font-medium ${getTextColor()}`}>
            {isSecurityThreat ? 'Security Alert' : 'Block Rendering Error'}
          </h3>
          {blockType && (
            <p
              className={`mt-1 text-sm ${getTextColor().replace('800', '600').replace('900', '700')}`}
            >
              Block type: {blockType}
            </p>
          )}
          <p
            className={`mt-1 text-sm ${getTextColor().replace('800', '600').replace('900', '700')}`}
          >
            {getSecurityMessage()}
          </p>
          {isSecurityThreat && securityContext && (
            <p
              className={`mt-1 text-xs ${getTextColor().replace('800', '500').replace('900', '600')}`}
            >
              Threat level: {threatLevel} | Type: {securityContext.errorType}
            </p>
          )}
          <div className="mt-3">
            <button
              type="button"
              onClick={retry}
              className={`inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded ${getTextColor().replace('800', '700').replace('900', '800')} ${getBackgroundColor().replace('50', '100').replace('100', '200')} hover:${getBackgroundColor().replace('50', '200').replace('100', '300')} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500`}
            >
              Try Again
            </button>
          </div>
          {isSecurityThreat && (
            <div className="mt-3">
              <p
                className={`text-xs ${getTextColor().replace('800', '600').replace('900', '700')}`}
              >
                This content has been blocked for security reasons. Please contact support if you
                believe this is an error.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

/**
 * Create a security-aware error boundary wrapper
 */
export const createSecurityErrorBoundary = <T extends Record<string, any>>(
  Component: React.ComponentType<T>,
  options?: {
    fallback?: React.ComponentType<SecurityErrorFallbackProps>
    blockType?: string
    maxRetries?: number
    securityLevel?: 'strict' | 'moderate' | 'permissive'
    enableSecurityMonitoring?: boolean
    onSecurityThreat?: (context: SecurityErrorContext) => void
  },
) => {
  const { fallback = SecurityErrorFallback } = options || {}

  return React.forwardRef<any, T>((props, ref) => (
    <SecurityErrorBoundary fallback={fallback} resetOnPropsChange={true}>
      <Component {...(props as any)} ref={ref} />
    </SecurityErrorBoundary>
  ))
}

/**
 * Hook for security error monitoring
 */
export const useSecurityErrorMonitoring = () => {
  const [securityEvents, setSecurityEvents] = React.useState<SecurityErrorContext[]>([])

  const reportSecurityEvent = React.useCallback((context: SecurityErrorContext) => {
    setSecurityEvents((prev) => [...prev.slice(-9), context]) // Keep last 10 events

    // Log to console
    console.warn('[SecurityErrorMonitoring] Security event:', context)

    // Report to monitoring service
    if (typeof window !== 'undefined' && (window as any).gtag) {
      ;(window as any).gtag('event', 'security_event', {
        event_category: 'security',
        event_label: context.errorType,
        value:
          context.threatLevel === 'critical'
            ? 4
            : context.threatLevel === 'high'
              ? 3
              : context.threatLevel === 'medium'
                ? 2
                : 1,
      })
    }
  }, [])

  const clearSecurityEvents = React.useCallback(() => {
    setSecurityEvents([])
  }, [])

  const getSecuritySummary = React.useCallback(() => {
    const summary = {
      total: securityEvents.length,
      critical: securityEvents.filter((e) => e.threatLevel === 'critical').length,
      high: securityEvents.filter((e) => e.threatLevel === 'high').length,
      medium: securityEvents.filter((e) => e.threatLevel === 'medium').length,
      low: securityEvents.filter((e) => e.threatLevel === 'low').length,
      types: [...new Set(securityEvents.map((e) => e.errorType))],
    }
    return summary
  }, [securityEvents])

  return {
    securityEvents,
    reportSecurityEvent,
    clearSecurityEvents,
    getSecuritySummary,
  }
}

/**
 * Security error boundary provider for context
 */
export const SecurityErrorBoundaryContext = React.createContext<{
  reportSecurityEvent: (context: SecurityErrorContext) => void
  securityLevel: 'strict' | 'moderate' | 'permissive'
}>({
  reportSecurityEvent: () => {},
  securityLevel: 'moderate',
})

export const SecurityErrorBoundaryProvider: React.FC<{
  children: React.ReactNode
  securityLevel?: 'strict' | 'moderate' | 'permissive'
}> = ({ children, securityLevel = 'moderate' }) => {
  const { reportSecurityEvent } = useSecurityErrorMonitoring()

  return (
    <SecurityErrorBoundaryContext.Provider value={{ reportSecurityEvent, securityLevel }}>
      {children}
    </SecurityErrorBoundaryContext.Provider>
  )
}

/**
 * Hook to use security error boundary context
 */
export const useSecurityErrorBoundaryContext = () => {
  return React.useContext(SecurityErrorBoundaryContext)
}
