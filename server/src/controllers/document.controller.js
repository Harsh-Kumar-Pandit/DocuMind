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
