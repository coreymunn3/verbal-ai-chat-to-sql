"use server";
import { generateText, generateObject } from "ai";
import openai from "@/lib/open-ai";
import { z } from "zod";
import { sqlSystemPrompt } from "@/prompts/prompts";

/********************************************************************** */

export const getAiTextResponse = async (userInput: string) => {
  const { text } = await generateText({
    model: openai("gpt-4o"),
    prompt: userInput,
  });
  return text;
};

export const generateQuery = async (userInput: string) => {
  try {
    const result = await generateObject({
      model: openai("gpt-4o"),
      system: sqlSystemPrompt,
      prompt: `Generate the postgres sql query to retrieve the data the user wants: ${userInput}`,
      schema: z.object({
        query: z.string(),
      }),
    });
    return result.object.query;
  } catch (error) {
    throw new Error("Failed to generate SQL query");
  }
};
