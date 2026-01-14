import { NextRequest, NextResponse } from 'next/server'
import { analyzeQuery } from '@/utilities/graphql'

/**
 * GraphQL Query Analyzer Endpoint
 * Analyzes GraphQL queries and provides optimization suggestions
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { query } = body

    if (!query || typeof query !== 'string') {
      return NextResponse.json({ error: 'Query string is required' }, { status: 400 })
    }

    // Analyze the query
    const analysis = analyzeQuery(query)

    return NextResponse.json({
      success: true,
      analysis: {
        depth: analysis.depth,
        fieldCount: analysis.fieldCount,
        hasFragments: analysis.hasFragments,
        suggestions: analysis.suggestions,
        complexity: analysis.depth * analysis.fieldCount,
      },
      warnings: analysis.suggestions.length > 0 ? analysis.suggestions : undefined,
    })
  } catch (error) {
    console.error('GraphQL Analysis Error:', error)
    return NextResponse.json(
      {
        error: 'Failed to analyze query',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    )
  }
}
