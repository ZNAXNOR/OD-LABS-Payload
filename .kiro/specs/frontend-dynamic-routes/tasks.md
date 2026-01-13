# Implementation Plan: Frontend Dynamic Routes

## Overview

This implementation adds Next.js dynamic routes to render PayloadCMS collection pages on the frontend, enabling URLs like `/legal/privacy-policy` and `/services/web-development` to work correctly.

## Tasks

- [x] 1. Create RichText rendering component
  - Create `src/components/RichText/index.tsx`
  - Use `@payloadcms/richtext-lexical/react` for Lexical content rendering
  - Handle null/undefined content gracefully
  - Add basic prose styling
  - _Requirements: 1.3, 2.3, 3.3, 4.3, 5.3_

- [x] 2. Create Legal pages dynamic route
  - Create `src/app/(frontend)/legal/[slug]/page.tsx`
  - Implement `generateStaticParams` to fetch all legal page slugs
  - Implement `generateMetadata` for SEO
  - Implement page component that queries `legal` collection by slug
  - Use `notFound()` if page not found
  - Support draft mode with `draftMode()`
  - Render page title and content using RichText component
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 6.1, 6.2, 6.3, 6.4, 6.5, 7.1, 7.2, 7.3, 8.1, 8.2, 8.5_

- [x] 3. Create Services pages dynamic route
  - Create `src/app/(frontend)/services/[slug]/page.tsx`
  - Implement `generateStaticParams` to fetch all service page slugs
  - Implement `generateMetadata` for SEO
  - Implement page component that queries `services` collection by slug
  - Use `notFound()` if page not found
  - Support draft mode
  - Render page title and content using RichText component
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 6.1, 6.2, 6.3, 6.4, 6.5, 7.1, 7.2, 7.3, 8.1, 8.2, 8.5_

- [x] 4. Create Blogs pages dynamic route
  - Create `src/app/(frontend)/blogs/[slug]/page.tsx`
  - Implement `generateStaticParams` to fetch all blog post slugs
  - Implement `generateMetadata` for SEO
  - Implement page component that queries `blogs` collection by slug
  - Use `notFound()` if page not found
  - Support draft mode
  - Render page title and content using RichText component
  - Add author and date display if available
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 6.1, 6.2, 6.3, 6.4, 6.5, 7.1, 7.2, 7.3, 8.1, 8.2, 8.5_

- [x] 5. Create Contacts pages dynamic route
  - Create `src/app/(frontend)/contacts/[slug]/page.tsx`
  - Implement `generateStaticParams` to fetch all contact page slugs
  - Implement `generateMetadata` for SEO
  - Implement page component that queries `contacts` collection by slug
  - Use `notFound()` if page not found
  - Support draft mode
  - Render page title and content using RichText component
  - Handle contact form integration if form field is present
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 6.1, 6.2, 6.3, 6.4, 6.5, 7.1, 7.2, 7.3, 8.1, 8.2, 8.5_

- [x] 6. Create main Pages dynamic route (if using blocks)
  - Create `src/app/(frontend)/[slug]/page.tsx`
  - Implement `generateStaticParams` to fetch all main page slugs
  - Implement `generateMetadata` for SEO
  - Implement page component that queries `pages` collection by slug
  - Use `notFound()` if page not found
  - Support draft mode
  - If Pages collection has layout blocks, create RenderBlocks component
  - Otherwise, render content using RichText component
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 6.1, 6.2, 6.3, 6.4, 6.5, 7.1, 7.2, 7.3, 8.1, 8.2, 8.5_

- [x] 7. Test all dynamic routes
  - Start dev server with `pnpm dev`
  - Create test pages in admin panel for each collection:
    - Legal: Create "Privacy Policy" with slug "privacy-policy"
    - Services: Create "Web Development" with slug "web-development"
    - Blogs: Create "First Post" with slug "first-post"
    - Contacts: Create "General Contact" with slug "general"
  - Visit each URL and verify pages render:
    - http://localhost:3000/legal/privacy-policy
    - http://localhost:3000/services/web-development
    - http://localhost:3000/blogs/first-post
    - http://localhost:3000/contacts/general
  - Test 404 by visiting non-existent slugs
  - Test draft mode by creating draft pages
  - Verify SEO metadata in page source (view source)
  - _Requirements: All_

- [x] 8. Build and test static generation
  - Run `pnpm build` to generate static pages
  - Verify build completes without errors
  - Check `.next/server/app/(frontend)` for generated pages
  - Run `pnpm start` and test production build
  - Verify all routes work in production mode
  - _Requirements: 1.5, 2.5, 3.5, 4.5, 5.5_

## Notes

- All tasks are required for functional frontend routes
- Each route follows the same pattern for consistency
- RichText component is reusable across all collections
- Draft mode support allows content preview before publishing
- Static generation improves performance and SEO
- **Reference**: PayloadCMS website template dynamic routes
  - https://github.com/payloadcms/payload/tree/main/templates/website/src/app/(frontend)
  - Example: `templates/website/src/app/(frontend)/posts/[slug]/page.tsx`
- The main Pages route (`[slug]`) should be created last to avoid conflicting with other routes
- If you get 404 errors, verify:
  1. Pages exist in admin panel with correct slugs
  2. Pages are published (not drafts)
  3. Collection slugs match route folder names
  4. Payload config includes all collections
