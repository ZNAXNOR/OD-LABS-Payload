# Live Preview Configuration

This document describes the PayloadCMS Live Preview configuration implemented for all page collections.

## Overview

Live Preview functionality has been added to all page collections to enable real-time content updates in the admin panel. This allows content editors to see changes instantly without manual page refreshes.

## Configured Collections

The following collections now support live preview:

- **Pages** (`pages`) - Main website pages
- **BlogPages** (`blogs`) - Blog posts and articles
- **ServicesPages** (`services`) - Service description pages
- **LegalPages** (`legal`) - Legal documents and policies
- **ContactPages** (`contacts`) - Contact and support pages

## URL Generation

Each collection has a dedicated URL generation function that creates proper preview URLs:

### Pages Collection

- **Home page**: `/` (for slug: `home` or empty)
- **Regular pages**: `/{slug}`

### BlogPages Collection

- **Blog index**: `/blogs` (for empty slug)
- **Blog posts**: `/blogs/{slug}`

### ServicesPages Collection

- **Services index**: `/services` (for empty slug)
- **Service pages**: `/services/{slug}`

### LegalPages Collection

- **Legal index**: `/legal` (for empty slug)
- **Legal pages**: `/legal/{slug}`

### ContactPages Collection

- **Contacts index**: `/contacts` (for empty slug)
- **Contact pages**: `/contacts/{slug}`

## Configuration Details

### Live Preview Settings

Each collection includes the following live preview configuration:

```typescript
admin: {
  // ... other admin settings
  livePreview: {
    url: generateCollectionPreviewUrl, // Collection-specific URL generator
  },
}
```

### URL Generation Functions

All URL generation functions are located in `src/utilities/livePreview.ts` and follow these patterns:

1. **Base URL**: Uses `PAYLOAD_PUBLIC_SERVER_URL` environment variable or defaults to `http://localhost:3000`
2. **Locale Support**: Includes optional locale parameter for internationalization
3. **Slug Handling**: Properly handles empty slugs and special cases (like home page)
4. **Authentication**: Supports authenticated preview URLs with draft mode and token parameters

### Environment Variables

The live preview system uses the following environment variable:

- `PAYLOAD_PUBLIC_SERVER_URL`: The base URL for the frontend application (required for production)

## Usage

### In Admin Panel

1. Open any page document in the admin panel
2. Click the "Live Preview" button in the toolbar
3. The preview window will open showing the live frontend page
4. Changes made in the admin panel will be reflected in real-time

### URL Examples

```
# Pages
https://example.com/                    # Home page
https://example.com/about              # About page
https://example.com/es/about           # About page (Spanish)

# Blog Pages
https://example.com/blogs              # Blog index
https://example.com/blogs/my-post      # Blog post
https://example.com/fr/blogs/my-post   # Blog post (French)

# Services Pages
https://example.com/services           # Services index
https://example.com/services/web-dev   # Service page

# Legal Pages
https://example.com/legal              # Legal index
https://example.com/legal/privacy      # Privacy policy

# Contact Pages
https://example.com/contacts           # Contacts index
https://example.com/contacts/support   # Support page
```

## Authentication & Security

The live preview system includes:

- **Draft Mode**: Preview URLs include `?draft=true` parameter
- **Token Authentication**: Secure tokens for authenticated preview access
- **Access Control**: Respects existing collection access control settings
- **Session Management**: Proper cleanup of preview sessions

## Testing

Unit tests are provided in `tests/unit/utilities/livePreview.unit.spec.ts` to verify:

- URL generation for all collection types
- Locale support
- Authentication parameter handling
- Edge cases and error conditions

## Requirements Satisfied

This implementation satisfies the following requirements:

- **1.1**: Live preview enabled for all page collections
- **1.2**: Admin panel displays preview functionality in edit interface
- **1.3**: Proper preview URLs generated for each collection type
- **1.4**: Authentication and draft parameters included in URLs
- **1.5**: Custom preview URL generation for different collection types

## Next Steps

This configuration provides the foundation for live preview functionality. The next tasks will involve:

1. Creating preview API routes for authentication and draft mode
2. Implementing the LivePreviewListener component for real-time updates
3. Adding preview mode indicators and controls
4. Integrating with the frontend layout for draft content serving

## Troubleshooting

### Common Issues

1. **Preview button not appearing**: Ensure the collection has `livePreview.url` configured
2. **Invalid URLs**: Check `PAYLOAD_PUBLIC_SERVER_URL` environment variable
3. **Authentication errors**: Verify user permissions and access control settings

### Debug Information

To debug URL generation, you can test the functions directly:

```typescript
import { generatePagesPreviewUrl } from '@/utilities/livePreview'

const doc = { slug: 'test-page' }
const url = generatePagesPreviewUrl(doc, 'en')
console.log('Generated URL:', url)
```
