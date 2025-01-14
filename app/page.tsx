"use client";

import { getAiTextResponse } from "@/actions/actions";
import DarkModeToggle from "@/components/DarkModeToggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Loader2Icon } from "lucide-react";
import { FormEvent, useState } from "react";
import Markdown from "react-markdown";
import { useChat } from "ai/react";

export default function Home() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState<boolean>(false);
  const [aiResponse, setAiResponse] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    console.log("getting AI response");
    e.preventDefault();
    setInput("");
    setLoading(true);
    const aiResponse = await getAiTextResponse(input);
    setAiResponse(aiResponse);
    setLoading(false);
  };

  return (
    <div className="dark:bg-slate-900 dark:text-white h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="p-8 mt-10">
          <div className="flex justify-between align-middle mb-10">
            <div className="font-bold text-3xl">
              Natural Language to PostgreSQL
            </div>
            <DarkModeToggle />
          </div>

          <div>
            <form className="flex space-x-2" onSubmit={handleSubmit}>
              <Input value={input} onChange={(e) => setInput(e.target.value)} />
              <Button type="submit">Send</Button>
            </form>
          </div>

          <Separator className="my-4" />

          <div className="min-h-20  bg-slate-100 dark:bg-slate-800 rounded-md flex items-center justify-center">
            {/* the area where the ai response will be loaded */}
            {loading && (
              <Loader2Icon className="animate-spin h-8 w-8 text-slate-800" />
            )}
            {!loading && aiResponse && (
              <div className="p-8">
                <Markdown>{aiResponse}</Markdown>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
