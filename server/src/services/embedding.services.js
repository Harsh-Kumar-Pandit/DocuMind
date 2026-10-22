import { GoogleGenAI } from "@google/genai"

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
})

export async function generateEmbedding(text) {
    if (!process.env.GEMINI_API_KEY) {
        throw new Error("GEMINI_API_KE is missing from .env")
    }

    const result = await ai.models.embedContent({
        model: "gemini-embedding-001",
        contents: text,
        config: {
            outputDimensionality: 768
        }
    })

    const values = result.embeddings?.[0]?.values;

    if (!values || values.length !== 768) {
        throw new Error("Gemini returned an invalid embedding.")
    }

    return values;
}