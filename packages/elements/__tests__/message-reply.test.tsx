import type { MouseEvent } from "react";

import { fireEvent, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { createRef } from "react";

import { MessageContent, MessageQuote, MessageReply } from "../src/message";

const selectContents = (element: Node) => {
  const range = document.createRange();
  range.selectNodeContents(element);
  const selection = document.getSelection();
  selection?.removeAllRanges();
  selection?.addRange(range);
};

const preventReply = (event: MouseEvent<HTMLButtonElement>) =>
  event.preventDefault();

const renderReply = (onReply: (text: string) => void) => {
  document.getSelection()?.removeAllRanges();
  const ref = createRef<HTMLDivElement>();
  render(
    <>
      <p>Another message</p>
      <MessageContent ref={ref}>
        <p>
          Before <strong>selected words</strong> after.
        </p>
      </MessageContent>
      <MessageReply
        onReply={onReply}
        selectionRef={ref}
        text="Before **selected words** after."
      />
    </>
  );
  return screen.getByRole("button", { name: "Reply" });
};

describe("messageReply", () => {
  it("uses visible reply text without appending the default label", () => {
    render(
      <MessageReply onReply={vi.fn()} text="Quote">
        Respond
      </MessageReply>
    );
    expect(
      screen.getByRole("button", { exact: true, name: "Respond" })
    ).toBeInTheDocument();
  });

  it("uses visible children when a tooltip is supplied", () => {
    render(
      <MessageReply tooltip="Reply" onReply={vi.fn()} text="Quote">
        <span>Respond</span>
      </MessageReply>
    );
    expect(
      screen.getByRole("button", { exact: true, name: "Respond" })
    ).toBeInTheDocument();
  });

  it("labels the default reply icon", () => {
    render(<MessageReply onReply={vi.fn()} text="Quote" />);
    expect(
      screen.getByRole("button", { exact: true, name: "Reply" })
    ).toBeInTheDocument();
  });

  it("accepts an explicit label for a custom icon", () => {
    render(
      <MessageReply label="Quote message" onReply={vi.fn()} text="Quote">
        <svg aria-hidden="true" />
      </MessageReply>
    );
    expect(
      screen.getByRole("button", { exact: true, name: "Quote message" })
    ).toBeInTheDocument();
  });

  it("keeps aria-label as the accessible name", () => {
    render(
      <MessageReply
        aria-label="Respond to assistant"
        onReply={vi.fn()}
        text="Quote"
      >
        Respond
      </MessageReply>
    );
    expect(
      screen.getByRole("button", { exact: true, name: "Respond to assistant" })
    ).toBeInTheDocument();
  });

  it("replies with the original message when nothing is selected", async () => {
    const onReply = vi.fn();
    renderReply(onReply);
    await userEvent.click(screen.getByRole("button", { name: "Reply" }));
    expect(onReply).toHaveBeenCalledExactlyOnceWith(
      "Before **selected words** after."
    );
  });

  it.each(["{Enter}", " "])(
    "supports keyboard activation with %s",
    async (key) => {
      const onReply = vi.fn();
      const button = renderReply(onReply);
      button.focus();
      await userEvent.keyboard(key);
      expect(onReply).toHaveBeenCalledExactlyOnceWith(
        "Before **selected words** after."
      );
    }
  );

  it("quotes only selected text within the referenced content", async () => {
    const onReply = vi.fn();
    const button = renderReply(onReply);
    selectContents(screen.getByText("selected words"));
    await userEvent.click(button);
    expect(onReply).toHaveBeenCalledExactlyOnceWith("selected words");
  });

  it("captures a selection before pointer focus collapses it", () => {
    const onReply = vi.fn();
    const button = renderReply(onReply);
    selectContents(screen.getByText("selected words"));
    fireEvent.pointerDown(button, { button: 0 });
    document.getSelection()?.removeAllRanges();
    fireEvent.click(button, { detail: 1 });
    expect(onReply).toHaveBeenCalledExactlyOnceWith("selected words");
  });

  it("does not reuse a cancelled pointer selection", () => {
    const onReply = vi.fn();
    const button = renderReply(onReply);
    selectContents(screen.getByText("selected words"));
    fireEvent.pointerDown(button, { button: 0 });
    fireEvent.pointerCancel(button);
    document.getSelection()?.removeAllRanges();
    fireEvent.click(button, { detail: 1 });
    expect(onReply).toHaveBeenCalledExactlyOnceWith(
      "Before **selected words** after."
    );
  });

  it("does not reuse a pointer selection for a later keyboard activation", () => {
    const onReply = vi.fn();
    const button = renderReply(onReply);
    selectContents(screen.getByText("selected words"));
    fireEvent.pointerDown(button, { button: 0 });
    document.getSelection()?.removeAllRanges();
    fireEvent.click(button, { detail: 0 });
    expect(onReply).toHaveBeenCalledExactlyOnceWith(
      "Before **selected words** after."
    );
  });

  it("ignores selections from another message", async () => {
    const onReply = vi.fn();
    const button = renderReply(onReply);
    selectContents(screen.getByText("Another message"));
    await userEvent.click(button);
    expect(onReply).toHaveBeenCalledExactlyOnceWith(
      "Before **selected words** after."
    );
  });

  it("ignores selections crossing message boundaries", async () => {
    const onReply = vi.fn();
    const button = renderReply(onReply);
    const range = document.createRange();
    range.setStartBefore(screen.getByText("Another message"));
    range.setEndAfter(screen.getByText("selected words"));
    document.getSelection()?.addRange(range);
    await userEvent.click(button);
    expect(onReply).toHaveBeenCalledExactlyOnceWith(
      "Before **selected words** after."
    );
  });

  it("preserves Unicode and whitespace in a quote", async () => {
    const onReply = vi.fn();
    const ref = createRef<HTMLDivElement>();
    render(
      <>
        <MessageContent ref={ref}>
          <pre>{"  안녕하세요 👋\n世界  "}</pre>
        </MessageContent>
        <MessageReply onReply={onReply} selectionRef={ref} text="Fallback" />
      </>
    );
    selectContents(screen.getByText("안녕하세요 👋 世界"));
    await userEvent.click(screen.getByRole("button", { name: "Reply" }));
    expect(onReply).toHaveBeenCalledExactlyOnceWith("  안녕하세요 👋\n世界  ");
  });

  it("allows the consumer to prevent a reply", async () => {
    const onReply = vi.fn();
    render(
      <MessageReply
        onClick={preventReply}
        onReply={onReply}
        text="Do not quote"
      />
    );
    await userEvent.click(screen.getByRole("button", { name: "Reply" }));
    expect(onReply).not.toHaveBeenCalled();
  });

  it("does not reply when disabled", async () => {
    const onReply = vi.fn();
    render(<MessageReply disabled onReply={onReply} text="Do not quote" />);
    await userEvent.click(screen.getByRole("button", { name: "Reply" }));
    expect(onReply).not.toHaveBeenCalled();
  });

  it("does not submit its enclosing form", async () => {
    const onSubmit = vi.fn((event) => event.preventDefault());
    render(
      <form onSubmit={onSubmit}>
        <MessageReply onReply={vi.fn()} text="Quote" />
      </form>
    );
    await userEvent.click(screen.getByRole("button", { name: "Reply" }));
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("does not create an empty quote", async () => {
    const onReply = vi.fn();
    render(<MessageReply onReply={onReply} text={" \n "} />);
    await userEvent.click(screen.getByRole("button", { name: "Reply" }));
    expect(onReply).not.toHaveBeenCalled();
  });
});

describe("messageQuote", () => {
  it("renders text literally and supports a read-only quote", () => {
    const { container } = render(
      <MessageQuote label="Replying to assistant">
        {"<img src=x onerror=alert(1)> **text**"}
      </MessageQuote>
    );
    expect(
      screen.getByRole("group", { name: "Replying to assistant" })
    ).toBeInTheDocument();
    expect(container.querySelector("blockquote")).toHaveTextContent(
      "<img src=x onerror=alert(1)> **text**"
    );
    expect(container.querySelector("img")).toBeNull();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("supports a localized remove action without submitting a form", async () => {
    const onRemove = vi.fn();
    const onSubmit = vi.fn((event) => event.preventDefault());
    render(
      <form onSubmit={onSubmit}>
        <MessageQuote onRemove={onRemove} removeLabel="인용 삭제">
          Quoted text
        </MessageQuote>
      </form>
    );
    const button = screen.getByRole("button", { name: "인용 삭제" });
    button.focus();
    await userEvent.keyboard("{Enter}");
    expect(onRemove).toHaveBeenCalledOnce();
    expect(onSubmit).not.toHaveBeenCalled();
  });
});
