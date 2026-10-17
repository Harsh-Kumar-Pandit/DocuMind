import { Router } from "express";
import multer from "multer";
import path from "node:path";
import crypto from "node:crypto";
import fs from "node:fs";
import {
  uploadDocument,
  listDocuments,
} from "../controllers/document.controller.js";

const router = Router();
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
    fileSize: 10 * 1024 * 1024,
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
router.post("/upload", upload.single("file"), uploadDocument);

router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    const status = error.code === "LIMIT_FILE_SIZE" ? 413 : 400;

    return res.status(status).json({
      message:
        error.code === "LIMIT_FILE_SIZE"
          ? "PDF must be 10 MB or smaller."
          : error.message,
    });
  }

  if (error.message === "Only PDF files are allowed.") {
    return res.status(400).json({ message: error.message });
  }

  next(error);
});

export default router;
