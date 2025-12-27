# Bolt's Journal ⚡

This journal is for CRITICAL learnings that will help avoid mistakes or make better decisions.

- A performance bottleneck specific to this codebase's architecture
- An optimization that surprisingly DIDN'T work (and why)
- A rejected change with a valuable lesson
- A codebase-specific performance pattern or anti-pattern
- A surprising edge case in how this app handles performance
## 2025-12-27 - Efficient N+1 Handling in Hooks
**Learning:** The 'populateAuthors' hook in 'src/collections/Posts/hooks/populateAuthors.ts' provides a textbook example of how to solve an N+1 query problem in Payload CMS. It uses a batching mechanism with 'process.nextTick' to collect all necessary IDs from a 'findMany' operation and fetches them in a single, efficient query.
**Action:** When encountering similar N+1 issues in other 'afterRead' hooks, I will use this existing, effective pattern as a blueprint for the solution.
