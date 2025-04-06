"use client";

import type React from "react";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { Loader2, LogIn } from "lucide-react";
import { useSavedPrompts } from "../../contexts/saved-prompts-context";
import { useAuth } from "../../contexts/auth-context";

interface SavePromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  promptContent: string;
  onLoginRequest: () => void;
}

export function SavePromptModal({
  isOpen,
  onClose,
  promptContent,
  onLoginRequest,
}: SavePromptModalProps) {
  const [title, setTitle] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const { savePrompt } = useSavedPrompts();
  const { isAuthenticated } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    // 保存処理を少し遅延させてUXを向上
    await new Promise((resolve) => setTimeout(resolve, 500));

    savePrompt(title, promptContent);
    setIsSaving(false);
    setTitle("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-slate-900 border-slate-800 text-slate-200">
        <DialogHeader>
          <DialogTitle className="text-xl text-slate-100">
            プロンプトを保存
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            後で使用するためにこのプロンプトに名前を付けて保存します
          </DialogDescription>
        </DialogHeader>

        {isAuthenticated ? (
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-slate-300">
                  タイトル
                </Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="プロンプトのタイトル"
                  className="bg-slate-800/50 border-slate-700 text-slate-200 placeholder:text-slate-500"
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-slate-200"
              >
                キャンセル
              </Button>
              <Button
                type="submit"
                disabled={isSaving || !title.trim()}
                className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    保存中...
                  </>
                ) : (
                  "保存"
                )}
              </Button>
            </DialogFooter>
          </form>
        ) : (
          <div className="py-6">
            <div className="text-center mb-6">
              <p className="text-slate-300 mb-4">
                プロンプトを保存するには、ログインが必要です。
              </p>
              <Button
                onClick={() => {
                  onClose();
                  onLoginRequest();
                }}
                className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white"
              >
                <LogIn className="mr-2 h-4 w-4" />
                ログインする
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
