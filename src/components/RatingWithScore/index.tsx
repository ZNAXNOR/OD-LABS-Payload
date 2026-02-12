import React from 'react'

import { Rating } from '@/components/ui/rating'

export type RatingWithScoreProps = {
  score?: number | null
  label?: string | null
}

const RatingWithScore: React.FC<RatingWithScoreProps> = ({ score, label }) => {
  if (score === undefined || score === null) return null

  return <Rating rate={score} showScore description={label || ''} />
}

export default RatingWithScore
