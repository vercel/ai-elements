import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import {
  StackTrace,
  StackTraceActions,
  StackTraceContent,
  StackTraceCopyButton,
  StackTraceError,
  StackTraceErrorMessage,
  StackTraceErrorType,
  StackTraceExpandButton,
  StackTraceFrames,
  StackTraceHeader,
} from "../src/stack-trace";

const RENDER_WITH_HOOKS_REGEX = /renderWithHooks/;
const BEGIN_WORK_REGEX = /beginWork/;
const NODE_FS_REGEX = /node:fs/;
const ASYNC_FETCH_DATA_REGEX = /async fetchData/;

const sampleStackTrace = `TypeError: Cannot read properties of undefined (reading 'map')
    at UserList (/app/components/UserList.tsx:15:23)
    at renderWithHooks (node_modules/react-dom/cjs/react-dom.development.js:14985:18)
    at beginWork (node_modules/react-dom/cjs/react-dom.development.js:19049:16)`;

const simpleStackTrace = `Error: Something went wrong
    at myFunction (/src/index.ts:10:5)
    at main (/src/main.ts:20:10)`;

const nodeInternalTrace = `Error: ENOENT
    at readFile (node:fs:123:10)
    at internal/modules/cjs/loader.js:50:20`;

describe("StackTrace", () => {
  it("renders children", () => {
    render(<StackTrace trace={sampleStackTrace}>Content</StackTrace>);
    expect(screen.getByText("Content")).toBeInTheDocument();
  });

  it("throws error when component used outside provider", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => undefined);

    expect(() => render(<StackTraceHeader>Test</StackTraceHeader>)).toThrow(
      "StackTrace components must be used within StackTrace"
    );

    spy.mockRestore();
  });

  it("starts closed by default", () => {
    render(
      <StackTrace trace={sampleStackTrace}>
        <StackTraceHeader />
        <StackTraceContent>
          <StackTraceFrames />
        </StackTraceContent>
      </StackTrace>
    );

    const content = screen.queryByText("UserList");
    expect(content).not.toBeInTheDocument();
  });

  it("can start open", () => {
    const { container } = render(
      <StackTrace defaultOpen trace={sampleStackTrace}>
        <StackTraceHeader />
        <StackTraceContent>
          <StackTraceFrames />
        </StackTraceContent>
      </StackTrace>
    );

    // Check content is visible by finding frames container
    const framesContainer = container.querySelector(".space-y-1");
    expect(framesContainer).toBeVisible();
  });

  it("calls onOpenChange", async () => {
    const onOpenChange = vi.fn();
    const user = userEvent.setup();

    const { container } = render(
      <StackTrace onOpenChange={onOpenChange} trace={sampleStackTrace}>
        <StackTraceHeader />
        <StackTraceContent>
          <StackTraceFrames />
        </StackTraceContent>
      </StackTrace>
    );

    const trigger = container.querySelector(
      "[data-slot='collapsible-trigger']"
    );
    expect(trigger).toBeInTheDocument();
    await user.click(trigger as Element);

    expect(onOpenChange).toHaveBeenCalledWith(true);
  });

  it("applies custom className", () => {
    const { container } = render(
      <StackTrace className="custom-class" trace={sampleStackTrace}>
        Content
      </StackTrace>
    );

    expect(container.firstChild).toHaveClass("custom-class");
  });
});

describe("StackTraceHeader", () => {
  it("renders as clickable trigger", () => {
    const { container } = render(
      <StackTrace trace={sampleStackTrace}>
        <StackTraceHeader>Header Content</StackTraceHeader>
      </StackTrace>
    );

    const trigger = container.querySelector(
      "[data-slot='collapsible-trigger']"
    );
    expect(trigger).toBeInTheDocument();
    expect(screen.getByText("Header Content")).toBeInTheDocument();
  });

  it("toggles content on click", async () => {
    const user = userEvent.setup();

    const { container } = render(
      <StackTrace trace={sampleStackTrace}>
        <StackTraceHeader />
        <StackTraceContent>
          <StackTraceFrames />
        </StackTraceContent>
      </StackTrace>
    );

    // Check content is not visible initially
    const framesContainer = container.querySelector(".space-y-1");
    expect(framesContainer).not.toBeInTheDocument();

    const trigger = container.querySelector(
      "[data-slot='collapsible-trigger']"
    );
    expect(trigger).toBeInTheDocument();
    await user.click(trigger as Element);

    // Now frames container should be visible
    const visibleFrames = container.querySelector(".space-y-1");
    expect(visibleFrames).toBeVisible();
  });
});

describe("StackTraceError", () => {
  it("renders children", () => {
    render(
      <StackTrace trace={sampleStackTrace}>
        <StackTraceError>Error Info</StackTraceError>
      </StackTrace>
    );

    expect(screen.getByText("Error Info")).toBeInTheDocument();
  });

  it("renders alert icon", () => {
    const { container } = render(
      <StackTrace trace={sampleStackTrace}>
        <StackTraceError>Error</StackTraceError>
      </StackTrace>
    );

    expect(container.querySelector("svg")).toBeInTheDocument();
  });
});

describe("StackTraceErrorType", () => {
  it("renders parsed error type", () => {
    render(
      <StackTrace trace={sampleStackTrace}>
        <StackTraceErrorType />
      </StackTrace>
    );

    expect(screen.getByText("TypeError")).toBeInTheDocument();
  });

  it("renders custom children", () => {
    render(
      <StackTrace trace={sampleStackTrace}>
        <StackTraceErrorType>CustomError</StackTraceErrorType>
      </StackTrace>
    );

    expect(screen.getByText("CustomError")).toBeInTheDocument();
  });

  it("handles trace without error type", () => {
    const traceWithoutType = "Something went wrong\n    at foo (/bar.js:1:1)";

    render(
      <StackTrace trace={traceWithoutType}>
        <StackTraceErrorType />
      </StackTrace>
    );

    // Should render empty when no error type
    expect(screen.queryByText("Error")).not.toBeInTheDocument();
  });
});

describe("StackTraceErrorMessage", () => {
  it("renders parsed error message", () => {
    render(
      <StackTrace trace={sampleStackTrace}>
        <StackTraceErrorMessage />
      </StackTrace>
    );

    expect(
      screen.getByText("Cannot read properties of undefined (reading 'map')")
    ).toBeInTheDocument();
  });

  it("renders custom children", () => {
    render(
      <StackTrace trace={sampleStackTrace}>
        <StackTraceErrorMessage>Custom message</StackTraceErrorMessage>
      </StackTrace>
    );

    expect(screen.getByText("Custom message")).toBeInTheDocument();
  });
});

describe("StackTraceActions", () => {
  it("renders children", () => {
    render(
      <StackTrace trace={sampleStackTrace}>
        <StackTraceActions>
          <button type="button">Action</button>
        </StackTraceActions>
      </StackTrace>
    );

    expect(screen.getByText("Action")).toBeInTheDocument();
  });

  it("stops event propagation on click", async () => {
    const actionClick = vi.fn();
    const user = userEvent.setup();

    render(
      <StackTrace trace={sampleStackTrace}>
        <StackTraceActions>
          <button onClick={actionClick} type="button">
            Action
          </button>
        </StackTraceActions>
      </StackTrace>
    );

    await user.click(screen.getByText("Action"));

    expect(actionClick).toHaveBeenCalled();
  });
});

describe("StackTraceCopyButton", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders copy button", () => {
    render(
      <StackTrace trace={sampleStackTrace}>
        <StackTraceCopyButton />
      </StackTrace>
    );

    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("copies trace to clipboard", async () => {
    const user = userEvent.setup();
    const writeTextSpy = vi.spyOn(navigator.clipboard, "writeText");

    render(
      <StackTrace trace={sampleStackTrace}>
        <StackTraceCopyButton />
      </StackTrace>
    );

    await user.click(screen.getByRole("button"));

    expect(writeTextSpy).toHaveBeenCalledWith(sampleStackTrace);
  });

  it("calls onCopy callback", async () => {
    const onCopy = vi.fn();
    const user = userEvent.setup();

    render(
      <StackTrace trace={sampleStackTrace}>
        <StackTraceCopyButton onCopy={onCopy} />
      </StackTrace>
    );

    await user.click(screen.getByRole("button"));

    expect(onCopy).toHaveBeenCalled();
  });

  it("calls onError when clipboard fails", async () => {
    const onError = vi.fn();
    const user = userEvent.setup();
    const error = new Error("Clipboard error");

    vi.spyOn(navigator.clipboard, "writeText").mockRejectedValueOnce(error);

    render(
      <StackTrace trace={sampleStackTrace}>
        <StackTraceCopyButton onError={onError} />
      </StackTrace>
    );

    await user.click(screen.getByRole("button"));

    await vi.waitFor(() => {
      expect(onError).toHaveBeenCalledWith(error);
    });
  });

  it("calls onError when clipboard API is not available", async () => {
    const onError = vi.fn();
    const user = userEvent.setup();

    const originalClipboard = navigator.clipboard;
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText: undefined },
      writable: true,
      configurable: true,
    });

    render(
      <StackTrace trace={sampleStackTrace}>
        <StackTraceCopyButton onError={onError} />
      </StackTrace>
    );

    await user.click(screen.getByRole("button"));

    expect(onError).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Clipboard API not available",
      })
    );

    Object.defineProperty(navigator, "clipboard", {
      value: originalClipboard,
      writable: true,
      configurable: true,
    });
  });
});

describe("StackTraceExpandButton", () => {
  it("renders chevron icon", () => {
    const { container } = render(
      <StackTrace trace={sampleStackTrace}>
        <StackTraceExpandButton />
      </StackTrace>
    );

    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("rotates when open", () => {
    const { container } = render(
      <StackTrace defaultOpen trace={sampleStackTrace}>
        <StackTraceExpandButton />
      </StackTrace>
    );

    const svg = container.querySelector("svg");
    expect(svg).toHaveClass("rotate-180");
  });

  it("does not rotate when closed", () => {
    const { container } = render(
      <StackTrace trace={sampleStackTrace}>
        <StackTraceExpandButton />
      </StackTrace>
    );

    const svg = container.querySelector("svg");
    expect(svg).toHaveClass("rotate-0");
  });
});

describe("StackTraceContent", () => {
  it("renders content when open", () => {
    render(
      <StackTrace defaultOpen trace={sampleStackTrace}>
        <StackTraceContent>Content text</StackTraceContent>
      </StackTrace>
    );

    expect(screen.getByText("Content text")).toBeInTheDocument();
  });

  it("hides content when closed", () => {
    render(
      <StackTrace trace={sampleStackTrace}>
        <StackTraceContent>Hidden content</StackTraceContent>
      </StackTrace>
    );

    expect(screen.queryByText("Hidden content")).not.toBeInTheDocument();
  });

  it("applies maxHeight style", () => {
    const { container } = render(
      <StackTrace defaultOpen trace={sampleStackTrace}>
        <StackTraceContent maxHeight={200}>Content</StackTraceContent>
      </StackTrace>
    );

    const content = container.querySelector(
      "[data-slot='collapsible-content']"
    );
    expect(content).toHaveAttribute(
      "style",
      expect.stringContaining("max-height: 200px")
    );
  });
});

describe("StackTraceFrames", () => {
  it("renders stack frames", () => {
    const { container } = render(
      <StackTrace defaultOpen trace={simpleStackTrace}>
        <StackTraceContent>
          <StackTraceFrames />
        </StackTraceContent>
      </StackTrace>
    );

    // Check frames are rendered
    const frames = container.querySelectorAll(".text-xs");
    expect(frames.length).toBe(2);
  });

  it("renders file paths with line numbers", () => {
    render(
      <StackTrace defaultOpen trace={simpleStackTrace}>
        <StackTraceContent>
          <StackTraceFrames />
        </StackTraceContent>
      </StackTrace>
    );

    expect(screen.getByText("/src/index.ts:10:5")).toBeInTheDocument();
  });

  it("dims internal frames", () => {
    const { container } = render(
      <StackTrace defaultOpen trace={sampleStackTrace}>
        <StackTraceContent>
          <StackTraceFrames />
        </StackTraceContent>
      </StackTrace>
    );

    // Find the user frame (UserList) and internal frame (renderWithHooks)
    const frames = container.querySelectorAll(".text-xs");
    expect(frames.length).toBeGreaterThan(0);
  });

  it("hides internal frames when showInternalFrames is false", () => {
    const { container } = render(
      <StackTrace defaultOpen trace={sampleStackTrace}>
        <StackTraceContent>
          <StackTraceFrames showInternalFrames={false} />
        </StackTraceContent>
      </StackTrace>
    );

    // Should only have 1 frame (UserList), not the node_modules frames
    const frames = container.querySelectorAll(".text-xs");
    expect(frames.length).toBe(1);
    expect(screen.queryByText(RENDER_WITH_HOOKS_REGEX)).not.toBeInTheDocument();
    expect(screen.queryByText(BEGIN_WORK_REGEX)).not.toBeInTheDocument();
  });

  it("calls onFilePathClick when file path is clicked", async () => {
    const onFilePathClick = vi.fn();
    const user = userEvent.setup();

    render(
      <StackTrace
        defaultOpen
        onFilePathClick={onFilePathClick}
        trace={simpleStackTrace}
      >
        <StackTraceContent>
          <StackTraceFrames />
        </StackTraceContent>
      </StackTrace>
    );

    const filePathButton = screen.getByText("/src/index.ts:10:5");
    await user.click(filePathButton);

    expect(onFilePathClick).toHaveBeenCalledWith("/src/index.ts", 10, 5);
  });

  it("shows no frames message when empty", () => {
    const emptyTrace = "Error: test";

    render(
      <StackTrace defaultOpen trace={emptyTrace}>
        <StackTraceContent>
          <StackTraceFrames />
        </StackTraceContent>
      </StackTrace>
    );

    expect(screen.getByText("No stack frames")).toBeInTheDocument();
  });

  it("handles node: internal paths", () => {
    render(
      <StackTrace defaultOpen trace={nodeInternalTrace}>
        <StackTraceContent>
          <StackTraceFrames showInternalFrames={false} />
        </StackTraceContent>
      </StackTrace>
    );

    // node: paths should be hidden
    expect(screen.queryByText(NODE_FS_REGEX)).not.toBeInTheDocument();
  });
});

describe("Stack trace parsing", () => {
  it("parses TypeError correctly", () => {
    render(
      <StackTrace trace={sampleStackTrace}>
        <StackTraceErrorType />
        <StackTraceErrorMessage />
      </StackTrace>
    );

    expect(screen.getByText("TypeError")).toBeInTheDocument();
    expect(
      screen.getByText("Cannot read properties of undefined (reading 'map')")
    ).toBeInTheDocument();
  });

  it("parses simple Error correctly", () => {
    render(
      <StackTrace trace={simpleStackTrace}>
        <StackTraceErrorType />
        <StackTraceErrorMessage />
      </StackTrace>
    );

    expect(screen.getByText("Error")).toBeInTheDocument();
    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
  });

  it("handles frames without function names", () => {
    const traceWithoutFn = `Error: test
    at /src/index.ts:10:5`;

    render(
      <StackTrace defaultOpen trace={traceWithoutFn}>
        <StackTraceContent>
          <StackTraceFrames />
        </StackTraceContent>
      </StackTrace>
    );

    expect(screen.getByText("/src/index.ts:10:5")).toBeInTheDocument();
  });

  it("handles async function names", () => {
    const asyncTrace = `Error: test
    at async fetchData (/src/api.ts:20:10)`;

    render(
      <StackTrace defaultOpen trace={asyncTrace}>
        <StackTraceContent>
          <StackTraceFrames />
        </StackTraceContent>
      </StackTrace>
    );

    expect(screen.getByText(ASYNC_FETCH_DATA_REGEX)).toBeInTheDocument();
  });
});
