import { chatWithDocument } from "../services/chat.service.js";
import prisma from "../config/db.js";

export async function chatWithDocumentController(req, res) {
  try {
    const { id } = req.params;
    const document = await prisma.document.findFirst({ where: { id, ownerId: req.user.id }, select: { id: true } });
    if (!document) return res.status(404).json({ message: "Document not found." });
    const { question } = req.body;

    if (typeof question !== "string" || !question.trim()) {
      return res.status(400).json({
        message: "Question is required.",
      });
    }

    const result = await chatWithDocument(id, question.trim());

    return res.status(200).json(result);
  } catch (error) {
    console.error("Chat request failed:", error.message);

    return res.status(500).json({
      message: "Could not answer the question.",
    });
  }
}
