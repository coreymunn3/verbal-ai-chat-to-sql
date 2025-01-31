"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CircleHelp, Loader2Icon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Explanation } from "@/lib/types";
import { explainSqlQuery } from "@/actions/actions";

interface QueryExplanationProps {
  activeQuery: string;
  inputValue: string;
}

const QueryExplanation = ({
  activeQuery,
  inputValue,
}: QueryExplanationProps) => {
  const [queryExplanations, setQueryExplanations] = useState<Explanation[]>([]);
  const [explanationsLoading, setExplanationsLoading] = useState(false);

  const handleExplainQuery = async () => {
    setExplanationsLoading(true);
    const explanations = await explainSqlQuery(inputValue, activeQuery);
    setQueryExplanations(explanations);
    setExplanationsLoading(false);
  };

  return (
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
        {!explanationsLoading && queryExplanations.length > 0 && (
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
  );
};
export default QueryExplanation;
