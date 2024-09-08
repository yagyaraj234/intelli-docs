import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";
import { HumanMessage, AIMessage } from "@langchain/core/messages";

export const prompt = ChatPromptTemplate.fromMessages([
  [
    "system",
    "Answer the user query: ## Output instructions always return markdown response also don't give any extra information. ",
  ],
  new MessagesPlaceholder("chat_history"),
  ["user", "{input} "],
]);

export async function createHistory(history: any[]) {
  return history.map((item) => {
    if (item.type === "user") {
      return new HumanMessage(item.content);
    } else {
      return new AIMessage(item.content);
    }
  });
}
