import { useEffect, useRef } from 'react'
import { BookOpen, Bot, Sparkles } from 'lucide-react'
import ChatMessage from './ChatMessage'

export default function MessageList({
  messages,
  loading,
  sending,
  ready,
  documentName,
}) {
  const bottomRef = useRef(null)

  // Auto-scroll to bottom on message updates or when AI is generating
  useEffect(() => {
    if (!loading && (messages?.length > 0 || sending)) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, loading, sending])

  if (loading) {
    return (
      <div className="message-list-container loading">
        <div className="messages-skeleton">
          <div className="skeleton-bubble user" />
          <div className="skeleton-bubble assistant" />
          <div className="skeleton-bubble user" />
        </div>
      </div>
    )
  }

  if ((!messages || messages.length === 0) && !sending) {
    return (
      <div className="message-list-container empty">
        <div className="chat-empty-ambient-glow" aria-hidden="true" />
        <div className="chat-empty-state">
          <div className="empty-state-icon">
            <BookOpen size={28} strokeWidth={2.2} />
          </div>
          <h2>Ask your document anything</h2>
          <p>
            {ready
              ? `Ask questions, extract summaries, or query specific facts from ${documentName || 'your document'}. Answers are backed by retrieved document sources.`
              : 'Your document is preparing. Once ready, you can query and explore its contents with AI.'}
          </p>
          <div className="empty-state-hints">
            <span className="hint-pill">
              <Sparkles size={13} strokeWidth={2.2} /> Source citations included
            </span>
            <span className="hint-pill">
              <BookOpen size={13} strokeWidth={2.2} /> Semantic document search
            </span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="message-list-container">
      <div className="message-list-inner">
        {messages?.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}

        {sending && (
          <article className="chat-message assistant typing-message" aria-live="polite">
            <div className="message-avatar" aria-hidden="true">
              <Sparkles size={15} />
            </div>

            <div className="message-body">
              <div className="message-meta">
                <span className="meta-author">
                  <Bot size={13} />
                  DocuMind AI
                </span>
              </div>

              <div className="message-content typing-content">
                <div className="typing-indicator-wrapper">
                  <div className="typing-dots" aria-hidden="true">
                    <span className="typing-dot" />
                    <span className="typing-dot" />
                    <span className="typing-dot" />
                  </div>
                  <span className="typing-label">DocuMind is thinking…</span>
                </div>
              </div>
            </div>
          </article>
        )}

        <div ref={bottomRef} className="messages-bottom-anchor" />
      </div>
    </div>
  )
}
