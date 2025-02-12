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
import { configSchema, Result } from "@/lib/types";

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

export const generateChartConfig = async (
  results: Result[],
  userQuery: string
) => {
  try {
    const { object } = await generateObject({
      model: openai("gpt-4o"),
      system: "You are a data visualization expert.",
      prompt: `Given the following data from a SQL query result, generate the chart config that best visualises the data and answers the users query.
      For multiple groups use multi-lines. The configuration object must include the following fields:
      - type: The type of chart (bar, line, or pie).
      - xKey: The key for the x-axis or category.
      - yKeys: An array of keys for the y-axis values.
      - legend: A boolean indicating whether to show the legend.
      - title: A string for the chart title.
      - description: A string describing the chart.
      - takeaway: A string summarizing the main takeaway from the chart.

      If the chart type is "line", you must also include:
      - multipleLines: A boolean indicating whether the chart compares groups of data.
      - measurementColumn: The key for the quantitative y-axis column.
      - lineCategories: An array of categories used to compare different lines or data series.

      Here is an example object configuration for a line chart:
      export const chartConfig = {
        type: "line",
        xKey: "year",
        yKeys: ["company_count"],
        multipleLines: false,
        measurementColumn: "company_count",
        lineCategories: [],
        legend: true,
        title: "Number of Companies in New York Over Time",
        description: "This line chart shows the number of companies in New York each year.",
        takeaway: "The number of companies in New York has generally increased over time, with a significant spike in 2021."
      }

      Here is an example pie chart config:
      export const chartConfig = {
        type: "pie",
        xKey: "month",
        yKeys: ["sales", "profit", "expenses"],
        legend: true
      }
      
      User Query: 
      ${userQuery}

      Data: 
      ${superjson.stringify(results)}
      `,
      schema: configSchema,
    });

    const colors: Record<string, string> = {};
    object.yKeys.forEach((key, index) => {
      colors[key] = `hsl(var(--chart-${index + 1}))`;
    });

    return {
      ...object,
      colors,
    };
  } catch (error) {
    console.error(error);
  }
};
