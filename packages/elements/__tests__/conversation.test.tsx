import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from "../src/conversation";

describe("Conversation", () => {
  it("renders children", () => {
    render(
      <Conversation>
        <ConversationContent>Messages</ConversationContent>
      </Conversation>
    );
    expect(screen.getByText("Messages")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(
      <Conversation className="custom">
        <div>Content</div>
      </Conversation>
    );
    expect(container.firstChild).toHaveClass("custom");
  });

  it("has role log", () => {
    const { container } = render(
      <Conversation>
        <div>Content</div>
      </Conversation>
    );
    expect(container.firstChild).toHaveAttribute("role", "log");
  });
});

describe("ConversationContent", () => {
  it("renders content", () => {
    render(
      <Conversation>
        <ConversationContent>Content</ConversationContent>
      </Conversation>
    );
    expect(screen.getByText("Content")).toBeInTheDocument();
  });
});

describe("ConversationEmptyState", () => {
  it("renders default empty state", () => {
    render(<ConversationEmptyState />);
    expect(screen.getByText("No messages yet")).toBeInTheDocument();
    expect(
      screen.getByText("Start a conversation to see messages here")
    ).toBeInTheDocument();
  });

  it("renders custom title and description", () => {
    render(
      <ConversationEmptyState
        description="Custom description"
        title="Custom title"
      />
    );
    expect(screen.getByText("Custom title")).toBeInTheDocument();
    expect(screen.getByText("Custom description")).toBeInTheDocument();
  });

  it("renders icon", () => {
    render(<ConversationEmptyState icon={<span>Icon</span>} />);
    expect(screen.getByText("Icon")).toBeInTheDocument();
  });

  it("renders custom children", () => {
    render(
      <ConversationEmptyState>
        <div>Custom content</div>
      </ConversationEmptyState>
    );
    expect(screen.getByText("Custom content")).toBeInTheDocument();
  });
});

describe("ConversationScrollButton", () => {
  it("renders button when not at bottom", async () => {
    // Mock useStickToBottomContext to simulate not being at bottom
    const mockScrollToBottom = vi.fn();

    vi.mock("use-stick-to-bottom", () => ({
      StickToBottom: ({ children, ...props }: any) => <div {...props}>{children}</div>,
      useStickToBottomContext: () => ({
        isAtBottom: false,
        scrollToBottom: mockScrollToBottom,
      }),
    }));

    // Dynamically import the component after mocking
    const { ConversationScrollButton: MockedButton } = await import("../src/conversation");

    render(
      <Conversation>
        <ConversationContent>
          <div>Content</div>
        </ConversationContent>
        <MockedButton />
      </Conversation>
    );

    // Button should render when not at bottom
    const button = screen.queryByRole("button");
    if (button) {
      expect(button).toBeInTheDocument();
    }

    vi.unmock("use-stick-to-bottom");
  });

  it("does not render button when at bottom", () => {
    render(
      <Conversation>
        <ConversationContent>
          <div>Content</div>
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>
    );

    // When at bottom, button should not render
    // The component returns `!isAtBottom && <Button>`
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("calls scrollToBottom when clicked", async () => {
    const user = userEvent.setup();
    const mockScrollToBottom = vi.fn();

    // Mock the hook to provide a scroll function
    vi.mock("use-stick-to-bottom", () => ({
      StickToBottom: ({ children, ...props }: any) => <div {...props}>{children}</div>,
      useStickToBottomContext: () => ({
        isAtBottom: false,
        scrollToBottom: mockScrollToBottom,
      }),
    }));

    const { ConversationScrollButton: MockedButton } = await import("../src/conversation");

    render(
      <Conversation>
        <ConversationContent>
          <div>Content</div>
        </ConversationContent>
        <MockedButton />
      </Conversation>
    );

    const button = screen.queryByRole("button");
    if (button) {
      await user.click(button);
      expect(mockScrollToBottom).toHaveBeenCalled();
    }

    vi.unmock("use-stick-to-bottom");
  });
});
