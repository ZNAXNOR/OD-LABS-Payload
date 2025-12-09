# Contact Global

The Contact global element provides a centralized location to manage all contact information and social media links for your website.

## Structure

The Contact global is organized into two main sections:

### 1. Contact Information

Contains essential business contact details:

- **Address**: Complete address with street, city, state, postal code, and country
- **Email**: Primary contact email (required)
- **Phone**: Contact phone number
- **Contact Page Link**: Link to your main contact page (supports internal page references and custom URLs)
- **Business Hours**: Operating hours information

### 2. Social Media

Contains links to various social media platforms:

- Facebook
- Instagram
- Twitter/X
- LinkedIn
- YouTube
- GitHub
- TikTok
- **Custom Social Media**: Array field for any additional platforms

## Usage

### Accessing Contact Data

Import and use the `getContactData()` function:

```typescript
import { getContactData } from '@/Contact/Component'

const contact = await getContactData()
console.log(contact.email) // contact@example.com
```

### Using Pre-built Components

#### ContactInfo Component

Display contact information with customizable visibility:

```typescript
import { ContactInfo } from '@/Contact/Component'

// Show all contact info
<ContactInfo />

// Show only specific fields
<ContactInfo
  showAddress={true}
  showEmail={true}
  showPhone={false}
  showBusinessHours={true}
  className="my-custom-class"
/>
```

#### SocialLinks Component

Display social media links:

```typescript
import { SocialLinks } from '@/Contact/Component'

// Basic usage
<SocialLinks />

// With custom options
<SocialLinks
  iconSize="lg"
  showLabels={true}
  className="my-social-links"
/>
```

**Icon Sizes:**

- `sm`: Small (w-5 h-5)
- `md`: Medium (w-6 h-6) - default
- `lg`: Large (w-8 h-8)

#### ContactPageLink Component

Render a link to your contact page (supports both internal references and custom URLs):

```typescript
import { ContactPageLink } from '@/Contact/Component'

// Basic usage (renders as inline link)
<ContactPageLink />

// As a button with custom styling
<ContactPageLink
  appearance="default"
  className="my-button-class"
  label="Get in Touch"
/>

// With custom children
<ContactPageLink appearance="outline">
  Contact Our Team
</ContactPageLink>
```

**Appearance Options:**

- `inline`: Plain link (default)
- `default`: Button with default styling
- `outline`: Button with outline styling

## Use Cases

### 1. Contact Us Page

Use `ContactInfo` to display full contact details on your contact page.

### 2. Footer

Use `SocialLinks` and selected contact info in your footer.

### 3. CTA Blocks

Use the contact email or phone number in call-to-action blocks.

### 4. Custom Components

Access the data directly with `getContactData()` to build custom components.

## Updating Contact Information

1. Navigate to the Payload CMS admin panel
2. Go to **Globals** → **Contact**
3. Update the information in either the "Contact Information" or "Social Media" tabs
4. Save changes

The cache will automatically be revalidated when you save changes.

## Files

- `config.ts`: Global configuration with field definitions
- `Component.tsx`: React components for rendering contact data
- `hooks/revalidateContact.ts`: Cache revalidation hook
