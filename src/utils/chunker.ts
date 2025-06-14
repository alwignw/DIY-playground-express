import {encode} from 'gpt-tokenizer';

export function chunkText(text: string, maxTokens = 200, overlap = 20): string[] {
  const words = text.split(/\s+/);
  const chunks: string[] = [];
  let start = 0;

  while (start < words.length) {
    let chunk = "";
    let tokenCount = 0;
    let i = 0;

    while (start + i < words.length) {
      const tryChunk = words.slice(start, start + i + 1).join(" ");
      const tokens = encode(tryChunk); // ✅ encode teks, bukan panggil langsung
      if (tokens.length > maxTokens) break;
      chunk = tryChunk;
      tokenCount = tokens.length;
      i++;
    }

    if (chunk) chunks.push(chunk);
    const step = Math.max(1, tokenCount - overlap);
    start += step;
  }

  return chunks;
}
