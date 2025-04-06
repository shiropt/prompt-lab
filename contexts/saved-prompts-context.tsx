"use client"

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"
import { useAuth } from "./auth-context"

export type SavedPrompt = {
  id: string
  title: string
  content: string
  createdAt: string
  userId: string
}

export type ParsedPromptData = {
  role: string
  goal: string
  input: string
  context: string
  constraints: string
  tone: string
  format: string
}

type SavedPromptsContextType = {
  savedPrompts: SavedPrompt[]
  savePrompt: (title: string, content: string) => void
  deletePrompt: (id: string) => void
  updatePromptTitle: (id: string, newTitle: string) => void
  getPromptById: (id: string) => SavedPrompt | undefined
  parsePromptContent: (content: string) => ParsedPromptData
}

const STORAGE_KEY = "promptlab_saved_prompts"

const SavedPromptsContext = createContext<SavedPromptsContextType | undefined>(undefined)

export function SavedPromptsProvider({ children }: { children: ReactNode }) {
  const [savedPrompts, setSavedPrompts] = useState<SavedPrompt[]>([])
  const { user } = useAuth()

  // ユーザーIDに基づいたストレージキーを生成
  const getUserStorageKey = useCallback(() => {
    return user ? `${STORAGE_KEY}_${user.id}` : STORAGE_KEY
  }, [user])

  // 初期化時に保存されたプロンプトを読み込む
  useEffect(() => {
    // ログインしていない場合は空の配列を設定
    if (!user) {
      setSavedPrompts([])
      return
    }

    const storageKey = getUserStorageKey()
    const storedPrompts = localStorage.getItem(storageKey)
    if (storedPrompts) {
      setSavedPrompts(JSON.parse(storedPrompts))
    } else {
      setSavedPrompts([])
    }
  }, [getUserStorageKey, user])

  // プロンプトを保存
  const savePrompt = useCallback(
    (title: string, content: string) => {
      // ログインしていない場合は何もしない
      if (!user) return

      const newPrompt: SavedPrompt = {
        id: Date.now().toString(),
        title,
        content,
        createdAt: new Date().toISOString(),
        userId: user.id,
      }

      const updatedPrompts = [...savedPrompts, newPrompt]
      setSavedPrompts(updatedPrompts)
      localStorage.setItem(getUserStorageKey(), JSON.stringify(updatedPrompts))
    },
    [savedPrompts, getUserStorageKey, user],
  )

  // プロンプトを削除
  const deletePrompt = useCallback(
    (id: string) => {
      const updatedPrompts = savedPrompts.filter((prompt) => prompt.id !== id)
      setSavedPrompts(updatedPrompts)
      localStorage.setItem(getUserStorageKey(), JSON.stringify(updatedPrompts))
    },
    [savedPrompts, getUserStorageKey],
  )

  // プロンプトのタイトルを更新
  const updatePromptTitle = useCallback(
    (id: string, newTitle: string) => {
      const updatedPrompts = savedPrompts.map((prompt) => (prompt.id === id ? { ...prompt, title: newTitle } : prompt))
      setSavedPrompts(updatedPrompts)
      localStorage.setItem(getUserStorageKey(), JSON.stringify(updatedPrompts))
    },
    [savedPrompts, getUserStorageKey],
  )

  // IDでプロンプトを取得
  const getPromptById = useCallback(
    (id: string) => {
      return savedPrompts.find((prompt) => prompt.id === id)
    },
    [savedPrompts],
  )

  // プロンプトの内容を解析してフォームデータに変換
  const parsePromptContent = useCallback((content: string): ParsedPromptData => {
    const defaultData: ParsedPromptData = {
      role: "",
      goal: "",
      input: "",
      context: "",
      constraints: "",
      tone: "",
      format: "",
    }

    // プロンプトが空の場合はデフォルト値を返す
    if (!content) return defaultData

    // 各フィールドを抽出
    const roleMatch = content.match(/ロール: (.*?)(?:\n|$)/)
    const goalMatch = content.match(/目的: (.*?)(?:\n|$)/)
    const inputMatch = content.match(/入力: (.*?)(?:\n|$)/)
    const contextMatch = content.match(/背景情報: (.*?)(?:\n|$)/)
    const constraintsMatch = content.match(/制約: (.*?)(?:\n|$)/)
    const toneMatch = content.match(/トーン: (.*?)(?:\n|$)/)
    const formatMatch = content.match(/フォーマット: (.*?)(?:\n|$)/)

    return {
      role: roleMatch ? roleMatch[1] : "",
      goal: goalMatch ? goalMatch[1] : "",
      input: inputMatch ? inputMatch[1] : "",
      context: contextMatch ? contextMatch[1] : "",
      constraints: constraintsMatch ? constraintsMatch[1] : "",
      tone: toneMatch ? toneMatch[1] : "",
      format: formatMatch ? formatMatch[1] : "",
    }
  }, [])

  return (
    <SavedPromptsContext.Provider
      value={{
        savedPrompts,
        savePrompt,
        deletePrompt,
        updatePromptTitle,
        getPromptById,
        parsePromptContent,
      }}
    >
      {children}
    </SavedPromptsContext.Provider>
  )
}

export function useSavedPrompts() {
  const context = useContext(SavedPromptsContext)
  if (context === undefined) {
    throw new Error("useSavedPrompts must be used within a SavedPromptsProvider")
  }
  return context
}

