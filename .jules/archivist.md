## 2024-07-16 - Do Not Change Field Types Without Migration

**Issue:** An attempt to improve the schema by changing a `richText` field to a `textarea` was correctly identified as a high-risk, breaking change.

**Impact:** This change would have caused irreversible data loss for all existing entries in that field. The `richText` type stores data as a JSON object, while `textarea` stores it as a plain string. Without a migration script to safely convert the data, any existing content would be lost or corrupted upon the next save.

**Guideline:** Never change a field's type directly on a collection that may contain production data. If a type change is necessary, it must be accompanied by a carefully planned and tested data migration strategy. For enforcing constraints on existing fields (like character limits), use non-destructive features like the `validate` function, which can be safely added without altering the underlying data structure.
