/**
 * Keyboard navigation utilities for RichText components
 * Provides comprehensive keyboard support for accessibility
 */

import React from 'react'

/**
 * Keyboard event codes for navigation
 */
export const KEYBOARD_CODES = {
  ENTER: 'Enter',
  SPACE: 'Space',
  ESCAPE: 'Escape',
  TAB: 'Tab',
  ARROW_UP: 'ArrowUp',
  ARROW_DOWN: 'ArrowDown',
  ARROW_LEFT: 'ArrowLeft',
  ARROW_RIGHT: 'ArrowRight',
  HOME: 'Home',
  END: 'End',
  PAGE_UP: 'PageUp',
  PAGE_DOWN: 'PageDown',
} as const

/**
 * Keyboard navigation configuration
 */
export interface KeyboardNavConfig {
  enableArrowKeys?: boolean
  enableHomeEnd?: boolean
  enablePageUpDown?: boolean
  enableTabNavigation?: boolean
  enableEscapeKey?: boolean
  enableEnterActivation?: boolean
  enableSpaceActivation?: boolean
  wrapAround?: boolean
  skipDisabled?: boolean
}

/**
 * Default keyboard navigation configuration
 */
export const DEFAULT_KEYBOARD_CONFIG: KeyboardNavConfig = {
  enableArrowKeys: true,
  enableHomeEnd: true,
  enablePageUpDown: false,
  enableTabNavigation: true,
  enableEscapeKey: true,
  enableEnterActivation: true,
  enableSpaceActivation: true,
  wrapAround: true,
  skipDisabled: true,
}

/**
 * Get all focusable elements within a container
 */
export const getFocusableElements = (container: HTMLElement): HTMLElement[] => {
  const focusableSelectors = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'textarea:not([disabled])',
    'select:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
    '[role="button"]:not([disabled])',
    '[role="link"]',
    '[role="tab"]',
    '[role="menuitem"]',
    '[role="option"]',
  ].join(', ')

  return Array.from(container.querySelectorAll<HTMLElement>(focusableSelectors)).filter(
    (element) => {
      // Additional checks for visibility and interactivity
      const style = window.getComputedStyle(element)
      return (
        style.display !== 'none' &&
        style.visibility !== 'hidden' &&
        !element.hasAttribute('aria-hidden') &&
        element.offsetWidth > 0 &&
        element.offsetHeight > 0
      )
    },
  )
}

/**
 * Find the currently focused element within a container
 */
export const getCurrentFocusIndex = (
  focusableElements: HTMLElement[],
  activeElement: Element | null = document.activeElement,
): number => {
  if (!activeElement) return -1
  return focusableElements.findIndex((element) => element === activeElement)
}

/**
 * Move focus to the next/previous element
 */
export const moveFocus = (
  focusableElements: HTMLElement[],
  currentIndex: number,
  direction: 'next' | 'previous',
  config: KeyboardNavConfig = DEFAULT_KEYBOARD_CONFIG,
): number => {
  if (focusableElements.length === 0) return -1

  let newIndex = currentIndex
  const increment = direction === 'next' ? 1 : -1

  do {
    newIndex += increment

    // Handle wrapping
    if (config.wrapAround) {
      if (newIndex >= focusableElements.length) newIndex = 0
      if (newIndex < 0) newIndex = focusableElements.length - 1
    } else {
      if (newIndex >= focusableElements.length || newIndex < 0) return currentIndex
    }

    // Check if we've looped back to start (prevent infinite loop)
    if (newIndex === currentIndex) break
  } while (config.skipDisabled && focusableElements[newIndex]?.hasAttribute('disabled'))

  // Focus the new element
  focusableElements[newIndex]?.focus()
  return newIndex
}

/**
 * Handle arrow key navigation
 */
export const handleArrowKeyNavigation = (
  event: KeyboardEvent,
  container: HTMLElement,
  config: KeyboardNavConfig = DEFAULT_KEYBOARD_CONFIG,
): boolean => {
  if (!config.enableArrowKeys) return false

  const { code } = event
  if (
    ![
      KEYBOARD_CODES.ARROW_UP,
      KEYBOARD_CODES.ARROW_DOWN,
      KEYBOARD_CODES.ARROW_LEFT,
      KEYBOARD_CODES.ARROW_RIGHT,
    ].includes(code as any)
  ) {
    return false
  }

  const focusableElements = getFocusableElements(container)
  const currentIndex = getCurrentFocusIndex(focusableElements)

  let direction: 'next' | 'previous'

  // Determine direction based on arrow key and layout
  if (code === KEYBOARD_CODES.ARROW_DOWN || code === KEYBOARD_CODES.ARROW_RIGHT) {
    direction = 'next'
  } else {
    direction = 'previous'
  }

  const newIndex = moveFocus(focusableElements, currentIndex, direction, config)

  if (newIndex !== currentIndex) {
    event.preventDefault()
    return true
  }

  return false
}

/**
 * Handle Home/End key navigation
 */
export const handleHomeEndNavigation = (
  event: KeyboardEvent,
  container: HTMLElement,
  config: KeyboardNavConfig = DEFAULT_KEYBOARD_CONFIG,
): boolean => {
  if (!config.enableHomeEnd) return false

  const { code } = event
  if (![KEYBOARD_CODES.HOME, KEYBOARD_CODES.END].includes(code as any)) {
    return false
  }

  const focusableElements = getFocusableElements(container)
  if (focusableElements.length === 0) return false

  let targetIndex: number

  if (code === KEYBOARD_CODES.HOME) {
    targetIndex = 0
  } else {
    targetIndex = focusableElements.length - 1
  }

  // Skip disabled elements if configured
  if (config.skipDisabled) {
    while (
      targetIndex >= 0 &&
      targetIndex < focusableElements.length &&
      focusableElements[targetIndex]?.hasAttribute('disabled')
    ) {
      targetIndex += code === KEYBOARD_CODES.HOME ? 1 : -1
    }
  }

  if (targetIndex >= 0 && targetIndex < focusableElements.length) {
    focusableElements[targetIndex]?.focus()
    event.preventDefault()
    return true
  }

  return false
}

/**
 * Handle Enter/Space activation
 */
export const handleActivationKeys = (
  event: KeyboardEvent,
  config: KeyboardNavConfig = DEFAULT_KEYBOARD_CONFIG,
): boolean => {
  const { code } = event
  const target = event.target as HTMLElement

  if (!target) return false

  const isEnter = code === KEYBOARD_CODES.ENTER && config.enableEnterActivation
  const isSpace = code === KEYBOARD_CODES.SPACE && config.enableSpaceActivation

  if (!isEnter && !isSpace) return false

  // Don't activate if target is already an interactive element that handles these keys
  if (['INPUT', 'TEXTAREA', 'SELECT', 'BUTTON'].includes(target.tagName)) {
    return false
  }

  // Check for role-based interactive elements
  const role = target.getAttribute('role')
  if (['button', 'link', 'tab', 'menuitem', 'option'].includes(role || '')) {
    // Simulate click
    target.click()
    event.preventDefault()
    return true
  }

  return false
}

/**
 * Handle Escape key
 */
export const handleEscapeKey = (
  event: KeyboardEvent,
  onEscape?: () => void,
  config: KeyboardNavConfig = DEFAULT_KEYBOARD_CONFIG,
): boolean => {
  if (!config.enableEscapeKey || event.code !== KEYBOARD_CODES.ESCAPE) {
    return false
  }

  if (onEscape) {
    onEscape()
    event.preventDefault()
    return true
  }

  return false
}

/**
 * Comprehensive keyboard navigation handler
 */
export const handleKeyboardNavigation = (
  event: KeyboardEvent,
  container: HTMLElement,
  options?: {
    config?: KeyboardNavConfig
    onEscape?: () => void
    onActivate?: (element: HTMLElement) => void
  },
): boolean => {
  const config = { ...DEFAULT_KEYBOARD_CONFIG, ...options?.config }

  // Handle different types of keyboard navigation
  if (handleArrowKeyNavigation(event, container, config)) return true
  if (handleHomeEndNavigation(event, container, config)) return true
  if (handleActivationKeys(event, config)) return true
  if (handleEscapeKey(event, options?.onEscape, config)) return true

  return false
}

/**
 * Create keyboard navigation hook for React components
 */
export const useKeyboardNavigation = (
  containerRef: React.RefObject<HTMLElement>,
  config: KeyboardNavConfig = DEFAULT_KEYBOARD_CONFIG,
  options?: {
    onEscape?: () => void
    onActivate?: (element: HTMLElement) => void
  },
) => {
  const handleKeyDown = React.useCallback(
    (event: KeyboardEvent) => {
      if (!containerRef.current) return

      handleKeyboardNavigation(event, containerRef.current, {
        config,
        ...options,
      })
    },
    [containerRef, config, options],
  )

  React.useEffect(() => {
    const container = containerRef.current
    if (!container) return

    container.addEventListener('keydown', handleKeyDown)
    return () => container.removeEventListener('keydown', handleKeyDown)
  }, [containerRef, handleKeyDown])

  return {
    focusFirst: () => {
      if (!containerRef.current) return
      const focusableElements = getFocusableElements(containerRef.current)
      focusableElements[0]?.focus()
    },
    focusLast: () => {
      if (!containerRef.current) return
      const focusableElements = getFocusableElements(containerRef.current)
      focusableElements[focusableElements.length - 1]?.focus()
    },
    getFocusableCount: () => {
      if (!containerRef.current) return 0
      return getFocusableElements(containerRef.current).length
    },
  }
}

/**
 * Skip link navigation utilities
 */
export const createSkipLinkNavigation = (targets: Array<{ id: string; label: string }>) => {
  return targets.map(({ id, label }) => ({
    id: `skip-to-${id}`,
    href: `#${id}`,
    label: `Skip to ${label}`,
    onClick: (event: React.MouseEvent) => {
      event.preventDefault()
      const target = document.getElementById(id)
      if (target) {
        target.focus()
        target.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    },
    onKeyDown: (event: React.KeyboardEvent) => {
      if (event.code === KEYBOARD_CODES.ENTER || event.code === KEYBOARD_CODES.SPACE) {
        event.preventDefault()
        const target = document.getElementById(id)
        if (target) {
          target.focus()
          target.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }
    },
  }))
}

/**
 * Focus trap utilities for modals and dialogs
 */
export const createFocusTrap = (container: HTMLElement) => {
  const focusableElements = getFocusableElements(container)
  const firstElement = focusableElements[0]
  const lastElement = focusableElements[focusableElements.length - 1]

  const handleTabKey = (event: KeyboardEvent) => {
    if (event.code !== KEYBOARD_CODES.TAB) return

    if (event.shiftKey) {
      if (document.activeElement === firstElement) {
        lastElement?.focus()
        event.preventDefault()
      }
    } else {
      if (document.activeElement === lastElement) {
        firstElement?.focus()
        event.preventDefault()
      }
    }
  }

  container.addEventListener('keydown', handleTabKey)

  // Focus the first element initially
  firstElement?.focus()

  return {
    destroy: () => container.removeEventListener('keydown', handleTabKey),
    focusFirst: () => firstElement?.focus(),
    focusLast: () => lastElement?.focus(),
  }
}

/**
 * Roving tabindex implementation for complex widgets
 */
export const createRovingTabindex = (
  container: HTMLElement,
  config: KeyboardNavConfig = DEFAULT_KEYBOARD_CONFIG,
) => {
  const focusableElements = getFocusableElements(container)
  let currentIndex = 0

  // Set initial tabindex values
  focusableElements.forEach((element, index) => {
    element.setAttribute('tabindex', index === currentIndex ? '0' : '-1')
  })

  const updateTabindex = (newIndex: number) => {
    if (newIndex < 0 || newIndex >= focusableElements.length) return

    // Remove tabindex from current element
    focusableElements[currentIndex]?.setAttribute('tabindex', '-1')

    // Set tabindex on new element
    focusableElements[newIndex]?.setAttribute('tabindex', '0')
    focusableElements[newIndex]?.focus()

    currentIndex = newIndex
  }

  const handleKeyDown = (event: KeyboardEvent) => {
    handleKeyboardNavigation(event, container, {
      config,
      onActivate: (element) => {
        const index = focusableElements.indexOf(element)
        if (index !== -1) updateTabindex(index)
      },
    })
  }

  container.addEventListener('keydown', handleKeyDown)

  return {
    destroy: () => container.removeEventListener('keydown', handleKeyDown),
    setActiveIndex: updateTabindex,
    getCurrentIndex: () => currentIndex,
  }
}

/**
 * Keyboard navigation for specific component types
 */
export const componentKeyboardHandlers = {
  /**
   * Accordion keyboard navigation
   */
  accordion: (
    event: KeyboardEvent,
    panels: HTMLElement[],
    currentIndex: number,
    onToggle: (index: number) => void,
  ) => {
    const { code } = event

    switch (code) {
      case KEYBOARD_CODES.ARROW_DOWN:
      case KEYBOARD_CODES.ARROW_RIGHT:
        event.preventDefault()
        const nextIndex = (currentIndex + 1) % panels.length
        panels[nextIndex]?.focus()
        break

      case KEYBOARD_CODES.ARROW_UP:
      case KEYBOARD_CODES.ARROW_LEFT:
        event.preventDefault()
        const prevIndex = currentIndex === 0 ? panels.length - 1 : currentIndex - 1
        panels[prevIndex]?.focus()
        break

      case KEYBOARD_CODES.HOME:
        event.preventDefault()
        panels[0]?.focus()
        break

      case KEYBOARD_CODES.END:
        event.preventDefault()
        panels[panels.length - 1]?.focus()
        break

      case KEYBOARD_CODES.ENTER:
      case KEYBOARD_CODES.SPACE:
        event.preventDefault()
        onToggle(currentIndex)
        break
    }
  },

  /**
   * Tab navigation keyboard handler
   */
  tabs: (
    event: KeyboardEvent,
    tabs: HTMLElement[],
    currentIndex: number,
    onSelect: (index: number) => void,
  ) => {
    const { code } = event

    switch (code) {
      case KEYBOARD_CODES.ARROW_LEFT:
        event.preventDefault()
        const prevIndex = currentIndex === 0 ? tabs.length - 1 : currentIndex - 1
        tabs[prevIndex]?.focus()
        onSelect(prevIndex)
        break

      case KEYBOARD_CODES.ARROW_RIGHT:
        event.preventDefault()
        const nextIndex = (currentIndex + 1) % tabs.length
        tabs[nextIndex]?.focus()
        onSelect(nextIndex)
        break

      case KEYBOARD_CODES.HOME:
        event.preventDefault()
        tabs[0]?.focus()
        onSelect(0)
        break

      case KEYBOARD_CODES.END:
        event.preventDefault()
        const lastIndex = tabs.length - 1
        tabs[lastIndex]?.focus()
        onSelect(lastIndex)
        break
    }
  },
}
