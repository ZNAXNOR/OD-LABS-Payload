# Screen Reader Testing Guide for RichText Component

## Overview

This guide provides comprehensive instructions for manually testing the RichText component with screen readers to ensure WCAG 2.1 AA compliance.

## Supported Screen Readers

### Primary Testing Targets

- **NVDA** (Windows) - Free, widely used
- **JAWS** (Windows) - Most popular commercial screen reader
- **VoiceOver** (macOS/iOS) - Built-in Apple screen reader
- **TalkBack** (Android) - Built-in Android screen reader

### Browser Compatibility

- **Chrome** + NVDA/JAWS
- **Firefox** + NVDA/JAWS
- **Safari** + VoiceOver
- **Edge** + NVDA/JAWS

## Testing Checklist

### 1. Content Structure Navigation

#### Test Steps:

1. Navigate to a page with RichText content
2. Use heading navigation (H key in NVDA/JAWS, Control+Option+Command+H in VoiceOver)
3. Use landmark navigation (D key in NVDA/JAWS, Control+Option+U in VoiceOver)

#### Expected Results:

- [ ] All headings are announced with proper level (H1, H2, etc.)
- [ ] Heading hierarchy is logical (no skipped levels)
- [ ] Sections are announced as landmarks
- [ ] Content blocks are properly grouped

### 2. Content Announcements

#### Test Steps:

1. Navigate through RichText content using arrow keys
2. Listen for live region announcements when content loads
3. Check content summaries are provided

#### Expected Results:

- [ ] Content summary is announced on page load ("This content contains X sections")
- [ ] Block types are clearly identified (Hero section, Content section, etc.)
- [ ] Live regions announce content changes appropriately
- [ ] No unnecessary or repetitive announcements

### 3. Interactive Elements

#### Test Steps:

1. Navigate to links within RichText content (Tab key)
2. Navigate to buttons and form elements
3. Test embedded media controls

#### Expected Results:

- [ ] Links have descriptive text or aria-labels
- [ ] Link destinations are clear
- [ ] External links are identified
- [ ] Buttons have clear purposes
- [ ] Form elements have proper labels

### 4. Media Content

#### Test Steps:

1. Navigate to images within RichText content
2. Navigate to videos and other media
3. Check figure captions

#### Expected Results:

- [ ] Images have meaningful alt text
- [ ] Decorative images are properly hidden (alt="")
- [ ] Figure captions are associated with images
- [ ] Video controls are accessible
- [ ] Media descriptions are provided when needed

### 5. Block-Specific Testing

#### Hero Blocks

- [ ] Heading is announced with proper level
- [ ] Subheading provides additional context
- [ ] Call-to-action buttons are clearly labeled
- [ ] Background images don't interfere with text

#### Content Blocks

- [ ] Rich text content flows naturally
- [ ] Lists are properly structured
- [ ] Emphasis (bold, italic) is announced
- [ ] Links within content are identifiable

#### Media Blocks

- [ ] Images have descriptive alt text
- [ ] Captions are read after image descriptions
- [ ] Video content has proper controls
- [ ] Audio descriptions available when needed

#### Call-to-Action Blocks

- [ ] Primary actions are clearly identified
- [ ] Button purposes are obvious
- [ ] Form fields have proper labels
- [ ] Error messages are announced

## Testing Procedures

### NVDA Testing (Windows)

#### Setup:

1. Install NVDA (free from nvaccess.org)
2. Open supported browser (Chrome/Firefox recommended)
3. Start NVDA (Control+Alt+N)

#### Navigation Commands:

- **H** - Next heading
- **Shift+H** - Previous heading
- **D** - Next landmark
- **Shift+D** - Previous landmark
- **Tab** - Next focusable element
- **Shift+Tab** - Previous focusable element
- **Arrow Keys** - Read content line by line
- **Control+Home** - Go to top of page

#### Testing Script:

```
1. Navigate to RichText content page
2. Press Control+Home to go to top
3. Press H repeatedly to navigate through headings
4. Press D repeatedly to navigate through landmarks
5. Use arrow keys to read content sequentially
6. Tab through interactive elements
7. Listen for live region announcements
```

### VoiceOver Testing (macOS)

#### Setup:

1. Enable VoiceOver (Command+F5 or System Preferences > Accessibility)
2. Open Safari browser
3. Navigate to test page

#### Navigation Commands:

- **Control+Option+Command+H** - Headings menu
- **Control+Option+U** - Web rotor
- **Control+Option+Right/Left** - Navigate elements
- **Tab** - Next focusable element
- **Control+Option+Space** - Activate element

#### Testing Script:

```
1. Navigate to RichText content page
2. Open headings menu (Control+Option+Command+H)
3. Verify heading structure
4. Open web rotor (Control+Option+U)
5. Navigate through landmarks
6. Use Control+Option+Arrow keys to read content
7. Tab through interactive elements
```

## Common Issues to Check

### Content Issues

- [ ] Missing or generic alt text ("image", "photo")
- [ ] Redundant announcements
- [ ] Unclear link text ("click here", "read more")
- [ ] Missing form labels
- [ ] Inaccessible custom controls

### Navigation Issues

- [ ] Skipped heading levels (H1 to H3)
- [ ] Missing landmarks
- [ ] Keyboard traps
- [ ] Focus not visible
- [ ] Illogical tab order

### Announcement Issues

- [ ] Content not announced
- [ ] Too much information at once
- [ ] Technical jargon without explanation
- [ ] Missing context for elements

## Documentation Requirements

After testing, document:

### Test Results

- Screen reader and browser combinations tested
- Issues found and their severity
- Workarounds or fixes applied
- Remaining accessibility barriers

### User Experience Notes

- Overall navigation experience
- Content comprehension
- Task completion success
- User satisfaction feedback

## Automated vs Manual Testing

### What Automated Tests Cover:

- ARIA attribute presence
- Semantic HTML structure
- Color contrast ratios
- Basic accessibility violations

### What Manual Testing Adds:

- Real user experience
- Content quality and clarity
- Navigation flow
- Context and meaning
- Complex interaction patterns

## Best Practices for Fixes

### Content Improvements:

1. Write descriptive alt text that conveys meaning
2. Use clear, descriptive link text
3. Provide context for complex content
4. Structure content logically

### Technical Improvements:

1. Ensure proper heading hierarchy
2. Use semantic HTML elements
3. Implement ARIA labels correctly
4. Maintain logical focus order

### Testing Integration:

1. Include screen reader testing in QA process
2. Test with real users when possible
3. Document accessibility decisions
4. Regular accessibility audits

## Resources

### Screen Reader Downloads:

- [NVDA](https://www.nvaccess.org/download/) - Free
- [JAWS](https://www.freedomscientific.com/products/software/jaws/) - Commercial
- VoiceOver - Built into macOS/iOS
- TalkBack - Built into Android

### Testing Tools:

- [WebAIM Screen Reader Testing](https://webaim.org/articles/screenreader_testing/)
- [Accessibility Insights](https://accessibilityinsights.io/)
- [axe DevTools](https://www.deque.com/axe/devtools/)

### Guidelines:

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [WebAIM Guidelines](https://webaim.org/standards/wcag/)
- [Screen Reader User Survey](https://webaim.org/projects/screenreadersurvey9/)
