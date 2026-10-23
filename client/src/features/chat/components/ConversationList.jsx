import { MessageCircle, Trash2 } from 'lucide-react'

function formatDate(date) {
  if (!date) return ''
  return new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
  }).format(new Date(date))
}

export default function ConversationList({
  conversations,
  activeConversation,
  onOpen,
  onDelete,
}) {
  if (!conversations || conversations.length === 0) {
    return (
      <div className="conversations-empty">
        <MessageCircle size={18} />
        <p>No conversations yet. Ask a question or start a new chat.</p>
      </div>
    )
  }

  return (
    <div className="conversations-scrollable-list">
      {conversations.map((conversation) => {
        const isActive = activeConversation?.id === conversation.id
        return (
          <div
            key={conversation.id}
            className={`conversation-item ${isActive ? 'active' : ''}`}
          >
            <button
              type="button"
              className="conversation-item-btn"
              onClick={() => onOpen(conversation)}
            >
              <MessageCircle size={14} className="conversation-item-icon" />
              <div className="conversation-item-text">
                <span className="conversation-item-title">
                  {conversation.title || 'New Chat'}
                </span>
                <span className="conversation-item-date">
                  {formatDate(conversation.updatedAt || conversation.createdAt)}
                </span>
              </div>
            </button>

            <button
              type="button"
              className="delete-conversation-btn"
              aria-label={`Delete conversation ${conversation.title || 'New Chat'}`}
              title="Delete conversation"
              onClick={(e) => {
                e.stopPropagation()
                onDelete(conversation)
              }}
            >
              <Trash2 size={13} />
            </button>
          </div>
        )
      })}
    </div>
  )
}
