import {
  LogOut,
  Settings as SettingsIcon,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../auth/hooks/useAuth";
import "../styles/settings.css";

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

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
