"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export type User = {
  id: string
  email: string
  name: string
}

type AuthContextType = {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>
  register: (email: string, password: string, name: string) => Promise<{ success: boolean; message: string }>
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const USERS_STORAGE_KEY = "promptlab_users"
const CURRENT_USER_KEY = "promptlab_current_user"

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // 初期化時にログイン状態を復元
  useEffect(() => {
    const storedUser = localStorage.getItem(CURRENT_USER_KEY)
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (error) {
        console.error("Failed to parse stored user:", error)
        localStorage.removeItem(CURRENT_USER_KEY)
      }
    }
    setIsLoading(false)
  }, [])

  // ユーザー登録
  const register = async (
    email: string,
    password: string,
    name: string,
  ): Promise<{ success: boolean; message: string }> => {
    // 既存ユーザーを取得
    const storedUsers = localStorage.getItem(USERS_STORAGE_KEY)
    const users = storedUsers ? JSON.parse(storedUsers) : []

    // メールアドレスが既に使用されているか確認
    if (users.some((u: any) => u.email === email)) {
      return { success: false, message: "このメールアドレスは既に使用されています" }
    }

    // 新しいユーザーを作成
    const newUser = {
      id: Date.now().toString(),
      email,
      password, // 実際のアプリではパスワードをハッシュ化する
      name,
    }

    // ユーザーを保存
    const updatedUsers = [...users, newUser]
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updatedUsers))

    // ユーザー情報からパスワードを除外して保存
    const { password: _, ...userWithoutPassword } = newUser
    setUser(userWithoutPassword)
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userWithoutPassword))

    return { success: true, message: "登録が完了しました" }
  }

  // ログイン
  const login = async (email: string, password: string): Promise<{ success: boolean; message: string }> => {
    // 既存ユーザーを取得
    const storedUsers = localStorage.getItem(USERS_STORAGE_KEY)
    const users = storedUsers ? JSON.parse(storedUsers) : []

    // ユーザーを検索
    const foundUser = users.find((u: any) => u.email === email && u.password === password)

    if (!foundUser) {
      return { success: false, message: "メールアドレスまたはパスワードが正しくありません" }
    }

    // ユーザー情報からパスワードを除外して保存
    const { password: _, ...userWithoutPassword } = foundUser
    setUser(userWithoutPassword)
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userWithoutPassword))

    return { success: true, message: "ログインしました" }
  }

  // ログアウト
  const logout = () => {
    setUser(null)
    localStorage.removeItem(CURRENT_USER_KEY)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

