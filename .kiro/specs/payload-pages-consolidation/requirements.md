# Requirements Document

## 1. Introduction

This specification defines the requirements for refactoring a large Payload CMS + Next.js project from multiple specialized page collections (`Pages`, `Blogs`, `Services`, `Legal`, `Contacts`) into a **single canonical Pages collection**.

The refactor must:

* Preserve all existing functionality, behavior, and performance
* Ensure zero content loss and safe migration
* Improve schema clarity for **frontend consumption**
* Establish a single source of truth for page behavior
* Retain page-type specialization via structured metadata and conditional fields

This is a **structural consolidation**, not a content or rendering rewrite.

---

## 2. Core Design Principles (NEW — important)

The consolidated Pages collection SHALL follow these principles:

1. **Separation of Concerns**
   * Content (blocks)
   * Metadata (page identity & behavior)
   * Configuration (page-type–specific options)

2. **Frontend-First Shape**
   * API responses SHALL be predictable and consistent across page types
   * Page type SHALL be expressed as metadata, not structural divergence

3. **Progressive Specialization**
   * All pages share a common base
   * Specialization is additive, not branching

---

## 3. Glossary

* **Pages_Collection**
  The single unified collection representing all site pages

* **Page_Type**
  A required discriminator (`page`, `blog`, `service`, `legal`, `contact`) that controls behavior and available fields

* **Page_Base**
  The shared schema applied to all pages (identity, routing, SEO, layout, lifecycle)

* **Conditional_Field_Group**
  A page-type–specific field group rendered only when applicable

* **Block_Layout**
  A flexible, ordered block array representing page content

* **Page_Metadata**
  Non-rendered configuration that affects behavior (routing, revalidation, automation)

---

## 4. Requirement 1: Collection Consolidation

**User Story:**
As a content manager, I want all pages managed in a single collection so that shared behavior is centralized and consistent.

### Acceptance Criteria

1. THE Pages_Collection SHALL replace all specialized page collections (`Blogs`, `Services`, `Legal`, `Contacts`)
2. THE Pages_Collection SHALL define a shared Page_Base schema used by all page types
3. THE Pages_Collection SHALL include a required `pageType` discriminator with values:

   * `page`
   * `blog`
   * `service`
   * `legal`
   * `contact`
4. Page specialization SHALL be implemented via conditional field groups, not separate collections
5. Original collections MAY temporarily coexist during migration but SHALL be deprecated post-migration

---

## 5. Requirement 2: Schema Organization for Frontend Consumption (REFINED)

**User Story:**
As a frontend developer, I want page data to be structured predictably so rendering logic remains simple and consistent.

### Acceptance Criteria

1. THE Pages_Collection SHALL expose a **stable top-level shape** across all page types:

```ts
{
  id
  slug
  pageType
  title
  layout
  seo
  metadata
  audit
}
```

2. Shared fields SHALL live at the root level and NEVER be duplicated per page type
3. Page-type–specific fields SHALL be grouped under clearly named objects:

   * `blogConfig`
   * `serviceConfig`
   * `legalConfig`
   * `contactConfig`
4. The frontend SHALL NOT need to infer behavior from field presence alone — `pageType` SHALL be authoritative
5. Blocks SHALL remain the primary content surface for rendering

---

## 6. Requirement 3: Page-Type Specialization (RESTRUCTURED)

**User Story:**
As a content editor, I want pages to expose only fields relevant to their type without losing flexibility.

### Acceptance Criteria

1. WHEN `pageType = blog`, the page SHALL expose:
   * `blogConfig.author`
   * `blogConfig.tags`
   * `blogConfig.publishedDate`
   * `blogConfig.excerpt`

2. WHEN `pageType = service`, the page SHALL expose:
   * `serviceConfig.pricing`
   * `serviceConfig.serviceType`
   * `serviceConfig.featured`

3. WHEN `pageType = legal`, the page SHALL expose:
   * `legalConfig.documentType`
   * `legalConfig.effectiveDate`
   * `legalConfig.lastUpdated`
   * `legalConfig.notificationSettings`

4. WHEN `pageType = contact`, the page SHALL expose:
   * `contactConfig.purpose`
   * `contactConfig.formRelations`
   
5. These configs SHALL NOT affect unrelated page types

---

## 7. Requirement 4: Block Layout & Composition (CLARIFIED)

**User Story:**
As a content designer, I want consistent layouts with optional specialization.

### Acceptance Criteria

1. THE Pages_Collection SHALL define a shared `layout` blocks field
2. All page types SHALL support the shared block set
3. Page-type–specific block extensions MAY be added via:
   * conditional block fields, or
   * pageType-based block allowlists
4. Blocks SHALL NOT encode page identity — pageType SHALL

---

## 8. Requirement 5: Hierarchy & Routing Preservation

*(unchanged in intent, clarified in wording)*

### Acceptance Criteria

1. Parent-child relationships SHALL be preserved
2. Breadcrumb generation SHALL remain functional
3. Circular references SHALL continue to be prevented
4. Hierarchy support SHALL apply to all relevant page types
5. URL generation behavior SHALL remain unchanged

---

## 9. Requirement 6: Hooks & Lifecycle Behavior

**User Story:**
As a system administrator, I want shared automation logic to apply uniformly.

### Acceptance Criteria

1. Audit trails SHALL be implemented once at the Pages_Collection level
2. Revalidation SHALL use shared hook factories
3. Hooks MAY branch internally on `pageType`, but SHALL NOT be duplicated
4. Slug generation SHALL remain centralized
5. Hook performance characteristics SHALL be preserved

---

## 10. Requirement 7: Access Control

*(unchanged in spirit, clarified in scope)*

### Acceptance Criteria

1. Access control SHALL be collection-level
2. Permissions SHALL NOT diverge by pageType unless already required
3. Draft/publish workflows SHALL remain unchanged

---

## 11. Requirement 8: Live Preview

### Acceptance Criteria

1. Live preview SHALL work for all page types
2. Preview URL resolution SHALL remain compatible with existing frontend routing
3. `pageType` MAY be used for preview resolution only where routing currently depends on it
4. Draft and published preview behavior SHALL remain consistent

---

## 12. Requirement 9: Migration Safety (CORRECTED)

### Acceptance Criteria

1. All documents SHALL be migrated without data loss
2. Relationships and internal references SHALL be preserved
3. Version history and drafts SHALL be preserved
4. Audit metadata SHALL be preserved
5. Rollback procedures SHALL be defined and documented
6. Document IDs SHOULD be preserved where technically feasible

---

## 13. Requirement 10: Frontend Compatibility (REFINED)

### Acceptance Criteria

1. Frontend consumers SHALL continue to receive equivalent data
2. GraphQL and REST APIs SHALL remain compatible
3. Routing behavior SHALL remain unchanged
4. Minor internal schema refactors are acceptable if frontend behavior is preserved

---

## 14. Requirement 11: Admin UI Consistency

### Acceptance Criteria

1. Page type SHALL be clearly visible in list and edit views
2. Conditional fields SHALL reduce clutter, not increase it
3. Existing admin customizations SHALL be preserved
4. Field grouping SHALL reflect conceptual boundaries

---

## 15. Requirement 12: Validation Preservation

*(unchanged — already strong)*

---

## 🔑 What this rewrite accomplishes

* Frontend now gets a **clean, predictable page shape**
* Page-type logic is **explicit, not implicit**
* Blocks stay pure content
* Metadata drives behavior
* Kiro is guided away from:
  * flat field sprawl
  * over-nested schemas
  * frontend conditionals based on guesswork
