# Separation of Concerns Validation

This directory contains utilities for validating and maintaining proper separation of concerns between frontend, backend, and shared code in the PayloadCMS project.

## Overview

The separation of concerns validation ensures that:

1. **Frontend code** doesn't import backend-only modules (like Node.js built-ins or Payload server APIs)
2. **Backend code** doesn't import frontend-only modules (like browser APIs or client-side React features)
3. **Shared code** only uses modules that are available in both contexts

## Files

- `separationOfConcerns.ts` - Core validation logic and utilities
- `separationConfig.ts` - Configuration defining allowed/forbidden modules and paths
- `validateProject.ts` - Project-wide validation script
- `README.md` - This documentation file

## Usage

### Programmatic Usage

```typescript
import { validateFileSeparation } from '@/utilities/validation'

const result = validateFileSeparation('/src/components/MyComponent.tsx', ['react', 'payload'])
if (!result.isValid) {
  console.log('Violations:', result.violations)
}
```

### CLI Usage

Run the validation script:

```bash
node scripts/validate-separation.js
```

## Configuration

The separation rules are defined in `separationConfig.ts`. You can customize:

- **Allowed paths** for each context (frontend/backend/shared)
- **Allowed modules** that can be imported in each context
- **Forbidden modules** that should never be imported in specific contexts

## Context Determination

Files are automatically categorized based on their path:

### Frontend Context

- `/src/app/(frontend)/**`
- `/src/components/**`
- `/src/providers/**`
- `**/*.client.ts(x)`

### Backend Context

- `/src/app/(payload)/**`
- `/src/collections/**`
- `/src/globals/**`
- `/src/hooks/**`
- `/src/access/**`
- `payload.config.ts`
- `**/*.server.ts(x)`

### Shared Context

- `/src/utilities/**`
- `/src/types/**`
- `/src/fields/**`
- `/src/icons/**`

## Best Practices

1. **Keep utilities truly shared** - Only import modules available in both Node.js and browser environments
2. **Use proper file extensions** - Use `.client.ts(x)` for frontend-only code and `.server.ts(x)` for backend-only code
3. **Validate regularly** - Run the validation script as part of your CI/CD pipeline
4. **Document exceptions** - If you need to break the rules, document why and consider alternatives

## Common Violations

### Frontend importing backend modules

```typescript
// ❌ Bad - Node.js fs module in frontend
import { readFileSync } from 'fs'

// ✅ Good - Use Next.js API routes instead
const response = await fetch('/api/read-file')
```

### Backend importing frontend modules

```typescript
// ❌ Bad - Browser navigation in backend
import { useRouter } from 'next/navigation'

// ✅ Good - Use redirect or server-side navigation
import { redirect } from 'next/navigation'
```

### Shared code with context-specific imports

```typescript
// ❌ Bad - Node.js module in shared utility
import { join } from 'path'

// ✅ Good - Use environment-agnostic alternatives
const joinPaths = (...parts: string[]) => parts.join('/')
```
