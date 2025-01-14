"use client";

import DarkModeToggle from "@/components/DarkModeToggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { useState } from "react";

export default function Home() {
  const [input, setInput] = useState("");
  console.log(input);

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

          <div className="flex space-x-2">
            <Input value={input} onChange={(e) => setInput(e.target.value)} />
            <Button>Send</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
