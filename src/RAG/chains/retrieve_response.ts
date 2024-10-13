import { PromptTemplate } from "@langchain/core/prompts";
import { llm } from "../constants/constants";
import { StringOutputParser } from "@langchain/core/output_parsers";

export function generateResponsePrompt() {
  const answerTemplate = `
        You are a helpful and enthusiastic support bot for helping students with system design questions based on the context provided and previous conversation history with the student. Make sure to use the conversation history along with the context to generate the answer. Try to find the answer in the context. If you really don't know the answer, say "I'm sorry, I don't know the answer to that". Don't try to make up the answer. Always speak as if you were speaking to a friend.
        The previous conversation history with the user is {convHistory}
        context : {context}
        question : {question}
        answer : 
    `;
  return PromptTemplate.fromTemplate(answerTemplate)
    .pipe(llm)
    .pipe(new StringOutputParser());
}
