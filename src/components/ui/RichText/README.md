# Enhanced RichText Component

This directory contains the restructured and enhanced RichText component with improved architecture, custom converters, block whitelisting, and responsive design support.

## Directory Structure

```
src/components/RichText/
├── index.tsx                 # Main RichText component
├── types.ts                  # TypeScript type definitions
├── utils.ts                  # Utility functions
├── converters/
│   ├── index.ts             # Converter registry
│   ├── blockConverters.ts   # Block-specific converters
│   ├── linkConverters.ts    # Link handling converters
│   └── mediaConverters.ts   # Media handling converters
├── features/
│   ├── index.ts             # Feature registry
│   ├── blocks.ts            # Block feature configuration
│   ├── advanced.ts          # Advanced text features
│   └── media.ts             # Media features
├── examples/
│   └── ResponsiveRichText.tsx # Usage examples
└── README.md                # This file
```

## Key Features

### 1. Enhanced Props Interface

- `enableGutter`: Control container width
- `enableProse`: Enable/disable prose styling
- `enableBlocks`: Enable/disable block rendering
- `blockWhitelist`: Filter available blocks
- `customConverters`: Override default converters
- `responsive`: Responsive design options

### 2. Block Whitelisting

```tsx
<RichText data={content} blockWhitelist={['hero', 'content', 'mediaBlock']} />
```

### 3. Custom Converters

```tsx
const customConverters = {
  blocks: {
    hero: ({ node }) => <CustomHero {...node.fields} />,
  }
}

<RichText
  data={content}
  customConverters={customConverters}
/>
```

### 4. Responsive Design

```tsx
<RichText
  data={content}
  responsive={{
    mobile: {
      enableGutter: false,
      className: 'px-4',
    },
    tablet: {
      enableGutter: true,
      className: 'px-6',
    },
    desktop: {
      enableGutter: true,
      className: 'px-8',
    },
  }}
/>
```

## Usage Examples

### Basic Usage

```tsx
import { RichText } from '@/components/RichText'

;<RichText data={content} />
```

### Advanced Usage

```tsx
import { RichText } from '@/components/RichText'

;<RichText
  data={content}
  enableGutter={true}
  enableProse={true}
  blockWhitelist={['hero', 'content', 'cta']}
  responsive={{
    mobile: { enableGutter: false },
    desktop: { enableGutter: true },
  }}
  className="custom-richtext"
/>
```

## Block Registry

The component includes a comprehensive block registry with metadata for all available blocks:

- **Hero blocks**: hero
- **Content blocks**: content, archive, code
- **Layout blocks**: container, divider, spacer
- **CTA blocks**: cta, banner, contactForm, newsletter, socialProof
- **Portfolio blocks**: projectShowcase, caseStudy, beforeAfter, testimonial
- **Services blocks**: servicesGrid, techStack, processSteps, pricingTable
- **Technical blocks**: faqAccordion, featureGrid, statsCounter, timeline, mediaBlock

## Error Handling

All block converters are wrapped with error boundaries to prevent rendering failures:

```tsx
// Automatic error boundary wrapping
const WrappedBlock = createErrorBoundaryWrapper(BlockComponent, ErrorFallback)
```

## Performance Features

- Lazy loading for block components
- Memoized converter functions
- Responsive image handling
- Bundle size optimization

## Migration from Legacy Component

The enhanced component maintains backward compatibility with the existing API while adding new features. Existing usage will continue to work without changes.

## Development

When adding new blocks or features:

1. Add block metadata to `utils.ts` block registry
2. Create converter in appropriate converter file
3. Update types in `types.ts`
4. Add examples in `examples/` directory
5. Update this README with new features
