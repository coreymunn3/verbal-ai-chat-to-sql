"use client";

import { FormEvent, useState } from "react";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { HeaderInput } from "@/components/HeaderInput";
import {
  explainSqlQuery,
  generateChartConfig,
  generateQuery,
  runGeneratedSqlQuery,
} from "@/actions/actions";
import { Decimal } from "decimal.js";

import superjson from "superjson";
import { Config, Result } from "@/lib/types";
import QueryViewer from "@/components/QueryViewer";
import { Loader2Icon } from "lucide-react";
import ResultsViewer from "@/components/ResultsViewer";

superjson.registerCustom<Decimal, string>(
  {
    isApplicable: (v): v is Decimal => Decimal.isDecimal(v),
    serialize: (v) => v.toJSON(),
    deserialize: (v) => new Decimal(v),
  },
  "decimal.js"
);

export default function Home() {
  const [inputValue, setInputValue] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState<Result[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [activeQuery, setActiveQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(1);
  const [chartConfig, setChartConfig] = useState<Config | undefined>();

  console.log("cols and results", columns, superjson.stringify(results));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    // clean up previous queries
    handleClear();

    // save the question and process it
    const question = inputValue;
    if (inputValue.length === 0) return;
    clearExistingData();
    if (question.trim()) {
      setSubmitted(true);
    }
    setLoading(true);
    setLoadingStep(1);
    // generate the query
    try {
      const query = await generateQuery(question);

      if (query === undefined) {
        toast.error("An error occurred. Please try again.");
        setLoading(false);
        return;
      }
      // show the query
      setActiveQuery(query);
      setLoadingStep(2);
      // generate the actual result from the query
      const queryResult = await runGeneratedSqlQuery(query);
      const deserializedResult: Result[] = superjson.deserialize(queryResult);

      // parse it & set data attrs
      setResults(deserializedResult);
      setColumns(Object.keys(deserializedResult[0]));
      setLoading(false);

      // generate chart config & save
      setLoadingStep(3);
      const generatedChartConfig = await generateChartConfig(
        deserializedResult,
        question
      );
      setChartConfig(generatedChartConfig);

      // clean up
      setLoadingStep(1);
    } catch (error) {}
  };

  const clearExistingData = () => {
    setActiveQuery("");
    setResults([]);
    setColumns([]);
    // setChartConfig(null);
  };

  const handleClear = () => {
    setSubmitted(false);
    setInputValue("");
    clearExistingData();
  };

  return (
    <div className="dark:bg-slate-900 dark:text-white min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col gap-4 p-8 mt-10 min-h-screen">
          <HeaderInput
            handleSubmit={handleSubmit}
            input={inputValue}
            handleInputChange={(e) => setInputValue(e.target.value)}
          />
          <Separator className="my-4 dark:bg-slate-600" />

          {activeQuery.length > 0 && (
            <QueryViewer activeQuery={activeQuery} inputValue={inputValue} />
          )}

          <div className="w-full">
            {loading ? (
              <div className="w-full h-96 flex flex-col items-center justify-center space-y-4">
                <Loader2Icon className="h-12 w-12 animate-spin text-muted-foreground" />
                <p className="text-foreground/70">
                  {loadingStep === 1
                    ? "Generating SQL Query..."
                    : loadingStep === 2
                    ? "Querying the Database..."
                    : "Generating Chart Config..."}
                </p>
              </div>
            ) : results.length === 0 ? (
              <div className="flex items-center justify-center">
                <p className="text-center text-muted-foreground">
                  No Results Found
                </p>
              </div>
            ) : (
              <div className="">
                {results.length > 0 && columns.length > 0 && !!chartConfig && (
                  <ResultsViewer
                    results={results}
                    columns={columns}
                    chartConfig={chartConfig}
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
