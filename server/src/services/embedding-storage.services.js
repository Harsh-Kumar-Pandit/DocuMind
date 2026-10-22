import prisma from "../config/db.js"
import { generateEmbedding } from "./embedding.services.js"

export async function storeDocumentEmbeddings(documentId) {

    const chunks = await prisma.documentChunk.findMany({
        where: { documentId },
        orderBy: { chunkIndex: "asc" },
        select:{
            id: true,
            content: true
        }
    })

    if (chunks.length === 0) {
        throw new Error("No chunks found for this document.")
    }

    let storedCount = 0;

    for (const chunk of chunks) {
        const existing = await prisma.$queryRaw`
        SELECT 1
        FROM "ChunkEmbedding"
        WHERE "chunkId" = ${chunk.id}
        LIMIT 1
        `;

        if (existing.length > 0) {
            continue;
        }

        const values = await generateEmbedding(chunk.content)

        const vector = `[${values.join(",")}]`

        await prisma.$executeRaw`
        INSERT INTO "ChunkEmbedding" ("chunkId", "embedding") VALUES (
        ${chunk.id},
        ${vector}::vector
        )
        ON CONFLICT ("chunkId") DO NOTHING
        `;

        storedCount++;
    }
    return {
    totalChunks: chunks.length,
    storedCount,
    skippedCount: chunks.length - storedCount,
  };
}