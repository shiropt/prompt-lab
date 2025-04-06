"use client";

import type React from "react";

import { useState, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  RefreshCw,
  X,
  Sparkles,
  UserCircle2,
  Target,
  FileInput,
  Brain,
  Lock,
  Pencil,
  FileType,
  FileText,
  Edit2,
  Trash2,
  LogIn,
} from "lucide-react";
import { RichTextEditor } from "./rich-text-editor";
import { motion } from "framer-motion";
import { AuthModal } from "./auth-modal";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  ParsedPromptData,
  useSavedPrompts,
} from "../../contexts/saved-prompts-context";

interface PromptFormProps {
  initialData?: ParsedPromptData | null;
  selectedPromptTitle?: string | null;
  selectedPromptId?: string | null;
  isAuthenticated: boolean;
}

export function PromptForm({
  initialData,
  selectedPromptTitle,
  selectedPromptId,
  isAuthenticated,
}: PromptFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { getPromptById, parsePromptContent, updatePromptTitle, deletePrompt } =
    useSavedPrompts();
  const initialLoadDone = useRef(false);

  const [formData, setFormData] = useState<ParsedPromptData>({
    role: "",
    goal: "",
    input: "",
    context: "",
    constraints: "",
    tone: "",
    format: "",
  });

  // プロンプトタイトル編集関連の状態
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");

  // プロンプト削除関連の状態
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // 認証モーダル関連の状態
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // URLからプロンプトIDを取得し、対応するプロンプトの内容をフォームに読み込む
  // 初回レンダリング時のみ実行
  useEffect(() => {
    if (initialLoadDone.current) return;

    const promptId = searchParams.get("promptId");
    if (promptId) {
      const savedPrompt = getPromptById(promptId);
      if (savedPrompt) {
        const parsedData = parsePromptContent(savedPrompt.content);
        setFormData(parsedData);
      }
    }

    initialLoadDone.current = true;
  }, [searchParams, getPromptById, parsePromptContent]);

  // initialDataが変更されたときにフォームデータを更新
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  // タイトル編集モードを開始
  const startEditingTitle = () => {
    if (!isAuthenticated) {
      setIsAuthModalOpen(true);
      return;
    }

    if (selectedPromptTitle) {
      setEditedTitle(selectedPromptTitle);
      setIsEditingTitle(true);
    }
  };

  // タイトル編集をキャンセル
  const cancelEditingTitle = () => {
    setIsEditingTitle(false);
    setEditedTitle("");
  };

  // タイトルを保存
  const saveTitle = () => {
    if (selectedPromptId && editedTitle.trim()) {
      updatePromptTitle(selectedPromptId, editedTitle.trim());
      setIsEditingTitle(false);
    }
  };

  // プロンプト削除確認ダイアログを表示
  const confirmDeletePrompt = () => {
    if (!isAuthenticated) {
      setIsAuthModalOpen(true);
      return;
    }

    setIsDeleteDialogOpen(true);
  };

  // プロンプトを削除
  const handleDeletePrompt = () => {
    if (selectedPromptId) {
      deletePrompt(selectedPromptId);
      setIsDeleteDialogOpen(false);
      // ホーム画面に戻る
      router.push("/");
      // フォームをリセット
      handleReset();
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 実際のアプリでは、このデータをAPIエンドポイントに送信し、
    // 親コンポーネントで最適化されたプロンプトを更新します
    console.log("フォーム送信:", formData);

    // PromptOutputコンポーネントがリッスンできるカスタムイベントをディスパッチ
    const event = new CustomEvent("prompt:optimize", {
      detail: formData,
    });
    window.dispatchEvent(event);
  };

  const handleReset = () => {
    setFormData({
      role: "",
      goal: "",
      input: "",
      context: "",
      constraints: "",
      tone: "",
      format: "",
    });
  };

  return (
    <>
      {/* 選択されたプロンプトのタイトルを表示 */}
      {selectedPromptTitle && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 flex items-center justify-between gap-2 bg-slate-800/50 p-3 rounded-lg border border-slate-700"
        >
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-violet-400" />
            {isEditingTitle ? (
              <div className="flex items-center gap-2">
                <Input
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  className="bg-slate-800/50 border-slate-700 focus:border-violet-500 focus:ring-violet-500/20 text-slate-200 placeholder:text-slate-500 h-8"
                  placeholder="プロンプト名を入力"
                  autoFocus
                />
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={saveTitle}
                    className="h-7 w-7 text-green-500 hover:text-green-400 hover:bg-green-950/30"
                  >
                    <Sparkles className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={cancelEditingTitle}
                    className="h-7 w-7 text-red-500 hover:text-red-400 hover:bg-red-950/30"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <span className="text-slate-200 font-medium">
                現在のプロンプト: {selectedPromptTitle}
              </span>
            )}
          </div>

          {!isEditingTitle && (
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={startEditingTitle}
                className="h-8 w-8 text-slate-400 hover:text-slate-200 hover:bg-slate-700"
                title={
                  isAuthenticated
                    ? "プロンプト名を編集"
                    : "編集するにはログインが必要です"
                }
              >
                {isAuthenticated ? (
                  <Edit2 className="h-4 w-4" />
                ) : (
                  <LogIn className="h-4 w-4" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={confirmDeletePrompt}
                className="h-8 w-8 text-slate-400 hover:text-red-400 hover:bg-red-950/30"
                title={
                  isAuthenticated
                    ? "プロンプトを削除"
                    : "削除するにはログインが必要です"
                }
              >
                {isAuthenticated ? (
                  <Trash2 className="h-4 w-4" />
                ) : (
                  <LogIn className="h-4 w-4" />
                )}
              </Button>
            </div>
          )}
        </motion.div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid gap-8 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="overflow-hidden border-slate-800 bg-slate-900/50 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-slate-900 to-slate-800 border-b border-slate-800">
                <CardTitle className="flex items-center gap-2 text-xl text-slate-200">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-violet-500/20 text-violet-500">
                    🧱
                  </div>
                  プロンプト構造（基本設計）
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5 p-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="goal"
                    className="flex items-center gap-1.5 text-sm font-medium text-slate-300"
                  >
                    <Target className="h-4 w-4 text-violet-500" />
                    目的（Goal）
                  </Label>
                  <div className="relative group">
                    <Input
                      id="goal"
                      placeholder="何を達成したいか"
                      value={formData.goal}
                      onChange={(e) => handleChange("goal", e.target.value)}
                      className="bg-slate-800/50 border-slate-700 focus:border-violet-500 focus:ring-violet-500/20 text-slate-200 placeholder:text-slate-500 transition-all"
                    />
                    {formData.goal && (
                      <button
                        type="button"
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                        onClick={() => handleChange("goal", "")}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="role"
                    className="flex items-center gap-1.5 text-sm font-medium text-slate-300"
                  >
                    <UserCircle2 className="h-4 w-4 text-violet-500" />
                    ロール（Role）
                  </Label>
                  <div className="relative group">
                    <Input
                      id="role"
                      placeholder="AIにどう振る舞ってほしいか"
                      value={formData.role}
                      onChange={(e) => handleChange("role", e.target.value)}
                      className="bg-slate-800/50 border-slate-700 focus:border-violet-500 focus:ring-violet-500/20 text-slate-200 placeholder:text-slate-500 transition-all"
                    />
                    {formData.role && (
                      <button
                        type="button"
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                        onClick={() => handleChange("role", "")}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="input"
                    className="flex items-center gap-1.5 text-sm font-medium text-slate-300"
                  >
                    <FileInput className="h-4 w-4 text-violet-500" />
                    入力（Input）
                  </Label>
                  <div className="relative group">
                    <RichTextEditor
                      value={formData.input}
                      onChange={(value) => handleChange("input", value)}
                      placeholder="元のプロンプト、草案、素材など"
                      className="border-slate-700 focus-within:border-violet-500 focus-within:ring-2 focus-within:ring-violet-500/20 transition-all bg-slate-800/50"
                    />
                    {formData.input && (
                      <button
                        type="button"
                        className="absolute right-2 top-2 text-slate-500 hover:text-slate-300 transition-colors z-10"
                        onClick={() => handleChange("input", "")}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="context"
                    className="flex items-center gap-1.5 text-sm font-medium text-slate-300"
                  >
                    <Brain className="h-4 w-4 text-violet-500" />
                    背景情報（Context）
                  </Label>
                  <div className="relative group">
                    <RichTextEditor
                      value={formData.context}
                      onChange={(value) => handleChange("context", value)}
                      placeholder="誰向け？どんな前提がある？"
                      className="border-slate-700 focus-within:border-violet-500 focus-within:ring-2 focus-within:ring-violet-500/20 transition-all bg-slate-800/50"
                    />
                    {formData.context && (
                      <button
                        type="button"
                        className="absolute right-2 top-2 text-slate-500 hover:text-slate-300 transition-colors z-10"
                        onClick={() => handleChange("context", "")}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="constraints"
                    className="flex items-center gap-1.5 text-sm font-medium text-slate-300"
                  >
                    <Lock className="h-4 w-4 text-violet-500" />
                    制約（Constraints）
                  </Label>
                  <div className="relative group">
                    <Input
                      id="constraints"
                      placeholder="長さや禁止事項などの制限条件"
                      value={formData.constraints}
                      onChange={(e) =>
                        handleChange("constraints", e.target.value)
                      }
                      className="bg-slate-800/50 border-slate-700 focus:border-violet-500 focus:ring-violet-500/20 text-slate-200 placeholder:text-slate-500 transition-all"
                    />
                    {formData.constraints && (
                      <button
                        type="button"
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                        onClick={() => handleChange("constraints", "")}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="overflow-hidden border-slate-800 bg-slate-900/50 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-slate-900 to-slate-800 border-b border-slate-800">
                <CardTitle className="flex items-center gap-2 text-xl text-slate-200">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-fuchsia-500/20 text-fuchsia-500">
                    🎨
                  </div>
                  出力設定（表現スタイル）
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5 p-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="tone"
                    className="flex items-center gap-1.5 text-sm font-medium text-slate-300"
                  >
                    <Pencil className="h-4 w-4 text-fuchsia-500" />
                    トーン（Tone）
                  </Label>
                  <div className="relative group">
                    <Select
                      value={formData.tone}
                      onValueChange={(value) => handleChange("tone", value)}
                    >
                      <SelectTrigger
                        id="tone"
                        className="bg-slate-800/50 border-slate-700 focus:border-violet-500 focus:ring-violet-500/20 text-slate-200 transition-all"
                      >
                        <SelectValue placeholder="出力の文体・雰囲気" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border border-slate-600 text-slate-200 shadow-lg">
                        <SelectItem
                          value="casual"
                          className="focus:bg-slate-700 focus:text-slate-100"
                        >
                          カジュアル
                        </SelectItem>
                        <SelectItem
                          value="business"
                          className="focus:bg-slate-700 focus:text-slate-100"
                        >
                          ビジネス
                        </SelectItem>
                        <SelectItem
                          value="funny"
                          className="focus:bg-slate-700 focus:text-slate-100"
                        >
                          ユーモラス
                        </SelectItem>
                        <SelectItem
                          value="formal"
                          className="focus:bg-slate-700 focus:text-slate-100"
                        >
                          フォーマル
                        </SelectItem>
                        <SelectItem
                          value="friendly"
                          className="focus:bg-slate-700 focus:text-slate-100"
                        >
                          フレンドリー
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    {formData.tone && (
                      <button
                        type="button"
                        className="absolute right-10 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors z-10"
                        onClick={() => handleChange("tone", "")}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="format"
                    className="flex items-center gap-1.5 text-sm font-medium text-slate-300"
                  >
                    <FileType className="h-4 w-4 text-fuchsia-500" />
                    出力フォーマット（Format）
                  </Label>
                  <div className="relative group">
                    <Select
                      value={formData.format}
                      onValueChange={(value) => handleChange("format", value)}
                    >
                      <SelectTrigger
                        id="format"
                        className="bg-slate-800/50 border-slate-700 focus:border-violet-500 focus:ring-violet-500/20 text-slate-200 transition-all"
                      >
                        <SelectValue placeholder="箇条書き／Markdown／コード解説など" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border border-slate-600 text-slate-200 shadow-lg">
                        <SelectItem
                          value="paragraph"
                          className="focus:bg-slate-700 focus:text-slate-100"
                        >
                          段落
                        </SelectItem>
                        <SelectItem
                          value="bullets"
                          className="focus:bg-slate-700 focus:text-slate-100"
                        >
                          箇条書き
                        </SelectItem>
                        <SelectItem
                          value="markdown"
                          className="focus:bg-slate-700 focus:text-slate-100"
                        >
                          マークダウン
                        </SelectItem>
                        <SelectItem
                          value="code"
                          className="focus:bg-slate-700 focus:text-slate-100"
                        >
                          コード
                        </SelectItem>
                        <SelectItem
                          value="table"
                          className="focus:bg-slate-700 focus:text-slate-100"
                        >
                          表
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    {formData.format && (
                      <button
                        type="button"
                        className="absolute right-10 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors z-10"
                        onClick={() => handleChange("format", "")}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="mt-8 p-6 bg-slate-800/30 rounded-lg border border-slate-700/50">
                  <div className="flex flex-col items-center text-center space-y-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 text-violet-500">
                      <Brain className="h-6 w-6 text-violet-400" />
                    </div>
                    <h3 className="text-lg font-medium text-slate-200">
                      プロンプト最適化
                    </h3>
                    <p className="text-sm text-slate-400 max-w-md">
                      入力した情報を基に、AIがプロンプトを最適化します。各項目を埋めて「最適化」ボタンをクリックしてください。
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <motion.div
          className="flex justify-center gap-4 mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Button
            type="submit"
            size="lg"
            className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white shadow-lg shadow-violet-900/20 hover:shadow-violet-900/30 transition-all duration-200 px-8 border-0"
          >
            <Sparkles className="mr-2 h-4 w-4" />
            最適化
          </Button>
          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={handleReset}
            className="border-slate-600 bg-slate-800/70 text-slate-100 hover:bg-slate-700 hover:border-slate-500 hover:text-white transition-all duration-200"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            リセット
          </Button>
        </motion.div>
      </form>

      {/* 削除確認ダイアログ */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent className="bg-slate-900 border-slate-800 text-slate-200">
          <AlertDialogHeader>
            <AlertDialogTitle>プロンプトを削除しますか？</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-400">
              この操作は元に戻せません。このプロンプトは完全に削除されます。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-slate-200">
              キャンセル
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeletePrompt}
              className="bg-red-600 hover:bg-red-700 text-white border-0"
            >
              削除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* 認証モーダル */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </>
  );
}
