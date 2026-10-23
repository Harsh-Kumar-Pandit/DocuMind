import { Check, FileText, X } from "lucide-react";

function formatBytes(bytes) {
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export default function SelectedFile({ file, onRemove, uploading }) {
  return (
    <div className="selected-file">
      <span className="selected-file-icon">
        <FileText size={18} />
      </span>
      <span className="selected-file-meta">
        <strong title={file.name}>{file.name}</strong>
        <small>{formatBytes(file.size)} · PDF document</small>
      </span>
      {uploading ? (
        <span className="file-status uploading">Uploading…</span>
      ) : (
        <>
          <span className="file-status">
            <Check size={14} />
            Ready
          </span>
          <button
            type="button"
            aria-label="Remove selected file"
            onClick={onRemove}
          >
            <X size={17} />
          </button>
        </>
      )}
    </div>
  );
}
