import { useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import LandingPage from "../features/landing/pages/LandingPage";
import SignInPage from "../features/auth/pages/SignInPage";
import SignUpPage from "../features/auth/pages/SignUpPage";
import { AuthProvider } from "../features/auth/context/AuthContext";
import AppShell from "../features/app/components/AppShell";
import ProtectedRoute from "../features/app/components/ProtectedRoute";
import PublicOnlyRoute from "../features/app/components/PublicOnlyRoute";
import UploadDocumentPage from "../features/upload/pages/UploadDocumentPage";
import ChatPage from "../features/chat/pages/ChatPage";
import DocumentHistoryPage from "../features/history/pages/DocumentHistoryPage";
import SettingsPage from "../features/settings/pages/SettingsPage";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

function AppRoutes() {
  const [dark, setDark] = useState(false);
  return (
    <Routes>
      <Route element={<PublicOnlyRoute />}>
        <Route path="/" element={<div className={dark ? "app dark" : "app"} id="top"><LandingPage dark={dark} setDark={setDark} /></div>} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/signup" element={<SignUpPage />} />
      </Route>
      <Route element={<ProtectedRoute />}>
        <Route path="/app" element={<AppShell />}>
          <Route index element={<Navigate to="chat" replace />} />
          <Route path="upload" element={<UploadDocumentPage />} />
          <Route path="chat" element={<ChatPage />} />
          <Route path="history" element={<DocumentHistoryPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
