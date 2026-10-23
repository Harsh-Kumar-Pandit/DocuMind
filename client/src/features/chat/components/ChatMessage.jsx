import { Bot, Sparkles, User } from 'lucide-react'
import SourceCitation from './SourceCitation'
import MarkdownRenderer from '../../../components/ui/MarkdownRenderer'

export default function ChatMessage({ message }) {
  const isAssistant = message.role === 'ASSISTANT'
  const sources = Array.isArray(message.sources) ? message.sources : []

  return (
    <article className={`chat-message ${isAssistant ? 'assistant' : 'user'}`}>
      <div className="message-avatar" aria-hidden="true">
        {isAssistant ? <Sparkles size={15} /> : <User size={15} />}
      </div>

      <div className="message-body">
        <div className="message-meta">
          {isAssistant ? (
            <span className="meta-author">
              <Bot size={13} />
              DocuMind AI
            </span>
          ) : (
            <span className="meta-author">You</span>
          )}
        </div>

        <div className="message-content">
          {isAssistant ? (
            <MarkdownRenderer content={message.content} />
          ) : (
            <div className="user-message-text">{message.content}</div>
          )}
        </div>

        {isAssistant && sources.length > 0 && (
          <div className="source-citations-container">
            <div className="source-citations-title">
              Sources from your document ({sources.length})
            </div>
            <div className="source-citations-grid">
              {sources.map((source, index) => (
                <SourceCitation
                  key={`${source.chunkIndex ?? index}-${source.pageNumber ?? 'na'}-${index}`}
                  source={source}
                  index={index}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  )
}
