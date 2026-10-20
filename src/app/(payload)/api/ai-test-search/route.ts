import { NextRequest, NextResponse } from 'next/server'
import { answerKnowledgeQuery } from '@/vectorize/rag'

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get('q')

  if (!query) {
    return NextResponse.json(
      { error: 'Missing "q" query parameter' },
      { status: 400 },
    )
  }

  try {
    const results = await answerKnowledgeQuery(query)

    return NextResponse.json(results)
  } catch (error) {
    console.error('AI Search Error', error)

    return NextResponse.json(
      {
        error: 'AI query failed',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
