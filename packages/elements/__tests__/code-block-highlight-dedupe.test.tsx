import { render, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { CodeBlockContent, highlightCode } from "../src/code-block";

const mocks = vi.hoisted(() => ({
  codeToTokensSpy: vi.fn((code: string) => ({
    bg: "#fff",
    fg: "#000",
    tokens: code.split("\n").map((line) => [{ color: "#000", content: line }]),
  })),
  failNext: { value: false },
}));

// oxlint-disable-next-line typescript-eslint(consistent-type-imports)
vi.mock<typeof import("shiki")>(import("shiki"), () => ({
  createHighlighter: vi.fn(() => {
    if (mocks.failNext.value) {
      mocks.failNext.value = false;
      return Promise.reject(new Error("boom"));
    }
    return Promise.resolve({
      codeToTokens: mocks.codeToTokensSpy,
      getLoadedLanguages: () => ["javascript"],
    });
  }),
}));

const flushPending = () => {
  const { promise, resolve } = Promise.withResolvers<void>();
  setTimeout(resolve, 20);
  return promise;
};

describe("highlightCode in-flight dedupe", () => {
  it("tokenizes an uncached block exactly once on first mount", async () => {
    // CodeBlockContent calls highlightCode from both its render-time memo
    // and its passive effect; only one tokenization job may result.
    render(<CodeBlockContent code="const a = 1;" language="javascript" />);

    await waitFor(() => {
      expect(mocks.codeToTokensSpy).toHaveBeenCalled();
    });
    // Let any duplicate in-flight promise settle before counting
    await flushPending();

    expect(mocks.codeToTokensSpy).toHaveBeenCalledOnce();
  });

  it("delivers one in-flight result to all subscribers", async () => {
    mocks.codeToTokensSpy.mockClear();
    const results: unknown[] = [];

    highlightCode("const b = 2;", "javascript", (r) => results.push(r));
    highlightCode("const b = 2;", "javascript", (r) => results.push(r));

    await waitFor(() => {
      expect(results).toHaveLength(2);
    });
    expect(mocks.codeToTokensSpy).toHaveBeenCalledOnce();
    expect(results[0]).toBe(results[1]);
  });

  it("permits a retry after a rejected highlight", async () => {
    mocks.codeToTokensSpy.mockClear();
    mocks.failNext.value = true;
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {
      // suppress expected failure log
    });

    // The highlighter promise is cached per language; use a fresh language
    // so the rejecting createHighlighter call is actually exercised.
    highlightCode("const c = 3;", "python", () => {
      // never called - highlight fails
    });
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalled();
    });
    expect(mocks.codeToTokensSpy).not.toHaveBeenCalled();

    // Pending-key state must be released so a later call can retry
    const results: unknown[] = [];
    highlightCode("const c = 3;", "python", (r) => results.push(r));
    await waitFor(() => {
      expect(results).toHaveLength(1);
    });
    expect(mocks.codeToTokensSpy).toHaveBeenCalledOnce();
    consoleSpy.mockRestore();
  });
});
