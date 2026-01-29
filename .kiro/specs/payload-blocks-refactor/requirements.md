## Introduction

This specification defines the requirements for **incrementally improving the existing Payload CMS blocks implementation** so that it aligns with the **quality, consistency, and editor experience standards** seen in official Payload CMS repositories.

The goal is **not** to redesign the block system or introduce new abstractions, but to **enhance and correct the current block code in place**.

---

## Scope Clarification (Very Important)

* ✅ Existing block files MUST be updated, not rewritten from scratch
* ✅ Existing field definitions SHOULD be reused and improved
* ❌ No field factory system is required
* ❌ No new architectural layers should be introduced unless strictly necessary
* ❌ No business logic or content meaning changes
* ❌ No UI redesign

This is a **quality uplift**, not a re-architecture.

---

## Glossary

* **Block**: A Payload CMS block configuration already present in the codebase
* **Admin_UX**: Editor-facing configuration inside Payload Admin
* **Type_Contract**: TypeScript interfaces ensuring CMS ↔ frontend consistency
* **Row_Label**: Dynamic labels shown for blocks in the admin UI
* **Lexical_Editor**: Payload CMS v3 rich text editor

---

## Requirement 1: Preserve Existing Block Structure

**User Story:**
As a developer, I want blocks to remain recognizable and stable, so existing functionality is not disrupted.

### Acceptance Criteria

1. WHEN refactoring blocks, THE System SHALL keep each block as a single logical unit
2. WHEN updating blocks, THE System SHALL NOT introduce new architectural layers (e.g. field factories)
3. WHEN blocks are modified, THE System SHALL preserve existing field names and meanings
4. WHEN blocks are imported, THE System SHALL continue to work without import path changes

---

## Requirement 2: Improve Admin UX (Primary Focus)

**User Story:**
As a content editor, I want blocks to be understandable and easy to use, so I can build pages confidently.

### Acceptance Criteria

1. WHEN viewing a block, THE System SHALL add `admin.description` explaining when the block should be used
2. WHEN blocks appear in arrays, THE System SHALL provide meaningful `RowLabel` values
3. WHEN fields have sensible defaults, THE System SHALL define `defaultValue`
4. WHEN fields repeat content, THE System SHALL define `minRows` and `maxRows` where appropriate
5. WHEN fields depend on other fields, THE System SHALL use `admin.condition`
6. WHEN blocks contain many fields, THE System SHALL group them using `type: 'group'`

---

## Requirement 3: Type Safety Enhancement (In Place)

**User Story:**
As a developer, I want clearer CMS ↔ frontend contracts, without restructuring the system.

### Acceptance Criteria

1. WHEN a block defines data, THE System SHALL create a block-specific TypeScript interface
2. WHEN blocks use `blockType`, THE System SHALL use it as a discriminant
3. WHEN frontend components consume blocks, THE System SHALL rely on explicit interfaces
4. WHEN block schemas change, THE System SHALL surface TypeScript errors
5. WHEN exporting block types, THE System SHALL centralize exports without changing runtime behavior

---

## Requirement 4: Lexical Editor Control (Selective)

**User Story:**
As a developer, I want editors to have appropriate formatting tools, not unlimited ones.

### Acceptance Criteria

1. WHEN a block uses rich text, THE System SHALL explicitly define allowed Lexical features
2. WHEN rich text is used for headings, THE System SHALL limit formatting options
3. WHEN rich text is used for content, THE System SHALL allow richer formatting
4. WHEN rich text is used, THE System SHALL NOT rely on default editor config

---

## Requirement 5: Layout Block Corrections

**User Story:**
As a content editor, I want layout blocks to behave like containers, not content.

### Acceptance Criteria

1. WHEN a block is intended as a layout block, THE System SHALL support nested blocks
2. WHEN layout blocks exist, THE System SHALL clearly separate them from content blocks
3. WHEN layout blocks control spacing, THE System SHALL expose padding/margin options
4. WHEN layout blocks control width, THE System SHALL expose width/alignment options

---

## Requirement 6: Field Validation Improvements

**User Story:**
As a content editor, I want guardrails that prevent invalid content.

### Acceptance Criteria

1. WHEN fields have natural limits, THE System SHALL define `maxLength`
2. WHEN fields are required, THE System SHALL enforce `required: true`
3. WHEN arrays represent grids/lists, THE System SHALL enforce row limits
4. WHEN select fields exist, THE System SHALL include clear labels
5. WHEN conditional fields are hidden, THE System SHALL prevent stale values

---

## Requirement 7: Rendering Contract Alignment (Non-Disruptive)

**User Story:**
As a frontend developer, I want predictable data without changing rendering logic.

### Acceptance Criteria

1. WHEN blocks provide data, THE System SHALL document the expected shape via types
2. WHEN optional fields exist, THE System SHALL handle undefined values safely
3. WHEN block variants exist, THE System SHALL rely on `blockType` discrimination
4. WHEN data structures change, THE System SHALL preserve backward compatibility

---

## Requirement 8: Performance Preservation

**User Story:**
As a developer, I want no regressions.

### Acceptance Criteria

1. WHEN blocks are refactored, THE System SHALL preserve tree-shaking
2. WHEN admin config is added, THE System SHALL NOT significantly increase bundle size
3. WHEN types are added, THE System SHALL NOT impact runtime performance
4. WHEN blocks render, THE System SHALL behave identically to current behavior

---

## Explicit Non-Goals

* ❌ Introducing field factories
* ❌ Rewriting block architecture
* ❌ Changing visual design
* ❌ Changing content semantics
* ❌ Adding new block types

---

## Success Definition

The refactor is successful when:

* Blocks feel **editor-friendly**
* Admin UI is **self-explanatory**
* Types are **explicit and safe**
* Layout blocks behave correctly
* Existing behavior remains unchanged
* Code quality matches **official Payload standards**
