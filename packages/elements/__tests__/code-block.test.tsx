import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { CodeBlock, CodeBlockCopyButton } from "../src/code-block";

describe("CodeBlock", () => {
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

describe("CodeBlockCopyButton", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders copy button", () => {
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
      value: { writeText: undefined },
      writable: true,
      configurable: true,
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
      value: originalClipboard,
      writable: true,
      configurable: true,
    });
  });
});
