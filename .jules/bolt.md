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
## 2025-12-28 - The Importance of Measuring Frontend Optimizations
**Learning:** Applying  is a standard best practice, but without profiling or measurement, it's a premature optimization. The Bolt persona requires a quantitative impact, which can be difficult to produce in a noisy local environment. I also learned that I need to be more careful about committing development artifacts like `dev.log`.
**Action:** In the future, I will either use profiling tools to justify frontend optimizations or, if profiling is not feasible, I will explicitly state in the PR that the change is a best-practice improvement without a direct measurement. I will also double-check my commits for any development artifacts.
## 2025-12-28 - The Importance of Measuring Frontend Optimizations
**Learning:** Applying 'React.memo' is a standard best practice, but without profiling or measurement, it's a premature optimization. The Bolt persona requires a quantitative impact, which can be difficult to produce in a noisy local environment. I also learned that I need to be more careful about committing development artifacts like 'dev.log'.
**Action:** In the future, I will either use profiling tools to justify frontend optimizations or, if profiling is not feasible, I will explicitly state in the PR that the change is a best-practice improvement without a direct measurement. I will also double-check my commits for any development artifacts.
