import { Document } from "@langchain/core/documents";

export function formatConvHistory(messages: string[]) {
  return messages
    .map((message, index) => {
      if (index % 2 === 0) {
        return `Human: ${message}`;
      } else {
        return `AI: ${message}`;
      }
    })
    .join("\n");
}

export function combineDocuments(documents: Document[]) {
  return documents.map((doc) => doc.pageContent).join("\n\n");
}
