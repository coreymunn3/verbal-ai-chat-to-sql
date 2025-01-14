"use server";
import { generateText } from "ai";
import openai from "@/lib/open-ai";

/********************************************************************** */

export const getAiTextResponse = async (userInput: string) => {
  const { text } = await generateText({
    model: openai("gpt-4-turbo"),
    prompt: userInput,
  });
  return text;
};
