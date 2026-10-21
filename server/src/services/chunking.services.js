export function chunkPages(pages, chunkSize = 1000, overlap = 150) {
  if (
    chunkSize <= 0 ||
    overlap < 0 ||
    overlap >= chunkSize
  ) {
    throw new Error(
      "Chunk size must be positive, and overlap must be smaller than chunk size."
    );
  }

  const chunks = [];
  const step = chunkSize - overlap;
  let chunkIndex = 0;

  for (const page of pages) {
    const text = page.content.replace(/\s+/g, " ").trim();

    for (let start = 0; start < text.length; start += step) {
      const content = text.slice(start, start + chunkSize).trim();

      if (content.length > 0) {
        chunks.push({
          chunkIndex: chunkIndex++,
          pageNumber: page.pageNumber,
          content,
        });
      }

      if (start + chunkSize >= text.length) break;
    }
  }

  return chunks;
}
