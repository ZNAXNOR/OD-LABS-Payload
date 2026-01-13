# Requirements Document: Frontend Dynamic Routes

## Introduction

This specification defines the requirements for creating Next.js dynamic routes to render PayloadCMS collection pages on the frontend. Currently, the CMS collections (Pages, Legal, Services, Blogs, Contacts) exist in the admin panel but cannot be accessed via frontend URLs like `/legal/privacy-policy` or `/services/web-development`.

## Glossary

- **Dynamic_Route**: A Next.js route using `[slug]` or `[...slug]` syntax to match URL patterns
- **Catch-All_Route**: A route using `[...slug]` that matches any number of path segments
- **generateStaticParams**: Next.js function to pre-render dynamic routes at build time
- **RenderBlocks**: Component that renders block-based content from layout field
- **Collection_Slug**: The URL segment identifying which collection to query (e.g., `/legal/`, `/services/`)

## Requirements

### Requirement 1: Main Pages Dynamic Route

**User Story:** As a visitor, I want to access general pages by their slug, so that I can view content like About, Contact, etc.

#### Acceptance Criteria

1. THE System SHALL create a dynamic route at `app/(frontend)/[slug]/page.tsx`
2. WHEN a user visits `/{slug}`, THE System SHALL query the `pages` collection for matching slug
3. THE System SHALL render the page layout using RenderBlocks component
4. THE System SHALL return 404 if no page is found with the given slug
5. THE System SHALL generate static params for all published pages at build time

### Requirement 2: Legal Pages Dynamic Route

**User Story:** As a visitor, I want to access legal documents by URL, so that I can read privacy policies, terms of service, etc.

#### Acceptance Criteria

1. THE System SHALL create a dynamic route at `app/(frontend)/legal/[slug]/page.tsx`
2. WHEN a user visits `/legal/{slug}`, THE System SHALL query the `legal` collection
3. THE System SHALL render the legal page content
4. THE System SHALL return 404 if no legal page is found
5. THE System SHALL generate static params for all legal pages at build time

### Requirement 3: Services Pages Dynamic Route

**User Story:** As a visitor, I want to access service pages by URL, so that I can learn about specific services offered.

#### Acceptance Criteria

1. THE System SHALL create a dynamic route at `app/(frontend)/services/[slug]/page.tsx`
2. WHEN a user visits `/services/{slug}`, THE System SHALL query the `services` collection
3. THE System SHALL render the service page content
4. THE System SHALL return 404 if no service page is found
5. THE System SHALL generate static params for all service pages at build time

### Requirement 4: Blog Pages Dynamic Route

**User Story:** As a visitor, I want to access blog posts by URL, so that I can read individual articles.

#### Acceptance Criteria

1. THE System SHALL create a dynamic route at `app/(frontend)/blogs/[slug]/page.tsx`
2. WHEN a user visits `/blogs/{slug}`, THE System SHALL query the `blogs` collection
3. THE System SHALL render the blog post content
4. THE System SHALL return 404 if no blog post is found
5. THE System SHALL generate static params for all blog posts at build time

### Requirement 5: Contact Pages Dynamic Route

**User Story:** As a visitor, I want to access contact pages by URL, so that I can view contact forms and information.

#### Acceptance Criteria

1. THE System SHALL create a dynamic route at `app/(frontend)/contacts/[slug]/page.tsx`
2. WHEN a user visits `/contacts/{slug}`, THE System SHALL query the `contacts` collection
3. THE System SHALL render the contact page with form integration
4. THE System SHALL return 404 if no contact page is found
5. THE System SHALL generate static params for all contact pages at build time

### Requirement 6: SEO Metadata Generation

**User Story:** As a site owner, I want dynamic pages to have proper SEO metadata, so that search engines can index my content correctly.

#### Acceptance Criteria

1. EACH dynamic route SHALL export a `generateMetadata` function
2. THE System SHALL use the page's SEO fields (meta title, description, Open Graph image)
3. THE System SHALL fall back to page title if SEO fields are not set
4. THE System SHALL include canonical URLs in metadata
5. THE System SHALL include Open Graph and Twitter Card metadata

### Requirement 7: Draft Mode Support

**User Story:** As a content editor, I want to preview draft pages before publishing, so that I can verify content before it goes live.

#### Acceptance Criteria

1. WHEN draft mode is enabled, THE System SHALL fetch draft versions of pages
2. WHEN draft mode is disabled, THE System SHALL only fetch published pages
3. THE System SHALL pass draft mode status to Payload queries
4. THE System SHALL display draft indicator in admin bar when viewing drafts
5. THE System SHALL respect access control for draft content

### Requirement 8: 404 Error Handling

**User Story:** As a visitor, I want to see a helpful 404 page when a URL doesn't exist, so that I can navigate back to valid content.

#### Acceptance Criteria

1. WHEN a slug doesn't match any document, THE System SHALL call `notFound()`
2. THE System SHALL render Next.js 404 page
3. THE System SHALL log 404 errors for monitoring
4. THE System SHALL provide navigation back to homepage
5. THE System SHALL maintain proper HTTP 404 status code
