import { useEffect, useRef } from 'react'
import { BookOpen, Sparkles } from 'lucide-react'
import ChatMessage from './ChatMessage'

export default function MessageList({
  messages,
  loading,
  ready,
  documentName,
}) {
  const bottomRef = useRef(null)

  // Auto-scroll to bottom on message updates
  useEffect(() => {
    if (!loading && messages?.length > 0) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, loading])

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

  if (!messages || messages.length === 0) {
    return (
      <div className="message-list-container empty">
        <div className="chat-empty-state">
          <div className="empty-state-icon">
            <BookOpen size={28} />
          </div>
          <h2>Ask your document anything</h2>
          <p>
            {ready
              ? `Ask questions, extract summaries, or query specific facts from ${documentName || 'your document'}. Answers are backed by retrieved document sources.`
              : 'Your document is preparing. Once ready, you can query and explore its contents with AI.'}
          </p>
          <div className="empty-state-hints">
            <span className="hint-pill">
              <Sparkles size={12} /> Source citations included
            </span>
            <span className="hint-pill">
              <BookOpen size={12} /> Semantic document search
            </span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="message-list-container">
      <div className="message-list-inner">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
        <div ref={bottomRef} className="messages-bottom-anchor" />
      </div>
    </div>
  )
}
