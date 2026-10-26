'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { searchWiki, type WikiSearchDoc } from '@/lib/wiki-search'

type WikiSearchProps = {
  /** Built on the server by content/wiki/search-index.ts and serialised into the page. */
  index: WikiSearchDoc[]
}

const MAX_RESULTS = 12

export function WikiSearch({ index }: WikiSearchProps) {
  const [query, setQuery] = useState('')

  // The whole corpus is a few dozen short pages, so this is cheap enough to run
  // on every keystroke. No debounce: a delay on a list this small only makes
  // the box feel unresponsive.
  const hits = useMemo(() => searchWiki(index, query, MAX_RESULTS), [index, query])

  const trimmed = query.trim()
  const searching = trimmed.length > 0

  return (
    <div className="wiki-search">
      <label className="wiki-search-label" htmlFor="wiki-search-input">
        Search the wiki
      </label>
      <input
        id="wiki-search-input"
        className="wiki-search-input"
        type="search"
        autoComplete="off"
        placeholder="Try &ldquo;tranquilliser&rdquo;, &ldquo;GenCore&rdquo;, or &ldquo;rank&rdquo;"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        // Announces result counts to a screen reader as they change.
        aria-describedby="wiki-search-status"
      />

      <p className="wiki-search-status" id="wiki-search-status" role="status">
        {searching
          ? `${hits.length} ${hits.length === 1 ? 'result' : 'results'} for “${trimmed}”`
          : `${index.length} pages`}
      </p>

      {searching ? (
        hits.length > 0 ? (
          <ul className="wiki-results">
            {hits.map((hit) => (
              <li key={hit.doc.slug}>
                <Link className="wiki-result" href={`/wiki/${hit.doc.slug}`}>
                  <span className="wiki-result-category">{hit.doc.category}</span>
                  <span className="wiki-result-title">{hit.doc.title}</span>
                  <span className="wiki-result-snippet">{hit.snippet}</span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <div className="wiki-no-results">
            <p>
              Nothing matches <strong>{trimmed}</strong>.
            </p>
            <p>
              Every word has to appear on a page, so a shorter query usually
              finds more. The pages are all listed below too.
            </p>
          </div>
        )
      ) : null}
    </div>
  )
}
