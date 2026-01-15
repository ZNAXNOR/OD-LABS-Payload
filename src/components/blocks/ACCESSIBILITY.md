# Accessibility Implementation Guide

This document outlines the accessibility features implemented across all block components to ensure WCAG 2.1 AA compliance.

## Overview

All block components have been designed and implemented with accessibility as a core requirement. This includes:

- Proper semantic HTML structure
- ARIA labels and attributes
- Keyboard navigation support
- Color contrast compliance
- Screen reader compatibility
- Focus management
- Reduced motion support

## General Accessibility Features

### 1. Semantic HTML

All components use proper semantic HTML elements:

- `<section>` for major content sections
- `<article>` for self-contained content
- `<nav>` for navigation
- `<header>` and `<footer>` for page structure
- `<h1>` through `<h6>` for proper heading hierarchy
- `<button>` for interactive elements
- `<a>` for links

### 2. ARIA Labels

All interactive elements and regions have appropriate ARIA labels:

- `aria-label` for descriptive labels
- `aria-labelledby` for referencing label elements
- `aria-describedby` for additional descriptions
- `role` attributes for semantic meaning
- `aria-expanded` for expandable content
- `aria-controls` for related elements
- `aria-live` for dynamic content updates

### 3. Keyboard Navigation

All interactive elements are keyboard accessible:

- Tab order follows logical flow
- Focus indicators are visible (3px solid brand-primary)
- Enter/Space activate buttons
- Arrow keys navigate lists and menus
- Escape closes modals and dropdowns
- Focus trap in modals

### 4. Color Contrast

All text meets WCAG 2.1 AA contrast ratios:

- Normal text: 4.5:1 minimum
- Large text (18pt+ or 14pt+ bold): 3:1 minimum
- Interactive elements: 3:1 minimum
- Focus indicators: 3:1 minimum

### 5. Screen Reader Support

All components are screen reader friendly:

- Descriptive labels for all elements
- Hidden decorative elements with `aria-hidden="true"`
- Live regions for dynamic updates
- Proper heading structure
- Alternative text for images

### 6. Reduced Motion

Respects user's motion preferences:

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

## Block-Specific Accessibility Features

### Hero Block

- `role="banner"` for main hero sections
- `aria-label` with heading text for context
- Background media marked with `aria-hidden="true"`
- Video elements have descriptive labels
- Action buttons have proper focus indicators
- Loading states announced with `role="status"` and `aria-live="polite"`

### FAQ Accordion

- Each accordion item wrapped in `<h3>` for proper heading hierarchy
- Buttons have `aria-expanded` to indicate state
- Buttons have `aria-controls` linking to content panels
- Content panels have `role="region"` and `aria-labelledby`
- Search input has proper label and description
- Empty state announced with `aria-live="polite"`

### Services Grid

- Grid uses semantic structure
- Each service card is keyboard navigable
- Links have descriptive `aria-label` attributes
- Icons are decorative and marked `aria-hidden="true"`
- Feature lists use proper `<ul>` and `<li>` elements

### Stats Counter

- Animated numbers announced to screen readers
- Static values provided for screen readers
- Icons marked as decorative
- Proper heading hierarchy maintained

### Contact Form

- All inputs have associated `<label>` elements
- Required fields marked with `aria-required="true"`
- Error messages linked with `aria-describedby`
- Success/error states announced with `aria-live`
- Form validation provides clear feedback

### Navigation Components

- Main navigation has `role="navigation"`
- Current page indicated with `aria-current="page"`
- Dropdown menus use `aria-expanded` and `aria-haspopup`
- Mobile menu toggle has descriptive label
- Skip links provided for keyboard users

## Testing Checklist

### Automated Testing

- [ ] Run axe-core accessibility scanner
- [ ] Check color contrast ratios
- [ ] Validate HTML semantics
- [ ] Test with Lighthouse accessibility audit

### Manual Testing

- [ ] Keyboard navigation (Tab, Shift+Tab, Enter, Space, Escape, Arrow keys)
- [ ] Screen reader testing (NVDA, JAWS, VoiceOver)
- [ ] Focus indicators visible and clear
- [ ] Zoom to 200% without loss of functionality
- [ ] Test with reduced motion enabled
- [ ] Test in high contrast mode

### Browser Testing

- [ ] Chrome with ChromeVox
- [ ] Firefox with NVDA
- [ ] Safari with VoiceOver
- [ ] Edge with Narrator

## Common Patterns

### Skip Links

```tsx
<a href="#main-content" className="skip-to-main">
  Skip to main content
</a>
```

### Focus Management

```tsx
// Trap focus in modal
useEffect(() => {
  if (isOpen) {
    const cleanup = focusManagement.trapFocus(modalRef.current)
    return cleanup
  }
}, [isOpen])
```

### Announcing Updates

```tsx
// Announce to screen reader
announceToScreenReader('Form submitted successfully', 'polite')
```

### Accessible Buttons

```tsx
<button
  aria-label="Close dialog"
  aria-describedby="dialog-description"
  onClick={handleClose}
  className="focus:outline-none focus:ring-2 focus:ring-brand-primary"
>
  <CloseIcon aria-hidden="true" />
</button>
```

### Accessible Forms

```tsx
<div>
  <label htmlFor="email" className="required">
    Email Address
  </label>
  <input
    id="email"
    type="email"
    aria-required="true"
    aria-describedby="email-error"
    aria-invalid={hasError}
  />
  {hasError && (
    <div id="email-error" className="error-message" role="alert">
      Please enter a valid email address
    </div>
  )}
</div>
```

## Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [axe DevTools](https://www.deque.com/axe/devtools/)
- [NVDA Screen Reader](https://www.nvaccess.org/)

## Maintenance

- Review accessibility on every component update
- Test with real users who rely on assistive technology
- Keep up with WCAG updates and best practices
- Document any accessibility decisions or trade-offs
- Provide accessibility training for all developers
