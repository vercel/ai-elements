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
  ConversationDownload,
  ConversationEmptyState,
  ConversationScrollButton,
  messagesToMarkdown,
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

describe("messagesToMarkdown", () => {
  it("converts messages to markdown format", () => {
    const messages = [
      { role: "user" as const, content: "Hello" },
      { role: "assistant" as const, content: "Hi there!" },
    ];

    const result = messagesToMarkdown(messages);

    expect(result).toBe("**User:** Hello\n\n**Assistant:** Hi there!");
  });

  it("handles empty messages array", () => {
    const result = messagesToMarkdown([]);
    expect(result).toBe("");
  });

  it("uses custom formatMessage function", () => {
    const messages = [
      { role: "user" as const, content: "Hello" },
      { role: "assistant" as const, content: "Hi" },
    ];

    const customFormat = (msg: { role: string; content: string }) =>
      `[${msg.role}]: ${msg.content}`;

    const result = messagesToMarkdown(messages, customFormat);

    expect(result).toBe("[user]: Hello\n\n[assistant]: Hi");
  });

  it("handles all role types", () => {
    const messages = [
      { role: "user" as const, content: "User msg" },
      { role: "assistant" as const, content: "Assistant msg" },
      { role: "system" as const, content: "System msg" },
      { role: "tool" as const, content: "Tool msg" },
      { role: "data" as const, content: "Data msg" },
    ];

    const result = messagesToMarkdown(messages);

    expect(result).toContain("**User:** User msg");
    expect(result).toContain("**Assistant:** Assistant msg");
    expect(result).toContain("**System:** System msg");
    expect(result).toContain("**Tool:** Tool msg");
    expect(result).toContain("**Data:** Data msg");
  });
});

describe("ConversationDownload", () => {
  const mockMessages = [
    { role: "user" as const, content: "Hello" },
    { role: "assistant" as const, content: "Hi there!" },
  ];

  it("renders download button", () => {
    render(
      <Conversation>
        <ConversationContent>
          <div>Content</div>
        </ConversationContent>
        <ConversationDownload messages={mockMessages} />
      </Conversation>
    );

    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
  });

  it("renders custom children", () => {
    render(
      <Conversation>
        <ConversationDownload messages={mockMessages}>
          Download Chat
        </ConversationDownload>
      </Conversation>
    );

    expect(screen.getByText("Download Chat")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    render(
      <Conversation>
        <ConversationDownload className="custom-class" messages={mockMessages} />
      </Conversation>
    );

    const button = screen.getByRole("button");
    expect(button).toHaveClass("custom-class");
  });

  it("triggers download on click", async () => {
    const user = userEvent.setup();
    const mockCreateObjectURL = vi.fn(() => "blob:test");
    const mockRevokeObjectURL = vi.fn();
    const mockClick = vi.fn();

    global.URL.createObjectURL = mockCreateObjectURL;
    global.URL.revokeObjectURL = mockRevokeObjectURL;

    const originalCreateElement = document.createElement.bind(document);
    vi.spyOn(document, "createElement").mockImplementation((tag: string) => {
      if (tag === "a") {
        const link = originalCreateElement("a");
        link.click = mockClick;
        return link;
      }
      return originalCreateElement(tag);
    });

    render(
      <Conversation>
        <ConversationDownload messages={mockMessages} />
      </Conversation>
    );

    const button = screen.getByRole("button");
    await user.click(button);

    expect(mockCreateObjectURL).toHaveBeenCalled();
    expect(mockClick).toHaveBeenCalled();
    expect(mockRevokeObjectURL).toHaveBeenCalled();

    vi.restoreAllMocks();
  });
});
