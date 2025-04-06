import type { Config } from "jest";
import nextJest from "next/jest";

const createJestConfig = nextJest({
  // next.config.jsとは異なり、テスト環境のNext.jsの設定を提供します
  dir: "./",
});

// Jest設定をカスタマイズします
const config: Config = {
  testEnvironment: "jest-environment-jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest/jest.setup.ts"],
  moduleNameMapper: {
    // パスエイリアスの設定（tsconfig.jsonに合わせる）
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  testPathIgnorePatterns: [
    "<rootDir>/node_modules/",
    "<rootDir>/.next/",
    "<rootDir>/src/__tests__/utils/", // テストユーティリティを除外
  ],
  collectCoverage: true,
  collectCoverageFrom: [
    "src/**/*.{js,jsx,ts,tsx}",
    "!src/**/*.d.ts",
    "!**/node_modules/**",
    "!src/__tests__/utils/**", // カバレッジからもテストユーティリティを除外
  ],
};

// createJestConfigを使用して、Next.jsとJestの設定をマージします
export default createJestConfig(config);
