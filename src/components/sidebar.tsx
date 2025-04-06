"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

import {
  ChevronLeft,
  ChevronRight,
  Search,
  Clock,
  Plus,
  Edit2,
  Trash2,
  Check,
  X,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
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
import { useSavedPrompts } from "../../contexts/saved-prompts-context";
import { useAuth } from "../../contexts/auth-context";
import { useSidebar } from "../../contexts/sidebar-context";

interface SidebarProps {
  onSelectPrompt: (promptId: string) => void;
}

export function Sidebar({ onSelectPrompt }: SidebarProps) {
  const { savedPrompts, deletePrompt, updatePromptTitle } = useSavedPrompts();
  const { isAuthenticated } = useAuth();
  const { isCollapsed, toggleSidebar } = useSidebar();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredPrompts, setFilteredPrompts] = useState(savedPrompts);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [deletePromptId, setDeletePromptId] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // 検索クエリが変更されたときにプロンプトをフィルタリング
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredPrompts(savedPrompts);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = savedPrompts.filter(
        (prompt) =>
          prompt.title.toLowerCase().includes(query) ||
          prompt.content.toLowerCase().includes(query)
      );
      setFilteredPrompts(filtered);
    }
  }, [searchQuery, savedPrompts]);

  // ログインしていない場合はサイドバーを表示しない
  if (!isAuthenticated) {
    return null;
  }

  // 日付でグループ化する関数
  const groupPromptsByDate = () => {
    const groups: { [key: string]: typeof savedPrompts } = {};

    filteredPrompts.forEach((prompt) => {
      const date = new Date(prompt.createdAt);
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      let groupKey: string;

      if (date.toDateString() === today.toDateString()) {
        groupKey = "今日";
      } else if (date.toDateString() === yesterday.toDateString()) {
        groupKey = "昨日";
      } else {
        groupKey = new Intl.DateTimeFormat("ja-JP", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }).format(date);
      }

      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }

      groups[groupKey].push(prompt);
    });

    return groups;
  };

  const promptGroups = groupPromptsByDate();

  // 編集モードを開始
  const startEditing = (
    id: string,
    currentTitle: string,
    e: React.MouseEvent
  ) => {
    e.stopPropagation(); // 親要素のクリックイベントを停止
    setEditingId(id);
    setEditTitle(currentTitle);
  };

  // 編集をキャンセル
  const cancelEditing = (e: React.MouseEvent) => {
    e.stopPropagation(); // 親要素のクリックイベントを停止
    setEditingId(null);
    setEditTitle("");
  };

  // タイトルを保存
  const saveTitle = (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // 親要素のクリックイベントを停止
    if (editTitle.trim()) {
      updatePromptTitle(id, editTitle.trim());
      setEditingId(null);
      setEditTitle("");
    }
  };

  // 削除確認ダイアログを表示
  const confirmDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // 親要素のクリックイベントを停止
    setDeletePromptId(id);
    setIsDeleteDialogOpen(true);
  };

  // プロンプトを削除
  const handleDelete = () => {
    if (deletePromptId) {
      deletePrompt(deletePromptId);
      setDeletePromptId(null);
      setIsDeleteDialogOpen(false);
    }
  };

  return (
    <>
      {/* 折りたたまれている時のトグルボタン */}
      {isCollapsed && (
        <button
          onClick={toggleSidebar}
          className="fixed top-4 left-4 z-50 flex items-center justify-center w-8 h-8 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-slate-100 transition-colors"
          aria-label="サイドバーを開く"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      )}

      {/* サイドバー本体 */}
      <div
        className={cn(
          "h-screen fixed top-0 left-0 z-40 flex flex-col border-r border-slate-800 bg-slate-900/95 backdrop-blur-sm transition-all duration-300 w-72 shadow-xl",
          isCollapsed ? "-translate-x-full" : "translate-x-0"
        )}
      >
        <div className="flex items-center justify-between p-4 border-b border-slate-800">
          <h2 className="text-lg font-semibold text-slate-200">
            保存したプロンプト
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="text-slate-400 hover:text-slate-200 hover:bg-slate-800"
            aria-label="サイドバーを閉じる"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-3 border-b border-slate-800">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
            <Input
              type="search"
              placeholder="プロンプトを検索..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-slate-800/50 border-slate-700 text-slate-200 placeholder:text-slate-500"
            />
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-3">
            {Object.keys(promptGroups).length > 0 ? (
              Object.entries(promptGroups).map(([date, prompts]) => (
                <div key={date} className="mb-4">
                  <h3 className="text-xs font-medium text-slate-500 mb-2 flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {date}
                  </h3>
                  <div className="space-y-1">
                    {prompts.map((prompt) => (
                      <div
                        key={prompt.id}
                        className="relative group rounded hover:bg-slate-800 transition-colors"
                      >
                        {editingId === prompt.id ? (
                          // 編集モード
                          <div
                            className="p-2 flex items-center gap-2"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Input
                              value={editTitle}
                              onChange={(e) => setEditTitle(e.target.value)}
                              className="bg-slate-800/50 border-slate-700 focus:border-violet-500 focus:ring-violet-500/20 text-slate-200 placeholder:text-slate-500 text-sm"
                              placeholder="プロンプト名を入力"
                              autoFocus
                            />
                            <div className="flex gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={(e) => saveTitle(prompt.id, e)}
                                className="h-7 w-7 text-green-500 hover:text-green-400 hover:bg-green-950/30"
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={cancelEditing}
                                className="h-7 w-7 text-red-500 hover:text-red-400 hover:bg-red-950/30"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ) : (
                          // 通常モード
                          <button
                            onClick={() => onSelectPrompt(prompt.id)}
                            className="w-full text-left p-2 flex flex-col"
                          >
                            <div className="flex items-center justify-between">
                              <div className="truncate text-sm font-medium text-slate-300 group-hover:text-slate-100">
                                {prompt.title}
                              </div>
                              <div className="flex opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={(e) =>
                                    startEditing(prompt.id, prompt.title, e)
                                  }
                                  className="h-6 w-6 text-slate-400 hover:text-slate-200 hover:bg-slate-700"
                                >
                                  <Edit2 className="h-3.5 w-3.5" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={(e) => confirmDelete(prompt.id, e)}
                                  className="h-6 w-6 text-slate-400 hover:text-red-400 hover:bg-red-950/30"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                              </div>
                            </div>
                            <div className="truncate text-xs text-slate-500">
                              {prompt.content.substring(0, 60)}...
                            </div>
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-slate-500 text-sm">
                  保存されたプロンプトはありません
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2 border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-slate-200"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  新しいプロンプトを作成
                </Button>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* サイドバーが開いている時のオーバーレイ */}
      {!isCollapsed && (
        <div
          className="fixed inset-0 bg-black/50 z-30"
          onClick={toggleSidebar}
          aria-hidden="true"
        />
      )}

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
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white border-0"
            >
              削除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
