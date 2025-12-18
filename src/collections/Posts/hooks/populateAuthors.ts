import type { CollectionAfterReadHook } from 'payload'

// The `user` collection has access control locked so that users are not publicly accessible
// This means that we need to populate the authors manually here to protect user privacy
// GraphQL will not return mutated user data that differs from the underlying schema
// So we use an alternative `populatedAuthors` field to populate the user data, hidden from the admin UI
export const populateAuthors: CollectionAfterReadHook = async ({ doc, req: { payload } }) => {
  // Performance Optimization:
  // Instead of fetching each author individually (N+1 problem),
  // we gather all author IDs and fetch them in a single query.
  if (doc?.authors && doc.authors.length > 0) {
    const authorIds = doc.authors.map((author) => (typeof author === 'object' ? author.id : author))

    try {
      const authorDocs = await payload.find({
        collection: 'users',
        where: {
          id: {
            in: authorIds,
          },
        },
        depth: 0,
        pagination: false, // Ensure we get all authors
      })

      if (authorDocs.docs.length > 0) {
        doc.populatedAuthors = authorDocs.docs.map((authorDoc) => ({
          id: authorDoc.id,
          name: authorDoc.name,
        }))
      } else {
        doc.populatedAuthors = []
      }
    } catch (error) {
      // Log the error for debugging, but don't block the response
      payload.logger.error(`Error populating authors for post ${doc.id}: ${error}`)
      // Optionally, you could clear populatedAuthors or leave it as is
      doc.populatedAuthors = []
    }
  }

  return doc
}
