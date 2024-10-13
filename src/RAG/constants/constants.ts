import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { createClient } from "@supabase/supabase-js";
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
require("dotenv").config();

export const geminiApiKey = process.env.GEMINI_API_KEY;
export const supabaseUrl = process.env.SUPABASE_URL as string;
export const supabaseKey = process.env.SUPABASE_API_KEY as string;

export const embeddings = new GoogleGenerativeAIEmbeddings({
  apiKey: geminiApiKey,
  model: "text-embedding-004",
});
export const client = createClient(supabaseUrl, supabaseKey);
export const llm = new ChatGoogleGenerativeAI({
  apiKey: geminiApiKey,
  model: "gemini-1.5-flash",
  maxRetries: 2,
});

export const convHistory: string[] = [];

export const vectorStore = new SupabaseVectorStore(embeddings, {
  client,
  tableName: "documents", // Name of the table in supabase where the documents are stored
  queryName: "match_documents", // Name of the function in supabase used to match the documents
});

export const retriever = vectorStore.asRetriever();
