
## 2024-05-24 - Safe Refactoring with Module Resolution
**Issue:** A file move refactor (`Media.ts` -> `Media/index.ts`) was incorrectly flagged as a breaking change, assuming it would break external imports.
**Learning:** TypeScript and Node.js module resolution will automatically resolve an import pointing to a directory (e.g., `'./collections/Media'`) to the `index.ts` file within that directory. The successful build proved the change was non-breaking.
**Guideline:** Refactoring a single file (e.g., `Collection.ts`) into a directory structure (`Collection/index.ts`) is a safe, non-breaking change for external importers. Only the file's internal relative imports need updating.
