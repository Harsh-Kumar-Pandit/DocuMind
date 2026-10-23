import fs from "node:fs/promises";
import path from "node:path";
import prisma from "../config/db.js";

const uploadDir = path.resolve("uploads");

export async function uploadDocument(req, res) {
    if (!req.file) {
        return res.status(400).json({
            error: "No file uploaded, Please Upload it"
        })
    }

    try {
        const document = await prisma.document.create({
            data: {
                filename: req.file.filename,
                originalName: req.file.originalname,
                mimeType: req.file.mimetype,
                size: req.file.size,
                status: "UPLOADED",
                ownerId: req.user.id,
            }
        })

        return res.status(201).json({
            message: "PDF uploaded successfully",
            document,
        })
    } catch (error) {
        await fs.unlink(req.file.path).catch(() => {})

        console.error("Document upload failed:", error.message);

        return res.status(500).json(
            {
                message: "Could not save document metadata."
            }
        )
    }
}


export async function listDocuments(req, res) {
  try {
    const documents = await prisma.document.findMany({
      where: { ownerId: req.user.id },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        originalName: true,
        size: true,
        status: true,
        createdAt: true,
      },
    });

    return res.status(200).json({
      documents,
    });
  } catch (error) {
    console.error("Failed to list documents:", error);

    return res.status(500).json({
      message: "Could not fetch documents.",
    });
  }
}

export async function getDocumentFile(req, res) {
  try {
    const { id } = req.params;

    const document = await prisma.document.findFirst({
      where: {
        id,
        ownerId: req.user.id,
      },
    });

    if (!document) {
      return res.status(404).json({ message: "Document not found." });
    }

    const filePath = path.resolve(uploadDir, document.filename);

    if (!filePath.startsWith(uploadDir)) {
      return res.status(403).json({ message: "Forbidden file access." });
    }

    try {
      await fs.access(filePath);
    } catch {
      return res.status(404).json({ message: "Document file not found on disk." });
    }

    const safeFilename = encodeURIComponent(document.originalName || "document.pdf");
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `inline; filename="${safeFilename}"; filename*=UTF-8''${safeFilename}`
    );
    res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");

    return res.sendFile(filePath);
  } catch (error) {
    console.error("Failed to serve document file:", error);
    return res.status(500).json({ message: "Could not retrieve document file." });
  }
}
