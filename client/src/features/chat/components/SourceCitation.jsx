import { BookOpen } from 'lucide-react'

export default function SourceCitation({ source, index }) {
  const page = source?.pageNumber != null ? `Page ${source.pageNumber}` : 'Page N/A'
  const similarity =
    typeof source?.similarity === 'number' && !isNaN(source.similarity)
      ? `${Math.round(source.similarity * 100)}% match`
      : null

  return (
    <div className="source-citation-card">
      <div className="source-citation-header">
        <span className="source-citation-index">{index + 1}</span>
        <span className="source-citation-page">
          <BookOpen size={13} />
          {page}
        </span>
        {similarity && (
          <span className="source-citation-score">{similarity}</span>
        )}
      </div>
      {source?.content && (
        <p className="source-citation-excerpt">{source.content}</p>
      )}
    </div>
  )
}
