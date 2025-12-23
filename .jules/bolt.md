# Bolt's Journal ⚡

This journal is for CRITICAL learnings that will help avoid mistakes or make better decisions.

- A performance bottleneck specific to this codebase's architecture
- An optimization that surprisingly DIDN'T work (and why)
- A rejected change with a valuable lesson
- A codebase-specific performance pattern or anti-pattern
- A surprising edge case in how this app handles performance

## 2024-08-22 - Refactor Batching Logic in `afterRead` Hooks
**Learning:** A robust pattern to solve N+1 query problems in Payload CMS `afterRead` hooks is to implement a batch loader. During a `findMany` operation, this involves caching promises on the `req` object for each item and using `process.nextTick` to defer the execution of a single, aggregated database query until after the hook has been called for all documents in the batch.
**Action:** When encountering N+1 problems in `afterRead` hooks, I will implement a batch loader that caches promises on the `req` object and uses `process.nextTick` to defer the execution of a single, aggregated database query.
