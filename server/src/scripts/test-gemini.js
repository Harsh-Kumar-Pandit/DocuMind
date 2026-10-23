import "dotenv/config";
import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;
const model = process.env.GEMINI_CHAT_MODEL;

if (!apiKey) {
  console.error("GEMINI_API_KEY is missing from .env");
  process.exit(1);
}

if (!model) {
  console.error("GEMINI_CHAT_MODEL is missing from .env");
  process.exit(1);
}

const ai = new GoogleGenAI({ apiKey });

async function testGemini() {
  console.log("Testing Gemini API...");
  console.log("Model:", model);

  try {
    const response = await ai.models.generateContent({
      model,
      contents: "Explain a primary key in SQL in one sentence.",
      config: {
        temperature: 0.2,
        maxOutputTokens: 100,
      },
    });

    console.log("\nGemini response:\n");
    console.log(response.text || "No text returned.");

    console.log("\nToken usage:");
    console.log({
      promptTokens: response.usageMetadata?.promptTokenCount,
      outputTokens: response.usageMetadata?.candidatesTokenCount,
      totalTokens: response.usageMetadata?.totalTokenCount,
    });
  } catch (error) {
    console.error("\nGemini test failed:");
    console.dir(error, { depth: 5 });
console.dir(error.cause, { depth: 5 });
  }
}

await testGemini();
