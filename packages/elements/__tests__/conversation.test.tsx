import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

// Mock use-stick-to-bottom with module-level state
const mockState = { isAtBottom: true };
const mockScrollToBottom = vi.fn();

vi.mock("use-stick-to-bottom", () => {
  const StickToBottomMock = ({ children, ...props }: any) => (
    <div role="log" {...props}>
      {children}
    </div>
  );

  const StickToBottomContent = ({ children, ...props }: any) => (
    <div {...props}>{children}</div>
  );

  (StickToBottomMock as any).Content = StickToBottomContent;

  return {
    StickToBottom: StickToBottomMock,
    useStickToBottomContext: () => ({
      isAtBottom: mockState.isAtBottom,
      scrollToBottom: mockScrollToBottom,
    }),
  };
});

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
  it("renders scroll button when not at bottom", () => {
    mockState.isAtBottom = false;

    render(
      <Conversation>
        <ConversationContent>
          <div>Content</div>
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>
    );

    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();

    mockState.isAtBottom = true;
  });

  it("does not render when at bottom", () => {
    mockState.isAtBottom = true;

    render(
      <Conversation>
        <ConversationContent>
          <div>Content</div>
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>
    );

    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("applies custom className when button renders", () => {
    mockState.isAtBottom = false;

    render(
      <Conversation>
        <ConversationContent>
          <div>Content</div>
        </ConversationContent>
        <ConversationScrollButton className="custom-scroll-btn" />
      </Conversation>
    );

    const button = screen.getByRole("button");
    expect(button).toHaveClass("custom-scroll-btn");

    mockState.isAtBottom = true;
  });

  it("calls scrollToBottom when clicked", async () => {
    mockState.isAtBottom = false;
    mockScrollToBottom.mockClear();
    const user = userEvent.setup();

    render(
      <Conversation>
        <ConversationContent>
          <div>Content</div>
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>
    );

    const button = screen.getByRole("button");
    await user.click(button);

    expect(mockScrollToBottom).toHaveBeenCalled();

    mockState.isAtBottom = true;
  });
});
