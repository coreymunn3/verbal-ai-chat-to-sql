"use server";
import { generateText, generateObject } from "ai";
import openai from "@/lib/open-ai";
import { z } from "zod";
import {
  explainSqlSystemPrompt,
  generateSqlSystemPrompt,
} from "@/prompts/prompts";
import { prisma } from "@/lib/prisma";
import { Company } from "@prisma/client";
import superjson from "superjson";
import { Decimal } from "decimal.js";

superjson.registerCustom<Decimal, string>(
  {
    isApplicable: (v): v is Decimal => Decimal.isDecimal(v),
    serialize: (v) => v.toJSON(),
    deserialize: (v) => new Decimal(v),
  },
  "decimal.js"
);

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
      system: generateSqlSystemPrompt,
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

export const runGeneratedSqlQuery = async (query: string) => {
  // make sure its only a select query
  if (
    !query.trim().toLowerCase().startsWith("select") ||
    query.trim().toLowerCase().includes("drop") ||
    query.trim().toLowerCase().includes("delete") ||
    query.trim().toLowerCase().includes("insert") ||
    query.trim().toLowerCase().includes("update") ||
    query.trim().toLowerCase().includes("alter") ||
    query.trim().toLowerCase().includes("truncate") ||
    query.trim().toLowerCase().includes("create") ||
    query.trim().toLowerCase().includes("grant") ||
    query.trim().toLowerCase().includes("revoke")
  ) {
    throw new Error("Only SELECT queries are allowed");
  }

  let data: any;
  try {
    data = await prisma.$queryRawUnsafe<Company[]>(query);
  } catch (error) {
    console.error(error);
    throw new Error("Unable to run SQL query");
  }
  // serialize it to encode 'decimal' type
  return superjson.serialize(data);
};

export const explainSqlQuery = async (input: string, sqlQuery: string) => {
  try {
    const result = await generateObject({
      model: openai("gpt-4o"),
      system: explainSqlSystemPrompt,
      prompt: `Explain the SQL query you generated to retrieve the data the user wanted. Assume the user is not an expert in SQL. Break down the query into steps. Be concise
      User Query:
      ${input}

      Generated Query:
      ${sqlQuery}
      `,
      schema: z.object({
        section: z.string(),
        explanation: z.string(),
      }),
      output: "array",
    });
    return result.object;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to explain the query");
  }
};
