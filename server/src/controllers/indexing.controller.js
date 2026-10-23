import prisma from "../config/db.js";
import { chunkPages } from "../services/chunking.services.js";
import { extractPdfText } from "../services/pdf.services.js";

export async function extractDocument(req, res) {
  const { id } = req.params;

  let document;

  try {
    document = await prisma.document.findFirst({
      where: { id, ownerId: req.user.id },
    });

    if (!document) {
      return res.status(404).json({
        message: "Document not found.",
      });
    }

    if (document.status === "PROCESSING") {
      return res.status(409).json({
        message: "Documnet is already being processed.",
      });
    }

    await prisma.document.update({
      where: { id },
      data: {
        status: "PROCESSING",
        errorMessage: null,
      },
    });

    const filePath = `uploads/${document.filename}`;
    const extracted = await extractPdfText(filePath);

    const chunks = chunkPages(extracted.pages);

    if (chunks.length === 0) {
      throw new Error("No text chunks were generated.");
    }

    await prisma.$transaction(async (tx) => {
      // Delete existing chunks before re-indexing
      await tx.documentChunk.deleteMany({
        where: { documentId: id },
      });

      // Save the newly generated chunks
      await tx.documentChunk.createMany({
        data: chunks.map((chunk) => ({
          documentId: id,
          chunkIndex: chunk.chunkIndex,
          pageNumber: chunk.pageNumber,
          content: chunk.content,
        })),
      });

      // Mark completed only after chunks are saved
      await tx.document.update({
        where: { id },
        data: {
          status: "COMPLETED",
          errorMessage: null,
        },
      });
    });

    return res.json({
      message: "PDF text extracted successfully.",
      documentId: id,
      pageCount: extracted.pageCount,
      chunkCount: chunks.length,
      status: "COMPLETED",
    });
  } catch (error) {
    console.error("PDF extraction failed:", error);

    if (document) {
      await prisma.document
        .update({
          where: { id },
          data: {
            status: "FAILED",
            errorMessage: "PDF text extraction failed.",
          },
        })
        .catch(() => {});
    }

    return res.status(500).json({
      message: "Could not index PDF text.",
    });
  }
}
