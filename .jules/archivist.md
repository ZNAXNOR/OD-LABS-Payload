## 2024-09-06 - Conditionally Required Fields for Data Integrity

**Issue:** An optional-but-important field (like image `alt` text) relied on a non-enforced UI hint (a React component description) to guide users, leading to inconsistent data.

**Impact:** This created ambiguity in the data model. An empty `alt` field could mean either the image was decorative or that the user simply forgot to add the text. This makes it impossible for front-end tooling to programmatically handle accessibility correctly.

**Guideline:** For optional-but-important fields, add an explicit boolean flag (e.g., `isDecorative: { type: 'checkbox' }`) to the schema. Use this flag to conditionally require the main field (`required: ({ data }) => !data.isDecorative`). This moves business logic from UI hints into enforced data-modeling guardrails, ensuring data is explicit and reliable.
