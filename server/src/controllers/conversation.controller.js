import prisma from "../config/db.js";
import { chatWithDocument } from "../services/chat.service.js";

export async function createConversation(req, res) {
  try {
    const { id: documentId } = req.params;

    const document = await prisma.document.findUnique({
      where: { id: documentId },
      select: { id: true },
    });

    if (!document) {
      return res.status(404).json({
        message: "Document not found.",
      });
    }

    const conversation = await prisma.conversation.create({
      data: {
        documentId,
        title: "New Chat",
      },
    });

    return res.status(201).json({ conversation });
  } catch (error) {
    console.error("Create conversation failed:", error.message);
    return res.status(500).json({
      message: "Could not create conversation.",
    });
  }
}

export async function listConversations(req, res) {
  try {
    const { id: documentId } = req.params;

    const document = await prisma.document.findUnique({
      where: { id: documentId },
      select: { id: true },
    });

    if (!document) {
      return res.status(404).json({
        message: "Document not found.",
      });
    }

    const conversations = await prisma.conversation.findMany({
      where: { documentId },
      orderBy: { updatedAt: "desc" },
      include: {
        _count: {
          select: { messages: true },
        },
      },
    });

    return res.status(200).json({ conversations });
  } catch (error) {
    console.error("List conversations failed:", error.message);
    return res.status(500).json({
      message: "Could not load conversations.",
    });
  }
}

export async function getConversationMessages(req, res) {
  try {
    const { conversationId } = req.params;

    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      select: { id: true },
    });

    if (!conversation) {
      return res.status(404).json({
        message: "Conversation not found.",
      });
    }

    const messages = await prisma.chatMessage.findMany({
      where: { conversationId },
      orderBy: { createdAt: "asc" },
    });

    return res.status(200).json({ messages });
  } catch (error) {
    console.error("Load messages failed:", error.message);
    return res.status(500).json({
      message: "Could not load messages.",
    });
  }
}

export async function deleteConversation(req, res) {
  try {
    const { conversationId } = req.params;

    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      select: { id: true },
    });

    if (!conversation) {
      return res.status(404).json({
        message: "Conversation not found.",
      });
    }

    await prisma.conversation.delete({
      where: { id: conversationId },
    });

    return res.status(200).json({
      message: "Conversation deleted.",
    });
  } catch (error) {
    console.error("Delete conversation failed:", error.message);
    return res.status(500).json({
      message: "Could not delete conversation.",
    });
  }
}


export async function sendConversationMessage(req, res) {
  try {
    const { conversationId } = req.params;
    const { question } = req.body;

    if (typeof question !== "string" || !question.trim()) {
      return res.status(400).json({
        message: "Question is required.",
      });
    }

    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      select: {
        id: true,
        documentId: true,
      },
    });

    if (!conversation) {
      return res.status(404).json({
        message: "Conversation not found.",
      });
    }

    const cleanQuestion = question.trim();

    // Generate the answer using the existing RAG service.
    const result = await chatWithDocument(
      conversation.documentId,
      cleanQuestion
    );

    // Save the question and answer together.
    const response = await prisma.$transaction(async (tx) => {
      const userMessage = await tx.chatMessage.create({
        data: {
          conversationId,
          role: "USER",
          content: cleanQuestion,
        },
      });

      const assistantMessage = await tx.chatMessage.create({
        data: {
          conversationId,
          role: "ASSISTANT",
          content: result.answer,
          sources: result.sources,
        },
      });

      // Use the first question as the conversation title.
      const existingUserMessages = await tx.chatMessage.count({
        where: {
          conversationId,
          role: "USER",
        },
      });

      const title =
        existingUserMessages === 1
          ? cleanQuestion.slice(0, 80)
          : undefined;

      await tx.conversation.update({
        where: { id: conversationId },
        data: {
          updatedAt: new Date(),
          ...(title ? { title } : {}),
        },
      });

      return { userMessage, assistantMessage };
    });

    return res.status(200).json({
      conversationId,
      userMessage: response.userMessage,
      assistantMessage: response.assistantMessage,
      provider: result.provider,
      usage: result.usage,
    });
  } catch (error) {
    console.error("Send conversation message failed:", error.message);

    return res.status(500).json({
      message: "Could not process the message.",
    });
  }
}
