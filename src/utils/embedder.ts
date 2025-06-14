import { OpenAI } from 'openai';


const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function getEmbedding(text: string): Promise<number[]> {
  const response = await openai.embeddings.create({
    model: 'text-embedding-3-small', // atau 'text-embedding-3-large'
    input: text,
    encoding_format: 'float',
  });

  return response.data[0].embedding;
}
