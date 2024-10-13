import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { createClient } from "@supabase/supabase-js";
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { Document } from "@langchain/core/documents";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { TaskType } from "@google/generative-ai";
require("dotenv").config();

const supabaseUrl = process.env.SUPABASE_URL as string;
const supabaseKey = process.env.SUPABASE_API_KEY as string;
const geminiApiKey = process.env.GEMINI_API_KEY as string;
const pdfPath = process.env.DATA_PATH as string;
const loader = new PDFLoader(pdfPath);
const client = createClient(supabaseUrl, supabaseKey);

async function loadPdf() {
  const docs = await loader.load();
  return docs;
}

async function splitTextIntoChunks(document: Document<Record<string, any>>[]) {
  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkOverlap: 200,
    chunkSize: 1000,
    separators: ["\n\n", "\n", " ", ""],
  });

  const texts = await textSplitter.splitDocuments(document);
  return texts;
}

async function main() {
  try {
    const document = await loadPdf();
    const output = await splitTextIntoChunks(document);
    const embeddings = new GoogleGenerativeAIEmbeddings({
      apiKey: geminiApiKey,
      model: "text-embedding-004",
      taskType: TaskType.RETRIEVAL_DOCUMENT,
      title: "System Design",
    });
    const vectorStore = await SupabaseVectorStore.fromDocuments(
      output,
      embeddings,
      {
        client,
        tableName: "documents",
      }
    );
    console.log(vectorStore);
    console.log("Vector store created successfully");
  } catch (error) {
    console.log(error);
  }
}
main();
