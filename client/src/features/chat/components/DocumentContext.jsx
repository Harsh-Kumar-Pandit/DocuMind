import {
  CheckCircle2,
  Clock3,
  Eye,
  FileText,
  HardDrive,
  Sparkles,
  X,
} from 'lucide-react'
import { getStatusBadgeClass, normalizeStatus } from '../../../lib/documentStatus'

function formatSize(bytes) {
  if (!bytes) return '—'
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

function formatDate(date) {
  if (!date) return '—'
  return new Intl.DateTimeFormat(undefined, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))
}

const QUICK_QUESTIONS = [
  'Summarize this document in 3 key points',
  'What are the primary topics covered?',
  'What key conclusions or takeaways are mentioned?',
  'What important definitions or findings are outlined?',
]

export default function DocumentContext({
  document,
  ready,
  onAsk,
  onClose,
  onViewDocument,
  isOpen = false,
}) {
  const statusStr = ready ? 'COMPLETED' : normalizeStatus(document?.status)
  const badgeClass = getStatusBadgeClass(statusStr)

  return (
    <aside className={`document-context-panel ${isOpen ? 'mobile-open' : ''}`}>
      <div className="context-header">
        <div className="context-title">
          <h2>Document Context</h2>
          <Sparkles size={15} className="context-sparkle" />
        </div>
        {onClose && (
          <button
            type="button"
            className="context-close-btn"
            onClick={onClose}
            aria-label="Close document context panel"
          >
            <X size={18} />
          </button>
        )}
      </div>

      <div className="context-scroll-content">
        {!document ? (
          <div className="context-empty-state">
            <FileText size={32} />
            <strong>No document selected</strong>
            <p>Select a document from the left sidebar to view its metadata and quick actions.</p>
          </div>
        ) : (
          <>
            {/* Functional PDF viewer action card */}
            <div className="document-preview-card active-preview-card">
              <div className="preview-icon-wrapper">
                <FileText size={32} />
              </div>
              <span className="preview-label">Document Viewer</span>
              <p className="preview-explanation">
                Open the complete uploaded PDF to read, zoom, and inspect original pages.
              </p>
              <button
                type="button"
                className="context-view-doc-btn"
                onClick={onViewDocument}
              >
                <Eye size={15} />
                <span>View Document</span>
              </button>
            </div>

            {/* Document summary info */}
            <div className="context-file-card">
              <span className="context-pdf-icon">
                <FileText size={18} />
              </span>
              <div className="context-file-info">
                <strong title={document.originalName}>
                  {document.originalName}
                </strong>
                <span className="context-file-meta">
                  {formatSize(document.size)} · {formatDate(document.createdAt)}
                </span>
              </div>
            </div>

            {/* Metadata list */}
            <div className="context-meta-section">
              <span className="context-section-label">File Details</span>
              <dl className="context-meta-list">
                <div className="meta-item">
                  <dt>
                    <HardDrive size={14} /> Size
                  </dt>
                  <dd>{formatSize(document.size)}</dd>
                </div>
                <div className="meta-item">
                  <dt>
                    <Clock3 size={14} /> Uploaded
                  </dt>
                  <dd>{formatDate(document.createdAt)}</dd>
                </div>
                <div className="meta-item">
                  <dt>
                    <CheckCircle2 size={14} /> Status
                  </dt>
                  <dd>
                    <span className={`status-pill ${badgeClass}`}>
                      {statusStr}
                    </span>
                  </dd>
                </div>
              </dl>
            </div>

            {/* Quick questions that call existing chat API */}
            <div className="quick-questions-section">
              <div className="quick-questions-header">
                <Sparkles size={14} />
                <strong>Quick Questions</strong>
              </div>
              <p className="quick-questions-description">
                Click any prompt to ask DocuMind using the retrieved document context.
              </p>
              <div className="quick-questions-list">
                {QUICK_QUESTIONS.map((q) => (
                  <button
                    key={q}
                    type="button"
                    className="quick-question-btn"
                    disabled={!ready}
                    onClick={() => onAsk(q)}
                  >
                    <span className="quick-question-bullet">✦</span>
                    <span className="quick-question-text">{q}</span>
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </aside>
  )
}
