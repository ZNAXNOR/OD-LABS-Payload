## 2024-05-23 - Conditional Validation for Better Accessibility UX

**Learning:** For critical accessibility fields like `alt` text, a non-blocking UI warning is a good first step, but it can be easily ignored. A more robust and user-friendly pattern is to introduce a boolean field (e.g., `isDecorative`) that allows users to explicitly opt-out. This transforms the requirement from a suggestion into a conscious choice.

**Action:** When implementing accessibility features, prefer conditional validation tied to an explicit user choice over passive warnings. This improves data quality and ensures accessibility is a deliberate part of the content creation process.
