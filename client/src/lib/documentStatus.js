export const DocumentStatus = {
  UPLOADED: "UPLOADED",
  PROCESSING: "PROCESSING",
  COMPLETED: "COMPLETED",
  FAILED: "FAILED",
};

export function normalizeStatus(status) {
  if (!status) return "UNKNOWN";
  const upper = String(status).toUpperCase().trim();
  if (Object.values(DocumentStatus).includes(upper)) {
    return upper;
  }
  return upper;
}

export function isDocumentReady(document) {
  if (!document) return false;
  return normalizeStatus(document.status) === DocumentStatus.COMPLETED;
}

export function isDocumentProcessing(document) {
  if (!document) return false;
  return normalizeStatus(document.status) === DocumentStatus.PROCESSING;
}

export function isDocumentFailed(document) {
  if (!document) return false;
  return normalizeStatus(document.status) === DocumentStatus.FAILED;
}

export function getStatusBadgeClass(status) {
  const norm = normalizeStatus(status);
  switch (norm) {
    case DocumentStatus.COMPLETED:
      return "status-badge-complete";
    case DocumentStatus.PROCESSING:
      return "status-badge-processing";
    case DocumentStatus.FAILED:
      return "status-badge-failed";
    case DocumentStatus.UPLOADED:
      return "status-badge-uploaded";
    default:
      return "status-badge-default";
  }
}
