# Pages Collection Stability & Improvement Requirements

## Overview

This specification addresses stability issues, missing patterns, and improvements needed for all page collections (Pages, Blogs, Services, Contacts, Legal) in the Payload CMS project, based on comparison with the official Payload CMS website repository and best practices.

## Problem Statement

After analyzing the current page collections against the official Payload CMS website repository and best practices, several critical issues and missing patterns have been identified:

### Critical Issues Found

1. **Inconsistent Hook Usage**
   - Some collections use deprecated shared hooks (`generateSlug`, `auditTrail`)
   - Pages collection uses the new `createSlugGenerationHook` but others don't
   - Inconsistent revalidation hook implementations

2. **Missing Field Validations**
   - No validation for circular parent references in Pages
   - Missing required field validations
   - No slug format validation at field level

3. **Incomplete Audit Trail**
   - Audit trail hook doesn't respect Payload's built-in `timestamps: true`
   - Redundant `createdAt`/`updatedAt` fields conflict with Payload's automatic timestamps
   - Missing proper transaction safety in hooks

4. **Block Assignment Issues**
   - Inconsistent block availability across collections
   - No validation that assigned blocks actually exist
   - Hero blocks use different patterns (array vs single block)

5. **Missing SEO Integration**
   - No SEO plugin configuration visible
   - Comments reference SEO tab but no implementation shown

6. **Access Control Gaps**
   - No field-level access control for sensitive fields
   - Missing admin-only fields protection
   - No row-level security for multi-tenant scenarios

7. **Missing Features from Official Repo**
   - No meta fields (description, image for social sharing)
   - Missing breadcrumb generation for non-Pages collections
   - No published date auto-setting
   - Missing author auto-assignment

## User Stories

### US-1: Consistent Hook Implementation

**As a** developer  
**I want** all page collections to use consistent, modern hook patterns  
**So that** the codebase is maintainable and follows best practices

**Acceptance Criteria:**

- 1.1: All collections use `createSlugGenerationHook` from utilities
- 1.2: All collections use `createRevalidateHook` factory function
- 1.3: Audit trail hooks properly integrate with Payload's timestamps
- 1.4: All hooks maintain transaction safety by passing `req`

### US-2: Robust Field Validation

**As a** content editor  
**I want** proper validation on all fields  
**So that** I cannot create invalid content that breaks the site

**Acceptance Criteria:**

- 2.1: Slug fields validate format at field level
- 2.2: Parent field prevents circular references
- 2.3: Required fields are properly enforced
- 2.4: Date fields have appropriate constraints
- 2.5: Relationship fields have proper filterOptions

### US-3: Complete Audit Trail

**As a** site administrator  
**I want** to track who created and modified content  
**So that** I can maintain accountability and audit history

**Acceptance Criteria:**

- 3.1: Use Payload's built-in timestamps feature
- 3.2: Track createdBy and updatedBy relationships
- 3.3: Audit fields are read-only in admin UI
- 3.4: Audit trail respects transaction boundaries

### US-4: Standardized Block System

**As a** content editor  
**I want** consistent block availability across page types  
**So that** I understand what content I can add to each page type

**Acceptance Criteria:**

- 4.1: Block assignments are validated at startup
- 4.2: Hero blocks use consistent pattern (maxRows: 1)
- 4.3: Layout blocks are properly categorized
- 4.4: Missing blocks are reported with helpful errors

### US-5: SEO Optimization

**As a** content editor  
**I want** SEO fields on all page types  
**So that** my content is optimized for search engines

**Acceptance Criteria:**

- 5.1: All page collections have meta description field
- 5.2: All page collections have meta image field
- 5.3: SEO plugin is properly configured
- 5.4: Open Graph tags are supported

### US-6: Enhanced Access Control

**As a** site administrator  
**I want** proper access control on sensitive fields  
**So that** only authorized users can modify critical data

**Acceptance Criteria:**

- 6.1: Audit fields are admin-only
- 6.2: Slug field has appropriate update restrictions
- 6.3: Status field changes are logged
- 6.4: Role-based field visibility is implemented

### US-7: Auto-Population Features

**As a** content editor  
**I want** fields to auto-populate with sensible defaults  
**So that** I can work more efficiently

**Acceptance Criteria:**

- 7.1: Author field auto-populates with current user
- 7.2: Published date auto-sets when status changes to published
- 7.3: Last updated date auto-updates on save
- 7.4: Breadcrumbs auto-generate for hierarchical pages

### US-8: Comprehensive Testing

**As a** developer  
**I want** comprehensive tests for all page collections  
**So that** I can confidently make changes without breaking functionality

**Acceptance Criteria:**

- 8.1: Unit tests for all hook functions
- 8.2: Integration tests for collection operations
- 8.3: Validation tests for all field constraints
- 8.4: Access control tests for all scenarios
- 8.5: Property-based tests for slug generation

## Technical Requirements

### TR-1: Hook Standardization

- All collections must use factory functions from utilities
- Hooks must be properly typed with Payload types
- Hooks must maintain transaction safety
- Hooks must handle errors gracefully

### TR-2: Field Configuration

- All fields must have proper admin descriptions
- Conditional fields must use admin.condition
- Relationship fields must have filterOptions
- All text fields must have maxLength

### TR-3: Type Safety

- All collections must have TypeScript interfaces
- All hooks must be properly typed
- No `any` types in production code
- Proper type guards for field access

### TR-4: Performance

- Hooks must not perform N+1 queries
- Expensive operations must be cached in context
- Database queries must use proper indexes
- Revalidation must be debounced

### TR-5: Security

- All sensitive fields must have access control
- Audit trail must be tamper-proof
- User input must be sanitized
- SQL injection prevention in queries

## Non-Functional Requirements

### NFR-1: Maintainability

- Code must follow DRY principles
- Shared logic must be extracted to utilities
- Collections must have consistent structure
- Documentation must be comprehensive

### NFR-2: Reliability

- All operations must be atomic
- Errors must be handled gracefully
- Logging must be comprehensive
- Rollback must work correctly

### NFR-3: Performance

- Page load time < 200ms
- Admin UI response < 100ms
- Hook execution < 50ms
- Database queries optimized

### NFR-4: Testability

- All functions must be unit testable
- Integration tests must cover all operations
- Test coverage must be > 80%
- Tests must be fast (< 5s total)

## Out of Scope

- Frontend rendering components (addressed in separate spec)
- Block component implementations (addressed in separate spec)
- Global configurations (Header, Footer, Contact)
- Media collection modifications
- User authentication changes
- Database migration strategies

## Dependencies

- Payload CMS v3.x
- PostgreSQL database
- Next.js 15
- TypeScript 5.x
- Vitest for testing

## Success Metrics

1. **Code Quality**
   - Zero TypeScript errors
   - Zero ESLint warnings
   - 100% hook consistency

2. **Test Coverage**
   - > 80% code coverage
   - All critical paths tested
   - Zero failing tests

3. **Performance**
   - No N+1 queries
   - < 50ms hook execution
   - < 100ms admin response

4. **Stability**
   - Zero runtime errors in production
   - Proper error handling everywhere
   - Transaction safety maintained

## Risk Assessment

### High Risk

- **Transaction Safety**: Breaking atomic operations could cause data corruption
- **Slug Uniqueness**: Race conditions in slug generation could create duplicates
- **Circular References**: Improper validation could create infinite loops

### Medium Risk

- **Performance**: Inefficient hooks could slow down admin UI
- **Type Safety**: Missing types could cause runtime errors
- **Access Control**: Improper restrictions could expose sensitive data

### Low Risk

- **UI Changes**: Admin UI modifications are low impact
- **Logging**: Additional logging has minimal performance impact
- **Documentation**: Documentation improvements are zero risk

## Migration Strategy

1. **Phase 1**: Fix critical issues (hooks, validation, audit trail)
2. **Phase 2**: Add missing features (SEO, auto-population)
3. **Phase 3**: Enhance access control and security
4. **Phase 4**: Comprehensive testing
5. **Phase 5**: Documentation and cleanup

## References

- [Payload CMS Official Website Repo](https://github.com/payloadcms/website)
- [Payload CMS Collections Documentation](https://payloadcms.com/docs/configuration/collections)
- [Payload CMS Hooks Documentation](https://payloadcms.com/docs/hooks/overview)
- [Payload CMS Access Control](https://payloadcms.com/docs/access-control/overview)
