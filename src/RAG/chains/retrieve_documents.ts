import { PromptTemplate } from "@langchain/core/prompts";
import { llm, retriever } from "../constants/constants";
import { combineDocuments } from "../utils/utils";

export function generateStandaloneQuestionPrompt() {
  const standaloneQuestion =
    "Given a user question, generate a suitable standalone question from it. The user question is: {question} .\n The previous conversation history with the user is {convHistory}, Make sure to use the context from the conversation history to generate a suitable standalone question";
  const standalonePrompt = PromptTemplate.fromTemplate(standaloneQuestion);
  return standalonePrompt;
}

export function retrieveDocumentsFromVectorStore() {
  return (
    generateStandaloneQuestionPrompt()
      .pipe(llm)
      .pipe((output) => output.content) // Extracting the standalone question generated by the llm and passing it to the retriever
      //! Instead of this even StringOutputParser can be used like .pipe(new StringOutputParser()), output parser are used to generate the output in a specific format
      .pipe(retriever)
      .pipe(combineDocuments)
  );
}
