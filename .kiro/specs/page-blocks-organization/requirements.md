# Requirements Document

## Introduction

This specification defines the organization and assignment of content blocks across different page collection types in the PayloadCMS website. Currently, all blocks are available only to the general "Pages" collection, which creates confusion for content editors and doesn't provide appropriate block options for specialized page types (Blogs, Services, Contacts, Legal).

The goal is to assign contextually appropriate blocks to each page collection type, improving the content editing experience and ensuring that editors see only relevant block options for their specific page type.

## Glossary

- **Block**: A reusable content component that can be added to a page layout (e.g., Hero, Content, CallToAction)
- **Page_Collection**: A PayloadCMS collection representing a specific type of page (Pages, Blogs, Services, Contacts, Legal)
- **Layout_Builder**: The blocks field that allows editors to build page layouts by adding and arranging blocks
- **Block_Category**: A logical grouping of related blocks (Hero, Content, Services, Portfolio, Technical, CTA, Layout)
- **Content_Editor**: A user who creates and manages page content through the PayloadCMS admin panel
- **Component**: A React component that renders a block on the frontend

## Requirements

### Requirement 1: Blog Pages Block Assignment

**User Story:** As a content editor creating blog posts, I want to see only blocks relevant to blog content, so that I can focus on writing and presenting articles effectively.

#### Acceptance Criteria

1. WHEN editing a blog page, THE System SHALL provide access to Hero, Content, Media, Banner, and Code blocks
2. WHEN editing a blog page, THE System SHALL provide access to FeatureGrid, StatsCounter, FAQAccordion, and Timeline blocks from the Technical category
3. WHEN editing a blog page, THE System SHALL provide access to CallToAction, Newsletter, and SocialProof blocks from the CTA category
4. WHEN editing a blog page, THE System SHALL provide access to Container, Divider, and Spacer blocks from the Layout category
5. WHEN editing a blog page, THE System SHALL NOT provide access to Services-specific blocks (ServicesGrid, TechStack, ProcessSteps, PricingTable)
6. WHEN editing a blog page, THE System SHALL NOT provide access to Portfolio-specific blocks (ProjectShowcase, CaseStudy, BeforeAfter, Testimonial)

### Requirement 2: Services Pages Block Assignment

**User Story:** As a content editor creating service pages, I want to see blocks optimized for presenting services and offerings, so that I can effectively showcase our services to potential clients.

#### Acceptance Criteria

1. WHEN editing a service page, THE System SHALL provide access to Hero, Content, Media, and CallToAction blocks
2. WHEN editing a service page, THE System SHALL provide access to all Services category blocks (ServicesGrid, TechStack, ProcessSteps, PricingTable)
3. WHEN editing a service page, THE System SHALL provide access to Testimonial block for client testimonials
4. WHEN editing a service page, THE System SHALL provide access to FeatureGrid, StatsCounter, and FAQAccordion blocks from the Technical category
5. WHEN editing a service page, THE System SHALL provide access to ContactForm, Newsletter, and SocialProof blocks from the CTA category
6. WHEN editing a service page, THE System SHALL provide access to Container, Divider, and Spacer blocks from the Layout category
7. WHEN editing a service page, THE System SHALL NOT provide access to Archive block
8. WHEN editing a service page, THE System SHALL NOT provide access to Code block

### Requirement 3: Contact Pages Block Assignment

**User Story:** As a content editor creating contact pages, I want to see blocks focused on contact forms and communication, so that I can create effective contact pages without unnecessary options.

#### Acceptance Criteria

1. WHEN editing a contact page, THE System SHALL provide access to Hero, Content, and Media blocks
2. WHEN editing a contact page, THE System SHALL provide access to ContactForm and SocialProof blocks from the CTA category
3. WHEN editing a contact page, THE System SHALL provide access to FAQAccordion block for contact-related FAQs
4. WHEN editing a contact page, THE System SHALL provide access to Container, Divider, and Spacer blocks from the Layout category
5. WHEN editing a contact page, THE System SHALL NOT provide access to Services category blocks
6. WHEN editing a contact page, THE System SHALL NOT provide access to Portfolio category blocks
7. WHEN editing a contact page, THE System SHALL NOT provide access to Archive, Banner, or Code blocks

### Requirement 4: Legal Pages Block Assignment

**User Story:** As a content editor creating legal documents, I want to see minimal, document-focused blocks, so that I can create clear legal pages without distracting layout options.

#### Acceptance Criteria

1. WHEN editing a legal page, THE System SHALL provide access to Content block for document text
2. WHEN editing a legal page, THE System SHALL provide access to Banner block for important legal notices
3. WHEN editing a legal page, THE System SHALL provide access to FAQAccordion block for legal FAQs
4. WHEN editing a legal page, THE System SHALL provide access to Container, Divider, and Spacer blocks from the Layout category
5. WHEN editing a legal page, THE System SHALL NOT provide access to Hero block
6. WHEN editing a legal page, THE System SHALL NOT provide access to Media, Archive, or Code blocks
7. WHEN editing a legal page, THE System SHALL NOT provide access to Services, Portfolio, or CTA category blocks (except as specified)

### Requirement 5: General Pages Block Assignment

**User Story:** As a content editor creating general pages, I want access to all available blocks, so that I have maximum flexibility for creating diverse page layouts.

#### Acceptance Criteria

1. WHEN editing a general page, THE System SHALL provide access to all Hero category blocks
2. WHEN editing a general page, THE System SHALL provide access to all Content category blocks
3. WHEN editing a general page, THE System SHALL provide access to all Services category blocks
4. WHEN editing a general page, THE System SHALL provide access to all Portfolio category blocks
5. WHEN editing a general page, THE System SHALL provide access to all Technical category blocks
6. WHEN editing a general page, THE System SHALL provide access to all CTA category blocks
7. WHEN editing a general page, THE System SHALL provide access to all Layout category blocks

### Requirement 6: Block Import Organization

**User Story:** As a developer maintaining the codebase, I want block imports organized by page collection type, so that I can easily understand which blocks are used where and maintain the code efficiently.

#### Acceptance Criteria

1. WHEN reviewing page collection configuration files, THE System SHALL group block imports by category with clear comments
2. WHEN reviewing page collection configuration files, THE System SHALL list blocks in a consistent order across all collections
3. WHEN a new block is added to a category, THE System SHALL make it easy to identify which page collections should include it
4. WHEN reviewing the blocks array in a page collection, THE System SHALL organize blocks by category with section comments

### Requirement 7: Frontend Component Mapping

**User Story:** As a developer implementing frontend rendering, I want clear mapping between blocks and their React components, so that I can ensure all blocks render correctly on each page type.

#### Acceptance Criteria

1. WHEN a block is assigned to a page collection, THE System SHALL ensure a corresponding React component exists in the components directory
2. WHEN rendering a page, THE System SHALL map each block type to its correct React component
3. WHEN a block type is not recognized, THE System SHALL log a warning and skip rendering that block
4. WHEN reviewing component organization, THE System SHALL group components by the same categories as blocks

### Requirement 8: Block Validation and Type Safety

**User Story:** As a developer, I want TypeScript type safety for block assignments, so that I can catch configuration errors at compile time rather than runtime.

#### Acceptance Criteria

1. WHEN configuring blocks for a page collection, THE System SHALL validate that all referenced blocks exist
2. WHEN building the application, THE System SHALL type-check that block configurations match their TypeScript interfaces
3. WHEN a block is removed from the codebase, THE System SHALL produce a TypeScript error if it's still referenced in a page collection
4. WHEN adding a new block to a page collection, THE System SHALL provide autocomplete for available block names

### Requirement 9: Documentation and Maintenance

**User Story:** As a developer or content editor, I want clear documentation of which blocks are available for each page type, so that I can understand the system without reading code.

#### Acceptance Criteria

1. WHEN reviewing project documentation, THE System SHALL provide a matrix showing which blocks are available for each page collection
2. WHEN reviewing project documentation, THE System SHALL explain the rationale for block assignments
3. WHEN a content editor needs help, THE System SHALL provide admin panel descriptions explaining which blocks are available
4. WHEN maintaining the system, THE System SHALL provide comments in code explaining block assignment decisions

### Requirement 10: Backward Compatibility

**User Story:** As a system administrator, I want existing pages to continue working after block reorganization, so that no content is lost or broken during the migration.

#### Acceptance Criteria

1. WHEN migrating to the new block organization, THE System SHALL preserve all existing page content
2. WHEN a page contains a block that is no longer available for its collection type, THE System SHALL still render that block on the frontend
3. WHEN editing a page with legacy blocks, THE System SHALL display a warning that certain blocks are no longer available for new additions
4. WHEN saving a page with legacy blocks, THE System SHALL preserve those blocks unless explicitly removed by the editor
