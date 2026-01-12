---
trigger: always_on
---

---
title: Access Control - Advanced Patterns
description: Context-aware, time-based, subscription-based access, factory functions, templates
tags: [payload, access-control, security, advanced, performance]
priority: high
---

## Best Practices

1. **Default Deny**: Start with restrictive access, gradually add permissions
2. **Type Guards**: Use TypeScript for user type safety
3. **Validate Data**: Never trust frontend-provided IDs or data
4. **Async for Critical Checks**: Use async operations for important security decisions
5. **Consistent Logic**: Apply same rules at field and collection levels
6. **Test Edge Cases**: Test with no user, wrong user, admin user scenarios
7. **Monitor Access**: Log failed access attempts for security review
8. **Regular Audit**: Review access rules quarterly or after major changes
9. **Cache Wisely**: Use `req.context` for expensive operations
10. **Document Intent**: Add comments explaining complex access rules
11. **Avoid Secrets in Client**: Never expose sensitive logic to client-side
12. **Handle Errors Gracefully**: Access functions should return `false` on error, not throw
13. **Test Local API**: Remember to set `overrideAccess: false` when testing
14. **Consider Performance**: Measure impact of async operations
15. **Principle of Least Privilege**: Grant minimum access required

## Performance Summary

**Minimize Async Operations**: Use query constraints over async lookups when possible

**Cache Expensive Checks**: Store results in `req.context` for reuse

**Index Query Fields**: Ensure fields in query constraints are indexed

**Avoid Complex Logic in Array Fields**: Simple boolean checks preferred

**Use Query Constraints**: Let database filter rather than loading all records