import { Menu } from 'lucide-react'
import { Outlet, useLocation } from 'react-router-dom'
import { useState } from 'react'
import useAuth from '../../auth/hooks/useAuth'
import AppSidebar from './AppSidebar'
import { ChatProvider } from '../../chat/context/ChatContext'
import '../styles/app.css'
import '../styles/shell-overrides.css'

const pageTitles = {
  '/app/chat': 'Chat',
  '/app/upload': 'Upload Document',
  '/app/history': 'Document History',
  '/app/settings': 'Settings',
}

export default function AppShell() {
  return (
    <ChatProvider>
      <AppShellInner />
    </ChatProvider>
  )
}

function AppShellInner() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { user } = useAuth()
  const location = useLocation()
  const isChatRoute = location.pathname.startsWith('/app/chat')

  const currentPageLabel = pageTitles[location.pathname] || 'Workspace'

  return (
    <div className={`app-shell ${isChatRoute ? 'is-chat-page' : ''}`}>
      {/* Mobile drawer backdrop overlay */}
      <div
        className={`app-mobile-backdrop ${mobileMenuOpen ? 'open' : ''}`}
        onClick={() => setMobileMenuOpen(false)}
        aria-hidden="true"
      />

      {/* 1. Shared Unified Sidebar across all workspace routes */}
      <AppSidebar
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />

      {/* 2. Main Content Wrapper */}
      <div className="app-main">
        {/* Standard top header on non-chat routes; Chat has its own dedicated document header */}
        {!isChatRoute && (
          <header className="app-topbar">
            <div className="topbar-left">
              <button
                className="topbar-sidebar-toggle"
                type="button"
                aria-label="Open navigation menu"
                onClick={() => setMobileMenuOpen(true)}
              >
                <Menu size={20} />
              </button>
              <div className="topbar-breadcrumb">
                <span>Workspace</span>
                <span className="breadcrumb-slash">/</span>
                <strong>{currentPageLabel}</strong>
              </div>
            </div>

            <div className="topbar-right">
              <span className="online-dot" aria-hidden="true" />
              <span className="topbar-user-name">{user?.name || 'Account'}</span>
            </div>
          </header>
        )}

        <main className={`app-content ${isChatRoute ? 'app-content-chat' : ''}`}>
          <Outlet context={{ setMobileMenuOpen }} />
        </main>
      </div>
    </div>
  )
}
