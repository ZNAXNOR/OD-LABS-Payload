# Example Page Configurations

This directory contains example page configurations demonstrating how to use the various blocks available in the Pages collection.

## Available Examples

### 1. About Page (`about-page.json`)

Demonstrates a typical "About Us" page with:

- **Hero Block**: Centered variant with call-to-action buttons
- **Content Block**: Company introduction
- **Stats Counter Block**: Impact metrics with animated counters
- **Tech Stack Block**: Technology showcase
- **Testimonial Block**: Client testimonials in grid layout
- **CTA Block**: Final call-to-action with primary background

**Use Case**: Company information, team introduction, company values

### 2. Portfolio Page (`portfolio-page.json`)

Demonstrates a comprehensive portfolio page with:

- **Hero Block**: Gradient variant with animated background
- **Project Showcase Block**: Filterable project grid
- **Divider Block**: Visual separation
- **Case Study Block**: Detailed project case study with metrics
- **Before/After Block**: Visual comparison slider
- **CTA Block**: Project inquiry call-to-action

**Use Case**: Showcasing work, case studies, project galleries

### 3. Services Page (`services-page.json`)

Demonstrates a services offering page with:

- **Hero Block**: Split variant with code display
- **Services Grid Block**: Service cards with features
- **Process Steps Block**: Development workflow timeline
- **Pricing Table Block**: Tiered pricing comparison
- **FAQ Accordion Block**: Frequently asked questions
- **CTA Block**: Consultation booking call-to-action

**Use Case**: Service offerings, pricing pages, process explanation

## How to Use These Examples

### Method 1: Import via Admin Panel

1. Navigate to the Pages collection in the PayloadCMS admin panel
2. Click "Create New"
3. Copy the content from one of the example JSON files
4. Paste into the appropriate fields in the admin panel
5. Adjust content and media references as needed
6. Save as draft or publish

### Method 2: Seed Database

You can use these examples as seed data for your database:

```typescript
// In your seed script
import aboutPage from './src/pages/examples/about-page.json'
import portfolioPage from './src/pages/examples/portfolio-page.json'
import servicesPage from './src/pages/examples/services-page.json'

await payload.create({
  collection: 'pages',
  data: aboutPage,
})

await payload.create({
  collection: 'pages',
  data: portfolioPage,
})

await payload.create({
  collection: 'pages',
  data: servicesPage,
})
```

### Method 3: API Import

Use the Payload Local API to programmatically create pages:

```typescript
import { getPayload } from 'payload'
import config from '@payload-config'

const payload = await getPayload({ config })

const aboutPage = await payload.create({
  collection: 'pages',
  data: {
    // ... page data from JSON
  },
})
```

## Customization Tips

### Replacing Media References

The example pages reference media that may not exist in your database. Update these fields:

- `hero.media` - Replace with actual media ID or upload
- `beforeAfter.beforeImage` and `beforeAfter.afterImage` - Add actual images
- `testimonial.avatar` - Add client photos
- `projectShowcase.image` - Add project screenshots

### Adjusting Content

All text content can be customized:

- **Headings**: Update to match your brand voice
- **Descriptions**: Tailor to your specific services/products
- **CTAs**: Change button text and links to match your site structure
- **Colors**: Adjust `backgroundColor` and `pattern` options

### Adding More Blocks

You can extend these examples by adding more blocks:

```json
{
  "layout": [
    // ... existing blocks
    {
      "blockType": "newsletter",
      "heading": "Stay Updated",
      "description": "Subscribe to our newsletter",
      "placeholder": "Enter your email",
      "buttonText": "Subscribe",
      "style": "card",
      "showPrivacyNote": true,
      "successMessage": "Thanks for subscribing!"
    }
  ]
}
```

## Block Combinations

### Landing Page Pattern

```
Hero (centered/gradient)
→ Feature Grid
→ Stats Counter
→ Testimonials
→ CTA
```

### Service Page Pattern

```
Hero (split)
→ Services Grid
→ Process Steps
→ Pricing Table
→ FAQ
→ CTA
```

### Portfolio Page Pattern

```
Hero (gradient)
→ Project Showcase
→ Case Study
→ Before/After
→ Testimonials
→ CTA
```

### About Page Pattern

```
Hero (centered)
→ Content
→ Stats Counter
→ Tech Stack
→ Timeline
→ Testimonials
→ CTA
```

## Best Practices

1. **Hero First**: Always start with a hero block to establish context
2. **Visual Hierarchy**: Use dividers and spacers to create breathing room
3. **CTA Placement**: Include CTAs at logical conversion points
4. **Mobile Optimization**: All blocks are responsive by default
5. **Content Length**: Keep descriptions concise and scannable
6. **Media Quality**: Use high-quality images optimized for web
7. **Accessibility**: Ensure proper alt text for all images
8. **Performance**: Limit the number of blocks per page (10-15 recommended)

## Testing Your Pages

After creating pages from these examples:

1. **Preview**: Use the preview feature to see how it looks
2. **Responsive**: Test on mobile, tablet, and desktop
3. **Performance**: Check page load times
4. **Accessibility**: Run accessibility audits
5. **SEO**: Verify meta tags and structured data

## Need Help?

- Review the block documentation in `src/blocks/BLOCK_PREVIEWS.md`
- Check the design document at `.kiro/specs/pages-admin-enhancement/design.md`
- Refer to the requirements at `.kiro/specs/pages-admin-enhancement/requirements.md`

## Contributing

If you create additional example pages, please:

1. Follow the naming convention: `{page-type}-page.json`
2. Include a variety of blocks
3. Add documentation explaining the use case
4. Test thoroughly before committing
