import { API_BASE_URL } from "../../../services/authService";

export async function uploadDocument(file) {
  const formData = new FormData();
  formData.append("file", file);
  const response = await fetch(`${API_BASE_URL}/api/documents/upload`, {
    method: "POST",
    body: formData,
    credentials: "include",
    headers: {
      "x-documind-access-token": localStorage.getItem("documind-access-token") || "",
    },
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok)
    throw new Error(
      data.message || data.error || "Could not upload this document.",
    );
  return data;
}

async function postDocumentStep(id, step, fallback) {
  const response = await fetch(`${API_BASE_URL}/api/documents/${id}/${step}`, {
    method: "POST",
    credentials: "include",
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || data.error || fallback);
  return data;
}

export function extractDocument(id) {
  return postDocumentStep(
    id,
    "extract",
    "Could not extract text from this document.",
  );
}

export function embedDocument(id) {
  return postDocumentStep(
    id,
    "embed",
    "Could not prepare this document for chat.",
  );
}
