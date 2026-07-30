import { render, screen, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";

import {
  CodeBlock,
  CodeBlockContent,
  CodeBlockCopyButton,
  highlightCode,
} from "../src/code-block";

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

describe(highlightCode, () => {
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

describe("codeBlock", () => {
  it("renders code content", async () => {
    const { container } = render(
      <CodeBlock code="const foo = 'bar';" language="javascript" />
    );
    await waitFor(() => {
      expect(container.textContent).toContain("const foo");
    });
  });

  it("renders with line numbers", async () => {
    const { container } = render(
      <CodeBlock
        code="line1\nline2"
        language="javascript"
        showLineNumbers={true}
      />
    );
    await waitFor(() => {
      expect(container.textContent).toContain("line1");
    });
  });

  it("renders children actions", () => {
    render(
      <CodeBlock code="code" language="javascript">
        <button type="button">Action</button>
      </CodeBlock>
    );
    expect(screen.getByText("Action")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(
      <CodeBlock className="custom-class" code="code" language="javascript" />
    );
    expect(container.firstChild).toHaveClass("custom-class");
    expect(container.firstChild).toHaveClass("group");
    expect(container.firstChild).toHaveClass("relative");
  });
});

const setupCopyButtonTests = () => {
  vi.clearAllMocks();
};

describe("codeBlockCopyButton", () => {
  it("renders copy button", () => {
    setupCopyButtonTests();
    render(
      <CodeBlock code="test code" language="javascript">
        <CodeBlockCopyButton />
      </CodeBlock>
    );
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("copies code to clipboard", async () => {
    const user = userEvent.setup();
    const writeTextSpy = vi.spyOn(navigator.clipboard, "writeText");

    render(
      <CodeBlock code="test code" language="javascript">
        <CodeBlockCopyButton />
      </CodeBlock>
    );

    const button = screen.getByRole("button");
    await user.click(button);

    expect(writeTextSpy).toHaveBeenCalledWith("test code");
  });

  it("calls onCopy callback", async () => {
    const onCopy = vi.fn();
    const user = userEvent.setup();

    render(
      <CodeBlock code="test code" language="javascript">
        <CodeBlockCopyButton onCopy={onCopy} />
      </CodeBlock>
    );

    const button = screen.getByRole("button");
    await user.click(button);

    expect(onCopy).toHaveBeenCalled();
  });

  it("calls onError when clipboard fails", async () => {
    const onError = vi.fn();
    const user = userEvent.setup();
    const error = new Error("Clipboard error");

    vi.spyOn(navigator.clipboard, "writeText").mockRejectedValueOnce(error);

    render(
      <CodeBlock code="test code" language="javascript">
        <CodeBlockCopyButton onError={onError} />
      </CodeBlock>
    );

    const button = screen.getByRole("button");
    await user.click(button);

    await vi.waitFor(() => {
      expect(onError).toHaveBeenCalledWith(error);
    });
  });

  it("calls onError when clipboard API is not available", async () => {
    const onError = vi.fn();
    const user = userEvent.setup();

    // Temporarily remove clipboard writeText method
    const originalClipboard = navigator.clipboard;
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText: undefined },
      writable: true,
    });

    render(
      <CodeBlock code="test code" language="javascript">
        <CodeBlockCopyButton onError={onError} />
      </CodeBlock>
    );

    const button = screen.getByRole("button");
    await user.click(button);

    expect(onError).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Clipboard API not available",
      })
    );

    // Restore clipboard API
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: originalClipboard,
      writable: true,
    });
  });
});
