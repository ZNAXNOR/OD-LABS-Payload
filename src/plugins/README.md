# Plugins

This directory contains centralized plugin configurations for Payload CMS, following the official [Payload website template](https://github.com/payloadcms/payload/tree/main/templates/website/src/plugins) pattern.

## Structure

All plugin configurations are exported from `index.ts` as a single array that is imported into `payload.config.ts`.

## Current Plugins

### Form Builder (`@payloadcms/plugin-form-builder`)

- Creates `forms` and `form-submissions` collections
- Handles dynamic form creation and submission management
- Email notifications on form submission
- Payment fields disabled by default
- Public read access for forms
- Form submissions grouped under "Forms" in admin panel

### SEO (`@payloadcms/plugin-seo`)

- Automatically adds SEO fields to all page collections
- Collections: pages, blogs, services, legal, contacts
- Auto-generates meta titles with "| OD LABS" suffix
- Auto-generates meta descriptions
- Includes Open Graph image support
- Preview snippets in admin panel

### Redirects (`@payloadcms/plugin-redirects`)

- Creates `redirects` collection under Settings group
- Supports 301, 302, 307, 308 redirect types
- Link to existing pages or use custom URLs
- Public read access for frontend redirect handling
- Helps maintain SEO value during URL changes

## Adding New Plugins

To add a new plugin:

1. Install the plugin package:

   ```bash
   pnpm add @payloadcms/plugin-name
   ```

2. Import and configure it in `index.ts`:

   ```typescript
   import { newPlugin } from '@payloadcms/plugin-name'

   export const plugins: Plugin[] = [
     // ... existing plugins
     newPlugin({
       // configuration
     }),
   ]
   ```

3. The plugin will automatically be included in the Payload configuration.

## Benefits

- **Centralized Configuration**: All plugins in one place for easy maintenance
- **Type Safety**: Full TypeScript support
- **Separation of Concerns**: Keeps `payload.config.ts` clean and focused
- **Easy Testing**: Can easily swap or disable plugins for testing
- **Version Control**: Clear history of plugin changes
