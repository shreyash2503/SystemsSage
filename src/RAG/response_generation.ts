import { convHistory } from "./constants/constants";
import { formatConvHistory } from "./utils/utils";
import { createPipeline } from "./chains/final_pipeline";
/**
 * We use the standalone questino to retrieve the most relevant documents from the vector store
 * But while generating the response from the llm we use the original user question, as it may contain some data which can be used by the llm to generate better responses
 */
export async function generateResponse(question: string) {
  //   const chain = retrieveDocumentsFromVectorStore().pipe(combineDocuments);
  //   const response = await chain.invoke({ question });
  //   console.log(response);

  const pipeline = createPipeline();
  const response = await pipeline.invoke({
    question,
    convHistory: formatConvHistory(convHistory),
  });
  convHistory.push(question);
  convHistory.push(response);
  return response;
}
