import {
  ArrowUpRight,
  FileUp,
  History,
  LoaderCircle,
  LogOut,
  MessageCircle,
  Plus,
  Settings,
  Sparkles,
  X,
} from 'lucide-react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { Logo } from '../../../components/layout/Navbar'
import useAuth from '../../auth/hooks/useAuth'
import useChatContext from '../../chat/hooks/useChatContext'
import DocumentSelector from '../../chat/components/DocumentSelector'
import ConversationList from '../../chat/components/ConversationList'

const NAV_ITEMS = [
  { to: '/app/chat', label: 'Chat', icon: MessageCircle },
  { to: '/app/upload', label: 'Upload Document', icon: FileUp },
  { to: '/app/history', label: 'Document History', icon: History },
  { to: '/app/settings', label: 'Settings', icon: Settings },
]

export default function AppSidebar({ isOpen = false, onClose }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const isChatRoute = location.pathname.startsWith('/app/chat')

  // Chat context is available when on or near chat route
  const chat = useChatContext()

  const signOut = async () => {
    await logout()
    navigate('/', { replace: true })
  }

  const handleNewConversation = async () => {
    if (chat?.startNewConversation) {
      await chat.startNewConversation()
      onClose?.()
    }
  }

  const handleDeleteConversation = async (conversation) => {
    const title = conversation.title || 'New Chat'
    if (window.confirm(`Delete conversation "${title}"?`)) {
      await chat?.removeConversation(conversation.id)
    }
  }

  return (
    <aside className={`shared-sidebar ${isOpen ? 'mobile-open' : ''}`}>
      {/* 1. Brand Logo Header */}
      <div className="shared-sidebar-header">
        <Logo />
        {onClose && (
          <button
            type="button"
            className="sidebar-close-btn"
            aria-label="Close navigation sidebar"
            onClick={onClose}
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* 2. Main Navigation Links */}
      <nav className="shared-nav-links" aria-label="Main application navigation">
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `shared-nav-link ${isActive ? 'active' : ''}`
            }
            onClick={onClose}
          >
            <Icon size={16} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* 3. Subtle Separator */}
      <div className="shared-sidebar-divider" />

      {/* 4. Middle Section */}
      {isChatRoute && chat ? (
        <>
          {/* Chat action: + New Chat */}
          <div className="sidebar-chat-action">
            <button
              type="button"
              className="new-chat-btn"
              onClick={handleNewConversation}
              disabled={!chat.selectedDocument || chat.processing}
            >
              <Plus size={16} />
              <span>New Chat</span>
            </button>
          </div>

          {/* Current document selector */}
          <div className="sidebar-chat-controls">
            {chat.documentLoading ? (
              <div className="sidebar-loading-state">
                <LoaderCircle className="spin" size={16} />
                <span>Loading documents…</span>
              </div>
            ) : chat.documents.length > 0 ? (
              <>
                <div className="sidebar-section-header">
                  <span className="sidebar-section-title">Current Document</span>
                </div>
                <DocumentSelector
                  documents={chat.documents}
                  selectedDocument={chat.selectedDocument}
                  onSelect={(doc) => {
                    chat.selectDocument(doc)
                    onClose?.()
                  }}
                />

                <div className="sidebar-section-header recent-chats-header">
                  <span className="sidebar-section-title">Recent Chats</span>
                  <button
                    type="button"
                    className="section-sub-action"
                    onClick={handleNewConversation}
                    disabled={!chat.selectedDocument || chat.processing}
                  >
                    + New
                  </button>
                </div>
              </>
            ) : (
              <div className="sidebar-no-documents">
                <FileUp size={20} />
                <strong>No documents yet</strong>
                <p>Upload a PDF to start chatting with your knowledge base.</p>
                <Link
                  to="/app/upload"
                  className="sidebar-upload-link"
                  onClick={onClose}
                >
                  Upload document <ArrowUpRight size={13} />
                </Link>
              </div>
            )}
          </div>

          {/* Independently Scrollable Conversations Area */}
          <div className="sidebar-scrollable-body">
            {chat.documents.length > 0 && (
              <ConversationList
                conversations={chat.conversations}
                activeConversation={chat.activeConversation}
                onOpen={(conv) => {
                  chat.openConversation(conv)
                  onClose?.()
                }}
                onDelete={handleDeleteConversation}
              />
            )}
          </div>
        </>
      ) : (
        /* Non-chat routes: Informational promotional card in the middle */
        <div className="sidebar-info-body">
          <div className="sidebar-promo-card">
            <div className="promo-card-icon">
              <Sparkles size={16} />
            </div>
            <div className="promo-card-content">
              <strong>Smart Research Workspace</strong>
              <p>Keep your PDFs indexed, searchable, and always ready for source-backed chat.</p>
            </div>
          </div>
        </div>
      )}

      {/* 5. Fixed Anchored Account Footer at the Bottom */}
      <div className="shared-sidebar-account">
        <div className="account-avatar-wrapper" aria-hidden="true">
          {user?.name?.slice(0, 1).toUpperCase() || 'U'}
        </div>
        <div className="account-text-info">
          <strong
            className="account-user-name"
            title={user?.name || 'Your account'}
          >
            {user?.name || 'Your account'}
          </strong>
          <span
            className="account-user-email"
            title={user?.email || ''}
          >
            {user?.email || 'Authenticated user'}
          </span>
        </div>
        <button
          type="button"
          className="account-logout-btn"
          aria-label="Sign out"
          title="Sign out"
          onClick={signOut}
        >
          <LogOut size={16} />
        </button>
      </div>
    </aside>
  )
}
