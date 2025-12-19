import type { CollectionAfterReadHook } from 'payload'
import type { Post } from '../../../payload-types'

/**
 * @file src/collections/Posts/hooks/populateAuthors.ts
 * @description This hook populates the `populatedAuthors` field on posts.
 * It is designed to solve the N+1 query problem when fetching a list of posts
 * with authors. When multiple posts are fetched in a single request (`findMany`),
 * it batches all author IDs from all posts and fetches them in a single query.
 * For a single post fetch, it fetches the authors directly.
 */

// A custom property to be added to the request object to hold batch data.
declare module 'express-serve-static-core' {
  interface Request {
    batchAuthors?: {
      // A set of unique author IDs to fetch for the current request.
      authorIDs: Set<string>
      // An array of docs that need their authors populated.
      docs: Post[]
      // A promise that resolves when the batch fetch is complete.
      promise: Promise<void>
    }
  }
}

export const populateAuthors: CollectionAfterReadHook = async ({ doc, req, findMany }) => {
  // For 'findMany' operations, we batch the author fetching to prevent N+1 queries.
  if (findMany) {
    // Initialize the batch on the first doc of a findMany request.
    // The `process.nextTick` ensures that the batch fetch is deferred until all
    // `afterRead` hooks for the current find operation have had a chance to run
    // and add their author IDs to the batch.
    if (!req.batchAuthors) {
      req.batchAuthors = {
        authorIDs: new Set(),
        docs: [],
        promise: new Promise(resolve => {
          process.nextTick(async () => {
            const { authorIDs, docs } = req.batchAuthors
            try {
              const authorDocs = await req.payload.find({
                collection: 'users',
                where: {
                  id: {
                    in: Array.from(authorIDs),
                  },
                },
                depth: 0,
                pagination: false,
              })

              const authorsMap = new Map(authorDocs.docs.map(author => [author.id, author]))

              for (const doc of docs) {
                const authorIds = (doc.authors || []).map(author =>
                  typeof author === 'object' ? author.id : author,
                )
                doc.populatedAuthors = authorIds
                  .map(id => {
                    const author = authorsMap.get(id)
                    return author ? { id: author.id, name: author.name } : null
                  })
                  .filter(Boolean)
              }
            } catch (error) {
              req.payload.logger.error(`Error batch-populating authors: ${error}`)
              // In case of an error, ensure populatedAuthors is an empty array.
              for (const doc of docs) {
                doc.populatedAuthors = []
              }
            }
            resolve()
          })
        }),
      }
    }

    // Collect author IDs from the current doc and add the doc to the batch.
    if (doc.authors?.length) {
      const authorIds = doc.authors.map(author =>
        typeof author === 'object' ? author.id : author,
      )
      authorIds.forEach(id => req.batchAuthors.authorIDs.add(id))
      req.batchAuthors.docs.push(doc as Post)
    } else {
      doc.populatedAuthors = []
    }

    // Wait for the batch promise to resolve. All hook invocations for this
    // request will wait on the same promise.
    await req.batchAuthors.promise
    return doc
  }

  // For single 'findOne' operations, fetch authors directly.
  if (doc.authors?.length) {
    const authorIds = doc.authors.map(author => (typeof author === 'object' ? author.id : author))
    try {
      const authorDocs = await req.payload.find({
        collection: 'users',
        where: {
          id: {
            in: authorIds,
          },
        },
        depth: 0,
        pagination: false,
      })

      doc.populatedAuthors = authorDocs.docs.map(authorDoc => ({
        id: authorDoc.id,
        name: authorDoc.name,
      }))
    } catch (error) {
      req.payload.logger.error(`Error populating authors for post ${doc.id}: ${error}`)
      doc.populatedAuthors = []
    }
  } else {
    doc.populatedAuthors = []
  }

  return doc
}
