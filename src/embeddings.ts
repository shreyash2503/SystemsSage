import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { Document } from "@langchain/core/documents";

const pdfPath = process.env.DATA_PATH as string;
const loader = new PDFLoader(pdfPath);

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
  const document = await loadPdf();
  await splitTextIntoChunks(document);
}
main();
