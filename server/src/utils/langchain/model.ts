// import { ChatAnthropic } from "@langchain/anthropic";
import { ChatGroq } from "@langchain/groq";

// export const claudeModel = new ChatAnthropic({
//   model: "claude-3-haiku-2024030",
//   apiKey: process.env.ANTHROPIC_API_KEY,
//   maxTokens: 2000, // Maximum number of tokens to generate
//   maxRetries: 3,
//   temperature: 0.4,
// });

export const groqModel = new ChatGroq({
  model: "llama-3.1-70b-versatile",
  apiKey: "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",
});
