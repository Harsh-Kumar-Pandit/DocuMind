import "dotenv/config";
import { generateEmbedding } from "../services/embedding.services.js";

const vector = await generateEmbedding(
  "A primary key uniquely identifies a row in a database table."
);

console.log("Embedding dimensions:", vector.length);
console.log("First five values:", vector.slice(0, 5));