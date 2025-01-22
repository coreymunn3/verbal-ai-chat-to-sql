"use client";

import { Separator } from "@/components/ui/separator";
import Markdown from "react-markdown";
import { useChat } from "ai/react";
import { HeaderInput } from "@/components/HeaderInput";

export default function Home() {
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit: handleStreamingSubmit,
  } = useChat();

  return (
    <div className="dark:bg-slate-900 dark:text-white min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="p-8 mt-10">
          <HeaderInput
            handleSubmit={handleStreamingSubmit}
            handleInputChange={handleInputChange}
            input={input}
          />
          <Separator className="my-4" />
          {/* render messages */}
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
