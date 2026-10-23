import {
  Bot,
  LogOut,
  Settings as SettingsIcon,
  ShieldCheck,
  Trash2,
  UserRound,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../auth/hooks/useAuth";
import { chatService } from "../../chat/services/chatService";
import "../styles/settings.css";

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [responseLength, setResponseLength] = useState(
    () => localStorage.getItem("documind-response-length") || "balanced"
  );
  const [clearing, setClearing] = useState(false);
  const [notice, setNotice] = useState("");

  const saveResponseLength = (value) => {
    setResponseLength(value);
    localStorage.setItem("documind-response-length", value);
    setNotice("AI response preference saved.");
    setTimeout(() => setNotice(""), 2200);
  };

  const clearHistory = async () => {
    if (!window.confirm("Delete all conversations and chat messages? This cannot be undone.")) return;
    setClearing(true);
    setNotice("");
    try {
      const result = await chatService.clearAllConversations();
      setNotice(`${result.deleted || 0} conversation(s) cleared.`);
    } catch (error) {
      setNotice(error.message || "Could not clear chat history.");
    } finally {
      setClearing(false);
    }
  };

  const signOut = async () => {
    await logout();
    navigate("/", { replace: true });
  };

  return (
    <div className="settings-page">
      {/* Header */}
      <div className="settings-page-header">
        <div className="settings-header-copy">
          <span className="settings-eyebrow">
            <SettingsIcon size={14} /> Workspace preferences
          </span>
          <h1>Settings</h1>
          <p>Manage your authenticated DocuMind session and account profile.</p>
        </div>
      </div>

      {/* Grid */}
      <div className="settings-grid">
        <section className="settings-card">
          <div className="settings-section-heading">
            <div className="settings-section-icon"><Bot size={18} /></div>
            <div><h2>AI Preferences</h2><p>Choose how detailed DocuMind answers should be.</p></div>
          </div>
          <label className="settings-select-label" htmlFor="response-length">Response length</label>
          <select id="response-length" className="settings-select" value={responseLength} onChange={(event) => saveResponseLength(event.target.value)}>
            <option value="concise">Concise</option>
            <option value="balanced">Balanced</option>
            <option value="detailed">Detailed</option>
          </select>
        </section>

        <section className="settings-card">
          <div className="settings-section-heading">
            <div className="settings-section-icon"><Trash2 size={18} /></div>
            <div><h2>Chat History</h2><p>Remove all saved conversations from your workspace.</p></div>
          </div>
          <button className="settings-danger-btn" type="button" onClick={clearHistory} disabled={clearing}>
            <Trash2 size={16} /> <span>{clearing ? "Clearing..." : "Clear all chat history"}</span>
          </button>
          {notice && <p className="settings-notice" role="status">{notice}</p>}
        </section>

        {/* Account Info Card */}
        <section className="settings-card">
          <div className="settings-section-heading">
            <div className="settings-section-icon">
              <UserRound size={18} />
            </div>
            <div>
              <h2>Account Information</h2>
              <p>
                Your profile is linked to this authenticated workspace session.
              </p>
            </div>
          </div>

          <div className="account-details-list">
            <div className="account-detail-row">
              <span className="detail-label">Full Name</span>
              <strong className="detail-value">{user?.name || "—"}</strong>
            </div>

            <div className="account-detail-row">
              <span className="detail-label">Email Address</span>
              <strong className="detail-value">{user?.email || "—"}</strong>
            </div>

            <div className="account-detail-row">
              <span className="detail-label">Workspace Access</span>
              <strong className="detail-value">
                Personal Workspace (Owner)
              </strong>
            </div>
          </div>
        </section>

        {/* Session Card */}
        <section className="settings-card">
          <div className="settings-section-heading">
            <div className="settings-section-icon">
              <ShieldCheck size={18} />
            </div>
            <div>
              <h2>Session & Security</h2>
              <p>
                Sign out of this browser and safely return to the landing page.
              </p>
            </div>
          </div>

          <div className="session-card-body">
            <p className="session-description">
              Signing out terminates your current cookie-based session token.
              All your uploaded documents, embeddings, and conversation
              histories remain safely stored in your account.
            </p>

            <button
              className="settings-logout-btn"
              type="button"
              onClick={signOut}
            >
              <LogOut size={16} />
              <span>Sign out of workspace</span>
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
