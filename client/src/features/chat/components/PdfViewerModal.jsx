import { useEffect, useState } from "react";
import {
  AlertCircle,
  Download,
  ExternalLink,
  FileText,
  LoaderCircle,
  RefreshCw,
  X,
} from "lucide-react";
import { chatService } from "../services/chatService";

function formatSize(bytes) {
  if (!bytes) return "—";
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function formatDate(date) {
  if (!date) return "—";
  return new Intl.DateTimeFormat(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

function PdfViewerDialog({ onClose, document }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pdfBlobUrl, setPdfBlobUrl] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true;
    let createdUrl = null;

    chatService
      .getDocumentFileBlob(document.id)
      .then((blob) => {
        if (!active) return;
        createdUrl = URL.createObjectURL(blob);
        setPdfBlobUrl(createdUrl);
        setLoading(false);
      })
      .catch((err) => {
        if (!active) return;
        setError(err.message || "Could not load the PDF document.");
        setLoading(false);
      });

    return () => {
      active = false;
      if (createdUrl) {
        URL.revokeObjectURL(createdUrl);
      }
    };
  }, [document.id, reloadKey]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const handleDownload = () => {
    if (!pdfBlobUrl) return;
    const a = window.document.createElement("a");
    a.href = pdfBlobUrl;
    a.download = document.originalName || "document.pdf";
    window.document.body.appendChild(a);
    a.click();
    window.document.body.removeChild(a);
  };

  const handleOpenNewTab = () => {
    if (!pdfBlobUrl) return;
    window.open(pdfBlobUrl, "_blank", "noopener,noreferrer");
  };

  const handleRetry = () => {
    setError("");
    setLoading(true);
    setReloadKey((prev) => prev + 1);
  };

  return (
    <div
      className="pdf-modal-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="pdf-viewer-title"
    >
      <div
        className="pdf-modal-container"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="pdf-modal-header">
          <div className="pdf-modal-header-left">
            <span className="pdf-modal-icon">
              <FileText size={18} />
            </span>
            <div className="pdf-modal-title-copy">
              <h2 id="pdf-viewer-title" title={document.originalName}>
                {document.originalName}
              </h2>
              <span className="pdf-modal-meta">
                {formatSize(document.size)}
                <span className="meta-separator">·</span>
                {formatDate(document.createdAt)}
              </span>
            </div>
          </div>

          <div className="pdf-modal-header-actions">
            {pdfBlobUrl && (
              <>
                <button
                  type="button"
                  className="pdf-action-btn"
                  onClick={handleOpenNewTab}
                  title="Open in new browser tab"
                  aria-label="Open in new browser tab"
                >
                  <ExternalLink size={15} />
                  <span>Open in tab</span>
                </button>
                <button
                  type="button"
                  className="pdf-action-btn"
                  onClick={handleDownload}
                  title="Download PDF"
                  aria-label="Download PDF"
                >
                  <Download size={15} />
                  <span>Download</span>
                </button>
              </>
            )}

            <button
              type="button"
              className="pdf-modal-close-btn"
              onClick={onClose}
              title="Close viewer (Esc)"
              aria-label="Close viewer"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="pdf-modal-body">
          {loading ? (
            <div className="pdf-modal-state loading">
              <LoaderCircle className="spin" size={32} />
              <strong>Loading document…</strong>
              <p>Fetching {document.originalName}</p>
            </div>
          ) : error ? (
            <div className="pdf-modal-state error" role="alert">
              <AlertCircle size={36} />
              <strong>Unable to display document</strong>
              <p>{error}</p>
              <button
                type="button"
                className="pdf-retry-btn"
                onClick={handleRetry}
              >
                <RefreshCw size={14} /> Retry loading
              </button>
            </div>
          ) : pdfBlobUrl ? (
            <div className="pdf-viewer-frame-wrapper">
              <iframe
                src={`${pdfBlobUrl}#toolbar=1&navpanes=1`}
                title={document.originalName}
                className="pdf-viewer-frame"
              />
            </div>
          ) : (
            <div className="pdf-modal-state empty">
              <FileText size={32} />
              <strong>No document available</strong>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function PdfViewerModal({ isOpen, onClose, document }) {
  if (!isOpen || !document) return null;
  return <PdfViewerDialog onClose={onClose} document={document} />;
}
