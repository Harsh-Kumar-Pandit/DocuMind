import { storeDocumentEmbeddings } from "../services/embedding-storage.services.js";

export async function embedDocument(req, res) {
    try {
        const { id } = req.params;

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