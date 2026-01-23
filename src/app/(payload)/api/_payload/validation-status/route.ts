/**
 * API Route for Validation Status
 */

export async function GET() {
  return Response.json({
    enabled: process.env.NODE_ENV === 'development',
    lastValidation: Date.now(),
    config: {
      maxLength: 50,
      errorLength: 63,
      enforceSnakeCase: true,
      warnMissingDbName: true,
      dbNameRequiredDepth: 3,
    },
  })
}
