# Pages Collection Stability & Improvement - Implementation Tasks

## Phase 1: Foundation & Critical Fixes (Week 1)

- [x] 1. Shared Utilities & Factories
  - [x] 1.1 Create `src/pages/shared/hooks/createAuditTrailHook.ts` factory function
    - **Validates**: Requirements 3.1, 3.2, 3.3, 3.4
    - **Details**: Implement factory that auto-populates `createdBy` and `updatedBy` fields
    - **Implementation**: Use `operation` to determine create vs update, respect `req.user`
    - **Testing**: Unit test for create/update operations, test with/without user

  - [x] 1.2 Update `src/pages/shared/fields/auditFields.ts` with proper access control
    - **Validates**: Requirements 6.1, 6.2
    - **Details**: Add field-level access control (`create: () => false`, `update: () => false`)
    - **Implementation**: Make fields read-only in admin UI, add descriptions
    - **Testing**: Integration test attempting to modify audit fields via API

  - [x] 1.3 Create `src/pages/shared/hooks/createRevalidateHook.ts` factory function
    - **Validates**: Requirements TR-4
    - **Details**: Standardized revalidation with path prefix parameter
    - **Implementation**: Handle publish/unpublish/slug changes, support context flag
    - **Testing**: Unit test for all revalidation scenarios

  - [x] 1.4 Create `src/pages/shared/validation/circularReference.ts` validator
    - **Validates**: Requirements 2.2
    - **Details**: Async validation to detect circular parent references
    - **Implementation**: DFS traversal with visited set, max depth limit (50)
    - **Testing**: Unit test for direct/indirect cycles, performance test

  - [x] 1.5 Create `src/pages/shared/fields/slugField.ts` factory function
    - **Validates**: Requirements 2.1
    - **Details**: Reusable slug field configuration with validation
    - **Implementation**: Include format validation, unique constraint, index
    - **Testing**: Unit test for field configuration

  - [x] 1.6 Enhance `src/utilities/slugGeneration.ts` with race condition handling
    - **Validates**: Requirements 2.1, 2.2
    - **Details**: Add retry logic with timestamp fallback
    - **Implementation**: Update `generateUniqueSlug` with max retries (10), timestamp suffix
    - **Testing**: Property-based test for uniqueness, concurrent creation test

- [x] 2. Pages Collection Updates
  - [x] 2.1 Enable Payload timestamps in Pages collection
    - **Validates**: Requirements 3.1
    - **Details**: Add `timestamps: true` to collection config
    - **Implementation**: Remove custom `createdAt`/`updatedAt` from audit trail hook
    - **Testing**: Verify Payload auto-manages timestamps

  - [x] 2.2 Update Pages collection to use `createAuditTrailHook`
    - **Validates**: Requirements 1.1, 3.2
    - **Details**: Replace inline audit logic with factory function
    - **Implementation**: Import and use in `beforeChange` hook
    - **Testing**: Integration test verifying audit fields populated

  - [x] 2.3 Update Pages collection to use enhanced `auditFields`
    - **Validates**: Requirements 6.1, 6.2
    - **Details**: Spread updated audit fields with access control
    - **Implementation**: Remove old audit fields, spread new ones
    - **Testing**: Verify fields are read-only in admin UI

  - [x] 2.4 Add circular reference validation to Pages parent field
    - **Validates**: Requirements 2.2
    - **Details**: Use `createCircularReferenceValidator` on parent field
    - **Implementation**: Add to field's `validate` property
    - **Testing**: Integration test attempting circular references

  - [x] 2.5 Update Pages revalidation to use factory function
    - **Validates**: Requirements 1.2
    - **Details**: Migrate to `createRevalidateHook('pages')`
    - **Implementation**: Keep child page revalidation logic in custom hook
    - **Testing**: Verify revalidation works for pages and children

## Phase 2: Collection Migration (Week 2)

- [x] 3. Blogs Collection Migration
  - [x] 3.1 Enable Payload timestamps in Blogs collection
    - **Validates**: Requirements 3.1
    - **Details**: Add `timestamps: true` to collection config
    - **Testing**: Verify timestamps auto-managed

  - [x] 3.2 Migrate Blogs to use `createSlugGenerationHook` from utilities
    - **Validates**: Requirements 1.1
    - **Details**: Replace `generateSlug` import with factory function
    - **Implementation**: Use `createSlugGenerationHook('blogs', { sourceField: 'title', ... })`
    - **Testing**: Integration test for slug generation

  - [x] 3.3 Migrate Blogs to use `createAuditTrailHook`
    - **Validates**: Requirements 1.1, 3.2
    - **Details**: Replace `auditTrail` import with factory function
    - **Testing**: Verify audit fields populated correctly

  - [x] 3.4 Update Blogs to use enhanced `auditFields`
    - **Validates**: Requirements 6.1
    - **Details**: Spread updated audit fields with access control
    - **Testing**: Verify read-only enforcement

  - [x] 3.5 Migrate Blogs to use `createRevalidateHook`
    - **Validates**: Requirements 1.2
    - **Details**: Replace custom revalidation with factory function
    - **Implementation**: Use `createRevalidateHook('blogs')`
    - **Testing**: Verify revalidation works correctly

  - [x] 3.6 Add field validation and constraints to Blogs
    - **Validates**: Requirements 2.3, 2.4
    - **Details**: Add maxLength to title (200), excerpt (300)
    - **Implementation**: Add validation functions with helpful error messages
    - **Testing**: Unit test for validation edge cases

- [x] 4. Services Collection Migration
  - [x] 4.1 Enable Payload timestamps in Services collection
    - **Validates**: Requirements 3.1
    - **Details**: Add `timestamps: true` to collection config
    - **Testing**: Verify timestamps auto-managed

  - [x] 4.2 Migrate Services to use `createSlugGenerationHook` from utilities
    - **Validates**: Requirements 1.1
    - **Details**: Replace `generateSlug` import with factory function
    - **Testing**: Integration test for slug generation

  - [x] 4.3 Migrate Services to use `createAuditTrailHook`
    - **Validates**: Requirements 1.1, 3.2
    - **Details**: Replace `auditTrail` import with factory function
    - **Testing**: Verify audit fields populated correctly

  - [x] 4.4 Update Services to use enhanced `auditFields`
    - **Validates**: Requirements 6.1
    - **Details**: Spread updated audit fields with access control
    - **Testing**: Verify read-only enforcement

  - [x] 4.5 Migrate Services to use `createRevalidateHook`
    - **Validates**: Requirements 1.2
    - **Details**: Replace custom revalidation with factory function
    - **Implementation**: Keep featured service homepage revalidation logic
    - **Testing**: Verify revalidation works correctly

  - [x] 4.6 Add database indexes to Services collection
    - **Validates**: Requirements TR-4, NFR-3
    - **Details**: Add index to `serviceType` and `featured` fields
    - **Implementation**: Set `index: true` on fields
    - **Testing**: Performance test for filtered queries

- [x] 5. Contacts Collection Migration
  - [x] 5.1 Enable Payload timestamps in Contacts collection
    - **Validates**: Requirements 3.1
    - **Details**: Add `timestamps: true` to collection config
    - **Testing**: Verify timestamps auto-managed

  - [x] 5.2 Migrate Contacts to use `createSlugGenerationHook` from utilities
    - **Validates**: Requirements 1.1
    - **Details**: Replace `generateSlug` import with factory function
    - **Testing**: Integration test for slug generation

  - [x] 5.3 Migrate Contacts to use `createAuditTrailHook`
    - **Validates**: Requirements 1.1, 3.2
    - **Details**: Replace `auditTrail` import with factory function
    - **Testing**: Verify audit fields populated correctly

  - [x] 5.4 Update Contacts to use enhanced `auditFields`
    - **Validates**: Requirements 6.1
    - **Details**: Spread updated audit fields with access control
    - **Testing**: Verify read-only enforcement

  - [x] 5.5 Migrate Contacts to use `createRevalidateHook`
    - **Validates**: Requirements 1.2
    - **Details**: Replace custom revalidation with factory function
    - **Testing**: Verify revalidation works correctly

- [x] 6. Legal Collection Migration
  - [x] 6.1 Enable Payload timestamps in Legal collection
    - **Validates**: Requirements 3.1
    - **Details**: Add `timestamps: true` to collection config
    - **Testing**: Verify timestamps auto-managed

  - [x] 6.2 Migrate Legal to use `createSlugGenerationHook` from utilities
    - **Validates**: Requirements 1.1
    - **Details**: Replace `generateSlug` import with factory function
    - **Testing**: Integration test for slug generation

  - [x] 6.3 Migrate Legal to use `createAuditTrailHook`
    - **Validates**: Requirements 1.1, 3.2
    - **Details**: Replace `auditTrail` import with factory function
    - **Testing**: Verify audit fields populated correctly

  - [x] 6.4 Update Legal to use enhanced `auditFields`
    - **Validates**: Requirements 6.1
    - **Details**: Spread updated audit fields with access control
    - **Testing**: Verify read-only enforcement

  - [x] 6.5 Migrate Legal to use `createRevalidateHook`
    - **Validates**: Requirements 1.2
    - **Details**: Replace custom revalidation with factory function
    - **Testing**: Verify revalidation works correctly

  - [x] 6.6 Add database index to Legal collection
    - **Validates**: Requirements TR-4, NFR-3
    - **Details**: Add index to `documentType` field
    - **Implementation**: Set `index: true` on field
    - **Testing**: Performance test for filtered queries

- [x] 7. Deprecation & Cleanup
  - [x] 7.1 Mark old shared hooks as deprecated
    - **Validates**: Requirements 1.1
    - **Details**: Add `@deprecated` JSDoc to `generateSlug` and `auditTrail`
    - **Implementation**: Add deprecation notices with migration instructions
    - **Testing**: N/A (documentation only)

  - [x] 7.2 Remove deprecated shared hooks after migration
    - **Validates**: Requirements NFR-1
    - **Details**: Delete `src/pages/shared/hooks/generateSlug.ts` and `auditTrail.ts`
    - **Implementation**: Ensure no collections reference these files
    - **Testing**: Build verification

## Phase 3: Enhancements & Features (Week 3)

- [x] 8. Auto-Population Features
  - [x] 8.1 Add author auto-population to Blogs collection
    - **Validates**: Requirements 7.1
    - **Details**: Add field-level hook to auto-populate author on create
    - **Implementation**: Check operation and existing value, use `req.user.id`
    - **Testing**: Integration test verifying auto-population

  - [x] 8.2 Add publishedDate auto-setting to Blogs collection
    - **Validates**: Requirements 7.2
    - **Details**: Add field-level hook to auto-set date on first publish
    - **Implementation**: Check status change to published and no existing value
    - **Testing**: Integration test verifying auto-setting

  - [x] 8.3 Add author auto-population to Services collection
    - **Validates**: Requirements 7.1
    - **Details**: Add author field with auto-population hook
    - **Testing**: Integration test verifying auto-population

  - [x] 8.4 Add author auto-population to Contacts collection
    - **Validates**: Requirements 7.1
    - **Details**: Add author field with auto-population hook
    - **Testing**: Integration test verifying auto-population

- [x] 9. SEO Integration
  - [x] 9.1 Install and configure `@payloadcms/plugin-seo`
    - **Validates**: Requirements 5.1, 5.2, 5.3, 5.4
    - **Details**: Add plugin to payload config for all page collections
    - **Implementation**: Configure with `tabbedUI: true`, set generators
    - **Testing**: Verify SEO tab appears in admin UI

  - [ ]\* 9.2 Create manual meta fields as alternative (optional)
    - **Validates**: Requirements 5.1, 5.2, 5.3
    - **Details**: Create `src/pages/shared/fields/metaFields.ts` if plugin not used
    - **Implementation**: Group field with title, description, image, keywords
    - **Testing**: Verify fields appear in admin UI

- [x] 10. Performance Optimizations
  - [x] 10.1 Add database indexes to all collections
    - **Validates**: Requirements NFR-3
    - **Details**: Add indexes to slug, publishedDate, author, featured fields
    - **Implementation**: Set `index: true` on frequently queried fields
    - **Testing**: Performance benchmarks for queries

  - [x] 10.2 Optimize revalidation hooks with conditional logic
    - **Validates**: Requirements NFR-3
    - **Details**: Skip revalidation for draft saves, check status/slug changes
    - **Implementation**: Add early returns in revalidation hooks
    - **Testing**: Verify no unnecessary revalidation calls

  - [x] 10.3 Add context caching to circular reference validator
    - **Validates**: Requirements NFR-3
    - **Details**: Cache parent chain in `req.context` to avoid repeated queries
    - **Implementation**: Check context before building parent chain
    - **Testing**: Performance test with deep hierarchies

  - [x] 10.4 Create `src/utilities/revalidation.ts` with debounce utility
    - **Validates**: Requirements NFR-3
    - **Details**: Implement debounce map for revalidation calls
    - **Implementation**: `revalidateWithDebounce` function with timeout management
    - **Testing**: Unit test for debounce behavior

- [x] 11. Enhanced Validation
  - [x] 11.1 Add comprehensive field validation to all collections
    - **Validates**: Requirements 2.3, 2.4, 2.5
    - **Details**: Add maxLength, minLength, custom validators to all text fields
    - **Implementation**: Title (200), excerpt (300), slug (100) with validation
    - **Testing**: Unit tests for validation edge cases

  - [x] 11.2 Add slug format validation to all collections
    - **Validates**: Requirements 2.1
    - **Details**: Use `validateSlugFormat` in field validate function
    - **Implementation**: Add to slug field configuration
    - **Testing**: Integration test with invalid slug formats

  - [x] 11.3 Add required field validation with helpful messages
    - **Validates**: Requirements 2.3
    - **Details**: Custom validation functions with clear error messages
    - **Implementation**: Check for empty/whitespace-only values
    - **Testing**: Unit tests for validation messages

## Phase 4: Testing & Documentation (Week 4)

- [x] 12. Unit Tests
  - [x] 12.1 Write unit tests for `createAuditTrailHook`
    - **Validates**: Requirements 8.1
    - **Details**: Test create/update operations, with/without user
    - **Implementation**: Use Vitest, mock req and data objects
    - **Testing**: Coverage > 90%

  - [x] 12.2 Write unit tests for `createRevalidateHook`
    - **Validates**: Requirements 8.1
    - **Details**: Test publish/unpublish/slug change scenarios
    - **Implementation**: Mock Next.js revalidatePath
    - **Testing**: Coverage > 90%

  - [x] 12.3 Write unit tests for circular reference validator
    - **Validates**: Requirements 8.1
    - **Details**: Test direct/indirect cycles, max depth, performance
    - **Implementation**: Mock Payload findByID
    - **Testing**: Coverage > 90%

  - [x] 12.4 Write unit tests for slug generation utilities
    - **Validates**: Requirements 8.1
    - **Details**: Test format validation, uniqueness checking, edge cases
    - **Implementation**: Test with various inputs
    - **Testing**: Coverage > 90%

- [x] 13. Integration Tests
  - [x] 13.1 Write integration tests for Pages collection
    - **Validates**: Requirements 8.2
    - **Details**: Test CRUD operations, hooks, validation, access control
    - **Implementation**: Use real Payload instance
    - **Testing**: All critical paths covered

  - [x] 13.2 Write integration tests for Blogs collection
    - **Validates**: Requirements 8.2
    - **Details**: Test slug generation, audit trail, revalidation
    - **Implementation**: Use real Payload instance
    - **Testing**: All critical paths covered

  - [x] 13.3 Write integration tests for Services collection
    - **Validates**: Requirements 8.2
    - **Details**: Test featured service logic, revalidation
    - **Implementation**: Use real Payload instance
    - **Testing**: All critical paths covered

  - [x] 13.4 Write integration tests for Contacts collection
    - **Validates**: Requirements 8.2
    - **Details**: Test form relationship, contact info display
    - **Implementation**: Use real Payload instance
    - **Testing**: All critical paths covered

  - [x] 13.5 Write integration tests for Legal collection
    - **Validates**: Requirements 8.2
    - **Details**: Test document type, effective date, lastUpdated
    - **Implementation**: Use real Payload instance
    - **Testing**: All critical paths covered

  - [x] 13.6 Write integration tests for access control
    - **Validates**: Requirements 8.4
    - **Details**: Test field-level access control on audit fields
    - **Implementation**: Attempt unauthorized modifications
    - **Testing**: Verify all access rules enforced

- [x] 14. Property-Based Tests
  - [x] 14.1 Write PBT for slug generation properties
    - **Validates**: Requirements 8.5, Property 3, Property 6
    - **Details**: Test idempotence, format validity, length constraints
    - **Implementation**: Use fast-check library
    - **Testing**: Run 1000+ test cases

  - [x] 14.2 Write PBT for slug uniqueness property
    - **Validates**: Requirements 8.5, Property 2
    - **Details**: Test concurrent slug generation
    - **Implementation**: Generate random titles, create concurrently
    - **Testing**: Verify all slugs unique

  - [x] 14.3 Write PBT for circular reference detection
    - **Validates**: Requirements 8.5, Property 4
    - **Details**: Test various hierarchy structures
    - **Implementation**: Generate random parent chains
    - **Testing**: Verify all cycles detected

- [x] 15. Performance Testing
  - [x] 15.1 Benchmark hook execution times
    - **Validates**: Requirements NFR-3, Property 10
    - **Details**: Measure slug generation, audit trail, revalidation
    - **Implementation**: Use performance.now() for timing
    - **Testing**: Verify all < 50ms target

  - [x] 15.2 Benchmark database query performance
    - **Validates**: Requirements NFR-3
    - **Details**: Test find by slug, filtered queries, sorting
    - **Implementation**: Use database query profiling
    - **Testing**: Verify indexed queries < 10ms

  - [x] 15.3 Load test concurrent operations
    - **Validates**: Requirements NFR-3
    - **Details**: Test 100 concurrent creates, updates
    - **Implementation**: Use load testing tool
    - **Testing**: Verify no race conditions, acceptable performance

- [ ] 16. Documentation
  - [ ] 16.1 Document hook factory functions
    - **Validates**: Requirements NFR-1
    - **Details**: Add JSDoc with usage examples, parameters, return types
    - **Implementation**: Comprehensive inline documentation
    - **Testing**: N/A (documentation only)

  - [ ] 16.2 Document validation utilities
    - **Validates**: Requirements NFR-1
    - **Details**: Add JSDoc with examples for circular reference, slug validation
    - **Implementation**: Include edge cases and error handling
    - **Testing**: N/A (documentation only)

  - [ ] 16.3 Create migration guide
    - **Validates**: Requirements NFR-1
    - **Details**: Document steps to migrate from old to new patterns
    - **Implementation**: Step-by-step guide with code examples
    - **Testing**: N/A (documentation only)

  - [ ] 16.4 Update collection configuration documentation
    - **Validates**: Requirements NFR-1
    - **Details**: Document standard patterns, best practices
    - **Implementation**: Include examples for each collection type
    - **Testing**: N/A (documentation only)

## Phase 5: Deployment & Monitoring (Week 5)

- [x] 17. Pre-Deployment
  - [x] 17.1 Run full test suite
    - **Validates**: Requirements NFR-2
    - **Details**: Execute all unit, integration, and property-based tests
    - **Implementation**: `npm test` or equivalent
    - **Testing**: All tests must pass

  - [x] 17.2 Verify TypeScript compilation
    - **Validates**: Requirements TR-3
    - **Details**: Ensure no TypeScript errors
    - **Implementation**: `npm run build` or `tsc --noEmit`
    - **Testing**: Zero errors

  - [x] 17.3 Run ESLint and Prettier
    - **Validates**: Requirements NFR-1
    - **Details**: Ensure code quality standards met
    - **Implementation**: `npm run lint` and `npm run format`
    - **Testing**: Zero warnings

  - [x] 17.4 Generate Payload types
    - **Validates**: Requirements TR-3
    - **Details**: Regenerate types after schema changes
    - **Implementation**: `npm run generate:types`
    - **Testing**: Verify types match schema

- [ ] 18. Deployment
  - [ ] 18.1 Deploy to staging environment
    - **Validates**: Requirements NFR-2
    - **Details**: Deploy all changes to staging
    - **Implementation**: Follow deployment process
    - **Testing**: Smoke tests on staging

  - [ ] 18.2 Run integration tests on staging
    - **Validates**: Requirements NFR-2
    - **Details**: Execute full test suite against staging
    - **Implementation**: Point tests to staging database
    - **Testing**: All tests pass

  - [ ] 18.3 Perform user acceptance testing
    - **Validates**: Requirements NFR-2
    - **Details**: Manual testing of all collections in admin UI
    - **Implementation**: Create, update, delete documents
    - **Testing**: All functionality works as expected

  - [ ] 18.4 Deploy to production
    - **Validates**: Requirements NFR-2
    - **Details**: Deploy to production after staging validation
    - **Implementation**: Follow production deployment process
    - **Testing**: Monitor for errors

- [ ] 19. Post-Deployment Monitoring
  - [ ] 19.1 Monitor hook execution times
    - **Validates**: Requirements NFR-3
    - **Details**: Track performance metrics in production
    - **Implementation**: Use logging or APM tool
    - **Testing**: Verify performance targets met

  - [ ] 19.2 Monitor error rates
    - **Validates**: Requirements NFR-2
    - **Details**: Track errors in hooks, validation, revalidation
    - **Implementation**: Use error tracking service
    - **Testing**: Error rate < 0.1%

  - [ ] 19.3 Monitor database query performance
    - **Validates**: Requirements NFR-3
    - **Details**: Track slow queries, N+1 issues
    - **Implementation**: Use database monitoring
    - **Testing**: No slow queries detected

  - [ ] 19.4 Verify revalidation working correctly
    - **Validates**: Requirements NFR-2
    - **Details**: Test that content updates appear on frontend
    - **Implementation**: Manual verification
    - **Testing**: All pages revalidate correctly

- [ ]\* 20. Optional Enhancements

- [ ]\* 20.1 Add breadcrumb generation to Blogs collection
  - **Validates**: Future consideration
  - **Details**: Generate breadcrumbs based on categories/tags
  - **Implementation**: Similar to Pages breadcrumb logic
  - **Testing**: Integration test for breadcrumb generation

- [ ]\* 20.2 Add slug history tracking
  - **Validates**: Future consideration
  - **Details**: Track previous slugs for redirect generation
  - **Implementation**: Array field with historical slugs
  - **Testing**: Integration test for slug history

- [ ]\* 20.3 Add field-level change tracking
  - **Validates**: Future consideration
  - **Details**: Track what fields changed, not just who changed
  - **Implementation**: Compare data with originalDoc
  - **Testing**: Integration test for change tracking

- [ ]\* 20.4 Add debounced revalidation option
  - **Validates**: Future consideration
  - **Details**: Optional debouncing for rapid edits
  - **Implementation**: Use revalidateWithDebounce utility
  - **Testing**: Unit test for debounce behavior

## Notes

- Tasks marked with `*` are optional enhancements
- All tasks should include appropriate error handling
- All database operations must pass `req` parameter for transaction safety
- All hooks should respect `req.context` flags for conditional execution
- All validation should provide clear, helpful error messages
- All tests should follow the project's testing conventions
- Performance targets: hooks < 50ms, queries < 10ms, admin UI < 100ms
- Test coverage target: > 80% overall, > 90% for critical utilities
