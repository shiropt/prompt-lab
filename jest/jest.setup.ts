import "@testing-library/jest-dom";
import { cleanup } from "@testing-library/react";

// windowオブジェクトにmatchMediaメソッドのモックを追加
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // 非推奨ですが、互換性のために追加
    removeListener: jest.fn(), // 非推奨ですが、互換性のために追加
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// テストごとにクリーンアップを実行
afterEach(() => {
  cleanup();
});
