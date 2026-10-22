
import prisma from "../config/db.js";
import { generateEmbedding } from "./embedding.services.js";

export async function searchDocument(documentId, question, limit = 5) {
  const questionEmbedding = await generateEmbedding(question);
  const vector = `[${questionEmbedding.join(",")}]`;

  const results = await prisma.$queryRaw`
    SELECT
      dc.id,
      dc.content,
      dc."pageNumber",
      dc."chunkIndex",
      1 - (ce.embedding <=> ${vector}::vector) AS similarity
    FROM "ChunkEmbedding" ce
    JOIN "DocumentChunk" dc
      ON dc.id = ce."chunkId"
    WHERE dc."documentId" = ${documentId}
    ORDER BY ce.embedding <=> ${vector}::vector
    LIMIT ${limit}
  `;

  return results;
}
