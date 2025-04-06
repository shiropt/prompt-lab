import { ReactElement } from "react";
import { render, RenderOptions } from "@testing-library/react";
import { ThemeProvider } from "@/components/theme-provider";

// テスト用のカスタムレンダラー
// ThemeProviderなどのコンテキストプロバイダーをラップします
const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">
) => {
  const AllProviders = ({ children }: { children: React.ReactNode }) => {
    return (
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        {children}
      </ThemeProvider>
    );
  };

  return render(ui, { wrapper: AllProviders, ...options });
};

// テスト用のユーティリティをre-exportします
export * from "@testing-library/react";
export { customRender as render };
