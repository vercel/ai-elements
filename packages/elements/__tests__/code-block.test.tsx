import { render, screen, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";

import {
  CodeBlock,
  CodeBlockCopyButton,
  highlightCode,
} from "../src/code-block";

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

// Must match MAX_TOKENS_CACHE_SIZE in src/code-block.tsx
const TOKENS_CACHE_BOUND = 100;

const awaitHighlight = (code: string) =>
  new Promise<void>((resolve) => {
    const result = highlightCode(code, "javascript", () => resolve());
    if (result) {
      resolve();
    }
  });

describe("token cache eviction", () => {
  it("bounds the cache and keeps recently used entries", async () => {
    const batchA = Array.from(
      { length: TOKENS_CACHE_BOUND },
      (_, i) => `const a${i} = ${i};`
    );
    await Promise.all(batchA.map((code) => awaitHighlight(code)));

    // Every entry of the fill batch is retained; refresh recency of the first
    expect(highlightCode(batchA[0], "javascript")).not.toBeNull();

    // Overflow the cache with new unique entries
    const batchB = Array.from(
      { length: TOKENS_CACHE_BOUND - 1 },
      (_, i) => `const b${i} = ${i};`
    );
    await Promise.all(batchB.map((code) => awaitHighlight(code)));

    // The refreshed entry survived eviction; unrefreshed entries did not
    expect(highlightCode(batchA[0], "javascript")).not.toBeNull();
    expect(highlightCode(batchA[1], "javascript")).toBeNull();
  });
});
