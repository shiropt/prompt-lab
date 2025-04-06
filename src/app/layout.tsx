import type React from "react";
import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "../../contexts/auth-context";
import { SavedPromptsProvider } from "../../contexts/saved-prompts-context";
import { SidebarProvider } from "../../contexts/sidebar-context";

export const metadata: Metadata = {
  title: "PromptLab - AIプロンプト最適化ツール",
  description:
    "AIプロンプトを構造化して最適化し、より良い結果を得るためのツール",
  generator: "v0.dev",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <body className="bg-gradient-to-b from-slate-950 to-slate-900 min-h-screen">
        <AuthProvider>
          <SavedPromptsProvider>
            <SidebarProvider>
              <ThemeProvider
                attribute="class"
                defaultTheme="dark"
                enableSystem={false}
                storageKey="promptlab-theme"
              >
                {children}
              </ThemeProvider>
            </SidebarProvider>
          </SavedPromptsProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
