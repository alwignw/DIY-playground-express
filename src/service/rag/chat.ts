import { chunkText } from "../../utils/chunker";
import { getEmbedding } from "../../utils/embedder";
import {askGPT, askGPTMemorize, saveMessageToHistory,getMessageHistory} from "../../utils/ask"
import { Repository } from "../../model/repository";

export async function run() {
  let chunks:any = await chunkText(`
      Fitur Cek Minum adalah fitur yang memantau minum harian agar Anda disiplin minum air putih setiap hari.
      Bisa digunakan secara manual, atau bisa disambungkan juga ke Tumbler Groopy melalui Bluetooth.
      Tumbler Groopy bisa Anda dapatkan dengan menukarkan Groopy Poin di apps Groopy.
    `);

if(chunks.length > 0){
    chunks = chunks.toString().match(/[^.!?]+[.!?]+/g) ?? [chunks];
}

  const vectors = [];

  for (const chunk of chunks) {
    const embedding = await getEmbedding(chunk);
    vectors.push({
      content: chunk,
      embedding, // ini array angka float
      metadata: {
        source: "feature cek minum",
        type: "feature groopy",
      },
    });
    await Repository._insert_vektor_raw({
      content: chunk,
      embedding,
      metadata: {
        source: "feature cek minum",
        type: "feature groopy",
      },
    });
  }

  return vectors;
}


export async function chat(param:any) {
    const {ask} = param

    const questionEmbedding = await getEmbedding(ask);
    const retrievedChunks = await Repository._get_vektor_raw({embedding : questionEmbedding})
    let context = ''
    if(retrievedChunks.length > 0){
      context = retrievedChunks.map(c => c.content).join('\n');
    }

    let history:any = await getMessageHistory('user123');    
    history.push({
        role: "user", content: ask
    })
    await saveMessageToHistory('user123', 'user', ask);
    const result:any = await askGPTMemorize(history,context)
    
    await saveMessageToHistory('user123', 'assistant', result);

    
    return {
        result
    }
}
