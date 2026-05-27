import { render, screen, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import type * as StickToBottomModule from "use-stick-to-bottom";
import type { StickToBottomContext } from "use-stick-to-bottom";

import {
  Conversation,
  ConversationContent,
  ConversationDownload,
  ConversationEmptyState,
  ConversationScrollButton,
  ConversationVirtualizedContent,
  messagesToMarkdown,
} from "../src/conversation";

// Mock use-stick-to-bottom with module-level state using vi.hoisted
const {
  mockScrollToBottom,
  mockState,
  getMockContext,
  StickToBottomContent,
  StickToBottomMock,
} = vi.hoisted(() => {
  const state = { isAtBottom: true };
  const scrollToBottom = vi.fn();
  const stopScroll = vi.fn();
  let targetScrollTop: unknown = null;

  // oxlint-disable-next-line eslint-plugin-unicorn(consistent-function-scoping)
  const createRef = () => {
    const ref = ((node: HTMLElement | null) => {
      ref.current = node;
    }) as React.MutableRefObject<HTMLElement | null> &
      React.RefCallback<HTMLElement>;
    ref.current = null;
    return ref;
  };

  const scrollRef = createRef();
  const contentRef = createRef();

  const getContext = (): StickToBottomContext => ({
    contentRef,
    escapedFromLock: false,
    isAtBottom: state.isAtBottom,
    scrollRef,
    scrollToBottom,
    state: {
      accumulated: 0,
      calculatedTargetScrollTop: 0,
      escapedFromLock: false,
      isAtBottom: state.isAtBottom,
      isNearBottom: true,
      resizeDifference: 0,
      scrollDifference: 0,
      scrollTop: 0,
      targetScrollTop: 0,
      velocity: 0,
    },
    stopScroll,
    get targetScrollTop() {
      return targetScrollTop as StickToBottomContext["targetScrollTop"];
    },
    set targetScrollTop(value: StickToBottomContext["targetScrollTop"]) {
      targetScrollTop = value;
    },
  });

  interface MockProps extends Omit<
    React.HTMLAttributes<HTMLDivElement>,
    "children"
  > {
    children?:
      | React.ReactNode
      | ((context: StickToBottomContext) => React.ReactNode);
  }

  interface MockContentProps extends MockProps {
    scrollClassName?: string;
  }

  // These components must be defined inside vi.hoisted() for mock setup
  // oxlint-disable-next-line eslint-plugin-unicorn(consistent-function-scoping)
  const StickyMock = ({ children, ...props }: MockProps) => (
    <div role="log" {...props}>
      {typeof children === "function" ? children(getContext()) : children}
    </div>
  );

  // oxlint-disable-next-line eslint-plugin-unicorn(consistent-function-scoping)
  const StickyContent = ({
    children,
    scrollClassName,
    ...props
  }: MockContentProps) => (
    <div
      className={scrollClassName}
      ref={scrollRef}
      style={{ height: 400, overflow: "auto", width: 400 }}
    >
      <div {...props} ref={contentRef}>
        {typeof children === "function" ? children(getContext()) : children}
      </div>
    </div>
  );

  return {
    StickToBottomContent: StickyContent,
    StickToBottomMock: StickyMock,
    getMockContext: getContext,
    mockScrollToBottom: scrollToBottom,
    mockState: state,
  };
});

vi.mock<typeof StickToBottomModule>(import("use-stick-to-bottom"), () => {
  const MockComponent = StickToBottomMock as typeof StickToBottomMock & {
    Content: typeof StickToBottomContent;
  };
  MockComponent.Content = StickToBottomContent;

  return {
    StickToBottom:
      MockComponent as unknown as typeof StickToBottomModule.StickToBottom,
    useStickToBottomContext: getMockContext,
  };
});

// Custom format function for messagesToMarkdown test
const customFormatMessage = (msg: {
  role: string;
  parts: { type: string; text?: string }[];
}) => {
  const text = msg.parts
    .filter((p) => p.type === "text")
    .map((p) => p.text)
    .join("");
  return `[${msg.role}]: ${text}`;
};

describe("conversation", () => {
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

describe("conversationContent", () => {
  it("renders content", () => {
    render(
      <Conversation>
        <ConversationContent>Content</ConversationContent>
      </Conversation>
    );
    expect(screen.getByText("Content")).toBeInTheDocument();
  });
});

const estimateVirtualizedMessageSize = () => 40;

const getVirtualizedMessageKey = (item: { id: string }) => item.id;

describe("conversationVirtualizedContent", () => {
  const messages = Array.from({ length: 100 }, (_, index) => ({
    content: `Message ${index}`,
    id: `message-${index}`,
  }));

  it("renders visible items", async () => {
    render(
      <Conversation>
        <ConversationVirtualizedContent
          estimateSize={estimateVirtualizedMessageSize}
          getItemKey={getVirtualizedMessageKey}
          items={messages}
          overscan={1}
        >
          {(item) => <div>{item.content}</div>}
        </ConversationVirtualizedContent>
      </Conversation>
    );

    await waitFor(() => {
      expect(screen.getByText("Message 0")).toBeInTheDocument();
    });

    expect(screen.queryByText("Message 99")).not.toBeInTheDocument();
  });

  it("applies custom content and item class names", async () => {
    const { container } = render(
      <Conversation>
        <ConversationVirtualizedContent
          className="virtual-content"
          estimateSize={estimateVirtualizedMessageSize}
          itemClassName="virtual-item"
          items={messages.slice(0, 3)}
        >
          {(item) => <div>{item.content}</div>}
        </ConversationVirtualizedContent>
      </Conversation>
    );

    await waitFor(() => {
      expect(screen.getByText("Message 0")).toBeInTheDocument();
    });

    expect(container.querySelector(".virtual-content")).toBeInTheDocument();
    expect(container.querySelector(".virtual-item")).toBeInTheDocument();
  });
});

describe("conversationEmptyState", () => {
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

describe("conversationScrollButton", () => {
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

    expect(mockScrollToBottom).toHaveBeenCalledWith();

    mockState.isAtBottom = true;
  });
});

const makeMessage = (role: "user" | "assistant" | "system", text: string) => ({
  id: `${role}-${text}`,
  parts: [{ text, type: "text" as const }],
  role,
});

// Function name as describe title is a valid testing pattern
// oxlint-disable-next-line eslint-plugin-jest(valid-title)
describe(messagesToMarkdown, () => {
  it("converts messages to markdown format", () => {
    const messages = [
      makeMessage("user", "Hello"),
      makeMessage("assistant", "Hi there!"),
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
      makeMessage("user", "Hello"),
      makeMessage("assistant", "Hi"),
    ];

    const result = messagesToMarkdown(messages, customFormatMessage);

    expect(result).toBe("[user]: Hello\n\n[assistant]: Hi");
  });

  it("handles all role types", () => {
    const messages = [
      makeMessage("user", "User msg"),
      makeMessage("assistant", "Assistant msg"),
      makeMessage("system", "System msg"),
    ];

    const result = messagesToMarkdown(messages);

    expect(result).toContain("**User:** User msg");
    expect(result).toContain("**Assistant:** Assistant msg");
    expect(result).toContain("**System:** System msg");
  });

  it("extracts text from multiple parts", () => {
    const message = {
      id: "multi",
      parts: [
        { text: "Hello ", type: "text" as const },
        { type: "step-start" as const },
        { text: "world", type: "text" as const },
      ],
      role: "assistant" as const,
    };

    const result = messagesToMarkdown([message]);

    expect(result).toBe("**Assistant:** Hello world");
  });
});

// Helper to setup URL mocks for download tests
const setupDownloadMocks = () => {
  const mockCreateObjectURL = vi.fn(() => "blob:test");
  const mockRevokeObjectURL = vi.fn();
  const originalCreateObjectURL = URL.createObjectURL;
  const originalRevokeObjectURL = URL.revokeObjectURL;

  URL.createObjectURL = mockCreateObjectURL;
  URL.revokeObjectURL = mockRevokeObjectURL;

  return {
    mockCreateObjectURL,
    mockRevokeObjectURL,
    restore: () => {
      URL.createObjectURL = originalCreateObjectURL;
      URL.revokeObjectURL = originalRevokeObjectURL;
    },
  };
};

// Helper to setup DOM mocks for anchor click tracking
const setupDomClickTracker = () => {
  let linkClicked = false;
  const originalCreateElement = document.createElement.bind(document);

  vi.spyOn(document, "createElement").mockImplementation((tagName: string) => {
    const element = originalCreateElement(tagName);
    if (tagName === "a") {
      const originalClick = element.click.bind(element);
      element.click = () => {
        linkClicked = true;
        originalClick();
      };
    }
    return element;
  });

  return { wasLinkClicked: () => linkClicked };
};

describe("conversationDownload", () => {
  const mockMessages = [
    makeMessage("user", "Hello"),
    makeMessage("assistant", "Hi there!"),
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
        <ConversationDownload
          className="custom-class"
          messages={mockMessages}
        />
      </Conversation>
    );

    const button = screen.getByRole("button");
    expect(button).toHaveClass("custom-class");
  });

  it("triggers download on click", async () => {
    const user = userEvent.setup();
    const urlMocks = setupDownloadMocks();
    const domTracker = setupDomClickTracker();

    render(
      <Conversation>
        <ConversationDownload messages={mockMessages} />
      </Conversation>
    );

    await user.click(screen.getByRole("button"));

    expect(urlMocks.mockCreateObjectURL).toHaveBeenCalledWith(expect.any(Blob));
    expect(domTracker.wasLinkClicked()).toBeTruthy();
    expect(urlMocks.mockRevokeObjectURL).toHaveBeenCalledWith("blob:test");

    urlMocks.restore();
  });
});
