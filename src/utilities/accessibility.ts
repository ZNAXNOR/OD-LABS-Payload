/**
 * Accessibility utilities for WCAG 2.1 AA compliance
 */

/**
 * Calculate relative luminance of a color
 * Used for contrast ratio calculations
 */
export function getRelativeLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    const sRGB = c / 255
    return sRGB <= 0.03928 ? sRGB / 12.92 : Math.pow((sRGB + 0.055) / 1.055, 2.4)
  })
  return 0.2126 * (rs ?? 0) + 0.7152 * (gs ?? 0) + 0.0722 * (bs ?? 0)
}

/**
 * Calculate contrast ratio between two colors
 * WCAG 2.1 AA requires:
 * - 4.5:1 for normal text
 * - 3:1 for large text (18pt+ or 14pt+ bold)
 */
export function getContrastRatio(
  color1: { r: number; g: number; b: number },
  color2: { r: number; g: number; b: number },
): number {
  const l1 = getRelativeLuminance(color1.r, color1.g, color1.b)
  const l2 = getRelativeLuminance(color2.r, color2.g, color2.b)
  const lighter = Math.max(l1, l2)
  const darker = Math.min(l1, l2)
  return (lighter + 0.05) / (darker + 0.05)
}

/**
 * Check if contrast ratio meets WCAG AA standards
 */
export function meetsContrastAA(
  foreground: { r: number; g: number; b: number },
  background: { r: number; g: number; b: number },
  isLargeText = false,
): boolean {
  const ratio = getContrastRatio(foreground, background)
  return isLargeText ? ratio >= 3 : ratio >= 4.5
}

/**
 * Generate accessible label for screen readers
 */
export function generateAriaLabel(element: string, context?: string, action?: string): string {
  const parts = [element]
  if (context) parts.push(context)
  if (action) parts.push(action)
  return parts.join(', ')
}

/**
 * Get keyboard navigation attributes
 */
export function getKeyboardNavAttrs(isInteractive: boolean) {
  if (!isInteractive) return {}

  return {
    tabIndex: 0,
    role: 'button',
  }
}

/**
 * Generate skip link for keyboard navigation
 */
export function generateSkipLink(targetId: string, label: string) {
  return {
    href: `#${targetId}`,
    'aria-label': `Skip to ${label}`,
    className:
      'sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-brand-primary focus:text-white focus:rounded',
  }
}

/**
 * Announce to screen readers dynamically
 */
export function announceToScreenReader(
  message: string,
  priority: 'polite' | 'assertive' = 'polite',
) {
  if (typeof document === 'undefined') return

  const announcement = document.createElement('div')
  announcement.setAttribute('role', 'status')
  announcement.setAttribute('aria-live', priority)
  announcement.setAttribute('aria-atomic', 'true')
  announcement.className = 'sr-only'
  announcement.textContent = message

  document.body.appendChild(announcement)

  setTimeout(() => {
    document.body.removeChild(announcement)
  }, 1000)
}

/**
 * Focus management utilities
 */
export const focusManagement = {
  /**
   * Trap focus within an element (for modals, dialogs)
   */
  trapFocus(element: HTMLElement) {
    const focusableElements = element.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
    )

    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement?.focus()
          e.preventDefault()
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement?.focus()
          e.preventDefault()
        }
      }
    }

    element.addEventListener('keydown', handleTabKey)
    return () => element.removeEventListener('keydown', handleTabKey)
  },

  /**
   * Return focus to previous element
   */
  returnFocus(previousElement: HTMLElement | null) {
    if (previousElement && typeof previousElement.focus === 'function') {
      previousElement.focus()
    }
  },
}

/**
 * ARIA live region utilities
 */
export const liveRegion = {
  /**
   * Create a live region for dynamic content updates
   */
  create(priority: 'polite' | 'assertive' = 'polite'): HTMLDivElement {
    const region = document.createElement('div')
    region.setAttribute('role', 'status')
    region.setAttribute('aria-live', priority)
    region.setAttribute('aria-atomic', 'true')
    region.className = 'sr-only'
    document.body.appendChild(region)
    return region
  },

  /**
   * Update live region content
   */
  update(region: HTMLElement, message: string) {
    region.textContent = message
  },

  /**
   * Remove live region
   */
  remove(region: HTMLElement) {
    if (region.parentNode) {
      region.parentNode.removeChild(region)
    }
  },
}
