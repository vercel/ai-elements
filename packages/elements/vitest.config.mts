import path from "node:path";
import react from "@vitejs/plugin-react";
import { playwright } from "@vitest/browser-playwright";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    browser: {
      enabled: true,
      provider: playwright(),
      headless: true,
      instances: [{ browser: "chromium" }],
    },
    setupFiles: ["./__tests__/setup.ts"],
    include: ["__tests__/**/*.test.{ts,tsx}"],
    server: {
      deps: {
        inline: ["streamdown", "katex"],
      },
    },
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: [
        "node_modules/",
        "__tests__/**",
        "**/*.config.{ts,js,mts}",
        "**/styleMock.js",
      ],
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@repo/shadcn-ui/lib/utils": path.resolve(
        __dirname,
        "../shadcn-ui/lib/utils.ts"
      ),
      "@repo/shadcn-ui/components": path.resolve(
        __dirname,
        "../shadcn-ui/components"
      ),
      "katex/dist/katex.min.css": path.resolve(
        __dirname,
        "./__tests__/styleMock.js"
      ),
    },
  },
});
