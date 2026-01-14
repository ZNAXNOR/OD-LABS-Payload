# GraphQL Optimization Guide

This document describes the GraphQL optimization features implemented in the PayloadCMS project.

## Features

### 1. Query Complexity Limiting

The system implements query complexity limiting to prevent resource-intensive queries from overwhelming the server.

**Configuration:**

- Maximum complexity: 1000 points
- Scalar fields: 1 point each
- Object fields: 2 points each
- List fields: 10x multiplier

**Example:**

```graphql
# Low complexity query (< 50 points)
query {
  posts(limit: 10) {
    docs {
      id
      title
      status
    }
  }
}

# High complexity query (> 500 points)
query {
  posts {
    docs {
      id
      title
      author {
        id
        name
        posts {
          docs {
            id
            title
            categories {
              docs {
                id
                name
              }
            }
          }
        }
      }
    }
  }
}
```

### 2. Query Depth Limiting

Prevents deeply nested queries that can cause performance issues.

**Configuration:**

- Maximum depth: 10 levels
- Depth is calculated from the root query

**Example:**

```graphql
# Acceptable depth (3 levels)
query {
  posts {           # Level 1
    docs {          # Level 2
      author {      # Level 3
        name
      }
    }
  }
}

# Excessive depth (> 10 levels) - Will be rejected
query {
  posts {
    docs {
      author {
        organization {
          team {
            members {
              posts {
                categories {
                  parent {
                    # ... continues
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
```

### 3. Rate Limiting

Protects the API from abuse by limiting the number of requests per time window.

**Configuration:**

- Maximum requests: 100 per window
- Time window: 15 minutes
- Based on IP address (respects X-Forwarded-For header)

**Response Headers:**

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640000000
```

### 4. Error Handling and Logging

Comprehensive error handling with detailed logging for monitoring and debugging.

**Error Response Format:**

```json
{
  "errors": [
    {
      "message": "Query complexity exceeds maximum allowed",
      "extensions": {
        "code": "GRAPHQL_VALIDATION_FAILED"
      },
      "path": ["posts", "docs"],
      "locations": [{ "line": 2, "column": 3 }]
    }
  ]
}
```

**Development vs Production:**

- Development: Includes full error details, stack traces, and query paths
- Production: Sanitized errors with minimal information

### 5. Performance Monitoring

Built-in performance monitoring tracks query execution times and identifies slow queries.

**Metrics Tracked:**

- Query execution time
- Query complexity score
- Number of fields requested
- Cache hit/miss ratio

### 6. Query Analysis Endpoint

A dedicated endpoint for analyzing queries before execution.

**Endpoint:** `POST /api/graphql-analyze`

**Request:**

```json
{
  "query": "query { posts { docs { id title author { name } } } }"
}
```

**Response:**

```json
{
  "success": true,
  "analysis": {
    "depth": 3,
    "fieldCount": 5,
    "hasFragments": false,
    "complexity": 15,
    "suggestions": ["Consider adding pagination limits to list queries"]
  }
}
```

## Best Practices

### 1. Use Pagination

Always use pagination for list queries to limit the amount of data returned.

```graphql
# Good
query {
  posts(limit: 10, page: 1) {
    docs {
      id
      title
    }
    totalDocs
    hasNextPage
  }
}

# Bad - Returns all posts
query {
  posts {
    docs {
      id
      title
    }
  }
}
```

### 2. Request Only Needed Fields

Only request the fields you actually need to reduce query complexity.

```graphql
# Good - Minimal fields
query {
  posts(limit: 10) {
    docs {
      id
      title
      publishedAt
    }
  }
}

# Bad - Requesting unnecessary fields
query {
  posts(limit: 10) {
    docs {
      id
      title
      content
      author {
        id
        email
        firstName
        lastName
        createdAt
        updatedAt
      }
      categories {
        docs {
          id
          name
          description
          parent {
            id
            name
          }
        }
      }
    }
  }
}
```

### 3. Use Fragments for Reusability

Use GraphQL fragments to avoid duplication and reduce query size.

```graphql
fragment PostFields on Post {
  id
  title
  status
  publishedAt
}

query {
  recentPosts: posts(limit: 5, sort: "-publishedAt") {
    docs {
      ...PostFields
    }
  }

  featuredPosts: posts(where: { featured: { equals: true } }) {
    docs {
      ...PostFields
    }
  }
}
```

### 4. Limit Relationship Depth

Use the `depth` parameter to control how deep relationships are populated.

```graphql
# Good - Limited depth
query {
  posts(limit: 10, depth: 1) {
    docs {
      id
      title
      author {
        id
        name
      }
    }
  }
}

# Bad - Unlimited depth can cause performance issues
query {
  posts(limit: 10) {
    docs {
      id
      title
      author {
        posts {
          docs {
            author {
              posts {
                # Circular reference
              }
            }
          }
        }
      }
    }
  }
}
```

### 5. Use Aliases for Multiple Queries

Use aliases when making multiple queries in a single request.

```graphql
query {
  published: posts(where: { _status: { equals: "published" } }, limit: 10) {
    docs {
      id
      title
    }
  }

  drafts: posts(where: { _status: { equals: "draft" } }, limit: 10) {
    docs {
      id
      title
    }
  }
}
```

## Monitoring and Debugging

### Enable GraphQL Playground (Development Only)

The GraphQL playground is automatically disabled in production for security.

**Access:** `http://localhost:3000/api/graphql-playground`

### View Query Logs

GraphQL queries are logged with the following information:

- Query string
- Execution time
- Complexity score
- User context
- Errors (if any)

**Log Location:** Console output and application logs

### Analyze Query Performance

Use the query analysis endpoint to check query performance before execution:

```bash
curl -X POST http://localhost:3000/api/graphql-analyze \
  -H "Content-Type: application/json" \
  -d '{"query": "query { posts { docs { id title } } }"}'
```

## Configuration

All GraphQL optimization settings are configured in `src/payload.config.ts`:

```typescript
export default buildConfig({
  graphQL: {
    maxComplexity: 1000,
    disablePlaygroundInProduction: true,
    formatError: (error) => {
      // Custom error handling
    },
  },
  rateLimit: {
    max: 100,
    window: 15 * 60 * 1000,
    trustProxy: true,
  },
})
```

## Troubleshooting

### Query Complexity Exceeded

**Error:** "Query complexity exceeds maximum allowed"

**Solution:**

1. Reduce the number of fields requested
2. Add pagination limits
3. Reduce relationship depth
4. Split into multiple smaller queries

### Rate Limit Exceeded

**Error:** "Too many requests"

**Solution:**

1. Implement client-side caching
2. Batch multiple queries into one
3. Increase rate limit (if appropriate)
4. Use webhooks instead of polling

### Query Depth Exceeded

**Error:** "Query depth exceeds maximum allowed"

**Solution:**

1. Reduce nested relationships
2. Use the `depth` parameter to limit population
3. Fetch related data in separate queries
4. Consider denormalizing data

## Security Considerations

1. **Always use rate limiting** in production
2. **Disable GraphQL playground** in production
3. **Sanitize error messages** to avoid information leakage
4. **Monitor for suspicious queries** (excessive depth, complexity)
5. **Use authentication** for sensitive operations
6. **Implement field-level permissions** for sensitive data

## Performance Tips

1. **Use DataLoader** for batching and caching (built into Payload)
2. **Enable query caching** for frequently accessed data
3. **Index database fields** used in where clauses
4. **Use pagination** for all list queries
5. **Monitor query performance** and optimize slow queries
6. **Consider using persisted queries** for production
