import type { WikiBlock, WikiCell } from '@/content/wiki'

function Cell({ cell }: { cell: WikiCell }) {
  if (typeof cell === 'string') return <>{cell}</>
  return (
    <>
      {cell.text}
      {cell.note ? (
        <>
          <br />
          <span className="wiki-table-note">{cell.note}</span>
        </>
      ) : null}
    </>
  )
}

/**
 * Renders a page's blocks. Deliberately dumb: every decision about what a page
 * says lives in the page data, and everything here is about how it looks.
 */
export function WikiBlocks({ blocks }: { blocks: WikiBlock[] }) {
  return (
    <>
      {blocks.map((block, index) => {
        // Blocks have no ids and are a fixed, ordered list authored by hand, so
        // the index is a stable key here.
        const key = index

        switch (block.kind) {
          case 'heading':
            return <h2 key={key}>{block.text}</h2>

          case 'text':
            return <p key={key}>{block.body}</p>

          case 'note':
            return (
              <aside key={key} className="wiki-note">
                {block.body}
              </aside>
            )

          case 'list': {
            const items = block.items.map((item, itemIndex) => <li key={itemIndex}>{item}</li>)
            return block.ordered ? <ol key={key}>{items}</ol> : <ul key={key}>{items}</ul>
          }

          case 'table':
            return (
              <table key={key} className="wiki-table">
                <thead>
                  <tr>
                    {block.columns.map((column) => (
                      <th key={column}>{column}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {block.rows.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {row.map((cell, cellIndex) => (
                        <td key={cellIndex}>
                          <Cell cell={cell} />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            )
        }
      })}
    </>
  )
}
