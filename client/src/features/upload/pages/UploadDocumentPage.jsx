import {
  ArrowRight,
  CheckCircle2,
  FileCheck2,
  Info,
  LoaderCircle,
  RefreshCw,
  ShieldCheck,
  UploadCloud,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import useChatContext from "../../chat/hooks/useChatContext";
import UploadDropzone from "../components/UploadDropzone";
import SelectedFile from "../components/SelectedFile";
import {
  embedDocument,
  extractDocument,
  uploadDocument,
} from "../services/uploadService";

const MAX_FILE_SIZE = 4 * 1024 * 1024;

function validateFile(file) {
  if (!file) return "Choose a PDF to upload.";
  if (
    file.type !== "application/pdf" ||
    !file.name.toLowerCase().endsWith(".pdf")
  ) {
    return "Only PDF files are allowed.";
  }
  if (file.size > MAX_FILE_SIZE) {
    return "PDF must be 4 MB or smaller.";
  }
  return "";
}

const STAGES = [
  { id: 1, key: "select", title: "Select PDF", desc: "Choose a document" },
  { id: 2, key: "upload", title: "Upload PDF", desc: "Secure transfer" },
  {
    id: 3,
    key: "extract",
    title: "Extract text",
    desc: "Parse content & pages",
  },
  {
    id: 4,
    key: "embed",
    title: "Generate embeddings",
    desc: "Vectorize knowledge",
  },
  { id: 5, key: "confirm", title: "Ready to chat", desc: "Confirmed complete" },
];

export default function UploadDocumentPage() {
  const chat = useChatContext();
  const [file, setFile] = useState(null);
  const [fileError, setFileError] = useState("");
  const [activeStep, setActiveStep] = useState(1); // 1 to 5
  const [stageDescription, setStageDescription] = useState("");
  const [serverError, setServerError] = useState("");
  const [failedStep, setFailedStep] = useState(null); // 'upload' | 'extract' | 'embed'
  const [uploadedDocument, setUploadedDocument] = useState(null);
  const [readyDocument, setReadyDocument] = useState(null);
  const [busy, setBusy] = useState(false);

  const chooseFile = (nextFile) => {
    const error = validateFile(nextFile);
    setFileError(error);
    setServerError("");
    setFailedStep(null);
    setUploadedDocument(null);
    setReadyDocument(null);
    setActiveStep(1);
    if (!error) {
      setFile(nextFile);
    } else {
      setFile(null);
    }
  };

  const prepare = async (doc) => {
    setBusy(true);
    setServerError("");
    setFailedStep(null);

    try {
      // Step 3: Extract text
      setActiveStep(3);
      setStageDescription("Extracting text and structure from your PDF…");
      const extraction = await extractDocument(doc.id);

      // Step 4: Generate embeddings
      setActiveStep(4);
      setStageDescription("Generating vector embeddings for semantic search…");
      await embedDocument(doc.id);

      // Step 5: Save and confirm readiness
      setActiveStep(5);
      setStageDescription("Saving and confirming workspace readiness…");

      const completed = {
        ...doc,
        status: "COMPLETED",
        pageCount: extraction.pageCount,
        chunkCount: extraction.chunkCount,
      };
      setReadyDocument(completed);
      chat?.reloadDocuments?.();
    } catch (requestError) {
      setServerError(
        requestError.message || "Processing failed. Please retry.",
      );
      setFailedStep(activeStep === 3 ? "extract" : "embed");
    } finally {
      setBusy(false);
      setStageDescription("");
    }
  };

  const submit = async (event) => {
    event.preventDefault();
    const error = validateFile(file);
    if (error) return setFileError(error);

    setBusy(true);
    setServerError("");
    setFailedStep(null);

    try {
      // Step 2: Upload PDF
      setActiveStep(2);
      setStageDescription("Uploading PDF to your secure workspace…");
      const result = await uploadDocument(file);
      const doc = result.document;
      setUploadedDocument(doc);
      setFile(null);

      // Continue directly to extraction & embeddings
      await prepare(doc);
    } catch (requestError) {
      setServerError(
        requestError.message ||
          "Upload failed. Please check the file and try again.",
      );
      setFailedStep("upload");
      setBusy(false);
    }
  };

  const handleRetry = () => {
    if (uploadedDocument) {
      prepare(uploadedDocument);
    } else if (file) {
      submit(new Event("submit"));
    }
  };

  const reset = () => {
    setFile(null);
    setFileError("");
    setServerError("");
    setFailedStep(null);
    setUploadedDocument(null);
    setReadyDocument(null);
    setActiveStep(1);
    setStageDescription("");
    setBusy(false);
  };

  const isCompleted = Boolean(readyDocument);

  return (
    <div className="upload-page">
      <div className="upload-heading">
        <div>
          <span className="upload-eyebrow">
            <UploadCloud size={14} /> Add to your workspace
          </span>
          <h1>Upload a document</h1>
          <p>
            Bring a PDF into DocuMind and get it ready for focused,
            source-backed work.
          </p>
        </div>
        <div className="upload-heading-mark">
          <FileCheck2 size={24} />
          <span>Private by default</span>
        </div>
      </div>

      {/* Multi-stage process breadcrumb / stepper */}
      <div className="upload-stepper-card">
        <div className="upload-stepper">
          {STAGES.map((s) => {
            const isDone = isCompleted || activeStep > s.id;
            const isCurrent = !isCompleted && activeStep === s.id && busy;
            return (
              <div
                key={s.id}
                className={`stepper-step ${isDone ? "completed" : ""} ${isCurrent ? "active" : ""}`}
              >
                <div className="stepper-step-indicator">
                  {isDone ? (
                    <CheckCircle2 size={16} />
                  ) : isCurrent ? (
                    <LoaderCircle size={16} className="spin" />
                  ) : (
                    <span>{s.id}</span>
                  )}
                </div>
                <div className="stepper-step-text">
                  <strong>{s.title}</strong>
                  <small>{s.desc}</small>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="upload-grid">
        <section className="upload-card">
          <div className="card-title">
            <span className="card-step">01</span>
            <div>
              <h2>
                {isCompleted ? "Processing complete" : "Upload and index PDF"}
              </h2>
              <p>
                {isCompleted
                  ? "Your document is fully prepared for AI chat."
                  : "Files are processed in real stages: upload, text extraction, and vector embedding."}
              </p>
            </div>
          </div>

          {isCompleted ? (
            <div className="upload-success" role="status">
              <CheckCircle2 size={32} className="success-icon" />
              <div className="success-content">
                <strong>{readyDocument.originalName} is ready to chat</strong>
                <p>
                  Text extraction and vector embeddings finished successfully
                  {readyDocument.pageCount
                    ? ` across ${readyDocument.pageCount} page${readyDocument.pageCount === 1 ? "" : "s"}`
                    : ""}
                  {readyDocument.chunkCount
                    ? ` with ${readyDocument.chunkCount} searchable passage${readyDocument.chunkCount === 1 ? "" : "s"}`
                    : ""}
                  .
                </p>
                <div className="success-actions">
                  <Link
                    className="upload-chat-link"
                    to={`/app/chat?document=${readyDocument.id}`}
                  >
                    Chat with this document <ArrowRight size={15} />
                  </Link>
                  <button
                    className="secondary-action"
                    type="button"
                    onClick={reset}
                  >
                    Upload another document
                  </button>
                </div>
              </div>
            </div>
          ) : uploadedDocument && busy ? (
            <div className="upload-processing" role="status">
              <LoaderCircle className="spin" size={24} />
              <div className="processing-content">
                <strong>{uploadedDocument.originalName}</strong>
                <span>{stageDescription || "Preparing your document…"}</span>
              </div>
            </div>
          ) : (
            <form onSubmit={submit}>
              <UploadDropzone file={file} onFile={chooseFile} disabled={busy} />

              {file && (
                <SelectedFile
                  file={file}
                  onRemove={() => setFile(null)}
                  uploading={busy}
                />
              )}

              {fileError && (
                <div className="upload-error" role="alert">
                  {fileError}
                </div>
              )}

              {serverError && (
                <div className="upload-error" role="alert">
                  <strong>Error: </strong> {serverError}
                </div>
              )}

              {busy && (
                <div className="upload-progress" role="status">
                  <span>{stageDescription}</span>
                  <div>
                    <i />
                  </div>
                </div>
              )}

              {serverError && failedStep && (
                <button
                  className="secondary-action retry-btn"
                  type="button"
                  onClick={handleRetry}
                  disabled={busy}
                >
                  <RefreshCw size={14} /> Retry{" "}
                  {failedStep === "upload" ? "Upload" : "Preparation"}
                </button>
              )}

              <button
                className="upload-submit"
                type="submit"
                disabled={!file || busy}
              >
                {busy ? (
                  <>
                    <LoaderCircle className="spin" size={17} />
                    Processing document…
                  </>
                ) : (
                  <>
                    Upload document <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>
          )}

          {!isCompleted && uploadedDocument && !busy && serverError && (
            <button className="secondary-action" type="button" onClick={reset}>
              Start over with another document
            </button>
          )}
        </section>

        <aside className="upload-info">
          <div className="info-heading">
            <Info size={17} />
            <h2>Before you upload</h2>
          </div>
          <ul>
            <li>
              <span>
                <CheckCircle2 size={15} />
              </span>
              <div>
                <strong>PDF files only</strong>
                <small>
                  Other file formats are not accepted by the indexing API.
                </small>
              </div>
            </li>
            <li>
              <span>
                <CheckCircle2 size={15} />
              </span>
              <div>
                <strong>Up to 4 MB</strong>
                <small>Keep your PDF document within the backend limits.</small>
              </div>
            </li>
            <li>
              <span>
                <ShieldCheck size={15} />
              </span>
              <div>
                <strong>Private to your account</strong>
                <small>
                  Documents and vectors are accessible only in your session.
                </small>
              </div>
            </li>
          </ul>
          <div className="upload-info-footer">
            Your document is stored first, followed by chunk extraction and
            vector embedding before chat is unlocked.
          </div>
        </aside>
      </div>
    </div>
  );
}
