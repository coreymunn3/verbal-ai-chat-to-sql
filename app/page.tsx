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

import superjson from "superjson";
import { Result } from "@/lib/types";
import QueryExplanation from "@/components/QueryViewer";

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

  console.log("cols and results", columns, results);

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

          {activeQuery && (
            <QueryExplanation
              activeQuery={activeQuery}
              inputValue={inputValue}
            />
          )}
        </div>
      </div>
    </div>
  );
}
