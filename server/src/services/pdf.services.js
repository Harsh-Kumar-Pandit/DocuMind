
import fs from "node:fs/promises";
import { PDFParse } from "pdf-parse";

export async function extractPdfText(filePath) {
  const buffer = await fs.readFile(filePath);
  const parser = new PDFParse({ data: buffer });

  try {
    const result = await parser.getText();

    const pages = result.pages
      .map((page, index) => ({
        pageNumber: index + 1,
        content: page.text.trim(),
      }))
      .filter((page) => page.content.length > 0);

    if (pages.length === 0) {
      throw new Error(
        "No readable text found. The PDF may be scanned or image-based."
      );
    }

    return {
      pageCount: result.pages.length,
      pages,
    };
  } finally {
    await parser.destroy();
  }
}
