# Requirements Document: Pages Admin Panel Enhancement & Technical Freelance Blocks

## Introduction

This specification covers two major enhancements to the PayloadCMS website:

1. Restructuring the Pages collection admin panel to follow PayloadCMS best practices with proper tab organization and sidebar positioning
2. Creating a comprehensive set of modern, technical-focused blocks and components for a freelance/technical services website

## Glossary

- **System**: The PayloadCMS admin panel and content management system
- **Pages_Collection**: The main pages collection configuration
- **Admin_Panel**: The PayloadCMS admin interface where content is managed
- **Block**: A reusable content component that can be added to page layouts
- **Tab**: A top-level organizational unit in the admin panel
- **Sidebar**: The right-side panel in the admin interface for metadata and settings
- **SEO_Plugin**: The @payloadcms/plugin-seo package providing SEO functionality
- **Schema_Type**: The structured data type for search engines (Article, Service, etc.)
- **Hero_Block**: A prominent banner/header section at the top of pages
- **Component**: A React component that renders block content on the frontend

## Requirements

### Requirement 1: Pages Collection Tab Restructure

**User Story:** As a content editor, I want the Pages collection admin panel organized into logical tabs with sidebar metadata, so that I can efficiently manage page content following PayloadCMS conventions.

#### Acceptance Criteria

1. THE System SHALL organize page fields into three tabs: "Content", "Hero", and "SEO"
2. THE System SHALL move slug, parent, breadcrumbs, and timestamps to the sidebar position
3. THE System SHALL place the Hero block configuration in a dedicated "Hero" tab
4. THE System SHALL place the layout blocks array in the "Content" tab
5. THE System SHALL use the SEO plugin's tab for all SEO-related fields
6. WHEN a user opens a page in the admin panel, THEN the System SHALL display all three tabs with proper field organization
7. THE System SHALL maintain all existing functionality including slug generation, breadcrumb population, and revalidation hooks

### Requirement 2: Collection-Specific SEO Schema Defaults

**User Story:** As a content editor, I want obvious SEO schema types to be pre-selected and readonly for specific collections, so that I don't have to manually configure obvious settings.

#### Acceptance Criteria

1. WHEN editing a Blog page, THE System SHALL default the schema type to "BlogPosting" and make it readonly
2. WHEN editing a Legal page, THE System SHALL default the schema type to "WebPage" and make it readonly
3. WHEN editing a Service page, THE System SHALL default the schema type to "Service" and make it readonly
4. WHEN editing a Contact page, THE System SHALL default the schema type to "ContactPage" and make it readonly
5. WHEN editing a generic Page, THE System SHALL allow manual selection of schema type
6. THE System SHALL apply these defaults through field hooks in the SEO plugin configuration
7. THE System SHALL maintain the ability for admins to override readonly settings if needed

### Requirement 3: Technical Hero Block Variants

**User Story:** As a content editor, I want multiple hero block style options suitable for a technical freelance website, so that I can create varied, professional page headers.

#### Acceptance Criteria

1. THE System SHALL provide a single Hero block with multiple style variants
2. THE Hero_Block SHALL support at least 6 style options: "Default", "Centered", "Minimal", "Split", "Gradient", and "Code Terminal"
3. WHEN the "Code Terminal" style is selected, THE System SHALL display a code snippet field with syntax highlighting
4. WHEN the "Split" style is selected, THE System SHALL provide left/right content arrangement options
5. WHEN the "Gradient" style is selected, THE System SHALL provide gradient color customization options
6. THE Hero_Block SHALL support all existing features: eyebrow, heading, subheading, media, video, actions, and settings
7. THE System SHALL render each hero variant with appropriate styling on the frontend

### Requirement 4: Technical Services Showcase Blocks

**User Story:** As a content editor, I want blocks specifically designed for showcasing technical services and skills, so that I can effectively present my freelance offerings.

#### Acceptance Criteria

1. THE System SHALL provide a "Services Grid" block with card-based service display
2. THE Services_Grid_Block SHALL support 2, 3, or 4 column layouts
3. THE System SHALL provide a "Tech Stack" block for displaying technologies and tools
4. THE Tech_Stack_Block SHALL support icon selection from popular tech brands
5. THE System SHALL provide a "Process Steps" block for explaining workflows
6. THE Process_Steps_Block SHALL support numbered or icon-based step indicators
7. THE System SHALL provide a "Pricing Table" block with comparison features
8. THE Pricing_Table_Block SHALL support up to 4 pricing tiers with feature lists

### Requirement 5: Portfolio and Case Study Blocks

**User Story:** As a content editor, I want blocks for showcasing projects and case studies, so that I can demonstrate my technical work and results.

#### Acceptance Criteria

1. THE System SHALL provide a "Project Showcase" block with filterable project cards
2. THE Project_Showcase_Block SHALL support filtering by technology, category, or custom tags
3. THE System SHALL provide a "Case Study" block with problem-solution-results structure
4. THE Case_Study_Block SHALL include fields for challenge, approach, solution, and metrics
5. THE System SHALL provide a "Before/After Comparison" block with slider functionality
6. THE Before_After_Block SHALL support image comparison with draggable slider
7. THE System SHALL provide a "Testimonial" block with client feedback display
8. THE Testimonial_Block SHALL support avatar, name, role, company, and quote fields

### Requirement 6: Technical Content Blocks

**User Story:** As a content editor, I want blocks optimized for technical content presentation, so that I can create engaging technical documentation and articles.

#### Acceptance Criteria

1. THE System SHALL enhance the existing Code block with language selection and themes
2. THE Code_Block SHALL support at least 20 programming languages with syntax highlighting
3. THE System SHALL provide a "Feature Grid" block with icon and description cards
4. THE Feature_Grid_Block SHALL support 2, 3, 4, or 6 column layouts
5. THE System SHALL provide a "Stats Counter" block for displaying metrics
6. THE Stats_Counter_Block SHALL support animated counting effects on scroll
7. THE System SHALL provide a "FAQ Accordion" block with expandable questions
8. THE FAQ_Block SHALL support nested questions and rich text answers
9. THE System SHALL provide a "Timeline" block for displaying chronological information
10. THE Timeline_Block SHALL support vertical or horizontal orientation

### Requirement 7: Call-to-Action and Conversion Blocks

**User Story:** As a content editor, I want conversion-focused blocks for driving user actions, so that I can effectively convert visitors into clients.

#### Acceptance Criteria

1. THE System SHALL enhance the existing CTA block with multiple layout variants
2. THE CTA_Block SHALL support "Centered", "Split", "Banner", and "Card" layouts
3. THE System SHALL provide a "Contact Form" block with customizable fields
4. THE Contact_Form_Block SHALL integrate with the form builder plugin
5. THE System SHALL provide a "Newsletter Signup" block with email capture
6. THE Newsletter_Block SHALL support integration with email service providers
7. THE System SHALL provide a "Social Proof" block with logos and metrics
8. THE Social_Proof_Block SHALL support client logos, statistics, and trust badges

### Requirement 8: Layout and Structure Blocks

**User Story:** As a content editor, I want flexible layout blocks for creating custom page structures, so that I can design unique page layouts without coding.

#### Acceptance Criteria

1. THE System SHALL enhance the existing Content block with more column options
2. THE Content_Block SHALL support 1, 2, 3, 4, and custom column layouts
3. THE System SHALL provide a "Container" block for grouping other blocks
4. THE Container_Block SHALL support background colors, padding, and margin controls
5. THE System SHALL provide a "Divider" block with customizable styles
6. THE Divider_Block SHALL support solid, dashed, dotted, and gradient styles
7. THE System SHALL provide a "Spacer" block for vertical spacing control
8. THE Spacer_Block SHALL support responsive spacing values

### Requirement 9: Frontend Component Implementation

**User Story:** As a developer, I want all blocks to have corresponding React components with proper styling, so that content renders correctly on the frontend.

#### Acceptance Criteria

1. THE System SHALL create a React component for each new block type
2. THE Components SHALL use Tailwind CSS with the brand-primary and zinc-800-950 color scheme
3. THE Components SHALL be responsive and work on mobile, tablet, and desktop
4. THE Components SHALL follow accessibility best practices (WCAG 2.1 AA)
5. THE Components SHALL use shadcn/ui components where appropriate
6. THE Components SHALL support dark mode with proper color adjustments
7. THE Components SHALL be optimized for performance with lazy loading where appropriate
8. THE System SHALL register all components in the RenderBlocks component

### Requirement 10: Block Organization and Categorization

**User Story:** As a content editor, I want blocks organized into logical categories in the admin panel, so that I can quickly find the block I need.

#### Acceptance Criteria

1. THE System SHALL organize blocks into categories: "Hero", "Content", "Services", "Portfolio", "Technical", "CTA", and "Layout"
2. THE Admin_Panel SHALL display block categories in the block selector
3. THE System SHALL provide descriptive labels and help text for each block
4. THE System SHALL include preview thumbnails for blocks where helpful
5. THE System SHALL maintain backward compatibility with existing blocks

### Requirement 11: Additional Page Types

**User Story:** As a website owner, I want suggestions for additional page types that would benefit a technical freelance website, so that I can create a comprehensive online presence.

#### Acceptance Criteria

1. THE System SHALL support creation of an "About" page with team/bio sections
2. THE System SHALL support creation of a "Portfolio" page with project filtering
3. THE System SHALL support creation of a "Resources" page with downloadable content
4. THE System SHALL support creation of a "FAQ" page with categorized questions
5. THE System SHALL support creation of a "Pricing" page with service packages
6. THE System SHALL support creation of a "Process" page explaining workflows
7. THE System SHALL support creation of a "Technologies" page showcasing tech stack
8. THE System SHALL support creation of a "Testimonials" page with client reviews

### Requirement 12: Color Scheme and Branding

**User Story:** As a website owner, I want all components to use consistent branding colors, so that the website has a cohesive professional appearance.

#### Acceptance Criteria

1. THE System SHALL use "brand-primary" as the primary accent color throughout
2. THE System SHALL use zinc-800 to zinc-950 range for backgrounds and secondary elements
3. THE Components SHALL support color customization through Tailwind configuration
4. THE System SHALL provide light and dark mode variants for all components
5. THE Components SHALL use proper contrast ratios for accessibility
6. THE System SHALL allow per-block color overrides where appropriate

### Requirement 13: Performance and Optimization

**User Story:** As a website visitor, I want pages to load quickly and smoothly, so that I have a good user experience.

#### Acceptance Criteria

1. THE System SHALL lazy load images in all blocks
2. THE System SHALL use Next.js Image component for optimized image delivery
3. THE System SHALL minimize JavaScript bundle size for each block
4. THE System SHALL use CSS-only animations where possible
5. THE System SHALL implement proper caching strategies for block content
6. THE System SHALL achieve Lighthouse performance score of 90+ on desktop
7. THE System SHALL achieve Lighthouse performance score of 80+ on mobile

### Requirement 14: Documentation and Examples

**User Story:** As a content editor, I want clear documentation and examples for each block, so that I can use them effectively.

#### Acceptance Criteria

1. THE System SHALL provide admin descriptions for each block field
2. THE System SHALL include placeholder text showing expected content format
3. THE System SHALL provide validation messages for incorrect inputs
4. THE System SHALL include example configurations for common use cases
5. THE System SHALL document any special requirements or limitations

## Notes

- All blocks should follow the PayloadCMS block pattern with proper TypeScript interfaces
- Components should reference shadcnblocks.com and payloadcms/website for design inspiration
- The implementation should maintain compatibility with existing content
- SEO enhancements should not break existing SEO configurations
- All new blocks should be optional and not required for existing pages to function
