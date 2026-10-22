
import "dotenv/config";
import { searchDocument } from "../services/search.service.js";

const documentId = "cmvc2u47i0000f3vwolmjs4yn";

const results = await searchDocument(
  documentId,
  "What is a primary key in SQL?",
  5
);

for (const result of results) {
  console.log("\nPage:", result.pageNumber);
  console.log("Similarity:", Number(result.similarity).toFixed(4));
  console.log("Content:", result.content.slice(0, 300));
}
