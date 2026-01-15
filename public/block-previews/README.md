# Block Preview Thumbnails

This directory contains preview thumbnail images for PayloadCMS blocks.

## Directory Structure

```
public/block-previews/
├── README.md (this file)
├── hero.png
├── content.png
├── mediaBlock.png
├── archive.png
├── banner.png
├── servicesGrid.png
├── techStack.png
├── processSteps.png
├── pricingTable.png
├── projectShowcase.png
├── caseStudy.png
├── beforeAfter.png
├── testimonial.png
├── code.png
├── featureGrid.png
├── statsCounter.png
├── faqAccordion.png
├── timeline.png
├── cta.png
├── contactForm.png
├── newsletter.png
├── socialProof.png
├── container.png
├── divider.png
└── spacer.png
```

## Image Specifications

- **Format**: PNG or WebP
- **Dimensions**: 400x300px (4:3 aspect ratio)
- **File Size**: Under 50KB
- **Style**: Consistent design using brand colors

## Adding New Thumbnails

1. Create the thumbnail image following the specifications above
2. Save it in this directory with the block slug as the filename
3. Update the block configuration to reference the thumbnail:

```typescript
admin: {
  group: 'Category Name',
  preview: '/block-previews/block-slug.png',
}
```

## Status

⚠️ **Thumbnails need to be created**

Currently, this directory contains only documentation. Thumbnail images need to be designed and added for all blocks listed above.

See `src/blocks/BLOCK_PREVIEWS.md` for detailed instructions on creating thumbnails.
