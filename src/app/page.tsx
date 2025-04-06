"use client";

import { useState, useCallback, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { PromptForm } from "@/components/prompt-form";
import { PromptOutput } from "@/components/prompt-output";
import { Header } from "@/components/header";
import { Sidebar } from "@/components/sidebar";
import { useAuth } from "../../contexts/auth-context";
import {
  ParsedPromptData,
  useSavedPrompts,
} from "../../contexts/saved-prompts-context";

export default function Home() {
  const searchParams = useSearchParams();
  const { isAuthenticated } = useAuth();
  const { getPromptById, parsePromptContent } = useSavedPrompts();
  const [selectedPromptData, setSelectedPromptData] =
    useState<ParsedPromptData | null>(null);
  const [selectedPromptTitle, setSelectedPromptTitle] = useState<string | null>(
    null
  );
  const [selectedPromptId, setSelectedPromptId] = useState<string | null>(null);

  const handleSelectPrompt = useCallback(
    (promptId: string) => {
      const savedPrompt = getPromptById(promptId);
      if (savedPrompt) {
        const parsedData = parsePromptContent(savedPrompt.content);
        setSelectedPromptData(parsedData);
        setSelectedPromptTitle(savedPrompt.title);
        setSelectedPromptId(promptId);
      }
    },
    [getPromptById, parsePromptContent]
  );
  // URLからプロンプトIDを取得して初期化
  useEffect(() => {
    const promptId = searchParams.get("promptId");
    if (promptId) {
      handleSelectPrompt(promptId);
    }
  }, [searchParams, handleSelectPrompt]);

  return (
    <div className="min-h-screen">
      {isAuthenticated && <Sidebar onSelectPrompt={handleSelectPrompt} />}

      <main>
        <div className="container mx-auto py-10 px-4 md:px-6 max-w-6xl">
          <Header />

          <div className="grid gap-8">
            <PromptForm
              initialData={selectedPromptData}
              selectedPromptTitle={selectedPromptTitle}
              selectedPromptId={selectedPromptId}
              isAuthenticated={isAuthenticated}
            />
            <PromptOutput />
          </div>
        </div>
      </main>
    </div>
  );
}
