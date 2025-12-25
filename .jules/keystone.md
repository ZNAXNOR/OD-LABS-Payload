## 2024-05-23 - Collection Structure Migration

**Issue:** Simple, single-file collection configurations (e.g., `src/collections/Media.ts`) become difficult to maintain as they grow, mixing schema definitions, hooks, and access controls in one file.

**Learning:** The codebase previously lacked a clear guideline for when to migrate a collection from a single file to a more organized directory structure. This led to inconsistencies where some complex collections were well-structured (e.g., `Posts`) while others (`Media`) were not.

**Guideline:** When a collection's configuration grows beyond a simple schema (e.g., by adding hooks, complex access controls, or custom components), it should be refactored into a directory. The directory should contain an `index.ts` for the main configuration and separate files for hooks, access controls, etc., to ensure a clear separation of concerns.
