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
import { Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "../../contexts/auth-context";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type AuthMode = "login" | "register";

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const { login, register } = useAuth();

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setName("");
    setError(null);
    setSuccess(null);
  };

  const toggleMode = () => {
    resetForm();
    setMode(mode === "login" ? "register" : "login");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (mode === "login") {
        const result = await login(email, password);
        if (result.success) {
          setSuccess(result.message);
          setTimeout(() => {
            onClose();
            resetForm();
          }, 1500);
        } else {
          setError(result.message);
        }
      } else {
        const result = await register(email, password, name);
        if (result.success) {
          setSuccess(result.message);
          setTimeout(() => {
            onClose();
            resetForm();
          }, 1500);
        } else {
          setError(result.message);
        }
      }
    } catch (err) {
      setError("エラーが発生しました。もう一度お試しください。");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-slate-900 border-slate-800 text-slate-200">
        <DialogHeader>
          <DialogTitle className="text-xl text-slate-100">
            {mode === "login" ? "ログイン" : "アカウント登録"}
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            {mode === "login"
              ? "アカウントにログインしてプロンプトを保存・管理しましょう"
              : "新しいアカウントを作成してプロンプトを保存・管理しましょう"}
          </DialogDescription>
        </DialogHeader>

        {error && (
          <Alert
            variant="destructive"
            className="bg-red-950/50 border-red-800 text-red-300"
          >
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="bg-green-950/50 border-green-800 text-green-300">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {mode === "register" && (
              <div className="space-y-2">
                <Label htmlFor="name" className="text-slate-300">
                  名前
                </Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="あなたの名前"
                  className="bg-slate-800/50 border-slate-700 text-slate-200 placeholder:text-slate-500"
                  required
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-300">
                メールアドレス
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="bg-slate-800/50 border-slate-700 text-slate-200 placeholder:text-slate-500"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-300">
                パスワード
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="パスワード"
                className="bg-slate-800/50 border-slate-700 text-slate-200 placeholder:text-slate-500"
                required
              />
            </div>
          </div>

          <DialogFooter className="flex-col sm:flex-col gap-2">
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {mode === "login" ? "ログイン中..." : "登録中..."}
                </>
              ) : mode === "login" ? (
                "ログイン"
              ) : (
                "登録"
              )}
            </Button>

            <div className="text-center w-full mt-2">
              <button
                type="button"
                onClick={toggleMode}
                className="text-sm text-violet-400 hover:text-violet-300 transition-colors"
              >
                {mode === "login"
                  ? "アカウントをお持ちでない方はこちら"
                  : "既にアカウントをお持ちの方はこちら"}
              </button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
