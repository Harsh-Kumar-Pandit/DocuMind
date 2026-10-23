import { AlertCircle, LoaderCircle, RefreshCw } from 'lucide-react'

export default function DocumentProcessingState({
  processing,
  error,
  onRetry,
}) {
  if (error) {
    return (
      <div className="processing-state error" role="alert">
        <div className="processing-state-content">
          <AlertCircle size={16} className="processing-icon" />
          <span>
            <strong>Could not prepare document:</strong> {error}
          </span>
        </div>
        {onRetry && (
          <button
            type="button"
            className="processing-retry-btn"
            onClick={onRetry}
          >
            <RefreshCw size={13} /> Retry preparation
          </button>
        )}
      </div>
    )
  }

  if (processing) {
    return (
      <div className="processing-state processing" role="status">
        <div className="processing-state-content">
          <LoaderCircle className="spin processing-icon" size={16} />
          <span>
            <strong>Preparing document…</strong> Extracting text and generating searchable embeddings.
          </span>
        </div>
      </div>
    )
  }

  return null
}
