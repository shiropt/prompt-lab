"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, Sparkles, ArrowRight, Brain, Save, LogIn } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import { SavePromptModal } from "./save-prompt-modal";
import { AuthModal } from "./auth-modal";
import { useAuth } from "../../contexts/auth-context";
// 必要なインポートを追加

type FormData = {
  role: string;
  goal: string;
  input: string;
  context: string;
  constraints: string;
  tone: string;
  format: string;
};

export function PromptOutput() {
  // 既存のstateに加えて、useAuthを使用
  const { isAuthenticated } = useAuth();
  const [optimizedPrompt, setOptimizedPrompt] = useState("");
  const [originalPrompt, setOriginalPrompt] = useState("");
  const [copied, setCopied] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const createPromptFromData = useCallback((data: FormData): string => {
    let prompt = "";

    if (data.role) prompt += `ロール: ${data.role}\n`;
    if (data.goal) prompt += `目的: ${data.goal}\n`;
    if (data.input) {
      // HTMLからプレーンテキストを抽出
      const inputText = stripHtml(data.input);
      prompt += `入力: ${inputText}\n`;
    }
    if (data.context) {
      // HTMLからプレーンテキストを抽出
      const contextText = stripHtml(data.context);
      prompt += `背景情報: ${contextText}\n`;
    }
    if (data.constraints) prompt += `制約: ${data.constraints}\n`;
    if (data.tone) prompt += `トーン: ${data.tone}\n`;
    if (data.format) prompt += `フォーマット: ${data.format}\n`;

    return prompt;
  }, []);

  useEffect(() => {
    const handleOptimize = (event: CustomEvent<FormData>) => {
      const data = event.detail;

      // フォームデータから元のプロンプトを作成
      const original = createPromptFromData(data);
      setOriginalPrompt(original);

      // 最適化中の状態を設定
      setIsOptimizing(true);

      // 実際のアプリでは、AIサービスを呼び出してプロンプトを最適化します
      // デモ目的では、タイマーで遅延を追加して処理中の表示をシミュレート
      setTimeout(() => {
        const optimized = enhancePrompt(original);
        setOptimizedPrompt(optimized);
        setIsOptimizing(false);
      }, 1500);
    };

    // イベントリスナーを追加
    window.addEventListener("prompt:optimize", handleOptimize as EventListener);

    // クリーンアップ
    return () => {
      window.removeEventListener(
        "prompt:optimize",
        handleOptimize as EventListener
      );
    };
  }, [createPromptFromData]);

  const stripHtml = (html: string) => {
    // HTMLタグを削除して純粋なテキストを取得
    const doc = new DOMParser().parseFromString(html, "text/html");
    return doc.body.textContent || "";
  };

  const enhancePrompt = (prompt: string): string => {
    // これは実際のAI最適化のプレースホルダーです
    // 実際のアプリでは、AIサービスへのAPI呼び出しに置き換えられます
    return prompt.length > 0
      ? `あなたには${
          prompt.includes("ロール:")
            ? prompt.split("ロール:")[1].split("\n")[0].trim()
            : "アシスタント"
        }として行動してほしいです。

${prompt}

上記の仕様に従って回答してください。徹底的かつ明確に、言及されたすべての制約に従ってください。`
      : "";
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(optimizedPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveClick = () => {
    setIsSaveModalOpen(true);
  };

  const handleLoginRequest = () => {
    setIsAuthModalOpen(true);
  };

  if (isOptimizing) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="mt-6 border-slate-800 bg-slate-900/50 backdrop-blur-sm overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-slate-900 to-slate-800 border-b border-slate-800">
            <CardTitle className="flex items-center gap-2 text-xl text-slate-200">
              <div className="animate-spin">
                <Sparkles className="h-5 w-5 text-violet-500" />
              </div>
              プロンプトを最適化中...
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="flex flex-col items-center justify-center py-10">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-full blur opacity-70 animate-pulse"></div>
                <div className="relative bg-slate-900 rounded-full p-4">
                  <Brain className="h-10 w-10 text-violet-500 animate-pulse" />
                </div>
              </div>
              <p className="mt-4 text-slate-400">
                AIがプロンプトを最適化しています...
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  if (!optimizedPrompt) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card className="mt-6 border-slate-800 bg-slate-900/50 backdrop-blur-sm overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-slate-900 to-slate-800 border-b border-slate-800">
            <CardTitle className="flex items-center gap-2 text-xl text-slate-200">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-violet-500/20 text-violet-500">
                🧠
              </div>
              最適化されたプロンプト
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-lg p-8 text-center">
              <div className="flex flex-col items-center mb-4">
                <ArrowRight className="h-8 w-8 text-violet-500 mb-2" />
                <p className="text-lg font-medium text-slate-200">
                  プロンプトを最適化しましょう
                </p>
              </div>
              <p className="text-slate-400">
                上のフォームに記入して「最適化」をクリックすると、AIがプロンプトを強化します
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="mt-6 border-slate-800 bg-slate-900/50 backdrop-blur-sm overflow-hidden">
        {/* CardHeaderの部分を更新して、保存ボタンをログイン済みユーザーのみに表示 */}
        <CardHeader className="bg-gradient-to-r from-slate-900 to-slate-800 border-b border-slate-800 flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-xl text-slate-200">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-violet-500/20 text-violet-500">
              🧠
            </div>
            最適化されたプロンプト
          </CardTitle>
          <div className="flex gap-2">
            {isAuthenticated ? (
              <Button
                variant="outline"
                size="sm"
                onClick={handleSaveClick}
                className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-slate-200 transition-all duration-200"
              >
                <Save className="mr-2 h-4 w-4" />
                保存
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsAuthModalOpen(true)}
                className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-slate-200 transition-all duration-200"
              >
                <LogIn className="mr-2 h-4 w-4" />
                ログイン
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={copyToClipboard}
              className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-slate-200 transition-all duration-200"
            >
              <Copy className="mr-2 h-4 w-4" />
              {copied ? "コピーしました！" : "コピー"}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <Tabs defaultValue="optimized" className="w-full">
            <TabsList className="mb-4 bg-slate-800 p-1 rounded-lg">
              <TabsTrigger
                value="optimized"
                className="data-[state=active]:bg-slate-700 data-[state=active]:text-slate-100 text-slate-400 rounded-md transition-all"
              >
                最適化済み
              </TabsTrigger>
              <TabsTrigger
                value="compare"
                className="data-[state=active]:bg-slate-700 data-[state=active]:text-slate-100 text-slate-400 rounded-md transition-all"
              >
                比較
              </TabsTrigger>
            </TabsList>

            <TabsContent value="optimized">
              <Textarea
                className="min-h-[200px] font-mono text-sm bg-slate-800/50 border-slate-700 focus:border-violet-500 focus:ring-violet-500/20 text-slate-200 transition-all"
                value={optimizedPrompt}
                readOnly
              />
            </TabsContent>

            <TabsContent value="compare">
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <h3 className="text-sm font-medium mb-2 flex items-center gap-1 text-slate-300">
                    <span className="inline-block w-2 h-2 bg-slate-500 rounded-full"></span>
                    オリジナル
                  </h3>
                  <Textarea
                    className="min-h-[200px] font-mono text-sm bg-slate-800/50 border-slate-700 focus:border-violet-500 focus:ring-violet-500/20 text-slate-200 transition-all"
                    value={originalPrompt}
                    readOnly
                  />
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-2 flex items-center gap-1 text-slate-300">
                    <span className="inline-block w-2 h-2 bg-violet-500 rounded-full"></span>
                    最適化済み
                  </h3>
                  <Textarea
                    className="min-h-[200px] font-mono text-sm bg-slate-800/50 border-slate-700 focus:border-violet-500 focus:ring-violet-500/20 text-slate-200 transition-all"
                    value={optimizedPrompt}
                    readOnly
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* 保存モーダル */}
      <SavePromptModal
        isOpen={isSaveModalOpen}
        onClose={() => setIsSaveModalOpen(false)}
        promptContent={optimizedPrompt}
        onLoginRequest={handleLoginRequest}
      />

      {/* 認証モーダル */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </motion.div>
  );
}
