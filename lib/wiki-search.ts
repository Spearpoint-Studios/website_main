// Search over the wiki, hand-rolled rather than pulled from a package.
//
// The site ships no runtime dependencies beyond next and react, and a wiki of
// this size does not justify breaking that: the whole corpus is a few dozen
// short pages, so scoring every one of them on each keystroke is far cheaper
// than the download of a search library.
//
// Nothing here touches React or the DOM, so it is testable on its own.

export type WikiSearchDoc = {
  slug: string
  title: string
  category: string
  summary: string
  keywords: string[]
  /** The page body as plain text, for matching on words that are not in the title. */
  text: string
}

export type WikiSearchHit = {
  doc: WikiSearchDoc
  score: number
  /** A short piece of the body around the first match, for context under the title. */
  snippet: string
}

const SNIPPET_RADIUS = 90

// Weights are ordered by how strong a signal each field is, not tuned to
// anything. A word in the title almost always means the page is about it; the
// same word buried in the body usually does not.
const WEIGHT = {
  titleExact: 120,
  titleStart: 60,
  title: 40,
  keyword: 30,
  category: 12,
  summary: 8,
  text: 2,
} as const

export function normalize(value: string): string {
  return value
    .toLowerCase()
    // Fold punctuation to spaces so "t-rex" and "t rex" both match, and so a
    // trailing comma never welds itself to a word.
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}

export function tokenize(query: string): string[] {
  const normalized = normalize(query)
  return normalized.length === 0 ? [] : normalized.split(' ')
}

function countOccurrences(haystack: string, needle: string): number {
  if (needle.length === 0) return 0
  let count = 0
  let index = haystack.indexOf(needle)
  while (index !== -1) {
    count += 1
    index = haystack.indexOf(needle, index + needle.length)
  }
  return count
}

function scoreToken(doc: WikiSearchDoc, token: string): number {
  const title = normalize(doc.title)
  const category = normalize(doc.category)
  const summary = normalize(doc.summary)
  const text = normalize(doc.text)
  const keywords = doc.keywords.map(normalize)

  let score = 0

  if (title === token) {
    score += WEIGHT.titleExact
  } else if (title.startsWith(`${token} `) || title === token) {
    score += WEIGHT.titleStart
  } else if (title.includes(token)) {
    score += WEIGHT.title
  }

  if (keywords.some((keyword) => keyword === token || keyword.includes(token))) {
    score += WEIGHT.keyword
  }

  if (category.includes(token)) score += WEIGHT.category
  if (summary.includes(token)) score += WEIGHT.summary

  // Body matches count, but with diminishing returns: a page that says a word
  // forty times is not twenty times more relevant than one that says it twice.
  const bodyHits = countOccurrences(text, token)
  if (bodyHits > 0) score += WEIGHT.text * Math.min(bodyHits, 5)

  return score
}

function buildSnippet(doc: WikiSearchDoc, tokens: string[]): string {
  const text = doc.text
  if (text.length === 0) return doc.summary

  const lower = text.toLowerCase()
  let at = -1
  for (const token of tokens) {
    const found = lower.indexOf(token)
    if (found !== -1 && (at === -1 || found < at)) at = found
  }
  // No body match (the hit came from the title or keywords), so the summary is
  // the more useful thing to show.
  if (at === -1) return doc.summary

  const start = Math.max(0, at - SNIPPET_RADIUS)
  const end = Math.min(text.length, at + SNIPPET_RADIUS)
  const slice = text.slice(start, end).trim()

  return `${start > 0 ? '…' : ''}${slice}${end < text.length ? '…' : ''}`
}

/**
 * Every token must appear somewhere in a page for it to be a hit. Typing more
 * words narrows the results rather than widening them, which is what people
 * expect from a search box and what makes a second word worth typing.
 */
export function searchWiki(
  docs: readonly WikiSearchDoc[],
  query: string,
  limit = 20,
): WikiSearchHit[] {
  const tokens = tokenize(query)
  if (tokens.length === 0) return []

  const hits: WikiSearchHit[] = []

  for (const doc of docs) {
    let total = 0
    let matchedEvery = true

    for (const token of tokens) {
      const score = scoreToken(doc, token)
      if (score === 0) {
        matchedEvery = false
        break
      }
      total += score
    }

    if (!matchedEvery) continue
    hits.push({ doc, score: total, snippet: buildSnippet(doc, tokens) })
  }

  hits.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score
    // Stable and predictable when scores tie, rather than registry order.
    return a.doc.title.localeCompare(b.doc.title)
  })

  return hits.slice(0, limit)
}
