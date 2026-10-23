import { Eye, FileText, Menu, PanelRight } from 'lucide-react'
import DocumentProcessingState from './DocumentProcessingState'
import { getStatusBadgeClass, normalizeStatus } from '../../../lib/documentStatus'

function formatSize(bytes) {
  if (!bytes) return '—'
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

function formatDate(date) {
  if (!date) return '—'
  return new Intl.DateTimeFormat(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))
}

export default function ChatHeader({
  document,
  processing,
  ready,
  error,
  onMenu,
  onToggleContext,
  onRetry,
  onViewDocument,
}) {
  const statusStr = ready ? 'COMPLETED' : normalizeStatus(document?.status)
  const badgeClass = getStatusBadgeClass(statusStr)

  return (
    <>
      <header className="chat-header">
        <div className="chat-header-left">
          <button
            className="chat-mobile-menu"
            type="button"
            aria-label="Open chat navigation"
            onClick={onMenu}
          >
            <Menu size={19} />
          </button>
          <span className="chat-file-icon">
            <FileText size={18} />
          </span>
          <div className="chat-header-copy">
            <h1 title={document?.originalName || 'Document chat'}>
              {document?.originalName || 'Document chat'}
            </h1>
            {document && (
              <span className="chat-header-meta">
                {formatSize(document.size)}
                <span className="meta-separator">·</span>
                {formatDate(document.createdAt)}
              </span>
            )}
          </div>
        </div>

        <div className="chat-header-right">
          {document && (
            <button
              className="chat-view-doc-btn"
              type="button"
              onClick={onViewDocument}
              title="View full document"
              aria-label="View document"
            >
              <Eye size={15} />
              <span>View Document</span>
            </button>
          )}
          {document && (
            <span className={`chat-status-badge ${badgeClass}`}>
              <span className="status-dot" />
              {statusStr}
            </span>
          )}
          <button
            className="chat-context-toggle"
            type="button"
            aria-label="Toggle document details"
            onClick={onToggleContext}
            title="Document details"
          >
            <PanelRight size={18} />
          </button>
        </div>
      </header>

      <DocumentProcessingState
        document={document}
        processing={processing}
        ready={ready}
        error={error}
        onRetry={onRetry}
      />
    </>
  )
}
