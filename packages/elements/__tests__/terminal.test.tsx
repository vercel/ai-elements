import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import {
  Terminal,
  TerminalHeader,
  TerminalTitle,
  TerminalStatus,
  TerminalActions,
  TerminalCopyButton,
  TerminalClearButton,
  TerminalContent,
} from "../src/terminal";

describe("Terminal", () => {
  it("renders output text", () => {
    render(<Terminal output="Hello World" />);
    expect(screen.getByText("Hello World")).toBeInTheDocument();
  });

  it("renders default title", () => {
    render(<Terminal output="" />);
    expect(screen.getByText("Terminal")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(
      <Terminal output="" className="custom-class" />
    );
    expect(container.firstChild).toHaveClass("custom-class");
  });

  it("renders children when provided", () => {
    render(
      <Terminal output="">
        <div>Custom Content</div>
      </Terminal>
    );
    expect(screen.getByText("Custom Content")).toBeInTheDocument();
  });
});

describe("TerminalHeader", () => {
  it("renders custom title", () => {
    render(
      <Terminal output="">
        <TerminalHeader>
          <TerminalTitle>Build Output</TerminalTitle>
        </TerminalHeader>
      </Terminal>
    );
    expect(screen.getByText("Build Output")).toBeInTheDocument();
  });
});

describe("TerminalStatus", () => {
  it("shows shimmer when streaming", () => {
    const { container } = render(
      <Terminal output="" isStreaming={true}>
        <TerminalHeader>
          <TerminalStatus />
        </TerminalHeader>
      </Terminal>
    );
    // Shimmer component should be present
    expect(container.querySelector(".animate-shimmer")).toBeInTheDocument();
  });

  it("hides when not streaming", () => {
    const { container } = render(
      <Terminal output="" isStreaming={false}>
        <TerminalHeader>
          <TerminalStatus />
        </TerminalHeader>
      </Terminal>
    );
    expect(container.querySelector(".animate-shimmer")).not.toBeInTheDocument();
  });
});

describe("TerminalCopyButton", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("copies output to clipboard", async () => {
    const user = userEvent.setup();
    const writeTextSpy = vi.spyOn(navigator.clipboard, "writeText");

    render(
      <Terminal output="test output">
        <TerminalHeader>
          <TerminalActions>
            <TerminalCopyButton />
          </TerminalActions>
        </TerminalHeader>
      </Terminal>
    );

    const button = screen.getByRole("button");
    await user.click(button);

    expect(writeTextSpy).toHaveBeenCalledWith("test output");
  });

  it("calls onCopy callback", async () => {
    const onCopy = vi.fn();
    const user = userEvent.setup();

    render(
      <Terminal output="test">
        <TerminalHeader>
          <TerminalActions>
            <TerminalCopyButton onCopy={onCopy} />
          </TerminalActions>
        </TerminalHeader>
      </Terminal>
    );

    const button = screen.getByRole("button");
    await user.click(button);

    expect(onCopy).toHaveBeenCalled();
  });
});

describe("TerminalClearButton", () => {
  it("calls onClear when clicked", async () => {
    const onClear = vi.fn();
    const user = userEvent.setup();

    render(
      <Terminal output="test" onClear={onClear}>
        <TerminalHeader>
          <TerminalActions>
            <TerminalClearButton />
          </TerminalActions>
        </TerminalHeader>
      </Terminal>
    );

    const button = screen.getByRole("button");
    await user.click(button);

    expect(onClear).toHaveBeenCalled();
  });

  it("does not render without onClear", () => {
    render(
      <Terminal output="test">
        <TerminalHeader>
          <TerminalActions>
            <TerminalClearButton />
          </TerminalActions>
        </TerminalHeader>
      </Terminal>
    );

    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
});

describe("TerminalContent", () => {
  it("renders ANSI colored text", () => {
    const ansiText = "\x1b[32mGreen Text\x1b[0m";
    render(<Terminal output={ansiText} />);
    expect(screen.getByText("Green Text")).toBeInTheDocument();
  });

  it("shows cursor when streaming", () => {
    const { container } = render(<Terminal output="test" isStreaming={true} />);
    expect(container.querySelector(".animate-pulse")).toBeInTheDocument();
  });
});

describe("Composability", () => {
  it("renders with all subcomponents", () => {
    const onClear = vi.fn();
    render(
      <Terminal output="Output text" isStreaming={false} onClear={onClear}>
        <TerminalHeader>
          <TerminalTitle>My Terminal</TerminalTitle>
          <TerminalActions>
            <TerminalCopyButton />
            <TerminalClearButton />
          </TerminalActions>
        </TerminalHeader>
        <TerminalContent />
      </Terminal>
    );

    expect(screen.getByText("My Terminal")).toBeInTheDocument();
    expect(screen.getByText("Output text")).toBeInTheDocument();
    expect(screen.getAllByRole("button")).toHaveLength(2);
  });
});
