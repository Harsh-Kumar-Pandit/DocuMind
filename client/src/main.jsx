import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/globals.css'
import './features/landing/styles/landing.css'
import './features/auth/styles/auth.css'
import './features/app/styles/app.css'
import './features/upload/styles/upload.css'
import './features/upload/styles/upload-overrides.css'
import './features/chat/styles/chat.css'
import './features/chat/styles/document-selector.css'
import App from './app/App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
