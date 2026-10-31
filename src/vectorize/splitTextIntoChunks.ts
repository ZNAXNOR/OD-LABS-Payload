const MAX_CHUNK_CHARACTERS = 6_000

/**
 * Split extracted content into conservative-sized chunks before embedding.
 * The OpenAI embedding model accepts at most 8,192 tokens per input; a
 * character limit leaves room for tokenization differences and page metadata.
 */
export function splitTextIntoChunks(
  text: string,
  maxCharacters = MAX_CHUNK_CHARACTERS,
): string[] {
  const normalized = text.replace(/\r\n?/g, '\n').trim()
  if (!normalized) return []

  const chunks: string[] = []
  let current = ''

  const flush = () => {
    if (current.trim()) chunks.push(current.trim())
    current = ''
  }

  const appendLongParagraph = (paragraph: string) => {
    let remaining = paragraph.trim()

    while (remaining.length > maxCharacters) {
      let splitAt = remaining.lastIndexOf(' ', maxCharacters)

      if (splitAt < Math.floor(maxCharacters * 0.6)) {
        splitAt = maxCharacters
      }

      chunks.push(remaining.slice(0, splitAt).trim())
      remaining = remaining.slice(splitAt).trim()
    }

    if (remaining) {
      if (current && current.length + remaining.length + 2 <= maxCharacters) {
        current += `\n\n${remaining}`
      } else {
        flush()
        current = remaining
      }
    }
  }

  for (const paragraph of normalized.split(/\n\s*\n/)) {
    const cleaned = paragraph.trim()
    if (!cleaned) continue

    if (cleaned.length > maxCharacters) {
      flush()
      appendLongParagraph(cleaned)
      continue
    }

    if (!current) {
      current = cleaned
    } else if (current.length + cleaned.length + 2 <= maxCharacters) {
      current += `\n\n${cleaned}`
    } else {
      flush()
      current = cleaned
    }
  }

  flush()
  return chunks
}
