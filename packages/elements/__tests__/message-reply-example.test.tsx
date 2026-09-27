import { act, fireEvent, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";

import Example from "../../examples/src/message-reply";

describe("message reply example", () => {
  it("preserves the draft and focuses the input when adding a quote", async () => {
    render(<Example />);
    const input = screen.getByRole("textbox", { name: "Your reply" });
    await userEvent.type(input, "My unfinished thought");
    await userEvent.click(
      screen.getByRole("button", { name: "Reply to assistant" })
    );
    expect(input).toHaveFocus();
    expect(input).toHaveValue("My unfinished thought");
    expect(
      screen.getByRole("group", { name: "Replying to assistant" })
    ).toBeInTheDocument();
  });

  it("replaces a quote without replacing the draft", async () => {
    render(<Example />);
    const input = screen.getByRole("textbox", { name: "Your reply" });
    await userEvent.type(input, "My unfinished thought");
    await userEvent.click(
      screen.getByRole("button", { name: "Reply to assistant" })
    );
    await userEvent.click(
      screen.getByRole("button", { name: "Reply to user" })
    );
    expect(
      screen.queryByRole("group", { name: "Replying to assistant" })
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("group", { name: "Replying to user" })
    ).toHaveTextContent("What makes a good loading state?");
    expect(input).toHaveValue("My unfinished thought");
  });

  it("preserves the draft and restores focus when removing a quote", async () => {
    render(<Example />);
    const input = screen.getByRole("textbox", { name: "Your reply" });
    await userEvent.type(input, "My unfinished thought");
    await userEvent.click(
      screen.getByRole("button", { name: "Reply to assistant" })
    );
    await userEvent.click(screen.getByRole("button", { name: "Remove quote" }));
    expect(input).toHaveFocus();
    expect(input).toHaveValue("My unfinished thought");
    expect(
      screen.queryByRole("button", { name: "Remove quote" })
    ).not.toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent("Quote removed.");
  });

  it("removes the quote with Escape in the composer without clearing the draft", async () => {
    render(<Example />);
    await userEvent.click(
      screen.getByRole("button", { name: "Reply to assistant" })
    );
    const input = screen.getByRole("textbox", { name: "Your reply" });
    await userEvent.type(input, "Keep this draft");
    await userEvent.keyboard("{Escape}");
    expect(
      screen.queryByRole("button", { name: "Remove quote" })
    ).not.toBeInTheDocument();
    expect(input).toHaveValue("Keep this draft");
    expect(input).toHaveFocus();
  });

  it("does not consume Escape outside the composer", async () => {
    render(<Example />);
    const reply = screen.getByRole("button", { name: "Reply to assistant" });
    await userEvent.click(reply);
    reply.focus();
    await userEvent.keyboard("{Escape}");
    expect(
      screen.getByRole("button", { name: "Remove quote" })
    ).toBeInTheDocument();
  });

  it("keeps the quote when Escape belongs to IME composition", async () => {
    render(<Example />);
    await userEvent.click(
      screen.getByRole("button", { name: "Reply to assistant" })
    );
    const input = screen.getByRole("textbox", { name: "Your reply" });
    fireEvent.compositionStart(input);
    fireEvent.keyDown(input, { key: "Escape" });
    expect(
      screen.getByRole("button", { name: "Remove quote" })
    ).toBeInTheDocument();
    fireEvent.compositionEnd(input);
    fireEvent.keyDown(input, { key: "Escape", keyCode: 229 });
    expect(
      screen.getByRole("button", { name: "Remove quote" })
    ).toBeInTheDocument();
    fireEvent.keyDown(input, { isComposing: true, key: "Escape" });
    expect(
      screen.getByRole("button", { name: "Remove quote" })
    ).toBeInTheDocument();
    fireEvent.keyDown(input, { key: "Escape" });
    expect(
      screen.queryByRole("button", { name: "Remove quote" })
    ).not.toBeInTheDocument();
  });

  it("respects Escape already handled by a nested control", async () => {
    render(<Example />);
    await userEvent.click(
      screen.getByRole("button", { name: "Reply to assistant" })
    );
    const input = screen.getByRole("textbox", { name: "Your reply" });
    input.addEventListener("keydown", (event) => event.preventDefault(), {
      once: true,
    });
    fireEvent.keyDown(input, { key: "Escape" });
    expect(
      screen.getByRole("button", { name: "Remove quote" })
    ).toBeInTheDocument();
  });

  it("sends the quote with the reply and clears the composer", async () => {
    render(<Example />);
    await userEvent.click(
      screen.getByRole("button", { name: "Reply to user" })
    );
    const input = screen.getByRole("textbox", { name: "Your reply" });
    await userEvent.type(input, "Explain this in more detail");
    await userEvent.keyboard("{Enter}");
    await expect(
      screen.findByText("Explain this in more detail")
    ).resolves.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Remove quote" })
    ).not.toBeInTheDocument();
    expect(input).toHaveValue("");
    const quote = screen.getByRole("group", { name: "Replying to user" });
    expect(quote).toHaveTextContent("What makes a good loading state?");
    expect(screen.getByRole("button", { name: "Send reply" })).toBeDisabled();
  });

  it("supports multiline drafts without sending on Shift+Enter", async () => {
    render(<Example />);
    const input = screen.getByRole("textbox", { name: "Your reply" });
    await userEvent.type(input, "First line");
    await userEvent.keyboard("{Shift>}{Enter}{/Shift}");
    await userEvent.type(input, "Second line");
    expect(input).toHaveValue("First line\nSecond line");
    expect(
      screen.getAllByRole("button", { name: "Reply to user" })
    ).toHaveLength(1);
  });

  it("does not send on the IME confirmation Enter after composition ends", async () => {
    render(<Example />);
    await userEvent.click(
      screen.getByRole("button", { name: "Reply to assistant" })
    );
    const input = screen.getByRole("textbox", { name: "Your reply" });
    await userEvent.type(input, "입력 확정");
    await act(() => {
      fireEvent.compositionStart(input);
    });
    await act(() => {
      fireEvent.compositionEnd(input);
    });
    await act(() => {
      fireEvent.keyDown(input, { key: "Enter", keyCode: 229 });
    });
    expect(input).toHaveValue("입력 확정");
    expect(
      screen.getByRole("button", { name: "Remove quote" })
    ).toBeInTheDocument();
    expect(
      screen.getAllByRole("button", { name: "Reply to user" })
    ).toHaveLength(1);
  });
});
