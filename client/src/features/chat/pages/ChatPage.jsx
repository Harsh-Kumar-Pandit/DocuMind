import { AlertCircle, RefreshCw } from "lucide-react";
import { useRef, useState } from "react";
import { useOutletContext } from "react-router-dom";
import ChatHeader from "../components/ChatHeader";
import MessageList from "../components/MessageList";
import ChatComposer from "../components/ChatComposer";
import DocumentContext from "../components/DocumentContext";
import PdfViewerModal from "../components/PdfViewerModal";
import useChatContext from "../hooks/useChatContext";

export default function ChatPage() {
  const chat = useChatContext();
  const { setMobileMenuOpen } = useOutletContext() || {};
  const [contextOpen, setContextOpen] = useState(false);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const textareaRef = useRef(null);

  const handleQuickQuestion = (question) => {
    setDraft(question);
    if (contextOpen) {
      setContextOpen(false);
    }
    requestAnimationFrame(() => {
      const textarea = textareaRef.current;
      if (textarea) {
        textarea.focus();
        textarea.setSelectionRange(question.length, question.length);
        textarea.style.height = "auto";
        textarea.style.height = `${Math.min(textarea.scrollHeight, 140)}px`;
      }
    });
  };

  const handleRetryProcessing = () => {
    if (chat?.selectedDocument) {
      chat.retryPreparation(chat.selectedDocument);
    }
  };

  const handleOpenViewer = () => {
    if (chat?.selectedDocument) {
      setViewerOpen(true);
    }
  };

  return (
    <div
      className={`chat-workspace-columns ${contextOpen ? "context-drawer-open" : ""}`}
    >
      {/* Mobile drawer backdrop for context panel */}
      <div
        className="chat-context-mobile-overlay"
        onClick={() => setContextOpen(false)}
        aria-hidden="true"
      />

      {/* Center Chat Column */}
      <section className="chat-main-column">
        <ChatHeader
          document={chat?.selectedDocument}
          processing={chat?.processing}
          ready={chat?.ready}
          error={chat?.processingError}
          onMenu={() => setMobileMenuOpen?.(true)}
          onToggleContext={() => setContextOpen((prev) => !prev)}
          onRetry={handleRetryProcessing}
          onViewDocument={handleOpenViewer}
        />

        {chat?.documentError && (
          <div className="chat-inline-error-banner" role="alert">
            <AlertCircle size={15} />
            <span>{chat.documentError}</span>
            <button type="button" onClick={chat.reloadDocuments}>
              <RefreshCw size={13} /> Retry
            </button>
          </div>
        )}

        {chat?.conversationError && (
          <div className="chat-inline-error-banner" role="alert">
            <AlertCircle size={15} />
            <span>{chat.conversationError}</span>
            <button
              type="button"
              onClick={() => {
                if (chat.activeConversation) {
                  chat.openConversation(chat.activeConversation);
                }
              }}
            >
              <RefreshCw size={13} /> Retry
            </button>
          </div>
        )}

        {/* Scrollable conversation message list (empty state vs real messages) */}
        <MessageList
          messages={chat?.messages}
          loading={chat?.messagesLoading}
          ready={chat?.ready}
          documentName={chat?.selectedDocument?.originalName}
        />

        {/* Anchored composer at bottom */}
        <ChatComposer
          value={draft}
          onChange={setDraft}
          textareaRef={textareaRef}
          disabled={
            !chat?.ready ||
            !chat?.activeConversation ||
            Boolean(chat?.processingError) ||
            chat?.processing
          }
          sending={chat?.sending}
          onSend={chat?.sendMessage}
        />
      </section>

      {/* Right Document Context Panel Column */}
      <DocumentContext
        document={chat?.selectedDocument}
        ready={chat?.ready}
        onAsk={handleQuickQuestion}
        onClose={() => setContextOpen(false)}
        onViewDocument={handleOpenViewer}
        isOpen={contextOpen}
      />

      {/* In-app PDF Viewer Modal */}
      <PdfViewerModal
        isOpen={viewerOpen}
        onClose={() => setViewerOpen(false)}
        document={chat?.selectedDocument}
      />
    </div>
  );
}

