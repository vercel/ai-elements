import react from "@vitejs/plugin-react";
import { playwright } from "@vitest/browser-playwright";
import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
      "@repo/shadcn-ui/components": path.resolve(
        import.meta.dirname,
        "../shadcn-ui/components"
      ),
      "@repo/shadcn-ui/lib/utils": path.resolve(
        import.meta.dirname,
        "../shadcn-ui/lib/utils.ts"
      ),
      "katex/dist/katex.min.css": path.resolve(
        import.meta.dirname,
        "./__tests__/style-mock.js"
      ),
    },
  },
  test: {
    browser: {
      enabled: true,
      headless: true,
      instances: [{ browser: "chromium" }],
      provider: playwright(),
    },
    coverage: {
      exclude: [
        "node_modules/",
        "__tests__/**",
        "**/*.config.{ts,js,mts}",
        "**/style-mock.js",
      ],
      provider: "v8",
      reporter: ["text", "json", "html"],
    },
    globals: true,
    include: ["__tests__/**/*.test.{ts,tsx}"],
    server: {
      deps: {
        inline: ["streamdown", "katex", "motion", "cmdk"],
      },
    },
    setupFiles: ["./__tests__/setup.ts"],
  },
});
