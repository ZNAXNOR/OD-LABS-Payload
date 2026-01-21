/**
 * Keyboard navigation tests for RichText components
 * Tests keyboard navigation utilities and functionality
 */

import { describe, it, expect } from 'vitest'
import {
  KEYBOARD_CODES,
  DEFAULT_KEYBOARD_CONFIG,
  getFocusableElements,
  getCurrentFocusIndex,
  moveFocus,
  handleArrowKeyNavigation,
  handleHomeEndNavigation,
  handleActivationKeys,
  handleEscapeKey,
  handleKeyboardNavigation,
  createSkipLinkNavigation,
  createFocusTrap,
  createRovingTabindex,
} from '@/components/ui/RichText/utils/keyboardNavigation'

// Mock variable to track focused element in tests
let focusedElement: Element | null = null

describe('RichText Keyboard Navigation', () => {
  describe('Keyboard Constants', () => {
    it('should have correct keyboard codes', () => {
      expect(KEYBOARD_CODES.ENTER).toBe('Enter')
      expect(KEYBOARD_CODES.SPACE).toBe('Space')
      expect(KEYBOARD_CODES.ESCAPE).toBe('Escape')
      expect(KEYBOARD_CODES.ARROW_UP).toBe('ArrowUp')
      expect(KEYBOARD_CODES.ARROW_DOWN).toBe('ArrowDown')
      expect(KEYBOARD_CODES.ARROW_LEFT).toBe('ArrowLeft')
      expect(KEYBOARD_CODES.ARROW_RIGHT).toBe('ArrowRight')
    })

    it('should have default configuration', () => {
      expect(DEFAULT_KEYBOARD_CONFIG.enableArrowKeys).toBe(true)
      expect(DEFAULT_KEYBOARD_CONFIG.enableHomeEnd).toBe(true)
      expect(DEFAULT_KEYBOARD_CONFIG.enableTabNavigation).toBe(true)
      expect(DEFAULT_KEYBOARD_CONFIG.wrapAround).toBe(true)
    })
  })

  describe('Focusable Elements Detection', () => {
    it('should find focusable elements in container', () => {
      // Create a container with focusable elements
      const container = document.createElement('div')
      const button = document.createElement('button')
      const link = document.createElement('a')
      link.href = '#'
      const input = document.createElement('input')

      container.appendChild(button)
      container.appendChild(link)
      container.appendChild(input)
      document.body.appendChild(container)

      const focusableElements = getFocusableElements(container)
      expect(focusableElements).toHaveLength(3)
      expect(focusableElements).toContain(button)
      expect(focusableElements).toContain(link)
      expect(focusableElements).toContain(input)

      // Clean up
      document.body.removeChild(container)
    })

    it('should exclude disabled elements', () => {
      const container = document.createElement('div')
      const enabledButton = document.createElement('button')
      const disabledButton = document.createElement('button')
      disabledButton.disabled = true

      container.appendChild(enabledButton)
      container.appendChild(disabledButton)
      document.body.appendChild(container)

      const focusableElements = getFocusableElements(container)
      expect(focusableElements).toHaveLength(1)
      expect(focusableElements).toContain(enabledButton)
      expect(focusableElements).not.toContain(disabledButton)

      // Clean up
      document.body.removeChild(container)
    })
  })

  describe('Focus Index Management', () => {
    it('should find current focus index correctly', () => {
      const button1 = document.createElement('button')
      const button2 = document.createElement('button')
      const button3 = document.createElement('button')

      const elements = [button1, button2, button3]

      // Test with button2 as active element
      const index = getCurrentFocusIndex(elements, button2)
      expect(index).toBe(1)
    })

    it('should return -1 for unfocused elements', () => {
      const button1 = document.createElement('button')
      const button2 = document.createElement('button')
      const otherElement = document.createElement('div')

      const elements = [button1, button2]

      const index = getCurrentFocusIndex(elements, otherElement)
      expect(index).toBe(-1)
    })
  })

  describe('Focus Movement', () => {
    it('should move focus to next element', () => {
      const button1 = document.createElement('button')
      const button2 = document.createElement('button')
      const button3 = document.createElement('button')

      // Mock focus methods

      button1.focus = () => {
        focusedElement = button1
      }
      button2.focus = () => {
        focusedElement = button2
      }
      button3.focus = () => {
        focusedElement = button3
      }

      const elements = [button1, button2, button3]

      const newIndex = moveFocus(elements, 0, 'next')
      expect(newIndex).toBe(1)
      expect(focusedElement).toBe(button2)
    })

    it('should move focus to previous element', () => {
      const button1 = document.createElement('button')
      const button2 = document.createElement('button')
      const button3 = document.createElement('button')

      // Mock focus methods

      button1.focus = () => {
        focusedElement = button1
      }
      button2.focus = () => {
        focusedElement = button2
      }
      button3.focus = () => {
        focusedElement = button3
      }

      const elements = [button1, button2, button3]

      const newIndex = moveFocus(elements, 2, 'previous')
      expect(newIndex).toBe(1)
      expect(focusedElement).toBe(button2)
    })

    it('should wrap around when configured', () => {
      const button1 = document.createElement('button')
      const button2 = document.createElement('button')

      // Mock focus methods

      button1.focus = () => {
        focusedElement = button1
      }
      button2.focus = () => {
        focusedElement = button2
      }

      const elements = [button1, button2]

      // Move next from last element should wrap to first
      const newIndex = moveFocus(elements, 1, 'next', { wrapAround: true })
      expect(newIndex).toBe(0)
      expect(focusedElement).toBe(button1)
    })
  })

  describe('Arrow Key Navigation', () => {
    it('should handle arrow down navigation', () => {
      const container = document.createElement('div')
      const button1 = document.createElement('button')
      const button2 = document.createElement('button')

      container.appendChild(button1)
      container.appendChild(button2)
      document.body.appendChild(container)

      // Mock focus methods
      button1.focus = () => {
        focusedElement = button1
      }
      button2.focus = () => {
        focusedElement = button2
      }

      // Set initial focus
      button1.focus()
      Object.defineProperty(document, 'activeElement', {
        value: button1,
        configurable: true,
      })

      const mockEvent = {
        code: 'ArrowDown',
        preventDefault: () => {},
      } as KeyboardEvent

      const handled = handleArrowKeyNavigation(mockEvent, container)
      expect(handled).toBe(true)

      // Clean up
      document.body.removeChild(container)
    })

    it('should handle arrow up navigation', () => {
      const container = document.createElement('div')
      const button1 = document.createElement('button')
      const button2 = document.createElement('button')

      container.appendChild(button1)
      container.appendChild(button2)
      document.body.appendChild(container)

      // Mock focus methods

      button1.focus = () => {
        focusedElement = button1
      }
      button2.focus = () => {
        focusedElement = button2
      }

      // Set initial focus to second button
      Object.defineProperty(document, 'activeElement', {
        value: button2,
        configurable: true,
      })

      const mockEvent = {
        code: 'ArrowUp',
        preventDefault: () => {},
      } as KeyboardEvent

      const handled = handleArrowKeyNavigation(mockEvent, container)
      expect(handled).toBe(true)

      // Clean up
      document.body.removeChild(container)
    })
  })

  describe('Home/End Navigation', () => {
    it('should handle Home key navigation', () => {
      const container = document.createElement('div')
      const button1 = document.createElement('button')
      const button2 = document.createElement('button')
      const button3 = document.createElement('button')

      container.appendChild(button1)
      container.appendChild(button2)
      container.appendChild(button3)
      document.body.appendChild(container)

      // Mock focus methods

      button1.focus = () => {
        focusedElement = button1
      }
      button2.focus = () => {
        focusedElement = button2
      }
      button3.focus = () => {
        focusedElement = button3
      }

      const mockEvent = {
        code: 'Home',
        preventDefault: () => {},
      } as KeyboardEvent

      const handled = handleHomeEndNavigation(mockEvent, container)
      expect(handled).toBe(true)
      expect(focusedElement).toBe(button1)

      // Clean up
      document.body.removeChild(container)
    })

    it('should handle End key navigation', () => {
      const container = document.createElement('div')
      const button1 = document.createElement('button')
      const button2 = document.createElement('button')
      const button3 = document.createElement('button')

      container.appendChild(button1)
      container.appendChild(button2)
      container.appendChild(button3)
      document.body.appendChild(container)

      // Mock focus methods

      button1.focus = () => {
        focusedElement = button1
      }
      button2.focus = () => {
        focusedElement = button2
      }
      button3.focus = () => {
        focusedElement = button3
      }

      const mockEvent = {
        code: 'End',
        preventDefault: () => {},
      } as KeyboardEvent

      const handled = handleHomeEndNavigation(mockEvent, container)
      expect(handled).toBe(true)
      expect(focusedElement).toBe(button3)

      // Clean up
      document.body.removeChild(container)
    })
  })

  describe('Activation Keys', () => {
    it('should handle Enter key activation', () => {
      const div = document.createElement('div')
      div.setAttribute('role', 'button')

      let clicked = false
      div.click = () => {
        clicked = true
      }

      const mockEvent = {
        code: 'Enter',
        target: div,
        preventDefault: () => {},
      } as any

      const handled = handleActivationKeys(mockEvent)
      expect(handled).toBe(true)
      expect(clicked).toBe(true)
    })

    it('should handle Space key activation', () => {
      const div = document.createElement('div')
      div.setAttribute('role', 'button')

      let clicked = false
      div.click = () => {
        clicked = true
      }

      const mockEvent = {
        code: 'Space',
        target: div,
        preventDefault: () => {},
      } as any

      const handled = handleActivationKeys(mockEvent)
      expect(handled).toBe(true)
      expect(clicked).toBe(true)
    })
  })

  describe('Escape Key Handling', () => {
    it('should handle Escape key with callback', () => {
      let escapeCalled = false
      const onEscape = () => {
        escapeCalled = true
      }

      const mockEvent = {
        code: 'Escape',
        preventDefault: () => {},
      } as KeyboardEvent

      const handled = handleEscapeKey(mockEvent, onEscape)
      expect(handled).toBe(true)
      expect(escapeCalled).toBe(true)
    })

    it('should not handle non-Escape keys', () => {
      let escapeCalled = false
      const onEscape = () => {
        escapeCalled = true
      }

      const mockEvent = {
        code: 'Enter',
        preventDefault: () => {},
      } as KeyboardEvent

      const handled = handleEscapeKey(mockEvent, onEscape)
      expect(handled).toBe(false)
      expect(escapeCalled).toBe(false)
    })
  })

  describe('Skip Link Navigation', () => {
    it('should create skip links with correct properties', () => {
      const targets = [
        { id: 'main-content', label: 'main content' },
        { id: 'navigation', label: 'navigation' },
      ]

      const skipLinks = createSkipLinkNavigation(targets)

      expect(skipLinks).toHaveLength(2)
      expect(skipLinks[0]?.id).toBe('skip-to-main-content')
      expect(skipLinks[0]?.href).toBe('#main-content')
      expect(skipLinks[0]?.label).toBe('Skip to main content')
      expect(typeof skipLinks[0]?.onClick).toBe('function')
    })

    it('should handle skip link activation', () => {
      const target = document.createElement('div')
      target.id = 'main-content'
      target.tabIndex = -1
      document.body.appendChild(target)

      let focused = false
      target.focus = () => {
        focused = true
      }

      const skipLinks = createSkipLinkNavigation([{ id: 'main-content', label: 'main content' }])

      const mockEvent = {
        preventDefault: () => {},
      } as any

      skipLinks[0]?.onClick(mockEvent)
      expect(focused).toBe(true)

      // Clean up
      document.body.removeChild(target)
    })
  })

  describe('Focus Trap', () => {
    it('should create focus trap with correct methods', () => {
      const container = document.createElement('div')
      const button1 = document.createElement('button')
      const button2 = document.createElement('button')

      container.appendChild(button1)
      container.appendChild(button2)
      document.body.appendChild(container)

      // Mock focus methods

      button1.focus = () => {
        focusedElement = button1
      }
      button2.focus = () => {
        focusedElement = button2
      }

      const focusTrap = createFocusTrap(container)

      expect(typeof focusTrap.destroy).toBe('function')
      expect(typeof focusTrap.focusFirst).toBe('function')
      expect(typeof focusTrap.focusLast).toBe('function')

      // Test focus methods
      focusTrap.focusFirst()
      expect(focusedElement).toBe(button1)

      focusTrap.focusLast()
      expect(focusedElement).toBe(button2)

      // Clean up
      focusTrap.destroy()
      document.body.removeChild(container)
    })
  })

  describe('Roving Tabindex', () => {
    it('should create roving tabindex with correct methods', () => {
      const container = document.createElement('div')
      const button1 = document.createElement('button')
      const button2 = document.createElement('button')

      container.appendChild(button1)
      container.appendChild(button2)
      document.body.appendChild(container)

      const rovingTabindex = createRovingTabindex(container)

      expect(typeof rovingTabindex.destroy).toBe('function')
      expect(typeof rovingTabindex.setActiveIndex).toBe('function')
      expect(typeof rovingTabindex.getCurrentIndex).toBe('function')

      // Test initial state
      expect(rovingTabindex.getCurrentIndex()).toBe(0)
      expect(button1.getAttribute('tabindex')).toBe('0')
      expect(button2.getAttribute('tabindex')).toBe('-1')

      // Clean up
      rovingTabindex.destroy()
      document.body.removeChild(container)
    })
  })

  describe('Integration Tests', () => {
    it('should handle comprehensive keyboard navigation', () => {
      const container = document.createElement('div')
      const button1 = document.createElement('button')
      const button2 = document.createElement('button')
      const link = document.createElement('a')
      link.href = '#'

      container.appendChild(button1)
      container.appendChild(button2)
      container.appendChild(link)
      document.body.appendChild(container)

      // Mock focus methods

      button1.focus = () => {
        focusedElement = button1
      }
      button2.focus = () => {
        focusedElement = button2
      }
      link.focus = () => {
        focusedElement = link
      }

      // Test arrow key navigation
      const arrowEvent = {
        code: 'ArrowDown',
        preventDefault: () => {},
      } as KeyboardEvent

      const handled = handleKeyboardNavigation(arrowEvent, container)
      expect(handled).toBe(true)

      // Test Home key navigation
      const homeEvent = {
        code: 'Home',
        preventDefault: () => {},
      } as KeyboardEvent

      const homeHandled = handleKeyboardNavigation(homeEvent, container)
      expect(homeHandled).toBe(true)

      // Clean up
      document.body.removeChild(container)
    })
  })

  describe('Error Handling', () => {
    it('should handle empty containers gracefully', () => {
      const container = document.createElement('div')
      document.body.appendChild(container)

      const focusableElements = getFocusableElements(container)
      expect(focusableElements).toHaveLength(0)

      const mockEvent = {
        code: 'ArrowDown',
        preventDefault: () => {},
      } as KeyboardEvent

      const handled = handleArrowKeyNavigation(mockEvent, container)
      expect(handled).toBe(false)

      // Clean up
      document.body.removeChild(container)
    })

    it('should handle invalid focus movements', () => {
      const elements: HTMLElement[] = []
      const newIndex = moveFocus(elements, 0, 'next')
      expect(newIndex).toBe(-1)
    })
  })
})
