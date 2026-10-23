import { FileUp, FileText } from "lucide-react";

export default function UploadDropzone({ file, onFile, disabled }) {
  const choose = (event) => {
    const selected = event.target.files?.[0];
    if (selected) onFile(selected);
    event.target.value = "";
  };
  const drop = (event) => {
    event.preventDefault();
    if (!disabled && event.dataTransfer.files?.[0])
      onFile(event.dataTransfer.files[0]);
  };
  return (
    <div
      className={file ? "upload-dropzone has-file" : "upload-dropzone"}
      onDragOver={(event) => event.preventDefault()}
      onDrop={drop}
    >
      <input
        id="document-file"
        className="sr-only"
        type="file"
        accept="application/pdf,.pdf"
        onChange={choose}
        disabled={disabled}
      />
      <label htmlFor="document-file" className="dropzone-label">
        <span className="upload-icon">
          {file ? <FileText size={23} /> : <FileUp size={23} />}
        </span>
        {file ? (
          <>
            <strong>{file.name}</strong>
            <span>Ready to upload · choose another file to replace it</span>
          </>
        ) : (
          <>
            <strong>Drop your PDF here</strong>
            <span>
              or <em>browse from your computer</em>
            </span>
          </>
        )}
        <small>PDF only · maximum 4 MB</small>
      </label>
    </div>
  );
}
