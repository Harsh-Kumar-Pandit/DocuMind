
import { GoogleGenAI } from "@google/genai";
import { searchDocument } from "./search.service.js";

const gemini = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const GEMINI_MODEL =
  process.env.GEMINI_CHAT_MODEL || "gemini-3.8-flash";

const OPENROUTER_MODEL =
  process.env.OPENROUTER_FALLBACK_MODEL || "openrouter/free";

const GEMINI_TIMEOUT_MS = 3500;
const GEMINI_COOLDOWN_MS = 60_000;

let geminiUnavailableUntil = 0;

const SYSTEM_PROMPT = `
You are DocuMind, a PDF question-answering assistant.
Answer using only the supplied document passages.
Be concise and direct.
Cite page numbers when available.
If the passages do not contain the answer,
say that the answer could not be found in the retrieved passages.
Do not invent facts.
`;

function isTemporaryGeminiError(error) {
  const status = Number(error?.status ?? error?.code);
  const message = String(error?.message || error);

  return (
    [408, 429, 500, 502, 503, 504].includes(status) ||
    /UNAVAILABLE|high demand|overloaded|RESOURCE_EXHAUSTED/i.test(
      message
    )
  );
}

function withTimeout(promise, ms) {
  let timer;

  const timeout = new Promise((_, reject) => {
    timer = setTimeout(() => {
      reject(new Error("Gemini request timed out."));
    }, ms);
  });

  return Promise.race([promise, timeout]).finally(() => {
    clearTimeout(timer);
  });
}

async function askGemini(question, context) {
  const response = await gemini.models.generateContent({
    model: GEMINI_MODEL,
    contents: `Document passages:\n${context}\n\nQuestion:\n${question}`,
    config: {
      systemInstruction: SYSTEM_PROMPT,
      temperature: 0.2,
      maxOutputTokens: 400,
    },
  });

  if (!response.text?.trim()) {
    throw new Error("Gemini returned an empty answer.");
  }

  return {
    answer: response.text.trim(),
    provider: "gemini",
    usage: response.usageMetadata
      ? {
          promptTokens: response.usageMetadata.promptTokenCount,
          outputTokens: response.usageMetadata.candidatesTokenCount,
          totalTokens: response.usageMetadata.totalTokenCount,
        }
      : null,
  };
}

async function askOpenRouter(question, context) {
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    throw new Error("OPENROUTER_API_KEY is missing from .env");
  }

  const response = await fetch(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "X-OpenRouter-Title": "DocuMind",
      },
      body: JSON.stringify({
        model: OPENROUTER_MODEL,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          {
            role: "user",
            content: `Document passages:\n${context}\n\nQuestion:\n${question}`,
          },
        ],
        temperature: 0.2,
        // Some free OpenRouter models spend part of the budget on hidden
        // reasoning, so 500 can leave no room for visible answer content.
        max_tokens: 1200,
      }),
      signal: AbortSignal.timeout(45_000),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      `OpenRouter error (${response.status}): ${
        data?.error?.message || "Request failed"
      }`
    );
  }

  const rawAnswer = data.choices?.[0]?.message?.content;
  const answer = Array.isArray(rawAnswer)
    ? rawAnswer
        .map((part) => (typeof part === "string" ? part : part?.text || ""))
        .join("")
    : rawAnswer;

if (
  typeof answer !== "string" ||
  !answer.trim() ||
  /^User Safety:\s*safe\.?$/i.test(answer.trim())
) {
  throw new Error(
    `OpenRouter returned an invalid answer. Model: ${
      data.model || OPENROUTER_MODEL
    }`
  );
}

  return {
    answer: answer.trim(),
    provider: "openrouter",
    usage: data.usage
      ? {
          promptTokens: data.usage.prompt_tokens,
          outputTokens: data.usage.completion_tokens,
          totalTokens: data.usage.total_tokens,
        }
      : null,
  };
}


export async function chatWithDocument(documentId, question, responseLength = "balanced") {
  if (typeof question !== "string" || !question.trim()) {
    throw new Error("Question is required.");
  }

  // 1. Retrieve relevant chunks from Neon.
  const results = await searchDocument(
    documentId,
    question.trim(),
    3
  );

  if (results.length === 0) {
    throw new Error("No document content found.");
  }

  // 2. Build compact context with source page numbers.
  const context = results
    .map(
      (chunk, index) =>
        `[Source ${index + 1} | Page ${
          chunk.pageNumber ?? "Unknown"
        }]\n${chunk.content}`
    )
    .join("\n\n")
    .slice(0, 10_000);

  // 3. Call OpenRouter directly. Gemini is disabled for now.
  const lengthInstruction = {
    concise: "Keep the answer very concise, using only the essential points.",
    balanced: "Give a clear answer with a reasonable amount of detail.",
    detailed: "Give a thorough answer with helpful detail while staying focused.",
  }[responseLength] || "Give a clear answer with a reasonable amount of detail.";
  const aiResult = await askOpenRouter(
    `${question.trim()}\n\nResponse preference: ${lengthInstruction}`,
    context
  );

  return {
    answer: aiResult.answer,
    provider: aiResult.provider,
    sources: results.map((chunk) => ({
      pageNumber: chunk.pageNumber,
      chunkIndex: chunk.chunkIndex,
      similarity: Number(chunk.similarity),
      content: chunk.content,
    })),
    usage: aiResult.usage,
  };
}
