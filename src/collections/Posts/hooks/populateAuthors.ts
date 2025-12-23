import type { CollectionAfterReadHook } from 'payload'
import type { Post, User } from '../../../payload-types'

// A custom property to be added to the request object to hold batch data.
declare module 'express-serve-static-core' {
  interface Request {
    batchAuthors?: {
      // A promise that resolves with a map of author IDs to author data.
      promise: Promise<Map<string, User>>
      // An array of docs that need their authors populated.
      docs: Post[]
    }
  }
}

/**
 * @file src/collections/Posts/hooks/populateAuthors.ts
 * @description This hook populates the `populatedAuthors` field on posts.
 * It is designed to solve the N+1 query problem when fetching a list of posts
 * with authors. When multiple posts are fetched in a single request (`findMany`),
 * it batches all author IDs from all posts and fetches them in a single query.
 * For a single post fetch, it fetches the authors directly.
 */
export const populateAuthors: CollectionAfterReadHook = async ({ doc, req, findMany }) => {
  // For 'findMany' operations, we batch the author fetching to prevent N+1 queries.
  if (findMany) {
    // This is the first hook invocation for this batch.
    // Initialize the batch and start the fetch.
    if (!req.batchAuthors) {
      req.batchAuthors = {
        docs: [],
        promise: new Promise(async resolve => {
          // This fires after all `afterRead` hooks have run.
          // It collects all unique author IDs and fetches them in a single query.
          await new Promise(resolve => process.nextTick(resolve))

          const { docs } = req.batchAuthors
          const authorIDs = new Set<string>()
          for (const doc of docs) {
            ;(doc.authors || []).forEach(author => {
              const id = typeof author === 'object' ? author.id : author
              if (id) authorIDs.add(id)
            })
          }

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
            // Create a map of author IDs to author data for quick lookups.
            resolve(new Map(authorDocs.docs.map(author => [author.id, author])))
          } catch (error) {
            req.payload.logger.error(`Error batch-populating authors: ${error}`)
            // In case of an error, resolve with an empty map.
            resolve(new Map())
          }
        }),
      }
    }

    // Add the current doc to the batch.
    req.batchAuthors.docs.push(doc as Post)

    // Wait for the batch fetch to complete and get the authors map.
    const authorsMap = await req.batchAuthors.promise
    const authorIds = (doc.authors || []).map(author =>
      typeof author === 'object' ? author.id : author,
    )

    // Populate the `populatedAuthors` field.
    doc.populatedAuthors = authorIds
      .map(id => {
        const author = authorsMap.get(id)
        return author ? { id: author.id, name: author.name } : null
      })
      .filter(Boolean)

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
