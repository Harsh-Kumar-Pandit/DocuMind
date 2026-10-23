import {
  Eye,
  FileText,
  LoaderCircle,
  MessageCircle,
  RefreshCw,
  Search,
  UploadCloud,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { API_BASE_URL } from "../../../services/authService";
import {
  getStatusBadgeClass,
  normalizeStatus,
} from "../../../lib/documentStatus";
import PdfViewerModal from "../../chat/components/PdfViewerModal";
import "../styles/history.css";

async function listDocuments() {
  const response = await fetch(`${API_BASE_URL}/api/documents`, {
    credentials: "include",
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(
      data.message || data.error || "Could not load your documents.",
    );
  }
  return data.documents || [];
}

function formatSize(bytes) {
  if (!bytes) return "—";
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function formatDate(value) {
  if (!value) return "Date unavailable";
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export default function DocumentHistoryPage() {
  const [documents, setDocuments] = useState([]);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [viewingDoc, setViewingDoc] = useState(null);

  useEffect(() => {
    let ignore = false;

    async function fetchDocs() {
      try {
        const docs = await listDocuments();
        if (!ignore) {
          setDocuments(docs);
          setLoading(false);
        }
      } catch (err) {
        if (!ignore) {
          setError(err.message || "Could not load your documents.");
          setLoading(false);
        }
      }
    }

    fetchDocs();

    return () => {
      ignore = true;
    };
  }, []);

  const reload = async () => {
    setLoading(true);
    setError("");
    try {
      const docs = await listDocuments();
      setDocuments(docs);
    } catch (err) {
      setError(err.message || "Could not load your documents.");
    } finally {
      setLoading(false);
    }
  };

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return documents.filter((doc) => {
      const matchesQuery = q
        ? doc.originalName?.toLowerCase().includes(q)
        : true;
      const normStatus = normalizeStatus(doc.status);
      const matchesFilter = filter === "ALL" || normStatus === filter;
      return matchesQuery && matchesFilter;
    });
  }, [documents, filter, query]);

  return (
    <div className="history-page">
      {/* 1. Page Header */}
      <div className="history-page-header">
        <div className="history-header-copy">
          <span className="history-eyebrow">
            <FileText size={14} /> Workspace library
          </span>
          <h1>Your documents</h1>
          <p>
            Browse, search, and jump back into source-backed chat with any PDF
            in your workspace.
          </p>
        </div>

        <Link className="history-upload-btn" to="/app/upload">
          <UploadCloud size={16} />
          <span>Upload document</span>
        </Link>
      </div>

      {/* 2. Wide Document Library Card */}
      <section className="history-library-panel">
        {/* Toolbar */}
        <div className="history-toolbar">
          <div className="history-search-wrapper">
            <Search size={16} className="search-icon" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search documents by name…"
              aria-label="Search documents by name"
            />
            {query && (
              <button
                type="button"
                className="clear-search-btn"
                onClick={() => setQuery("")}
                aria-label="Clear search"
              >
                <X size={14} />
              </button>
            )}
          </div>

          <div className="history-filter-wrapper">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              aria-label="Filter documents by status"
            >
              <option value="ALL">All statuses</option>
              <option value="COMPLETED">Completed</option>
              <option value="PROCESSING">Processing</option>
              <option value="UPLOADED">Uploaded</option>
              <option value="FAILED">Failed</option>
            </select>
          </div>

          {!loading && !error && (
            <div className="history-results-count">
              {filtered.length}{" "}
              {filtered.length === 1 ? "document" : "documents"}
            </div>
          )}
        </div>

        {/* Content list / Loading / Error / Empty States */}
        {loading ? (
          <div className="history-state-box loading">
            <LoaderCircle className="spin" size={24} />
            <p>Loading your document library…</p>
          </div>
        ) : error ? (
          <div className="history-state-box error" role="alert">
            <p>{error}</p>
            <button
              type="button"
              onClick={reload}
              className="history-retry-btn"
            >
              <RefreshCw size={14} /> Retry loading
            </button>
          </div>
        ) : filtered.length > 0 ? (
          <div className="history-document-list">
            {filtered.map((doc) => {
              const statusStr = normalizeStatus(doc.status);
              const badgeClass = getStatusBadgeClass(statusStr);
              const isCompleted = statusStr === "COMPLETED";

              return (
                <article className="history-document-row" key={doc.id}>
                  <div className="doc-row-icon">
                    <FileText size={20} />
                  </div>

                  <div className="doc-row-details">
                    <strong className="doc-row-name" title={doc.originalName}>
                      {doc.originalName}
                    </strong>
                    <div className="doc-row-meta">
                      <span>{formatSize(doc.size)}</span>
                      <span className="doc-row-dot">·</span>
                      <span>Added {formatDate(doc.createdAt)}</span>
                    </div>
                  </div>

                  <div className="doc-row-status">
                    <span className={`doc-status-badge ${badgeClass}`}>
                      <span className="status-dot" />
                      {statusStr}
                    </span>
                  </div>

                  <div className="doc-row-actions">
                    <button
                      type="button"
                      className="doc-view-btn"
                      onClick={() => setViewingDoc(doc)}
                      title="View PDF document"
                    >
                      <Eye size={14} />
                      <span>View</span>
                    </button>
                    {isCompleted ? (
                      <Link
                        className="doc-chat-btn"
                        to={`/app/chat?document=${doc.id}`}
                      >
                        <MessageCircle size={15} />
                        <span>Chat</span>
                      </Link>
                    ) : (
                      <span
                        className="doc-chat-btn disabled"
                        title="Processing must complete before chat is ready"
                      >
                        Not ready
                      </span>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="history-state-box empty">
            <FileText size={36} className="empty-icon" />
            <h2>
              {documents.length > 0
                ? "No matching documents"
                : "Your library is empty"}
            </h2>
            <p>
              {documents.length > 0
                ? "Try a different search query or change the status filter."
                : "Upload your first PDF document to start questioning and exploring it with AI."}
            </p>
            {documents.length === 0 && (
              <Link className="history-upload-btn" to="/app/upload">
                <UploadCloud size={16} />
                <span>Upload a PDF</span>
              </Link>
            )}
          </div>
        )}
      </section>

      <PdfViewerModal
        isOpen={Boolean(viewingDoc)}
        onClose={() => setViewingDoc(null)}
        document={viewingDoc}
      />
    </div>
  );
}
