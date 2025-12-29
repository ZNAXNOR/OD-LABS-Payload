## 2024-05-20 - Standardize Collection Structure

**Issue:** A Payload CMS collection (`Media`) was defined in a single file (`src/collections/Media.ts`) while its related hooks were in a separate directory (`src/collections/Media/hooks`). This created an inconsistent and fragmented structure compared to other collections that were properly organized within their own directories.

**Learning:** This inconsistency likely arose because the collection started simple and grew over time, with new logic being added in a separate directory out of convenience. This leads to a confusing structure where related files are not co-located.

**Guideline:** To maintain architectural consistency, all collections, regardless of their initial simplicity, should be organized within a dedicated directory from the start. This directory should contain an `index.ts` for the collection configuration and subdirectories for related logic like `hooks`, `access`, and `fields`. This pattern makes the codebase easier to navigate and scale.
