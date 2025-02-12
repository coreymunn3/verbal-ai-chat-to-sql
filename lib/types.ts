import { z } from "zod";

export type Result = Record<string, string | number>;

export type Explanation = {
  section: string;
  explanation: string;
};

export const configSchema = z
  .object({
    description: z
      .string()
      .describe(
        "Describe the chart. What is it showing? What is interesting about the way the data is displayed?"
      ),
    takeaway: z.string().describe("What is the main takeaway from the chart?"),
    type: z
      .enum(["bar", "line", "pie"])
      .describe("Type of chart - must be either bar, line, or pie"),
    title: z.string(),
    xKey: z.string().describe("Key for x-axis or category"),
    yKeys: z
      .array(z.string())
      .describe(
        "Key(s) for y-axis values this is typically the quantitative column"
      ),
    multipleLines: z
      .boolean()
      .describe(
        "Required for line charts only: whether the chart is comparing groups of data."
      )
      .optional(),
    measurementColumn: z
      .string()
      .describe(
        "Required for line charts only: key for quantitative y-axis column to measure against (eg. values, counts etc.)"
      )
      .optional(),
    lineCategories: z
      .array(z.string())
      .describe(
        "Required for line charts only: Categories used to compare different lines or data series. Each category represents a distinct line in the chart."
      )
      .optional(),
    legend: z.boolean().describe("Whether to show legend"),
  })
  .describe("Chart configuration object");

export type Config = z.infer<typeof configSchema>;
