# Inline Comment Standards for dbName Properties

This document establishes standards for inline comments explaining `dbName` property rationale throughout the Payload CMS configuration files.

## Comment Format

All `dbName` properties should include inline comments following this format:

```typescript
dbName: 'field_name', // [Rationale category]: [Specific explanation]
```

## Rationale Categories

### 1. Snake Case Conversion

For fields that are converted from camelCase to snake_case:

```typescript
// ✅ Good examples
dbName: 'first_name', // Snake case conversion following project standards
dbName: 'last_login_at', // Snake case conversion following project standards
dbName: 'social_media', // Snake case conversion following project standards
```

### 2. Abbreviation

For fields that use standard abbreviations:

```typescript
// ✅ Good examples
dbName: 'desc', // Abbreviated 'description' following project standards
dbName: 'feat_link', // Abbreviated 'featured' to 'feat' following project standards
dbName: 'nav_items', // Abbreviated 'navigation' to 'nav' following project standards
dbName: 'svc_grid', // Abbreviated 'services' to 'svc' to prevent long root identifiers
```

### 3. Strategic Interruption

For fields that break long identifier chains:

```typescript
// ✅ Good examples
dbName: 'nav_items', // CRITICAL for breaking long identifier chains in nested navigation
dbName: 'feat_link', // CRITICAL abbreviation to break long chains in dropdown structures
dbName: 'head_tabs', // Strategic interruption at root level to prevent deep nesting issues
```

### 4. Conflict Prevention

For fields that prevent naming conflicts:

```typescript
// ✅ Good examples
dbName: 'link_type', // Prefixed to avoid enum conflicts when used in multiple contexts
dbName: 'link_ref', // Prefixed to avoid conflicts when link fields are nested deeply
dbName: 'headers', // Pluralized for consistency with database naming conventions and to prevent conflicts
```

### 5. Semantic Preservation

For fields that maintain meaning while optimizing length:

```typescript
// ✅ Good examples
dbName: 'dropdown', // Keep semantic meaning while preventing identifier accumulation
dbName: 'services', // Keep semantic meaning - 'services' is already concise
dbName: 'features', // Keep semantic meaning - prevents redundant 'service' prefix
```

### 6. Context Simplification

For fields that remove redundant context:

```typescript
// ✅ Good examples
dbName: 'title', // Remove redundant 'service' prefix in service context
dbName: 'links', // Remove redundant 'section' prefix in section context
dbName: 'content', // Simplify in text block context
```

### 7. Descriptive Naming

For fields that need descriptive database names:

```typescript
// ✅ Good examples
dbName: 'layout_blocks', // Descriptive name to distinguish from other layout fields
dbName: 'parent_page', // Descriptive name to distinguish from other parent relationships
dbName: 'pricing_config', // Descriptive configuration group name
```

### 8. Standard Preservation

For fields that keep standard terms:

```typescript
// ✅ Good examples
dbName: 'logo', // Keep short semantic names - 'logo' is already concise
dbName: 'email', // Keep standard web terms
dbName: 'url', // Keep standard web terms
```

## Complete Examples

### Global Configuration

```typescript
export const Header: GlobalConfig = {
  slug: 'header',
  dbName: 'headers', // Pluralized for consistency with database naming conventions and to prevent conflicts
  fields: [
    {
      name: 'navigationTabs',
      type: 'array',
      dbName: 'nav_tabs', // Abbreviated 'navigation' to 'nav' following project standards
      fields: [
        {
          name: 'featuredLink',
          type: 'group',
          dbName: 'feat_link', // CRITICAL abbreviation to break long chains in dropdown structures
          fields: [
            {
              name: 'descriptionLinks',
              type: 'array',
              dbName: 'desc_links', // Abbreviated 'description' and snake case conversion
            },
          ],
        },
      ],
    },
  ],
}
```

### Block Configuration

```typescript
export const ServicesGridBlock: Block = {
  slug: 'servicesGrid',
  dbName: 'svc_grid', // Abbreviated 'services' to 'svc' to prevent long root identifiers
  fields: [
    {
      name: 'services',
      type: 'array',
      dbName: 'services', // Keep semantic meaning - 'services' is already concise
      fields: [
        {
          name: 'serviceFeatures',
          type: 'array',
          dbName: 'features', // Keep semantic meaning - prevents redundant 'service' prefix
          fields: [
            {
              name: 'featureDescription',
              type: 'textarea',
              dbName: 'desc', // Abbreviated 'description' following project standards
            },
          ],
        },
      ],
    },
  ],
}
```

### Field Factory

```typescript
export const link: LinkType = () => ({
  name: 'link',
  type: 'group',
  dbName: 'links', // Pluralized for consistency with array contexts and to prevent conflicts
  fields: [
    {
      name: 'type',
      type: 'radio',
      dbName: 'link_type', // Prefixed to avoid enum conflicts when used in multiple contexts
    },
    {
      name: 'reference',
      type: 'relationship',
      dbName: 'link_ref', // Abbreviated 'reference' to 'ref' with prefix to prevent conflicts
    },
    {
      name: 'newTab',
      type: 'checkbox',
      dbName: 'new_tab', // Snake case conversion following project standards
    },
  ],
})
```

### Collection Configuration

```typescript
export const Users: CollectionConfig = {
  slug: 'users',
  dbName: 'users', // Explicit database naming for consistency and predictability
  fields: [
    {
      name: 'firstName',
      type: 'text',
      dbName: 'first_name', // Snake case conversion following project standards
    },
    {
      name: 'lastLoginAt',
      type: 'date',
      dbName: 'last_login_at', // Snake case conversion following project standards
    },
  ],
}
```

## Comment Quality Guidelines

### ✅ Good Comments

- Explain the specific rationale for the abbreviation or naming choice
- Reference project standards when applicable
- Indicate critical importance for identifier length compliance
- Mention context when relevant

### ❌ Poor Comments

```typescript
// Too generic
dbName: 'nav_items', // Short name
dbName: 'feat_link', // Abbreviation

// Too verbose
dbName: 'desc', // We abbreviated description to desc because the full word would make the identifier too long and exceed PostgreSQL's 63 character limit

// Missing rationale
dbName: 'svc_grid', // Services grid
```

## Maintenance Guidelines

### When Adding New Fields

1. **Check identifier length**: Run validation to see if `dbName` is needed
2. **Follow established patterns**: Use existing abbreviations when possible
3. **Add appropriate comment**: Explain the rationale clearly
4. **Test with validation**: Ensure the change resolves identifier issues

### When Updating Existing Fields

1. **Preserve existing patterns**: Don't change abbreviations without good reason
2. **Update comments**: Ensure comments reflect current rationale
3. **Generate migration**: Create migration scripts for database changes
4. **Document changes**: Update this guide if new patterns emerge

### Code Review Checklist

- [ ] All `dbName` properties have inline comments
- [ ] Comments follow the established format
- [ ] Rationale is clear and specific
- [ ] Abbreviations follow project standards
- [ ] Snake case is used consistently
- [ ] Critical identifier breaks are noted

## Integration with Development Workflow

### IDE Integration

Configure your IDE to show these comments prominently:

```json
// VSCode settings.json
{
  "editor.tokenColorCustomizations": {
    "comments": {
      "fontStyle": "italic",
      "foreground": "#6A9955"
    }
  }
}
```

### Linting Rules

Consider adding ESLint rules to enforce comment presence:

```javascript
// .eslintrc.js
module.exports = {
  rules: {
    'payload/require-dbname-comment': 'warn',
  },
}
```

### Documentation Generation

These comments can be extracted for automatic documentation:

```bash
# Extract dbName rationale for documentation
grep -r "dbName.*//.*" src/ > dbname-rationale.txt
```

## Resources

- [Database Identifier Optimization Guide](./DATABASE_IDENTIFIER_OPTIMIZATION.md)
- [dbName Quick Reference](./DBNAME_QUICK_REFERENCE.md)
- [dbName Usage Examples](./DBNAME_USAGE_EXAMPLES.md)
- [Identifier Guidelines](./IDENTIFIER_GUIDELINES.md)

---

_This document ensures that all `dbName` properties are self-documenting and maintainable for future developers._
