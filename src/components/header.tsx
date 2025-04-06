"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { LogIn, LogOut, User } from "lucide-react";
import { AuthModal } from "./auth-modal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "../../contexts/auth-context";

export function Header() {
  const { user, logout, isAuthenticated } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  return (
    <header className="mb-10">
      {/* ナビゲーションバー - 右上に配置 */}
      <div className="flex justify-end mb-4">
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-slate-700 bg-slate-800/70 text-slate-300 hover:bg-slate-700 hover:text-slate-100"
                >
                  <User className="mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">
                    {user?.name || "ユーザー"}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-slate-800 border-slate-700 text-slate-200">
                <DropdownMenuLabel>マイアカウント</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-slate-700" />
                <DropdownMenuItem
                  className="hover:bg-slate-700 cursor-pointer"
                  onClick={logout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  ログアウト
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsAuthModalOpen(true)}
              className="border-slate-700 bg-slate-800/70 text-slate-300 hover:bg-slate-700 hover:text-slate-100"
            >
              <LogIn className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">ログイン</span>
            </Button>
          )}
        </div>
      </div>

      {/* タイトルとサブタイトル - 中央に配置 */}
      <div className="flex flex-col items-center text-center">
        <div className="relative mb-4">
          <div className="absolute -inset-1 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-full blur opacity-70"></div>
          <div className="relative bg-slate-900 rounded-full p-5">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-10 h-10 text-violet-500"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              <path d="M12 7v.01"></path>
              <path d="M16 11v.01"></path>
              <path d="M8 11v.01"></path>
            </svg>
          </div>
        </div>
        <h1 className="text-4xl font-bold tracking-tight mb-2 bg-clip-text text-transparent bg-gradient-to-r from-violet-500 to-fuchsia-500">
          PromptLab
        </h1>
        <p className="text-slate-400 max-w-md text-lg">
          AIプロンプトを構造化して最適化し、より良い結果を得る
        </p>
      </div>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </header>
  );
}
