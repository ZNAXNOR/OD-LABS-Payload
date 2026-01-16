# Performance Testing

This directory contains performance benchmarks for the Pages Collection Stability & Improvement spec.

## Test Files

### hooks.perf.spec.ts

Tests hook execution performance without requiring database connection.

**Target Metrics:**

- Slug generation: < 20ms
- Audit trail: < 5ms
- Revalidation: < 30ms

**Run with:**

```bash
npx vitest run tests/performance/hooks.perf.spec.ts
```

### queries.perf.spec.ts

Tests database query performance. **Requires running database connection.**

**Target Metrics:**

- Find by slug: < 10ms (indexed)
- Count query: < 20ms
- Create document: < 100ms
- Update document: < 80ms

**Run with:**

```bash
# Ensure database is running first
npx vitest run tests/performance/queries.perf.spec.ts
```

### load.perf.spec.ts

Tests concurrent operations and load scenarios. **Requires running database connection.**

**Target Metrics:**

- 100 concurrent creates: No race conditions
- Acceptable performance under load
- No duplicate slugs

**Run with:**

```bash
# Ensure database is running first
npx vitest run tests/performance/load.perf.spec.ts
```

## Notes

- Hook performance tests (hooks.perf.spec.ts) can run without database
- Query and load tests require a running PostgreSQL database
- Database connection can take 30-60 seconds to establish
- Performance results may vary based on hardware and database load
- All tests include console output showing actual execution times

## Performance Targets Summary

From the design document:

**Hook Execution:**

- Slug generation: < 20ms
- Audit trail: < 5ms
- Revalidation: < 30ms
- Circular reference check: < 50ms (cached), < 200ms (uncached)

**Database Operations:**

- Create document: < 100ms
- Update document: < 80ms
- Find by slug: < 10ms (indexed)
- Count query: < 20ms

**Admin UI:**

- Page load: < 200ms
- Form submission: < 500ms
- Validation feedback: < 100ms
