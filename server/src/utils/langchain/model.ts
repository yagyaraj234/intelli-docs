// import { ChatAnthropic } from "@langchain/anthropic";
import { ChatGroq } from "@langchain/groq";
import * as dotenv from "dotenv";

dotenv.config();

// export const claudeModel = new ChatAnthropic({
//   model: "claude-3-haiku-2024030",
//   apiKey: process.env.ANTHROPIC_API_KEY,
//   maxTokens: 2000, // Maximum number of tokens to generate
//   maxRetries: 3,
//   temperature: 0.4,
// });

export const groqModel = new ChatGroq({
  model: "llama-3.1-70b-versatile",
  maxTokens: 3000,
  maxRetries: 3,
  temperature: 0.4,
});
