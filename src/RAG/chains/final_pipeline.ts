import {
  RunnablePassthrough,
  RunnableSequence,
} from "@langchain/core/runnables";
import { retrieveDocumentsFromVectorStore } from "./retrieve_documents";
import { generateResponsePrompt } from "./retrieve_response";

export function createPipeline() {
  return RunnableSequence.from([
    {
      originalInput: new RunnablePassthrough(),
    },
    {
      question: ({ originalInput }) => originalInput.question,
      convHistory: ({ originalInput }) => originalInput.convHistory,
    },
    {
      context: retrieveDocumentsFromVectorStore(),
      //* Here we can use Something like context : prevResult => prevResult.question to access the output of the previous operation
      //! Instead of using pipes we can also use nested RunnableSequence to create a pipeline
      //! RunnableSequence is used instead of pipe to create a pipeline so that input from the first operation can be available until the last operation
      question: ({ question }) => question,
      convHistory: ({ convHistory }) => convHistory,
    },
    generateResponsePrompt(),
  ]);
}
