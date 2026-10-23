import {
  BarChart3,
  BookOpen,
  Check,
  ChevronDown,
  FileCheck2,
  FileText,
  Lock,
  MessageCircle,
  MoreHorizontal,
  Search,
  Send,
  SlidersHorizontal,
  Sparkles,
  Upload,
} from "lucide-react";

export default function ProductMockup() {
  return (
    <div className="preview-container">
      {/* Ambient background glow behind the mockup */}
      <div className="mockup-glow" />

      {/* Floating 3D translucent paper decorations */}
      <div className="floating-paper paper-1" aria-hidden="true">
        <div className="paper-line w-3/4" />
        <div className="paper-line w-full" />
        <div className="paper-line w-1/2" />
      </div>
      <div className="floating-paper paper-2" aria-hidden="true">
        <div className="paper-line w-full" />
        <div className="paper-line w-2/3" />
        <div className="paper-line w-4/5" />
      </div>
      <div className="floating-paper paper-3" aria-hidden="true">
        <div className="paper-line w-5/6" />
        <div className="paper-line w-1/2" />
      </div>

      {/* Floating badges around the mockup */}
      <div className="floating-badge badge-upload">
        <span className="floating-badge-icon icon-red">
          <FileText size={13} />
        </span>
        <div className="floating-badge-text">
          <b>Upload your PDF</b>
          <span>and start chatting</span>
        </div>
      </div>

      <div className="floating-badge badge-sources">
        <span className="floating-badge-icon icon-green">
          <Check size={13} strokeWidth={2.8} />
        </span>
        <div className="floating-badge-text">
          <b>Source-backed</b>
          <span>answers with citations</span>
        </div>
      </div>

      <div className="floating-badge badge-summaries">
        <span className="floating-badge-icon icon-purple">
          <BarChart3 size={13} />
        </span>
        <div className="floating-badge-text">
          <b>Summaries</b>
          <span>in seconds</span>
        </div>
      </div>

      <div className="floating-badge badge-privacy">
        <span className="floating-badge-icon icon-purple">
          <Lock size={13} />
        </span>
        <div className="floating-badge-text">
          <b>Your data</b>
          <span>stays private</span>
        </div>
      </div>

      {/* The main application window preview */}
      <div className="product-mockup-window">
        {/* App Window Header Bar */}
        <div className="mockup-header">
          <div className="mockup-brand">
            <span className="mockup-logo-mark">
              <Sparkles size={10} strokeWidth={2.5} />
            </span>
            <span className="mockup-brand-name">DocuMind</span>
          </div>
          <div className="mockup-header-actions">
            <button className="header-icon-btn" aria-label="Search" type="button">
              <Search size={13} />
            </button>
            <div className="mockup-avatar-badge" title="Jordan Davis">
              JD
            </div>
            <button className="header-icon-btn" aria-label="More" type="button">
              <MoreHorizontal size={14} />
            </button>
          </div>
        </div>

        {/* App Window Body */}
        <div className="mockup-body">
          {/* Sidebar */}
          <aside className="mockup-sidebar">
            <div className="sidebar-user">
              <div className="sidebar-avatar">JD</div>
              <div className="sidebar-user-meta">
                <span className="user-name">Jordan Davis</span>
                <span className="user-plan">Free workspace</span>
              </div>
              <ChevronDown size={12} className="sidebar-user-arrow" />
            </div>

            <nav className="sidebar-menu">
              <div className="sidebar-item active">
                <MessageCircle size={13} />
                <span>Chat</span>
              </div>
              <div className="sidebar-item">
                <Upload size={13} />
                <span>Upload document</span>
              </div>
              <div className="sidebar-item">
                <FileCheck2 size={13} />
                <span>My documents</span>
              </div>
              <div className="sidebar-item">
                <SlidersHorizontal size={13} />
                <span>Settings</span>
              </div>
            </nav>

            <div className="sidebar-recent-section">
              <div className="recent-header">
                <span>Recent chats</span>
                <button className="recent-plus" type="button" aria-label="New chat">
                  +
                </button>
              </div>
              <div className="recent-items">
                <div className="recent-item">Q2 market research</div>
                <div className="recent-item">Project proposal</div>
                <div className="recent-item">Climate report notes</div>
              </div>
            </div>
          </aside>

          {/* Main Chat Panel */}
          <main className="mockup-chat">
            {/* Document Header Card */}
            <div className="doc-meta-card">
              <div className="doc-icon-wrap">
                <FileText size={15} />
              </div>
              <div className="doc-info">
                <span className="doc-title">Harvard_Research.pdf</span>
                <span className="doc-sub">12 pages · Uploaded just now</span>
              </div>
              <span className="status-badge-completed">COMPLETED</span>
            </div>

            {/* Chat conversation area */}
            <div className="mockup-conversation">
              {/* User question bubble */}
              <div className="chat-bubble user-bubble">
                What are the main findings of this research?
              </div>

              {/* AI Answer Card */}
              <div className="chat-ai-card">
                <div className="ai-card-header">
                  <div className="ai-brand-tag">
                    <span className="ai-spark-icon">
                      <Sparkles size={11} />
                    </span>
                    <span className="ai-name">DocuMind</span>
                  </div>
                  <span className="ai-meta">just now</span>
                </div>
                <p className="ai-paragraph">
                  The study finds that remote collaboration improves productivity
                  when teams have clear communication rituals and shared
                  documentation. Here are the key findings:
                </p>
                <ol className="ai-list">
                  <li>Teams with asynchronous workflows saved 3.5 hrs more productive...</li>
                  <li>Structured documentation reduces meeting fatigue.</li>
                  <li>Clear ownership and documentation lead to higher outreach rates...</li>
                </ol>
                <div className="ai-sources-bar">
                  <span className="sources-label">
                    <BookOpen size={11} /> Sources:
                  </span>
                  <div className="sources-chips">
                    <span className="citation-chip">Page 4</span>
                    <span className="citation-chip">Page 7</span>
                    <span className="citation-chip">Page 9</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom message input box */}
            <div className="mockup-input-bar">
              <span className="mockup-input-placeholder">
                Ask anything about this document...
              </span>
              <button
                className="mockup-send-btn"
                type="button"
                aria-label="Send query"
              >
                <Send size={12} />
              </button>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
