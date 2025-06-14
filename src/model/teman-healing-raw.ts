import { temanhealingDB } from "../app/database";
import { QueryTypes } from "sequelize";


export async function _insert_vektor(param:any): Promise<any[]> {
    const {content, embedding, metadata} = param
    // const embeddingSQL = `ARRAY[${embedding}]`;
  return await temanhealingDB.query(`INSERT INTO apps.content_vektor (content,metadata,embedding) VALUES (:content,:metadata,ARRAY[:embedding])`, {
    replacements: {content, embedding, metadata:JSON.stringify(metadata)},
    type: QueryTypes.INSERT,
  });
}


export async function _get_vektor(param:any): Promise<any[]> {
    const {embedding} = param
    // const embeddingSQL = `ARRAY[${embedding}]`;
  return await temanhealingDB.query(`
    SELECT 
        content, 
        metadata, 
        embedding <=> ARRAY[:embedding]::vector AS distance
       FROM apps.content_vektor
       WHERE embedding <=> ARRAY[:embedding]::vector <  0.5
       ORDER BY embedding <-> ARRAY[:embedding]::vector
       LIMIT 3
    `, {
    replacements: {embedding},
    type: QueryTypes.SELECT,
  });
}