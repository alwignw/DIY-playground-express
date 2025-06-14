import { OpenAI } from "openai";
import { ChatCompletionMessageParam } from "openai/resources";
import { redis } from "../config/redis";
import { getName, getDate } from "./func-call";

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!, // pastikan pakai dotenv atau ENV
});

const list_function: any = [
  {
    type: "function",
    function: {
      name: "getName",
      description: "Untuk mengecek siapa nama yang bertanya",
      parameters: {
        //   type: 'object',
        //   properties: {
        //     orderId: {
        //       type: 'string',
        //       description: 'Nomor pesanan yang ingin dicek',
        //     },
        //   },
        //   required: ['orderId'],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "getDate",
      description: "Untuk mengecek tanggal berapa sekarang",
      parameters: {
        //   type: 'object',
        //   properties: {
        //     orderId: {
        //       type: 'string',
        //       description: 'Nomor pesanan yang ingin dicek',
        //     },
        //   },
        //   required: ['orderId'],
      },
    },
  },
];

export async function askGPT(question: string, context: string) {
  const systemPrompt = `
  Anda adalah asisten cerdas. Jawablah pertanyaan berdasarkan konteks berikut:

  =====
  ${context}
  =====

  Pertanyaan: ${question}
  Jawaban:
  `;

  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [{ role: "user", content: systemPrompt }],
    functions: [],
    temperature: 0.7,
  });

  return completion.choices[0].message.content;
}

export async function askGPTMemorize(
  history: ChatCompletionMessageParam[], // Riwayat chat (max 5 pasang)
  context: string
) {
  const systemPrompt = context
    ? `
  Anda adalah asisten cerdas. Jawablah pertanyaan berdasarkan konteks berikut.
  
  
  =====
  ${context}
  =====
    `.trim()
    : "Anda adalah asisten cerdas.";

  const messages: ChatCompletionMessageParam[] = [
    { role: "system", content: systemPrompt },
    ...history,
  ];

  console.log(messages);

  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages,
    tools: list_function,
    tool_choice: "auto",
    temperature: 0.7,
  });

  //Deteksi dan Panggil Fungsi Lokal
  const choice = completion.choices[0];

  if (choice.finish_reason === "tool_calls") {
    const toolCall: any = choice.message.tool_calls?.[0];
    const args = JSON.parse(toolCall.function.arguments || "{}");

    if (toolCall.function.name === "getName") {
      const result = await getName();

      // Kirim kembali hasil fungsi ke GPT
      const final = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          ...history,
          choice.message,
          {
            role: "tool",
            tool_call_id: toolCall.id,
            content: JSON.stringify(result),
          },
        ],
      });

      return final.choices[0].message.content;
      console.log(final.choices[0].message.content);
    }

    if (toolCall.function.name === "getDate") {
      const result = await getDate();

      // Kirim kembali hasil fungsi ke GPT
      const final = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          ...history,
          choice.message,
          {
            role: "tool",
            tool_call_id: toolCall.id,
            content: JSON.stringify(result),
          },
        ],
      });

      return final.choices[0].message.content;
      console.log(final.choices[0].message.content);
    }
  }
  return completion.choices[0].message.content;
}

const MAX_HISTORY = 10;

export async function saveMessageToHistory(
  userId: string,
  role: "user" | "assistant",
  content: string
) {
  const key = `chat:history:${userId}`;
  const message = JSON.stringify({ role, content });

  // Tambahkan ke akhir list
  await redis.rpush(key, message);

  // Batasi panjang list (hanya simpan 10 pesan terakhir)
  await redis.ltrim(key, -MAX_HISTORY, -1);
}

export async function getMessageHistory(userId: string) {
  const key = `chat:history:${userId}`;
  const messages = await redis.lrange(key, 0, -1);
  return messages.map((m) => JSON.parse(m));
}
