# Footer Global Configuration

This Footer global provides comprehensive footer configuration with enhanced social media integration and legal links filtering.

## Features

### Legal Links

- **Filtered Internal Links**: Legal links can only reference pages from the `legal` collection
- **Custom URLs**: Support for external legal links (privacy policies hosted elsewhere, etc.)
- **Validation**: URL validation for custom links

### Social Media Integration (Global Assets)

- **Global Social Media Collection**: Social media links are managed as global assets in the `social-media` collection
- **Relationship Field**: Footer references social media links like pages in linkgroup
- **Reusable Across Site**: Same social media links can be used in Footer, Header, Contact, or any other global/collection
- **Modal Selection**: Uses the same modal interface as page selection for adding social media links

## Usage

### Admin Experience

1. **Managing Social Media (Global Assets)**:
   - Go to "Social Media" collection in admin (under Settings group)
   - Add social media platforms with URLs, labels, and descriptions
   - Mark platforms as active/inactive
   - These become available across the entire site

2. **Footer Configuration**:
   - **Legal Links**: Select "Legal Page" or "Custom URL" - filtered to legal collection only
   - **Social Media**:
     - Enable "Show Social Media Links"
     - Click "Add Social Media" to open selection modal (like page selection)
     - Select from existing social media links
     - No need to create separate social media entries for Footer

### Frontend Component Example

```tsx
import { getPayload } from 'payload'
import config from '@payload-config'

export default async function Footer() {
  const payload = await getPayload({ config })

  const footer = await payload.findGlobal({
    slug: 'footer',
    depth: 2, // Populate social media relationships
  })

  return (
    <footer>
      {/* Legal Links - Only shows legal collection pages */}
      {footer.legalLinks?.map((linkItem, index) => {
        const link = linkItem.link
        const href = link.type === 'reference' ? `/${link.reference.slug}` : link.url

        return (
          <a
            key={index}
            href={href}
            target={link.newTab ? '_blank' : undefined}
            rel={link.newTab ? 'noopener noreferrer' : undefined}
          >
            {link.label}
          </a>
        )
      })}

      {/* Social Media Links - Populated from global collection */}
      {footer.socialMedia?.enabled &&
        footer.socialMedia.links?.map((social, index) => (
          <a
            key={index}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={social.label || social.platform}
          >
            {social.label || social.platform}
          </a>
        ))}
    </footer>
  )
}
```

## Global Social Media Collection

### Fields

- **Platform**: Select from predefined platforms (Facebook, Twitter, LinkedIn, etc.)
- **URL**: Social media profile URL (validated)
- **Label**: Custom display label (optional)
- **Description**: Optional description for admin reference
- **Active**: Toggle to enable/disable the link site-wide

### Benefits

- **Single Source of Truth**: Manage all social media links in one place
- **Reusable**: Use the same links in Footer, Header, Contact, or any component
- **Consistent**: No duplicate social media entries across different sections
- **Easy Updates**: Change a URL once, updates everywhere it's used
- **Modal Selection**: Familiar interface like page selection

## Reusable Social Media Field

The `socialMediaLinks` field can be used in any global or collection:

```tsx
import { socialMediaLinks } from '@/fields/socialMediaLinks'

// In any collection or global
fields: [
  socialMediaLinks({
    label: 'Social Media',
    description: 'Select social media links to display',
    maxLinks: 10,
    enableToggle: true, // Adds enable/disable checkbox
  }),
]
```

## Migration

A migration script is provided to move existing Contact global social media data to the new collection:

```bash
# Run the migration to populate the SocialMedia collection
npm run payload migrate
```

## Configuration Options

### Social Media Field Options

- **label**: Field label (default: 'Social Media')
- **description**: Field description
- **maxLinks**: Maximum number of links (default: 10)
- **enableToggle**: Add enable/disable checkbox (default: true)

### Legal Links Configuration

1. **Legal Page**: Select from legal collection pages only
2. **Custom URL**: Add external legal links
3. **Label**: Custom display text for the link
4. **New Tab**: Open link in new tab

## Database Schema

- **Social Media Collection**: `social_media` table with platform, URL, label, description, isActive
- **Footer Relationships**: References to social media collection (like page relationships)
- **Legal Links**: Custom link structure with legal collection filtering

## How It Works

### Social Media as Global Assets

1. **Collection Management**: Social media platforms are managed in the `social-media` collection
2. **Relationship Fields**: Footer (and other globals/collections) use relationship fields to reference these
3. **Modal Selection**: Same interface as page selection - click "Add Social Media" → modal opens → select platforms
4. **Reusability**: Same social media links can be referenced across multiple contexts
5. **Consistency**: Update URL in collection → updates everywhere it's referenced

### Legal Links Filtering

The legal links field uses a custom link structure that restricts the relationship field to only show pages from the `legal` collection via `relationTo: ['legal']`.

This approach treats social media links exactly like pages in linkgroup - as global assets that can be referenced anywhere, providing consistency and reusability across the entire site.
