import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import {
  Reasoning,
  ReasoningContent,
  ReasoningTrigger,
} from "../src/reasoning";

describe("reasoning", () => {
  it("renders children", () => {
    render(<Reasoning>Content</Reasoning>);
    expect(screen.getByText("Content")).toBeInTheDocument();
  });

  it("throws error when components used outside Reasoning provider", () => {
    // Suppress console.error for this test
    const spy = vi.spyOn(console, "error").mockImplementation(vi.fn());

    expect(() => render(<ReasoningTrigger />)).toThrow(
      "Reasoning components must be used within Reasoning"
    );

    spy.mockRestore();
  });

  it("starts closed by default when not streaming (old messages)", () => {
    render(
      <Reasoning>
        <ReasoningTrigger />
        <ReasoningContent>Reasoning content</ReasoningContent>
      </Reasoning>
    );
    expect(screen.queryByText("Reasoning content")).not.toBeInTheDocument();
  });

  it("starts open when streaming", () => {
    render(
      <Reasoning isStreaming>
        <ReasoningTrigger />
        <ReasoningContent>Reasoning content</ReasoningContent>
      </Reasoning>
    );
    expect(screen.getByText("Reasoning content")).toBeVisible();
  });

  it("can be forced open with defaultOpen", () => {
    render(
      <Reasoning defaultOpen>
        <ReasoningTrigger />
        <ReasoningContent>Visible content</ReasoningContent>
      </Reasoning>
    );
    expect(screen.getByText("Visible content")).toBeVisible();
  });

  it("can be forced closed with defaultOpen={false}", () => {
    render(
      <Reasoning defaultOpen={false} isStreaming>
        <ReasoningTrigger />
        <ReasoningContent>Hidden content</ReasoningContent>
      </Reasoning>
    );
    expect(screen.queryByText("Hidden content")).not.toBeInTheDocument();
  });

  it("calls onOpenChange", async () => {
    const onOpenChange = vi.fn();
    const user = userEvent.setup();

    render(
      <Reasoning defaultOpen={false} onOpenChange={onOpenChange}>
        <ReasoningTrigger />
        <ReasoningContent>Content</ReasoningContent>
      </Reasoning>
    );

    const trigger = screen.getByRole("button");
    await user.click(trigger);

    expect(onOpenChange).toHaveBeenCalledWith();
  });

  it("auto-closes after delay when streaming stops", async () => {
    vi.useFakeTimers();
    const { rerender } = render(
      <Reasoning isStreaming>
        <ReasoningTrigger />
        <ReasoningContent>Reasoning content</ReasoningContent>
      </Reasoning>
    );

    // Initially open
    expect(screen.getByText("Reasoning content")).toBeVisible();

    // Stop streaming
    rerender(
      <Reasoning isStreaming={false}>
        <ReasoningTrigger />
        <ReasoningContent>Reasoning content</ReasoningContent>
      </Reasoning>
    );

    // Should still be open immediately
    expect(screen.getByText("Reasoning content")).toBeVisible();

    // Advance time past AUTO_CLOSE_DELAY (1000ms)
    act(() => {
      vi.advanceTimersByTime(1100);
    });

    // Should auto-close
    await vi.waitFor(() => {
      expect(screen.queryByText("Reasoning content")).not.toBeInTheDocument();
    });

    vi.useRealTimers();
  });

  it("does not auto-close old messages when manually opened - #86", async () => {
    // For old messages (never streamed), manually opening should not trigger auto-close
    // Use controlled open state to simulate user interaction
    const onOpenChange = vi.fn();

    render(
      <Reasoning defaultOpen isStreaming={false} onOpenChange={onOpenChange}>
        <ReasoningTrigger />
        <ReasoningContent>Old reasoning content</ReasoningContent>
      </Reasoning>
    );

    // Content should be visible with defaultOpen
    expect(screen.getByText("Old reasoning content")).toBeVisible();

    // Wait past AUTO_CLOSE_DELAY (1000ms) - use real timer
    await new Promise((resolve) => {
      setTimeout(resolve, 1200);
    });

    // Should still be open (no auto-close for messages that never streamed)
    expect(screen.getByText("Old reasoning content")).toBeVisible();

    // onOpenChange should NOT have been called with false (no auto-close)
    expect(onOpenChange).not.toHaveBeenCalledWith(false);
  });
});

describe("reasoningTrigger", () => {
  it("renders default thinking message when streaming", () => {
    render(
      <Reasoning isStreaming>
        <ReasoningTrigger />
      </Reasoning>
    );
    expect(screen.getByText("Thinking...")).toBeInTheDocument();
  });

  it("renders duration message when not streaming", () => {
    render(
      <Reasoning duration={5} isStreaming={false}>
        <ReasoningTrigger />
      </Reasoning>
    );
    expect(screen.getByText("Thought for 5 seconds")).toBeInTheDocument();
  });

  it("renders thinking message when duration is 0", () => {
    render(
      <Reasoning duration={0} isStreaming={false}>
        <ReasoningTrigger />
      </Reasoning>
    );
    expect(screen.getByText("Thinking...")).toBeInTheDocument();
  });

  it("renders generic message when duration is undefined", () => {
    render(
      <Reasoning isStreaming={false}>
        <ReasoningTrigger />
      </Reasoning>
    );
    expect(screen.getByText("Thought for a few seconds")).toBeInTheDocument();
  });

  it("renders custom children", () => {
    render(
      <Reasoning>
        <ReasoningTrigger>Custom trigger</ReasoningTrigger>
      </Reasoning>
    );
    expect(screen.getByText("Custom trigger")).toBeInTheDocument();
  });

  it("has brain icon", () => {
    const { container } = render(
      <Reasoning>
        <ReasoningTrigger />
      </Reasoning>
    );
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("rounds sub-second durations up to 1 second - #63", () => {
    vi.useFakeTimers();
    const { rerender } = render(
      <Reasoning isStreaming>
        <ReasoningTrigger />
      </Reasoning>
    );

    // Verify initial "Thinking..." state
    expect(screen.getByText("Thinking...")).toBeInTheDocument();

    // Advance time by 300ms (0.3 seconds)
    vi.advanceTimersByTime(300);

    // Stop streaming - should round up to 1 second using Math.ceil
    rerender(
      <Reasoning isStreaming={false}>
        <ReasoningTrigger />
      </Reasoning>
    );

    // Should display "Thought for 1 seconds" (rounds up from 0.3)
    expect(screen.getByText("Thought for 1 seconds")).toBeInTheDocument();
    expect(screen.queryByText("Thinking...")).not.toBeInTheDocument();

    vi.useRealTimers();
  });
});

describe("reasoningContent", () => {
  it("renders reasoning text", () => {
    render(
      <Reasoning defaultOpen>
        <ReasoningContent>The reasoning process</ReasoningContent>
      </Reasoning>
    );
    expect(screen.getByText("The reasoning process")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(
      <Reasoning defaultOpen>
        <ReasoningContent className="custom">Content</ReasoningContent>
      </Reasoning>
    );
    expect(container.querySelector(".custom")).toBeInTheDocument();
  });
});
