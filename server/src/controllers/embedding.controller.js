import { storeDocumentEmbeddings } from "../services/embedding-storage.services.js";
import prisma from "../config/db.js";

export async function embedDocument(req, res) {
    try {
        const { id } = req.params;
        const document = await prisma.document.findFirst({ where: { id, ownerId: req.user.id }, select: { id: true } });
        if (!document) return res.status(404).json({ message: "Document not found." });

        const result = await storeDocumentEmbeddings(id)

        return res.json({
            message: "Document embeddings generated successfully.",
            documentId: id,
            ...result
        })
    } catch (error) {
    console.error("Embedding generation failed:", error);

    return res.status(500).json({
      message: "Could not generate document embeddings.",
    });
  }

}
