"use client";

import { FormEvent, useState } from "react";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { HeaderInput } from "@/components/HeaderInput";
import {
  explainSqlQuery,
  generateQuery,
  runGeneratedSqlQuery,
} from "@/actions/actions";
import { Decimal } from "decimal.js";
import { CircleHelp, Loader2Icon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import superjson from "superjson";
import { Explanation, Result } from "@/lib/types";
import { Button } from "@/components/ui/button";

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
  const [queryExplanations, setQueryExplanations] = useState<Explanation[]>([]);
  const [explanationsLoading, setExplanationsLoading] = useState(false);

  // console.log(columns, results);
  console.log(queryExplanations);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
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

      // parse it
      setResults(deserializedResult);
      setColumns(Object.keys(deserializedResult[0]));

      // end
      setLoading(false);
    } catch (error) {}
  };

  const handleExplainQuery = async () => {
    setExplanationsLoading(true);
    const explanations = await explainSqlQuery(inputValue, activeQuery);
    setQueryExplanations(explanations);
    setExplanationsLoading(false);
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
        <div className="p-8 mt-10">
          <HeaderInput
            handleSubmit={handleSubmit}
            input={inputValue}
            handleInputChange={(e) => setInputValue(e.target.value)}
          />
          <Separator className="my-4 dark:bg-slate-600" />

          <div className="flex flex-col dark:bg-slate-800 bg-slate-100 p-4 rounded-md">
            {/* the query area */}
            <div className="flex mb-6">
              {/* The Generated Query */}
              <div className="flex-1 space-y-4 ">
                {!!activeQuery && (
                  <div>
                    <p className="mb-2 font-semibold">Your Query:</p>
                    <div className="font-mono text-sm">{activeQuery}</div>
                  </div>
                )}
              </div>
              {/* Button to Explain the Query */}
              <div className="flex items-center justify-center cursor-pointer">
                {activeQuery && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Button
                          variant={"ghost"}
                          size={"icon"}
                          onClick={handleExplainQuery}
                          disabled={explanationsLoading}
                        >
                          <CircleHelp className="h-6 w-6" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Explain This Query</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
            </div>
            {/* the explanation of the query area */}
            <div>
              {explanationsLoading && (
                <div className="flex space-x-4">
                  <Loader2Icon className="animate-spin" />
                  <span>Loading Explanation for This Query...</span>
                </div>
              )}
              {!explanationsLoading && queryExplanations.length && (
                <div>
                  <p className="mb-2 font-semibold">Query Explanation:</p>
                  {queryExplanations.map(({ explanation, section }) => (
                    <div className="mb-2">
                      <p className="font-mono text-sm italic">{section}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {explanation}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
