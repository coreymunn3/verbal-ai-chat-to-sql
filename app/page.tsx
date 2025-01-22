"use client";

import { FormEvent, useState } from "react";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { HeaderInput } from "@/components/HeaderInput";
import { generateQuery } from "@/actions/actions";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [inputValue, setInputValue] = useState("");
  const [submitted, setSubmitted] = useState(false);
  // const [results, setResults] = useState<Result[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [activeQuery, setActiveQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(1);
  // const [chartConfig, setChartConfig] = useState<Config | null>(null);

  console.log(activeQuery);

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
      console.log("here");
      const query = await generateQuery(question);

      if (query === undefined) {
        toast.error("An error occurred. Please try again.");
        setLoading(false);
        return;
      }
      // for now...
      setActiveQuery(query);
      setLoading(false);
    } catch (error) {}
  };

  const clearExistingData = () => {
    setActiveQuery("");
    // setResults([]);
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

          <div className="flex flex-col space-y-4 ">
            {/* query viewer */}
            {!!activeQuery && (
              <div className="dark:bg-slate-800 bg-slate-100 p-4 rounded-md">
                <p className="mb-2">Your Query:</p>
                <div className="font-mono text-sm">{activeQuery}</div>
                {/* TO DO - query explanation */}
                {/* <Button className="w-full mt-4 ">Explain This Query</Button> */}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
