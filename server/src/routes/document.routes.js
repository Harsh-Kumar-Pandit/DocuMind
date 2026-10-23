import { Router } from "express";
import multer from "multer";
import path from "node:path";
import crypto from "node:crypto";
import fs from "node:fs";
import {
  uploadDocument,
  listDocuments,
  getDocumentFile,
} from "../controllers/document.controller.js";
import { extractDocument } from "../controllers/indexing.controller.js";
import { embedDocument } from "../controllers/embedding.controller.js";
import {
  chatWithDocumentController,
} from "../controllers/chat.controller.js";
import {
  createConversation,
  listConversations,
  getConversationMessages,
  deleteConversation,
  deleteAllConversations,
  sendConversationMessage,
} from "../controllers/conversation.controller.js";
import { authenticate } from "../middleware/authenticate.js";

const router = Router();
router.use(authenticate);
const uploadDir = path.resolve("uploads");

fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${crypto.randomUUID()}.pdf`);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 4 * 1024 * 1024,
    files: 1,
  },
  fileFilter: (req, file, cb) => {
    const isPdf =
      file.mimetype === "application/pdf" &&
      path.extname(file.originalname).toLowerCase() === ".pdf";

    if (!isPdf) {
      return cb(new Error("Only PDF files are allowed."));
    }

    cb(null, true);
  },
});

router.get("/", listDocuments);
router.get("/:id/file", getDocumentFile);
router.post("/upload", upload.single("file"), uploadDocument);
router.post("/:id/extract", extractDocument);
router.post("/:id/embed", embedDocument);
router.post("/:id/chat", chatWithDocumentController);
// Conversation history
router.post("/:id/conversations", createConversation);
router.get("/:id/conversations", listConversations);

router.get(
  "/conversations/:conversationId/messages",
  getConversationMessages
);

router.delete("/conversations", deleteAllConversations);

router.delete(
  "/conversations/:conversationId",
  deleteConversation
);
router.post(
  "/conversations/:conversationId/messages",
  sendConversationMessage
);

router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    const status = error.code === "LIMIT_FILE_SIZE" ? 413 : 400;

    return res.status(status).json({
      message:
        error.code === "LIMIT_FILE_SIZE"
          ? "PDF must be 4 MB or smaller."
          : error.message,
    });
  }

  if (error.message === "Only PDF files are allowed.") {
    return res.status(400).json({ message: error.message });
  }

  next(error);
});

export default router;
