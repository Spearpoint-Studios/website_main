/**
 * Wiki content is data, not JSX.
 *
 * The first version of this rendered each page as a React component and built
 * the search index by rendering it to static markup and stripping the tags.
 * Next refuses to let react-dom/server into the App Router graph at all, so
 * that could not ship -- but the constraint pushed towards a better shape
 * anyway. With pages as data:
 *
 *   - the renderer and the search index read the same source, so a page cannot
 *     be searchable for something it no longer says,
 *   - formatting stays consistent across pages without anyone policing it,
 *   - a page is checkable by a test rather than only by eye,
 *   - and writing one needs no React.
 *
 * The cost is no inline markup inside a paragraph. In practice the pages that
 * wanted bold read better as a table or a list anyway.
 */

export const WIKI_CATEGORIES = [
  'Getting started',
  'Teams',
  'Progression',
  'Dinosaurs',
  'Rules',
] as const

export type WikiCategory = (typeof WIKI_CATEGORIES)[number]

/** A table cell. The long form adds a smaller line underneath the value. */
export type WikiCell = string | { text: string; note?: string }

export type WikiBlock =
  | { kind: 'text'; body: string }
  | { kind: 'heading'; text: string }
  | { kind: 'list'; items: string[]; ordered?: boolean }
  | { kind: 'table'; columns: string[]; rows: WikiCell[][] }
  /** A short aside, set apart from the body. Use sparingly. */
  | { kind: 'note'; body: string }

export type WikiMeta = {
  slug: string
  title: string
  category: WikiCategory
  /** One or two sentences. Shown on the index, and as the fallback search snippet. */
  summary: string
  /**
   * Words people would search for that the page does not itself contain:
   * synonyms, abbreviations, the old name for something. Not a place to repeat
   * words already in the body -- the body is indexed in full.
   */
  keywords?: string[]
  /** Sort order within a category. Lower first; equal values fall back to title. */
  order?: number
}

export type WikiPage = {
  meta: WikiMeta
  blocks: WikiBlock[]
}

export function cellText(cell: WikiCell): string {
  return typeof cell === 'string' ? cell : [cell.text, cell.note].filter(Boolean).join(' ')
}

/** Every human-readable string in a page, in reading order. Used for search. */
export function pageText(page: WikiPage): string {
  const parts: string[] = []

  for (const block of page.blocks) {
    switch (block.kind) {
      case 'text':
      case 'note':
        parts.push(block.body)
        break
      case 'heading':
        parts.push(block.text)
        break
      case 'list':
        parts.push(...block.items)
        break
      case 'table':
        parts.push(...block.columns)
        for (const row of block.rows) parts.push(...row.map(cellText))
        break
    }
  }

  return parts.join(' ')
}
