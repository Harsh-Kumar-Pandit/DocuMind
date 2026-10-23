
import "dotenv/config";
import { chatWithDocument } from "../services/chat.service.js";

const documentId = "cmvc2u47i0000f3vwolmjs4yn";

const testCases = [
  {
    name: "Test 1: Basic retrieval",
    question: "What is a primary key in SQL?",
  },
  {
    name: "Test 2: Another concept",
    question: "What is a foreign key?",
  },
  {
    name: "Test 3: Unanswerable question",
    question: "What is the capital of Japan?",
  },
  {
    name: "Test 4: Compare concepts",
    question:
      "What is the difference between a primary key and a foreign key?",
  },
  {
    name: "Test 5: Empty input",
    question: "",
  },
];

for (const test of testCases) {
  console.log(`\n${"=".repeat(60)}`);
  console.log(test.name);
  console.log("Question:", JSON.stringify(test.question));

  const startTime = Date.now();

  try {
    const result = await chatWithDocument(
      documentId,
      test.question
    );

    console.log("\nAI ANSWER:\n", result.answer);

    console.log("\nSOURCES:");
    for (const source of result.sources) {
      console.log({
        page: source.pageNumber,
        similarity: Number(source.similarity).toFixed(4),
        chunkIndex: source.chunkIndex,
      });
    }

    console.log("\nTOKEN USAGE:", result.usage);
  } catch (error) {
    console.log("\nEXPECTED/ACTUAL ERROR:", error.message);
  }

  console.log("TIME:", `${((Date.now() - startTime) / 1000).toFixed(2)}s`);
}
