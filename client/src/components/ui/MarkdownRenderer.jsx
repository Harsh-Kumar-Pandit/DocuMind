import React from 'react'

function renderInline(text) {
  if (!text) return null
  // Regex to match code `code`, bold **text**, and italic *text*
  const tokens = []
  let remaining = text
  let key = 0

  while (remaining.length > 0) {
    // Check for inline code
    const codeMatch = remaining.match(/^`([^`]+)`/)
    if (codeMatch) {
      tokens.push(
        <code key={key++} className="inline-code">
          {codeMatch[1]}
        </code>
      )
      remaining = remaining.slice(codeMatch[0].length)
      continue
    }

    // Check for bold **text**
    const boldMatch = remaining.match(/^\*\*([^*]+)\*\*/)
    if (boldMatch) {
      tokens.push(
        <strong key={key++}>
          {renderInline(boldMatch[1])}
        </strong>
      )
      remaining = remaining.slice(boldMatch[0].length)
      continue
    }

    // Check for italic *text*
    const italicMatch = remaining.match(/^\*([^*]+)\*/)
    if (italicMatch) {
      tokens.push(
        <em key={key++}>
          {renderInline(italicMatch[1])}
        </em>
      )
      remaining = remaining.slice(italicMatch[0].length)
      continue
    }

    // Normal text chunk up to next formatting character (` or *)
    const nextSpecial = remaining.search(/[`*]/)
    if (nextSpecial === -1) {
      tokens.push(remaining)
      break
    } else if (nextSpecial === 0) {
      // Unmatched formatting character
      tokens.push(remaining[0])
      remaining = remaining.slice(1)
    } else {
      tokens.push(remaining.slice(0, nextSpecial))
      remaining = remaining.slice(nextSpecial)
    }
  }

  return tokens
}

export default function MarkdownRenderer({ content, className = '' }) {
  if (!content) return null

  // Split into lines
  const lines = content.replace(/\r\n/g, '\n').split('\n')
  const elements = []
  let i = 0
  let blockKey = 0

  while (i < lines.length) {
    const line = lines[i]

    // Empty line
    if (!line.trim()) {
      i++
      continue
    }

    // Fenced code block
    if (line.trim().startsWith('```')) {
      const lang = line.trim().slice(3).trim()
      const codeLines = []
      i++
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        codeLines.push(lines[i])
        i++
      }
      if (i < lines.length) i++ // skip closing ```
      elements.push(
        <pre key={blockKey++} className="markdown-code-block" data-language={lang || 'text'}>
          <code>{codeLines.join('\n')}</code>
        </pre>
      )
      continue
    }

    // Headings
    if (line.startsWith('### ')) {
      elements.push(
        <h4 key={blockKey++} className="markdown-h4">
          {renderInline(line.slice(4))}
        </h4>
      )
      i++
      continue
    }
    if (line.startsWith('## ')) {
      elements.push(
        <h3 key={blockKey++} className="markdown-h3">
          {renderInline(line.slice(3))}
        </h3>
      )
      i++
      continue
    }
    if (line.startsWith('# ')) {
      elements.push(
        <h2 key={blockKey++} className="markdown-h2">
          {renderInline(line.slice(2))}
        </h2>
      )
      i++
      continue
    }

    // Unordered list
    if (/^[-*]\s+/.test(line)) {
      const listItems = []
      while (i < lines.length && /^[-*]\s+/.test(lines[i])) {
        const itemText = lines[i].replace(/^[-*]\s+/, '')
        listItems.push(
          <li key={listItems.length}>{renderInline(itemText)}</li>
        )
        i++
      }
      elements.push(
        <ul key={blockKey++} className="markdown-list markdown-ul">
          {listItems}
        </ul>
      )
      continue
    }

    // Ordered list
    if (/^\d+\.\s+/.test(line)) {
      const listItems = []
      while (i < lines.length && /^\d+\.\s+/.test(lines[i])) {
        const itemText = lines[i].replace(/^\d+\.\s+/, '')
        listItems.push(
          <li key={listItems.length}>{renderInline(itemText)}</li>
        )
        i++
      }
      elements.push(
        <ol key={blockKey++} className="markdown-list markdown-ol">
          {listItems}
        </ol>
      )
      continue
    }

    // Standard paragraph: accumulate consecutive non-empty lines that aren't special
    const paraLines = []
    while (
      i < lines.length &&
      lines[i].trim() &&
      !lines[i].trim().startsWith('```') &&
      !lines[i].startsWith('#') &&
      !/^[-*]\s+/.test(lines[i]) &&
      !/^\d+\.\s+/.test(lines[i])
    ) {
      paraLines.push(lines[i])
      i++
    }

    elements.push(
      <p key={blockKey++} className="markdown-paragraph">
        {paraLines.map((pLine, pIdx) => (
          <React.Fragment key={pIdx}>
            {renderInline(pLine)}
            {pIdx < paraLines.length - 1 && <br />}
          </React.Fragment>
        ))}
      </p>
    )
  }

  return <div className={`markdown-body ${className}`}>{elements}</div>
}
