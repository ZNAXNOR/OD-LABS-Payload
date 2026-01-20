import React from 'react'
import { cn } from '@/utilities/ui'

// Touch interaction constants
export const TOUCH_CONSTANTS = {
  // Minimum touch target size (WCAG AA standard)
  MIN_TOUCH_TARGET_SIZE: 44, // 44px

  // Recommended touch target size for better UX
  RECOMMENDED_TOUCH_TARGET_SIZE: 48, // 48px

  // Touch feedback duration
  TOUCH_FEEDBACK_DURATION: 150, // 150ms

  // Touch delay for preventing accidental taps
  TOUCH_DELAY: 300, // 300ms

  // Scroll threshold for touch vs scroll detection
  SCROLL_THRESHOLD: 10, // 10px
} as const

// Touch device detection
export const isTouchDevice = (): boolean => {
  if (typeof window === 'undefined') return false

  return (
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    // @ts-ignore - Legacy support
    navigator.msMaxTouchPoints > 0
  )
}

// Check if device supports hover
export const supportsHover = (): boolean => {
  if (typeof window === 'undefined') return true

  return window.matchMedia('(hover: hover)').matches
}

// Check if device has fine pointer (mouse)
export const hasFinePointer = (): boolean => {
  if (typeof window === 'undefined') return true

  return window.matchMedia('(pointer: fine)').matches
}

// Touch-friendly button classes
export const getTouchButtonClasses = (size: 'sm' | 'md' | 'lg' = 'md'): string => {
  const baseClasses = cn(
    'inline-flex items-center justify-center',
    'rounded-md font-medium transition-all duration-150',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
    'disabled:opacity-50 disabled:pointer-events-none',
    'ring-offset-background',
    'touch-manipulation', // Optimize for touch
    'select-none', // Prevent text selection
    'cursor-pointer',
    // Touch feedback
    'active:scale-95 active:transition-transform active:duration-75',
    // Ensure minimum touch target size
    'min-h-[44px] min-w-[44px]',
  )

  switch (size) {
    case 'sm':
      return cn(baseClasses, 'h-11 px-4 text-sm', 'min-h-[44px]')
    case 'md':
      return cn(baseClasses, 'h-12 px-6 text-base', 'min-h-[48px]')
    case 'lg':
      return cn(baseClasses, 'h-14 px-8 text-lg', 'min-h-[56px]')
    default:
      return cn(baseClasses, 'h-12 px-6 text-base', 'min-h-[48px]')
  }
}

// Touch-friendly link classes
export const getTouchLinkClasses = (): string => {
  return cn(
    'inline-flex items-center',
    'min-h-[44px] min-w-[44px]', // Minimum touch target
    'py-2 px-1', // Padding to increase touch area
    'touch-manipulation',
    'transition-colors duration-150',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2',
    'active:opacity-70 active:transition-opacity active:duration-75',
    // Hover effects only on devices that support hover
    'hover:text-blue-600 hover:underline',
    '@media (hover: none) { hover:no-underline hover:text-current }', // Remove hover on touch devices
  )
}

// Touch-friendly input classes
export const getTouchInputClasses = (): string => {
  return cn(
    'w-full',
    'min-h-[44px]', // Minimum touch target height
    'px-4 py-3', // Adequate padding for touch
    'text-base', // Prevent zoom on iOS
    'border border-input',
    'rounded-md',
    'bg-background',
    'transition-colors duration-150',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
    'disabled:cursor-not-allowed disabled:opacity-50',
    'touch-manipulation',
    // iOS specific fixes
    'appearance-none', // Remove default styling
    '-webkit-appearance-none', // Remove iOS styling
  )
}

// Touch-friendly form classes
export const getTouchFormClasses = (): string => {
  return cn(
    'space-y-4', // Adequate spacing between form elements
    'touch-manipulation',
  )
}

// Touch-friendly card/clickable area classes
export const getTouchCardClasses = (): string => {
  return cn(
    'block w-full',
    'min-h-[44px]', // Minimum touch target
    'p-4', // Adequate padding
    'rounded-lg',
    'border border-border',
    'bg-card text-card-foreground',
    'transition-all duration-150',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
    'active:scale-[0.98] active:transition-transform active:duration-75',
    'touch-manipulation',
    'cursor-pointer',
    // Hover effects only on devices that support hover
    'hover:bg-accent hover:text-accent-foreground',
    '@media (hover: none) { hover:bg-card hover:text-card-foreground }',
  )
}

// Touch-friendly navigation classes
export const getTouchNavClasses = (): string => {
  return cn('flex flex-col sm:flex-row', 'gap-2 sm:gap-4', 'touch-manipulation')
}

// Touch-friendly navigation item classes
export const getTouchNavItemClasses = (): string => {
  return cn(
    'flex items-center',
    'min-h-[44px] min-w-[44px]',
    'px-4 py-2',
    'rounded-md',
    'text-sm font-medium',
    'transition-colors duration-150',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
    'active:bg-accent active:text-accent-foreground active:transition-colors active:duration-75',
    'touch-manipulation',
    'cursor-pointer',
    // Hover effects only on devices that support hover
    'hover:bg-accent hover:text-accent-foreground',
    '@media (hover: none) { hover:bg-transparent hover:text-current }',
  )
}

// Touch-friendly accordion/collapsible trigger classes
export const getTouchAccordionTriggerClasses = (): string => {
  return cn(
    'flex w-full items-center justify-between',
    'min-h-[44px]',
    'px-4 py-3',
    'text-left font-medium',
    'transition-all duration-150',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
    'active:bg-accent active:text-accent-foreground active:transition-colors active:duration-75',
    'touch-manipulation',
    'cursor-pointer',
    '[&[data-state=open]>svg]:rotate-180',
    // Hover effects only on devices that support hover
    'hover:bg-accent hover:text-accent-foreground',
    '@media (hover: none) { hover:bg-transparent hover:text-current }',
  )
}

// Touch-friendly tab classes
export const getTouchTabClasses = (): string => {
  return cn(
    'inline-flex items-center justify-center',
    'min-h-[44px] min-w-[44px]',
    'px-4 py-2',
    'text-sm font-medium',
    'border-b-2 border-transparent',
    'transition-all duration-150',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
    'active:bg-accent active:text-accent-foreground active:transition-colors active:duration-75',
    'touch-manipulation',
    'cursor-pointer',
    'data-[state=active]:border-primary data-[state=active]:text-primary',
    // Hover effects only on devices that support hover
    'hover:bg-accent hover:text-accent-foreground',
    '@media (hover: none) { hover:bg-transparent hover:text-current }',
  )
}

// Touch-friendly slider/range classes
export const getTouchSliderClasses = (): string => {
  return cn(
    'relative flex w-full touch-none select-none items-center',
    'min-h-[44px]', // Ensure adequate touch area
    'touch-manipulation',
  )
}

// Touch-friendly slider thumb classes
export const getTouchSliderThumbClasses = (): string => {
  return cn(
    'block h-6 w-6', // Larger thumb for easier touch interaction
    'min-h-[24px] min-w-[24px]',
    'rounded-full',
    'border-2 border-primary',
    'bg-background',
    'transition-colors duration-150',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
    'disabled:pointer-events-none disabled:opacity-50',
    'touch-manipulation',
    'cursor-grab active:cursor-grabbing',
  )
}

// Touch gesture utilities
export interface TouchGestureOptions {
  onTap?: (event: TouchEvent) => void
  onDoubleTap?: (event: TouchEvent) => void
  onLongPress?: (event: TouchEvent) => void
  onSwipeLeft?: (event: TouchEvent) => void
  onSwipeRight?: (event: TouchEvent) => void
  onSwipeUp?: (event: TouchEvent) => void
  onSwipeDown?: (event: TouchEvent) => void
  longPressDelay?: number
  swipeThreshold?: number
  doubleTapDelay?: number
}

// Touch gesture handler
export class TouchGestureHandler {
  private element: HTMLElement
  private options: TouchGestureOptions
  private touchStartTime: number = 0
  private touchStartPosition: { x: number; y: number } = { x: 0, y: 0 }
  private lastTapTime: number = 0
  private longPressTimer: NodeJS.Timeout | null = null

  constructor(element: HTMLElement, options: TouchGestureOptions) {
    this.element = element
    this.options = {
      longPressDelay: 500,
      swipeThreshold: 50,
      doubleTapDelay: 300,
      ...options,
    }

    this.bindEvents()
  }

  private bindEvents(): void {
    this.element.addEventListener('touchstart', this.handleTouchStart.bind(this), {
      passive: false,
    })
    this.element.addEventListener('touchend', this.handleTouchEnd.bind(this), { passive: false })
    this.element.addEventListener('touchmove', this.handleTouchMove.bind(this), { passive: false })
    this.element.addEventListener('touchcancel', this.handleTouchCancel.bind(this))
  }

  private handleTouchStart(event: TouchEvent): void {
    const touch = event.touches[0]
    if (!touch) return

    this.touchStartTime = Date.now()
    this.touchStartPosition = { x: touch.clientX, y: touch.clientY }

    // Start long press timer
    if (this.options.onLongPress) {
      this.longPressTimer = setTimeout(() => {
        this.options.onLongPress?.(event)
      }, this.options.longPressDelay)
    }
  }

  private handleTouchMove(event: TouchEvent): void {
    const touch = event.touches[0]
    if (!touch) return

    const deltaX = Math.abs(touch.clientX - this.touchStartPosition.x)
    const deltaY = Math.abs(touch.clientY - this.touchStartPosition.y)

    // Cancel long press if finger moves too much
    if (deltaX > 10 || deltaY > 10) {
      this.cancelLongPress()
    }
  }

  private handleTouchEnd(event: TouchEvent): void {
    this.cancelLongPress()

    const touch = event.changedTouches[0]
    if (!touch) return

    const deltaX = touch.clientX - this.touchStartPosition.x
    const deltaY = touch.clientY - this.touchStartPosition.y
    const deltaTime = Date.now() - this.touchStartTime

    // Check for swipe gestures
    if (
      Math.abs(deltaX) > this.options.swipeThreshold! ||
      Math.abs(deltaY) > this.options.swipeThreshold!
    ) {
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // Horizontal swipe
        if (deltaX > 0) {
          this.options.onSwipeRight?.(event)
        } else {
          this.options.onSwipeLeft?.(event)
        }
      } else {
        // Vertical swipe
        if (deltaY > 0) {
          this.options.onSwipeDown?.(event)
        } else {
          this.options.onSwipeUp?.(event)
        }
      }
      return
    }

    // Check for tap gestures
    if (deltaTime < 300 && Math.abs(deltaX) < 10 && Math.abs(deltaY) < 10) {
      const now = Date.now()

      // Check for double tap
      if (this.options.onDoubleTap && now - this.lastTapTime < this.options.doubleTapDelay!) {
        this.options.onDoubleTap(event)
        this.lastTapTime = 0 // Reset to prevent triple tap
      } else {
        // Single tap
        this.lastTapTime = now
        setTimeout(() => {
          if (this.lastTapTime === now) {
            this.options.onTap?.(event)
          }
        }, this.options.doubleTapDelay)
      }
    }
  }

  private handleTouchCancel(): void {
    this.cancelLongPress()
  }

  private cancelLongPress(): void {
    if (this.longPressTimer) {
      clearTimeout(this.longPressTimer)
      this.longPressTimer = null
    }
  }

  public destroy(): void {
    this.element.removeEventListener('touchstart', this.handleTouchStart.bind(this))
    this.element.removeEventListener('touchend', this.handleTouchEnd.bind(this))
    this.element.removeEventListener('touchmove', this.handleTouchMove.bind(this))
    this.element.removeEventListener('touchcancel', this.handleTouchCancel.bind(this))
    this.cancelLongPress()
  }
}

// React hook for touch gestures
export const useTouchGestures = (
  ref: React.RefObject<HTMLElement>,
  options: TouchGestureOptions,
): void => {
  React.useEffect(() => {
    if (!ref.current || !isTouchDevice()) return

    const handler = new TouchGestureHandler(ref.current, options)

    return () => {
      handler.destroy()
    }
  }, [ref, options])
}

// Touch-friendly spacing utilities
export const getTouchSpacingClasses = (size: 'sm' | 'md' | 'lg' = 'md'): string => {
  switch (size) {
    case 'sm':
      return 'space-y-2 sm:space-y-3'
    case 'md':
      return 'space-y-3 sm:space-y-4'
    case 'lg':
      return 'space-y-4 sm:space-y-6'
    default:
      return 'space-y-3 sm:space-y-4'
  }
}

// Touch-friendly grid classes
export const getTouchGridClasses = (
  mobile: number = 1,
  tablet: number = 2,
  desktop: number = 3,
): string => {
  return cn(
    'grid gap-3 sm:gap-4 lg:gap-6', // Adequate spacing for touch
    `grid-cols-${mobile}`,
    `sm:grid-cols-${tablet}`,
    `lg:grid-cols-${desktop}`,
  )
}

// Block-specific touch classes
export const getBlockTouchClasses = (blockType: string): string => {
  switch (blockType) {
    case 'cta':
      return cn(getTouchButtonClasses('lg'), 'w-full sm:w-auto')

    case 'contactForm':
    case 'newsletter':
      return cn(getTouchFormClasses(), 'max-w-md mx-auto')

    case 'faqAccordion':
      return cn(getTouchAccordionTriggerClasses(), 'border-b border-border last:border-b-0')

    case 'testimonial':
      return cn(getTouchCardClasses(), 'text-center')

    case 'pricingTable':
      return cn(getTouchCardClasses(), 'h-full flex flex-col')

    case 'banner':
      return cn('min-h-[44px]', 'px-4 py-3', 'touch-manipulation')

    case 'timeline':
      return cn(getTouchCardClasses(), 'relative')

    case 'statsCounter':
      return cn('min-h-[44px]', 'p-4', 'text-center', 'touch-manipulation')

    case 'servicesGrid':
    case 'featureGrid':
      return cn(getTouchCardClasses(), 'text-center h-full')

    case 'archive':
      return cn(getTouchCardClasses(), 'mb-4')

    default:
      return cn('touch-manipulation', 'min-h-[44px]')
  }
}

// Accessibility improvements for touch
export const getTouchA11yClasses = (): string => {
  return cn(
    // Focus styles for keyboard users
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2',

    // Ensure adequate contrast
    'focus-visible:ring-offset-background',

    // Remove tap highlight on mobile
    'tap-highlight-transparent',
    '-webkit-tap-highlight-color-transparent',

    // Optimize for touch
    'touch-manipulation',

    // Prevent text selection on interactive elements
    'select-none',
  )
}

// Export all utilities
export const touchUtils = {
  TOUCH_CONSTANTS,
  isTouchDevice,
  supportsHover,
  hasFinePointer,
  getTouchButtonClasses,
  getTouchLinkClasses,
  getTouchInputClasses,
  getTouchFormClasses,
  getTouchCardClasses,
  getTouchNavClasses,
  getTouchNavItemClasses,
  getTouchAccordionTriggerClasses,
  getTouchTabClasses,
  getTouchSliderClasses,
  getTouchSliderThumbClasses,
  TouchGestureHandler,
  useTouchGestures,
  getTouchSpacingClasses,
  getTouchGridClasses,
  getBlockTouchClasses,
  getTouchA11yClasses,
}
