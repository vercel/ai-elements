import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Snippet, SnippetCopyButton, SnippetInput } from "../src/snippet";

describe("Snippet", () => {
  it("renders code via SnippetInput", () => {
    render(
      <Snippet code="npm install">
        <SnippetInput />
      </Snippet>
    );
    expect(screen.getByDisplayValue("npm install")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(
      <Snippet className="custom-class" code="test">
        <SnippetInput />
      </Snippet>
    );
    expect(container.firstChild).toHaveClass("custom-class");
  });

  it("renders children", () => {
    render(
      <Snippet code="test">
        <button type="button">Copy</button>
      </Snippet>
    );
    expect(screen.getByText("Copy")).toBeInTheDocument();
  });
});

describe("SnippetCopyButton", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders copy button", () => {
    render(
      <Snippet code="test">
        <SnippetCopyButton />
      </Snippet>
    );
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("copies code to clipboard", async () => {
    const user = userEvent.setup();
    const writeTextSpy = vi.spyOn(navigator.clipboard, "writeText");

    render(
      <Snippet code="test code">
        <SnippetCopyButton />
      </Snippet>
    );

    const button = screen.getByRole("button");
    await user.click(button);

    expect(writeTextSpy).toHaveBeenCalledWith("test code");
  });

  it("calls onCopy callback", async () => {
    const onCopy = vi.fn();
    const user = userEvent.setup();

    render(
      <Snippet code="test">
        <SnippetCopyButton onCopy={onCopy} />
      </Snippet>
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
      <Snippet code="test">
        <SnippetCopyButton onError={onError} />
      </Snippet>
    );

    const button = screen.getByRole("button");
    await user.click(button);

    await vi.waitFor(() => {
      expect(onError).toHaveBeenCalledWith(error);
    });
  });
});
