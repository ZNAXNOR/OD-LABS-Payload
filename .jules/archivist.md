## 2024-07-26 - Conditionally Requiring Fields to Capture Intent
**Issue:** The 'alt' text field in the 'Media' collection was optional, creating ambiguity. An empty value could mean an image was decorative or that an editor forgot to add text, relying on UI hints rather than schema enforcement.
**Impact:** This weakened the reliability of accessibility and SEO data, as it depended on editor diligence instead of a clear data contract.
**Guideline:** For optional-but-important fields, a robust pattern is to add a boolean flag (e.g., 'isDecorative') to the schema. Use this flag to conditionally require the main field. This moves business logic from soft UI hints into hard data-modeling guardrails, ensuring intent is explicitly captured and enforced.
