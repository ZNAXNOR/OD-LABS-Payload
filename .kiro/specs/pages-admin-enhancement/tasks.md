# Implementation Plan: Pages Admin Panel Enhancement & Technical Freelance Blocks

## Overview

This implementation plan converts the Pages Admin Panel Enhancement design into actionable TypeScript development tasks. Each task builds incrementally toward a comprehensive block-based content system with enhanced admin panel organization, following PayloadCMS best practices.

## Tasks

- [x] 1. Restructure Pages collection and implement SEO enhancements
  - Reorganize Pages collection with Content, Hero, and SEO tabs
  - Move slug, parent, breadcrumbs to sidebar
  - Implement SEO schema defaults for all collections
  - Update Blogs, Legal, Services, Contacts collections with SEO configuration

  - [x] 1.1 Restructure Pages Collection with tabs and sidebar
    - Create tab structure with Content, Hero, and SEO tabs
    - Move slug, parent, breadcrumbs, timestamps to sidebar with admin.position: 'sidebar'
    - Verify all hooks (slug generation, breadcrumbs, revalidation) are preserved
    - Test admin panel rendering and tab navigation

  - [ ]\* 1.2 Write unit tests for Pages collection structure
    - Test tab structure validity
    - Test sidebar field positioning
    - Test hook preservation

  - [x] 1.3 Implement SEO Schema Defaults Plugin Configuration
    - Update plugins/index.ts with SEO field customization
    - Add beforeChange hook to set schema type defaults based on collection
    - Add readOnly condition for schema type field in specific collections
    - Map collections: blogs→BlogPosting, legal→WebPage, services→Service, contacts→ContactPage

  - [ ]\* 1.4 Write unit tests for SEO schema defaults
    - Test schema type assignment for each collection
    - Test readonly behavior
    - Test admin override capability

- [x] 2. Create enhanced Hero block with multiple variants
  - Implement Hero block configuration with 6 variants
  - Create frontend components for all Hero variants
  - Register Hero block in block registry

  - [x] 2.1 Create Enhanced Hero Block Configuration
    - Create src/blocks/hero/config.ts with 6 variants: default, centered, minimal, split, gradient, codeTerminal
    - Add variant field with select options
    - Implement conditional fields for each variant (codeSnippet, splitLayout, gradientConfig)
    - Add settings group with theme, height, parallax, overlay options

  - [ ]\* 2.2 Write property test for Hero block variants
    - **Property 6: Hero Variant Options**
    - Verify variant field has all 6 required options

  - [x] 2.3 Create Hero Block Frontend Components
    - Create src/components/blocks/Hero/index.tsx with variant switching
    - Implement all 6 hero variant components (Default, Centered, Minimal, Split, Gradient, CodeTerminal)
    - Use brand-primary and zinc-800-950 colors throughout
    - Add dark mode support with dark: variants

  - [ ]\* 2.4 Write unit tests for Hero components
    - Test each variant renders correctly
    - Test conditional rendering based on variant
    - Test dark mode classes

- [x] 3. Implement Services blocks suite
  - Create Services Grid, Tech Stack, Process Steps, and Pricing Table blocks
  - Implement frontend components for all services blocks
  - Register all services blocks in block registry

  - [x] 3.1 Create Services Grid Block
    - Create src/blocks/services/ServicesGrid/config.ts with configuration
    - Create ServicesGrid frontend component with responsive grid layout
    - Add icon support using Lucide React
    - Style with brand-primary and zinc colors, add dark mode support

  - [ ]\* 3.2 Write unit tests for ServicesGrid
    - Test grid layout rendering
    - Test icon display
    - Test CTA functionality

  - [x] 3.3 Create Tech Stack Block
    - Create src/blocks/services/TechStack/config.ts with configuration
    - Create TechStack frontend component with layout variants (grid/carousel/list)
    - Add technology icons and category filtering
    - Style with brand colors and dark mode

  - [ ]\* 3.4 Write unit tests for TechStack
    - Test layout variants
    - Test category filtering
    - Test icon rendering

  - [x] 3.5 Create Process Steps Block
    - Create src/blocks/services/ProcessSteps/config.ts with configuration
    - Create ProcessSteps frontend component with layout variants
    - Add step numbering, icons, and timeline connector styling
    - Style with brand colors and dark mode

  - [ ]\* 3.6 Write unit tests for ProcessSteps
    - Test layout variants
    - Test step rendering
    - Test timeline connectors

  - [x] 3.7 Create Pricing Table Block
    - Create src/blocks/services/PricingTable/config.ts with configuration
    - Create PricingTable frontend component with pricing tier cards
    - Add feature comparison table and highlighted tier styling
    - Style with brand colors and dark mode

  - [ ]\* 3.8 Write unit tests for PricingTable
    - Test tier rendering
    - Test feature comparison
    - Test highlighted styling

- [ ] 4. Implement Portfolio blocks suite
  - Create Project Showcase, Case Study, Before/After, and Testimonial blocks
  - Implement frontend components for all portfolio blocks
  - Register all portfolio blocks in block registry

  - [ ] 4.1 Create Project Showcase Block
    - Create src/blocks/portfolio/ProjectShowcase/config.ts with configuration
    - Create ProjectShowcase frontend component with layout variants
    - Add filtering functionality and load more pagination
    - Style with brand colors and dark mode

  - [ ]\* 4.2 Write unit tests for ProjectShowcase
    - Test layout variants
    - Test filtering logic
    - Test pagination

  - [ ] 4.3 Create Case Study Block
    - Create src/blocks/portfolio/CaseStudy/config.ts with configuration
    - Create CaseStudy frontend component with problem-solution-results layout
    - Add metrics display with icons and testimonial section
    - Style with brand colors and dark mode

  - [ ]\* 4.4 Write unit tests for CaseStudy
    - Test section rendering
    - Test metrics display
    - Test testimonial rendering

  - [ ] 4.5 Create Before/After Comparison Block
    - Create src/blocks/portfolio/BeforeAfter/config.ts with configuration
    - Create BeforeAfter frontend component with image comparison slider
    - Add draggable handle and orientation support (horizontal/vertical)
    - Style with brand colors and dark mode

  - [ ]\* 4.6 Write unit tests for BeforeAfter
    - Test slider functionality
    - Test orientation variants
    - Test default position

  - [ ] 4.7 Create Testimonial Block
    - Create src/blocks/portfolio/Testimonial/config.ts with configuration
    - Create Testimonial frontend component with layout variants
    - Add avatar display and rating stars
    - Style with brand colors and dark mode

  - [ ]\* 4.8 Write unit tests for Testimonial
    - Test layout variants
    - Test rating display
    - Test avatar rendering

- [ ] 5. Implement Technical Content blocks suite
  - Enhance Code block and create Feature Grid, Stats Counter, FAQ Accordion, and Timeline blocks
  - Implement frontend components for all technical blocks
  - Register all technical blocks in block registry

  - [ ] 5.1 Enhance Code Block
    - Update src/blocks/technical/CodeBlock/config.ts with 20+ programming languages
    - Create enhanced CodeBlock frontend component with Shiki or Prism
    - Add copy-to-clipboard functionality, line numbers, and line highlighting
    - Style with brand colors and dark mode

  - [ ]\* 5.2 Write unit tests for CodeBlock
    - Test syntax highlighting
    - Test copy functionality
    - Test line highlighting

  - [ ] 5.3 Create Feature Grid Block
    - Create src/blocks/technical/FeatureGrid/config.ts with configuration
    - Create FeatureGrid frontend component with responsive grid layout
    - Add Lucide icon support and style variants
    - Style with brand colors and dark mode

  - [ ]\* 5.4 Write unit tests for FeatureGrid
    - Test grid layouts
    - Test icon rendering
    - Test style variants

  - [ ] 5.5 Create Stats Counter Block
    - Create src/blocks/technical/StatsCounter/config.ts with configuration
    - Create StatsCounter frontend component with counter animation
    - Add scroll-triggered animation and icon support
    - Style with brand colors and dark mode

  - [ ]\* 5.6 Write unit tests for StatsCounter
    - Test counter animation
    - Test scroll trigger
    - Test layout variants

  - [ ] 5.7 Create FAQ Accordion Block
    - Create src/blocks/technical/FAQAccordion/config.ts with configuration
    - Create FAQAccordion frontend component with accordion functionality
    - Add search filtering and category grouping
    - Style with brand colors and dark mode

  - [ ]\* 5.8 Write unit tests for FAQAccordion
    - Test accordion open/close
    - Test search functionality
    - Test category filtering

  - [ ] 5.9 Create Timeline Block
    - Create src/blocks/technical/Timeline/config.ts with configuration
    - Create Timeline frontend component with orientation variants
    - Add timeline connectors and icon/image support
    - Style with brand colors and dark mode

  - [ ]\* 5.10 Write unit tests for Timeline
    - Test orientation variants
    - Test timeline connectors
    - Test item rendering

- [ ] 6. Implement CTA and Conversion blocks suite
  - Enhance CTA block and create Contact Form, Newsletter, and Social Proof blocks
  - Implement frontend components for all CTA blocks
  - Register all CTA blocks in block registry

  - [ ] 6.1 Enhance Call-to-Action Block
    - Update src/blocks/cta/CallToAction/config.ts with variant options
    - Create enhanced CallToAction frontend component with variant layouts
    - Add background patterns and media support
    - Style with brand colors and dark mode

  - [ ]\* 6.2 Write unit tests for CallToAction
    - Test variant layouts
    - Test pattern rendering
    - Test action buttons

  - [ ] 6.3 Create Contact Form Block
    - Create src/blocks/cta/ContactForm/config.ts with configuration
    - Create ContactForm frontend component with form builder integration
    - Implement layout variants and contact info display
    - Style with brand colors and dark mode

  - [ ]\* 6.4 Write unit tests for ContactForm
    - Test form integration
    - Test layout variants
    - Test contact info display

  - [ ] 6.5 Create Newsletter Block
    - Create src/blocks/cta/Newsletter/config.ts with configuration
    - Create Newsletter frontend component with style variants
    - Add email validation and privacy note display
    - Style with brand colors and dark mode

  - [ ]\* 6.6 Write unit tests for Newsletter
    - Test style variants
    - Test email validation
    - Test form submission

  - [ ] 6.7 Create Social Proof Block
    - Create src/blocks/cta/SocialProof/config.ts with configuration
    - Create SocialProof frontend component with type variants
    - Add logo display with grayscale option, stats and badges display
    - Style with brand colors and dark mode

  - [ ]\* 6.8 Write unit tests for SocialProof
    - Test type variants
    - Test grayscale filter
    - Test layout variants

- [ ] 7. Implement Layout blocks suite
  - Enhance Content block and create Container, Divider, and Spacer blocks
  - Implement frontend components for all layout blocks
  - Register all layout blocks in block registry

  - [ ] 7.1 Enhance Content Block
    - Update src/blocks/layout/Content/config.ts with enhanced column options
    - Create enhanced Content frontend component with flexible column layouts
    - Add gap and alignment support, per-column styling
    - Style with brand colors and dark mode

  - [ ]\* 7.2 Write unit tests for Content
    - Test column layouts
    - Test gap and alignment
    - Test per-column styling

  - [ ] 7.3 Create Container Block
    - Create src/blocks/layout/Container/config.ts with configuration
    - Create Container frontend component with nested block rendering
    - Add max-width variants, background support, and spacing controls
    - Style with brand colors and dark mode

  - [ ]\* 7.4 Write unit tests for Container
    - Test nested block rendering
    - Test max-width variants
    - Test background rendering

  - [ ] 7.5 Create Divider Block
    - Create src/blocks/layout/Divider/config.ts with configuration
    - Create Divider frontend component with style variants
    - Add thickness and color support, width and alignment options
    - Style with brand colors and dark mode

  - [ ]\* 7.6 Write unit tests for Divider
    - Test style variants
    - Test thickness options
    - Test alignment

  - [ ] 7.7 Create Spacer Block
    - Create src/blocks/layout/Spacer/config.ts with configuration
    - Create Spacer frontend component with responsive height
    - Add breakpoint-specific spacing

  - [ ]\* 7.8 Write unit tests for Spacer
    - Test responsive heights
    - Test breakpoint behavior

- [ ] 8. Organize blocks and create documentation
  - Add category metadata and help text to all blocks
  - Create block preview thumbnails
  - Finalize block registry with TypeScript interfaces
  - Create example pages demonstrating block usage

  - [ ] 8.1 Organize Blocks with Categories
    - Update block configurations with category metadata
    - Add descriptive labels and help text to all blocks
    - Add admin.description to all block fields
    - Add admin.placeholder where appropriate

  - [ ]\* 8.2 Write property test for field documentation
    - **Property 11: Field Documentation Completeness**
    - Verify all fields have description or placeholder

  - [ ] 8.3 Create Block Preview Thumbnails
    - Create preview images for each block type
    - Add preview thumbnails to block configurations

  - [ ] 8.4 Update Block Registry
    - Finalize src/blocks/index.ts with all blocks organized by category
    - Add TypeScript interfaces for all block types
    - Export block registry for use in collections

  - [ ]\* 8.5 Write property test for block registry completeness
    - **Property 1: Block Configuration Completeness**
    - Verify all blocks have required fields

  - [ ]\* 8.6 Write property test for component registration
    - **Property 2: Component Registration Consistency**
    - Verify all blocks have corresponding components

  - [ ] 8.7 Create Example Pages
    - Create example page configurations demonstrating block usage
    - Create "About" page example
    - Create "Portfolio" page example
    - Create "Services" page example

- [ ] 9. Implement performance and accessibility optimizations
  - Add lazy loading to all block components
  - Optimize bundle sizes and implement caching strategies
  - Add ARIA labels and ensure color contrast compliance
  - Run performance and accessibility tests

  - [ ] 9.1 Implement Performance Optimizations
    - Add lazy loading to all block components using Next.js dynamic imports
    - Implement lazy loading for images using Next/Image
    - Minimize JavaScript for each block
    - Use CSS-only animations where possible
    - Implement tree-shaking for unused code
    - Add proper cache headers for block content
    - Implement ISR for static pages

  - [ ]\* 9.2 Run Lighthouse performance tests
    - Test desktop performance (target: 90+)
    - Test mobile performance (target: 80+)

  - [ ] 9.3 Implement Accessibility Features
    - Add ARIA labels to all interactive elements
    - Add proper role attributes
    - Add aria-label and aria-describedby
    - Ensure keyboard navigation works
    - Verify all text meets WCAG 2.1 AA contrast ratios
    - Test in both light and dark modes
    - Add focus indicators with proper contrast

  - [ ]\* 9.4 Run automated accessibility tests
    - Use axe-core to test all components
    - Verify no critical violations
    - Test keyboard navigation

  - [ ]\* 9.5 Perform screen reader testing
    - Test with NVDA/JAWS on Windows
    - Test with VoiceOver on macOS
    - Verify proper ARIA labels

- [ ] 10. Write comprehensive test suite
  - Implement property-based tests for core functionality
  - Create integration tests for admin panel and frontend
  - Write end-to-end tests for complete workflows

  - [ ]\* 10.1 Write Property-Based Tests
    - Write property test for collection tab structure (Property 3)
    - Write property test for sidebar field positioning (Property 4)
    - Write property test for SEO schema defaults (Property 5)
    - Write property test for component color scheme (Property 8)
    - Write property test for dark mode support (Property 9)
    - Write property test for component imports (Property 10)
    - Write property test for hook preservation (Property 12)

  - [ ]\* 10.2 Write Integration Tests
    - Test admin panel integration (collections load, tabs display, sidebar positioning, conditional fields)
    - Test frontend rendering integration (blocks render, nested blocks, responsive layouts, dark mode)
    - Test form submission integration (contact forms, newsletter signups, validation, success messages)
    - Test SEO integration (meta tags, structured data, Open Graph tags, Twitter cards)

  - [ ]\* 10.3 Write End-to-End Tests
    - Test content creation workflow (create page, save draft, preview, publish, verify rendering)
    - Test content editing workflow (edit page, change hero variant, add/remove blocks, reorder, save)
    - Test SEO workflow (create blog post, verify schema defaults, verify readonly, verify meta tags)

- [ ] 11. Create documentation and prepare for deployment
  - Write user documentation for all blocks
  - Create developer documentation
  - Prepare deployment checklist
  - Deploy to staging and production

  - [ ] 11.1 Create User Documentation
    - Write documentation for each block type
    - Create usage examples and best practices
    - Document field options and configurations
    - Create troubleshooting guide

  - [ ] 11.2 Create Developer Documentation
    - Document block architecture and patterns
    - Document component structure
    - Document styling conventions
    - Document testing approach
    - Create contribution guidelines

  - [ ] 11.3 Prepare for Deployment
    - Review all code for production readiness
    - Verify environment variables are configured
    - Test database migrations (if applicable)
    - Create deployment checklist

  - [ ] 11.4 Deploy to Staging
    - Deploy to staging environment
    - Run smoke tests on staging
    - Verify all blocks work correctly
    - Test admin panel functionality
    - Test frontend rendering

  - [ ] 11.5 User Acceptance Testing
    - Have content editors test admin panel
    - Gather feedback on block usability
    - Test all workflows end-to-end
    - Document any issues or improvements

  - [ ] 11.6 Deploy to Production
    - Deploy to production environment
    - Monitor for errors
    - Verify all functionality works
    - Announce new features to team

- [ ] 12. Checkpoint - Ensure all tests pass and system is complete
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional property-based and integration tests that can be skipped for faster MVP
- Each main task represents a complete feature area with sub-tasks for implementation details
- Checkpoints ensure incremental validation throughout the implementation
- Property tests validate universal correctness properties across all inputs
- Unit tests validate specific examples and edge cases
- Integration tests validate end-to-end functionality
- All components must use brand-primary and zinc-800-950 color scheme
- All components must support dark mode with proper contrast ratios
- All blocks must have descriptive help text for content editors
- Performance targets: 90+ Lighthouse score (desktop), 80+ (mobile)
- Accessibility target: WCAG 2.1 AA compliance
- Testing framework: Vitest for unit/property tests, Playwright for E2E tests
