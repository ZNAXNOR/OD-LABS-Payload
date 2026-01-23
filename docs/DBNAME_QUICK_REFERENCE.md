# dbName Quick Reference Guide

## TL;DR

Use `dbName` properties to keep PostgreSQL identifiers under 63 characters. Use snake_case and standard abbreviations.

## Quick Checklist

- [ ] Nested fields 3+ levels deep have `dbName` properties
- [ ] All `dbName` values use snake_case (not camelCase)
- [ ] Abbreviations follow project standards
- [ ] Run `pnpm run validate:identifiers` before committing
- [ ] Add inline comments explaining abbreviation rationale

## Common Patterns

### ✅ Good Examples

```typescript
// Global with deep nesting
{
  name: 'navigationTabs',
  type: 'array',
  dbName: 'nav_tabs', // Abbreviate + snake_case
  fields: [
    {
      name: 'featuredContent',
      type: 'group',
      dbName: 'feat_content', // Standard abbreviation
    }
  ]
}

// Block configuration
export const HeroBlock: Block = {
  slug: 'hero',
  dbName: 'hero', // Explicit root naming
  fields: [
    {
      name: 'backgroundImage',
      type: 'upload',
      dbName: 'bg_img', // Abbreviate both parts
    }
  ]
}

// Field factory
export const linkField = () => ({
  name: 'link',
  type: 'group',
  dbName: 'link', // Predictable naming
  fields: [
    {
      name: 'reference',
      type: 'relationship',
      dbName: 'ref', // Standard abbreviation
    }
  ]
})
```

### ❌ Bad Examples

```typescript
// Missing dbName on deep nesting
{
  name: 'navigationTabs',
  type: 'array',
  // Missing dbName - will generate long identifiers
  fields: [
    {
      name: 'featuredContent',
      type: 'group',
      // Missing dbName - compounds the problem
    }
  ]
}

// Wrong case format
{
  name: 'featuredImage',
  type: 'upload',
  dbName: 'featuredImage', // Should be 'featured_img'
}

// Cryptic abbreviations
{
  name: 'description',
  type: 'textarea',
  dbName: 'd', // Too cryptic - use 'desc'
}
```

## Standard Abbreviations

| Field Name      | Use This | Not This      |
| --------------- | -------- | ------------- |
| `navigation`    | `nav`    | `navi`, `n`   |
| `description`   | `desc`   | `descr`, `d`  |
| `featured`      | `feat`   | `ftr`, `f`    |
| `reference`     | `ref`    | `refer`, `r`  |
| `background`    | `bg`     | `back`, `bkg` |
| `thumbnail`     | `thumb`  | `tn`, `t`     |
| `category`      | `cat`    | `ctg`, `c`    |
| `metadata`      | `meta`   | `md`, `m`     |
| `information`   | `info`   | `inf`, `i`    |
| `configuration` | `config` | `cfg`, `conf` |
| `services`      | `svc`    | `serv`, `s`   |
| `portfolio`     | `port`   | `pf`, `p`     |

## When to Use dbName

### Always Use

- Fields nested 3+ levels deep
- Array fields with complex items
- Group fields in arrays
- Long field names (>10 characters)

### Consider Using

- Enum fields with long paths
- Relationship fields in deep structures
- Block configurations with multiple nested levels

### Usually Skip

- Root level fields
- Simple text/number fields
- Fields with short names (<8 characters)

## Validation Commands

```bash
# Quick validation
pnpm run validate:identifiers

# See suggestions
pnpm run validate:identifiers:verbose

# Strict mode (CI/CD)
pnpm run validate:identifiers:strict
```

## Migration Workflow

```bash
# 1. Make identifier changes
# 2. Validate
pnpm run validate:identifiers:strict

# 3. Generate migration
pnpm run payload migrate:create identifier_updates

# 4. Test locally
node src/migrations/testMigration.ts

# 5. Apply migration
pnpm run payload migrate
```

## IDE Integration

### VSCode Settings

Add to `.vscode/settings.json`:

```json
{
  "typescript.preferences.includePackageJsonAutoImports": "on",
  "editor.codeActionsOnSave": {
    "source.organizeImports": true
  },
  "files.associations": {
    "*.config.ts": "typescript"
  }
}
```

### Snippets

Add to VSCode snippets:

```json
{
  "dbName field": {
    "prefix": "dbname",
    "body": ["dbName: '${1:field_name}', // ${2:Rationale for abbreviation}"],
    "description": "Add dbName property with comment"
  }
}
```

## Common Mistakes

1. **Forgetting snake_case**: Use `nav_item` not `navItem`
2. **Over-abbreviating**: Use `desc` not `d` for description
3. **Inconsistent patterns**: Stick to established abbreviations
4. **Missing validation**: Always run validation before committing
5. **No migration**: Create migrations for existing field changes

## Emergency Fixes

If you hit identifier length errors in production:

```typescript
// Quick fix: Add dbName to the problematic field
{
  name: 'veryLongFieldNameThatCausesProblems',
  type: 'text',
  dbName: 'long_field', // Emergency abbreviation
}
```

Then:

1. Generate and test migration immediately
2. Apply during maintenance window
3. Update documentation with rationale

## Resources

- [Full Documentation](./DATABASE_IDENTIFIER_OPTIMIZATION.md)
- [Identifier Guidelines](./IDENTIFIER_GUIDELINES.md)
- [Migration Guide](./MIGRATION.md)
- [Validation Config](../validation.config.js)

---

_Keep this handy while developing. When in doubt, run validation!_
