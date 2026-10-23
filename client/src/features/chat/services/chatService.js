import { API_BASE_URL } from "../../../services/authService";

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...options.headers,
    },
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(
      data.message || "Something went wrong. Please try again.",
    );
    error.status = response.status;
    throw error;
  }
  return data;
}

export const chatService = {
  listDocuments: () => request("/api/documents"),
  extractDocument: (id) =>
    request(`/api/documents/${id}/extract`, { method: "POST" }),
  embedDocument: (id) =>
    request(`/api/documents/${id}/embed`, { method: "POST" }),
  listConversations: (documentId) =>
    request(`/api/documents/${documentId}/conversations`),
  createConversation: (documentId) =>
    request(`/api/documents/${documentId}/conversations`, { method: "POST" }),
  getMessages: (conversationId, documentId) => {
    const query = documentId ? `?documentId=${encodeURIComponent(documentId)}` : "";
    return request(`/api/documents/conversations/${conversationId}/messages${query}`);
  },
  sendMessage: (conversationId, question, documentId) =>
    request(`/api/documents/conversations/${conversationId}/messages`, {
      method: "POST",
      body: JSON.stringify({
        question,
        documentId,
        responseLength: localStorage.getItem("documind-response-length") || "balanced",
      }),
    }),
  clearAllConversations: () =>
    request("/api/documents/conversations", { method: "DELETE" }),
  deleteConversation: (conversationId, documentId) => {
    const query = documentId ? `?documentId=${encodeURIComponent(documentId)}` : "";
    return request(`/api/documents/conversations/${conversationId}${query}`, {
      method: "DELETE",
    });
  },
  getDocumentFileBlob: async (documentId) => {
    const response = await fetch(`${API_BASE_URL}/api/documents/${documentId}/file`, {
      credentials: "include",
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const error = new Error(
        errorData.message || "Failed to load document file."
      );
      error.status = response.status;
      throw error;
    }
    return await response.blob();
  },
  getDocumentFileUrl: (documentId) => `${API_BASE_URL}/api/documents/${documentId}/file`,
};
