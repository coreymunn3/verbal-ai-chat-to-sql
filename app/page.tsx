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
  // const [input, setInput] = useState("");
  const [loading, setLoading] = useState<boolean>(false);
  const [blockingAiResponse, setBlockingAiResponse] = useState<string | null>(
    null
  );
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit: handleStreamingSubmit,
  } = useChat();

  // const handleBlockingSubmit = async (e: FormEvent) => {
  //   console.log("getting AI response");
  //   e.preventDefault();
  //   setInput("");
  //   setLoading(true);
  //   const blockingAiResponse = await getAiTextResponse(input);
  //   setBlockingAiResponse(blockingAiResponse);
  //   setLoading(false);
  // };

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
            <form className="flex space-x-2" onSubmit={handleStreamingSubmit}>
              <Input value={input} onChange={handleInputChange} />
              <Button type="submit">Send</Button>
            </form>
          </div>

          <Separator className="my-4" />

          {/* for blocking submit */}
          <div className=" bg-slate-100 dark:bg-slate-800 rounded-md flex items-center justify-center">
            {/* the area where the ai response will be loaded */}
            {loading && (
              <Loader2Icon className="animate-spin h-8 w-8 text-slate-800" />
            )}

            {!loading && blockingAiResponse && (
              <div className="p-8">
                <Markdown>{blockingAiResponse}</Markdown>
              </div>
            )}
          </div>

          <div className="flex flex-col space-y-4 ">
            {messages.map((m) => (
              <div
                key={m.id}
                className="bg-slate-100 dark:bg-slate-700 rounded-lg p-4 flex items-center space-x-2"
              >
                {m.role === "user" ? (
                  <div className="h-10 min-w-10 w-10 rounded-full bg-slate-500 text-white flex items-center justify-center">
                    You
                  </div>
                ) : (
                  <div className="h-10 min-w-10 w-10 rounded-full bg-blue-500 text-white flex items-center justify-center">
                    AI
                  </div>
                )}
                <div>
                  <Markdown>{m.content}</Markdown>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
