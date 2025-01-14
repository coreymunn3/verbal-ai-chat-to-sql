import { createOpenAI } from "@ai-sdk/openai";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY is missing");
}

/**
 * Initialize the OpenAi object
 */
const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY, // should ideally be loaded from external place such as env variable
});

export default openai;
