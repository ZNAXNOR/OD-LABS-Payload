# Block Preview Thumbnails

This document describes how to add preview thumbnails to blocks for better visual identification in the admin panel.

## Overview

Block preview thumbnails help content editors quickly identify and select the right block type when building pages. Each block should have a representative thumbnail image.

## Thumbnail Specifications

- **Format**: PNG or WebP
- **Dimensions**: 400x300px (4:3 aspect ratio)
- **Location**: `public/block-previews/`
- **Naming**: `{block-slug}.png` or `{block-slug}.webp`
- **File Size**: Keep under 50KB for optimal loading

## Adding Thumbnails to Blocks

To add a preview thumbnail to a block, update the block configuration with the `admin.preview` property:

```typescript
export const MyBlock: Block = {
  slug: 'myBlock',
  interfaceName: 'MyBlock',
  labels: {
    singular: 'My Block',
    plural: 'My Blocks',
  },
  admin: {
    group: 'Content',
    preview: '/block-previews/myBlock.png', // Add this line
  },
  fields: [
    // ... fields
  ],
}
```

## Required Thumbnails

The following blocks need preview thumbnails created:

### Hero Blocks

- [ ] `hero.png` - Hero block with multiple variants

### Content Blocks

- [ ] `content.png` - Content block with columns
- [ ] `mediaBlock.png` - Media block
- [ ] `archive.png` - Archive/blog listing block
- [ ] `banner.png` - Banner notification block

### Services Blocks

- [ ] `servicesGrid.png` - Services grid with cards
- [ ] `techStack.png` - Technology stack display
- [ ] `processSteps.png` - Process steps timeline
- [ ] `pricingTable.png` - Pricing comparison table

### Portfolio Blocks

- [ ] `projectShowcase.png` - Project showcase grid
- [ ] `caseStudy.png` - Case study layout
- [ ] `beforeAfter.png` - Before/after comparison slider
- [ ] `testimonial.png` - Testimonial cards

### Technical Blocks

- [ ] `code.png` - Code block with syntax highlighting
- [ ] `featureGrid.png` - Feature grid with icons
- [ ] `statsCounter.png` - Statistics counter
- [ ] `faqAccordion.png` - FAQ accordion
- [ ] `timeline.png` - Timeline display

### CTA & Conversion Blocks

- [ ] `cta.png` - Call-to-action block
- [ ] `contactForm.png` - Contact form
- [ ] `newsletter.png` - Newsletter signup
- [ ] `socialProof.png` - Social proof (logos/stats)

### Layout Blocks

- [ ] `container.png` - Container wrapper
- [ ] `divider.png` - Divider line
- [ ] `spacer.png` - Spacer/spacing control

## Creating Thumbnails

### Design Guidelines

1. **Consistent Style**: Use the same design style across all thumbnails
2. **Brand Colors**: Use brand-primary and zinc colors from the design system
3. **Clear Representation**: Show the key features of each block
4. **Light Background**: Use a light background for consistency
5. **Annotations**: Add subtle labels if needed to clarify functionality

### Tools

- **Figma**: Design thumbnails in Figma using the design system
- **Screenshot**: Take screenshots of actual rendered blocks
- **Image Optimization**: Use tools like TinyPNG or Squoosh to optimize file size

### Example Thumbnail Content

**Hero Block**: Show a hero section with heading, subheading, and CTA buttons
**Services Grid**: Display 3 service cards with icons
**Code Block**: Show a code snippet with syntax highlighting
**Timeline**: Display a vertical timeline with 3-4 events

## Implementation Status

Once thumbnails are created and added to `public/block-previews/`, update each block configuration file to reference the thumbnail path.

## Future Enhancements

- Add animated GIF previews for interactive blocks
- Create variant-specific previews for blocks with multiple styles
- Add hover states showing additional block information
