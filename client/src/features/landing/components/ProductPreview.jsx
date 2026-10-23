import {
  BookOpen,
  ChevronDown,
  FileText,
  MessageCircle,
  MoreHorizontal,
  PanelLeft,
  Search,
  Send,
  Sparkles,
  Upload,
} from "lucide-react";

export default function ProductPreview() {
  return (
    <div className="preview-wrap">
      <div className="preview-glow" />
      <div className="product-preview">
        <div className="preview-topbar">
          <div className="mini-brand">
            <span className="logo-mark">
              <Sparkles size={9} />
            </span>
            DocuMind
          </div>
          <div className="topbar-actions">
            <Search size={12} />
            <span className="avatar">JD</span>
            <MoreHorizontal size={14} />
          </div>
        </div>
        <div className="preview-body">
          <aside className="preview-sidebar">
            <div className="sidebar-profile">
              <span className="avatar">JD</span>
              <span>
                <b>Jordan Davis</b>
                <small>Free workspace</small>
              </span>
              <ChevronDown size={12} />
            </div>
            <div className="sidebar-nav">
              <span className="selected">
                <MessageCircle size={13} />
                Chat
              </span>
              <span>
                <Upload size={13} />
                Upload document
              </span>
              <span>
                <FileText size={13} />
                Document history
              </span>
              <span>
                <PanelLeft size={13} />
                Settings
              </span>
            </div>
            <div className="recent-label">
              Recent chats <span className="plus">+</span>
            </div>
            <div className="recent-list">
              <span>Q2 market research</span>
              <span>Project proposal</span>
              <span>Climate report notes</span>
            </div>
          </aside>
          <div className="preview-chat">
            <div className="document-row">
              <div className="pdf-icon">
                <FileText size={15} />
              </div>
              <div>
                <b>Harvard_Research.pdf</b>
                <small>12 pages · Uploaded just now</small>
              </div>
              <span className="status-pill">COMPLETED</span>
            </div>
            <div className="chat-content">
              <div className="chat-eyebrow">
                Chat with your document <span>⌘ K</span>
              </div>
              <div className="user-question">
                What are the main findings of this research?
              </div>
              <div className="answer">
                <div className="answer-head">
                  <span className="ai-spark">
                    <Sparkles size={12} />
                  </span>
                  <b>DocuMind</b>
                  <span>just now</span>
                </div>
                <p>
                  The study finds that remote collaboration improves
                  productivity when teams have clear communication rituals and
                  shared documentation.
                </p>
                <div className="sources">
                  <b>
                    <BookOpen size={11} /> Sources
                  </b>
                  <div>
                    <span>p. 4</span>
                    <span>p. 7</span>
                    <span>p. 9</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="message-box">
              <span>Ask anything about this document...</span>
              <button aria-label="Send message">
                <Send size={13} />
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="preview-caption">
        <span>
          <span className="live-dot" /> Document intelligence, simplified
        </span>
        <span>Built for focused work</span>
      </div>
    </div>
  );
}
