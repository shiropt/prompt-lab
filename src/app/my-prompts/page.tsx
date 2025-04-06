"use client";

import type React from "react";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ArrowLeft,
  Trash2,
  Copy,
  Check,
  X,
  Edit2,
  ExternalLink,
  LogIn,
} from "lucide-react";
import Link from "next/link";

// 必要なインポートを追加
import { AuthModal } from "@/components/auth-modal";
import {
  SavedPrompt,
  useSavedPrompts,
} from "../../../contexts/saved-prompts-context";
import { useAuth } from "../../../contexts/auth-context";

export default function MyPromptsPage() {
  const { savedPrompts, deletePrompt, updatePromptTitle } = useSavedPrompts();
  const { isAuthenticated } = useAuth();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("ja-JP", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const copyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content);
  };

  const startEditing = (
    id: string,
    currentTitle: string,
    event: React.MouseEvent
  ) => {
    event.stopPropagation(); // 親要素のクリックイベントを停止
    setEditingId(id);
    setEditTitle(currentTitle);
  };

  const cancelEditing = (event: React.MouseEvent) => {
    event.stopPropagation(); // 親要素のクリックイベントを停止
    setEditingId(null);
    setEditTitle("");
  };

  const saveTitle = (id: string, event: React.MouseEvent) => {
    event.stopPropagation(); // 親要素のクリックイベントを停止
    if (editTitle.trim()) {
      updatePromptTitle(id, editTitle.trim());
      setEditingId(null);
      setEditTitle("");
    }
  };

  // ホーム画面に遷移し、プロンプトIDをクエリパラメータとして渡す
  const handlePromptClick = (promptId: string) => {
    // 直接 window.location を使用してナビゲーションを行う
    // これにより、Next.js のクライアントサイドナビゲーションをバイパスし、
    // 完全なページリロードを強制します
    window.location.href = `/?promptId=${promptId}`;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation(); // 親要素のクリックイベントを停止
    setEditTitle(e.target.value);
  };

  // return文の前に以下を追加
  if (!isAuthenticated) {
    return (
      <div className="container mx-auto py-10 px-4 md:px-6 max-w-6xl">
        <div className="flex items-center mb-8">
          <Link href="/">
            <Button
              variant="outline"
              size="sm"
              className="mr-4 border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-slate-200"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              戻る
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-slate-200">
            保存したプロンプト
          </h1>
        </div>

        <Card className="border-slate-800 bg-slate-900/50 backdrop-blur-sm overflow-hidden">
          <CardContent className="p-8 text-center">
            <p className="text-slate-400 mb-4">
              プロンプトを表示するには、ログインが必要です
            </p>
            <Button
              onClick={() => setIsAuthModalOpen(true)}
              className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white"
            >
              <LogIn className="mr-2 h-4 w-4" />
              ログインする
            </Button>
          </CardContent>
        </Card>

        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4 md:px-6 max-w-6xl">
      <div className="flex items-center mb-8">
        <Link href="/">
          <Button
            variant="outline"
            size="sm"
            className="mr-4 border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-slate-200"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            戻る
          </Button>
        </Link>
        <h1 className="text-2xl font-bold text-slate-200">
          保存したプロンプト
        </h1>
      </div>

      {savedPrompts.length === 0 ? (
        <Card className="border-slate-800 bg-slate-900/50 backdrop-blur-sm overflow-hidden">
          <CardContent className="p-8 text-center">
            <p className="text-slate-400">保存されたプロンプトはありません</p>
            <Link href="/" className="mt-4 inline-block">
              <Button className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white">
                プロンプトを作成する
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {savedPrompts.map((prompt: SavedPrompt) => (
            <Card
              key={prompt.id}
              className="border-slate-800 bg-slate-900/50 backdrop-blur-sm overflow-hidden hover:border-violet-800 transition-colors cursor-pointer"
              onClick={() => handlePromptClick(prompt.id)}
            >
              <CardHeader className="pb-2">
                {editingId === prompt.id ? (
                  <div
                    className="flex items-center gap-2"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Input
                      value={editTitle}
                      onChange={handleInputChange}
                      className="bg-slate-800/50 border-slate-700 focus:border-violet-500 focus:ring-violet-500/20 text-slate-200 placeholder:text-slate-500"
                      placeholder="タイトルを入力"
                      autoFocus
                    />
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => saveTitle(prompt.id, e)}
                        className="h-8 w-8 text-green-500 hover:text-green-400 hover:bg-green-950/30"
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={cancelEditing}
                        className="h-8 w-8 text-red-500 hover:text-red-400 hover:bg-red-950/30"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-slate-200 flex items-center gap-1 group">
                      {prompt.title}
                      <ExternalLink className="h-3.5 w-3.5 ml-1 text-slate-400" />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 ml-1 text-slate-400 hover:text-slate-200 hover:bg-slate-800/70"
                        onClick={(e) =>
                          startEditing(prompt.id, prompt.title, e)
                        }
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </Button>
                    </CardTitle>
                  </div>
                )}
                <CardDescription className="text-slate-400 mt-1">
                  {formatDate(prompt.createdAt)}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="max-h-40 overflow-y-auto bg-slate-800/50 rounded p-3 text-sm text-slate-300 font-mono">
                  {prompt.content.split("\n").map((line, i) => (
                    <p key={i} className={i > 0 ? "mt-1" : ""}>
                      {line}
                    </p>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    deletePrompt(prompt.id);
                  }}
                  className="border-slate-700 text-red-400 hover:bg-red-950/30 hover:text-red-300 hover:border-red-900"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    copyToClipboard(prompt.content);
                  }}
                  className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-slate-200"
                >
                  <Copy className="mr-2 h-4 w-4" />
                  コピー
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
