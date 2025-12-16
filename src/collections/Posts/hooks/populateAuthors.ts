import type { CollectionAfterReadHook } from 'payload'

// The `user` collection has access control locked so that users are not publicly accessible
// This means that we need to populate the authors manually here to protect user privacy
// GraphQL will not return mutated user data that differs from the underlying schema
// So we use an alternative `populatedAuthors` field to populate the user data, hidden from the admin UI
export const populateAuthors: CollectionAfterReadHook = async ({ doc, req: { payload } }) => {
  if (doc?.authors && doc.authors.length > 0) {
    const authorIDs = doc.authors.map((author) => (typeof author === 'object' ? author.id : author))

    try {
      // ⚡ Bolt: Replaced N+1 query with a single 'find' operation.
      // Instead of fetching each author individually in a loop, we now fetch all authors
      // for a given document with a single database query. This significantly reduces
      // the number of database roundtrips, especially for posts with multiple authors.
      const authorDocs = await payload.find({
        collection: 'users',
        where: {
          id: {
            in: authorIDs,
          },
        },
        depth: 0,
        pagination: false, // Important to fetch all authors
      })

      if (authorDocs.docs.length > 0) {
        doc.populatedAuthors = authorDocs.docs.map((authorDoc) => ({
          id: authorDoc.id,
          name: authorDoc.name,
        }))
      }
    } catch (err) {
      payload.logger.error(`Error populating authors for post '${doc.id}': ${err}`)
      // swallow error
    }
  }

  return doc
}
