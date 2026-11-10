const lastWords = (text: string, count: number): string => {
  const words = text.split(/\s+/);
  return words.slice(-count).join(' ');
};

export const makeChunks = (text: string, maxWords = 500, overlap = 50): string[] => {
  const paragraphs = text.split(/\n\s*\n/);
  const chunks: string[] = [];
  let current: string[] = [];
  for (const p of paragraphs) {
    const size = current.join(' ').split(/\s+/).length;
    if (size + p.split(/\s+/).length > maxWords && current.length) {
      chunks.push(current.join('\n\n'));
      current = [lastWords(current.join(' '), overlap)];
    }
    current.push(p);
  }
  if (current.length) chunks.push(current.join('\n\n'));
  return chunks;
}