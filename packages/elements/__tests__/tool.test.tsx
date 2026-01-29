import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";

const QUERY_REGEX = /"query"/;

import {
  Tool,
  ToolContent,
  ToolHeader,
  ToolInput,
  ToolOutput,
} from "../src/tool";

describe("Tool", () => {
  it("renders children", () => {
    render(<Tool>Content</Tool>);
    expect(screen.getByText("Content")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(<Tool className="custom">Test</Tool>);
    expect(container.firstChild).toHaveClass("custom");
  });
});

describe("ToolHeader", () => {
  it("renders tool name", () => {
    render(
      <Tool defaultOpen>
        <ToolHeader state="input-available" title="search" type="tool-search" />
      </Tool>
    );
    expect(screen.getByText("search")).toBeInTheDocument();
  });

  it("renders derived name from type", () => {
    render(
      <Tool defaultOpen>
        <ToolHeader state="input-available" type="tool-web-search" />
      </Tool>
    );
    expect(screen.getByText("web-search")).toBeInTheDocument();
  });

  it("shows pending status", () => {
    render(
      <Tool>
        <ToolHeader state="input-streaming" title="test" type="tool-test" />
      </Tool>
    );
    expect(screen.getByText("Pending")).toBeInTheDocument();
  });

  it("shows running status", () => {
    render(
      <Tool>
        <ToolHeader state="input-available" title="test" type="tool-test" />
      </Tool>
    );
    expect(screen.getByText("Running")).toBeInTheDocument();
  });

  it("shows completed status", () => {
    render(
      <Tool>
        <ToolHeader state="output-available" title="test" type="tool-test" />
      </Tool>
    );
    expect(screen.getByText("Completed")).toBeInTheDocument();
  });

  it("shows error status", () => {
    render(
      <Tool>
        <ToolHeader state="output-error" title="test" type="tool-test" />
      </Tool>
    );
    expect(screen.getByText("Error")).toBeInTheDocument();
  });

  it("shows awaiting approval status", () => {
    render(
      <Tool>
        <ToolHeader state="approval-requested" title="test" type="tool-test" />
      </Tool>
    );
    expect(screen.getByText("Awaiting Approval")).toBeInTheDocument();
  });

  it("shows responded status", () => {
    render(
      <Tool>
        <ToolHeader state="approval-responded" title="test" type="tool-test" />
      </Tool>
    );
    expect(screen.getByText("Responded")).toBeInTheDocument();
  });

  it("shows denied status", () => {
    render(
      <Tool>
        <ToolHeader state="output-denied" title="test" type="tool-test" />
      </Tool>
    );
    expect(screen.getByText("Denied")).toBeInTheDocument();
  });

  it("has wrench icon", () => {
    const { container } = render(
      <Tool>
        <ToolHeader state="input-available" title="test" type="tool-test" />
      </Tool>
    );
    expect(container.querySelector("svg")).toBeInTheDocument();
  });
});

describe("ToolHeader with DynamicToolUIPart", () => {
  it("renders dynamic tool name from toolName prop", () => {
    render(
      <Tool defaultOpen>
        <ToolHeader
          state="input-available"
          toolName="web-search"
          type="dynamic-tool"
        />
      </Tool>
    );
    expect(screen.getByText("web-search")).toBeInTheDocument();
  });

  it("renders title over toolName for dynamic tools", () => {
    render(
      <Tool defaultOpen>
        <ToolHeader
          state="input-available"
          title="Custom Title"
          toolName="web-search"
          type="dynamic-tool"
        />
      </Tool>
    );
    expect(screen.getByText("Custom Title")).toBeInTheDocument();
  });

  it("shows status badge for dynamic tools", () => {
    render(
      <Tool>
        <ToolHeader
          state="output-available"
          toolName="search"
          type="dynamic-tool"
        />
      </Tool>
    );
    expect(screen.getByText("Completed")).toBeInTheDocument();
  });

  it("shows approval-requested status for dynamic tools", () => {
    render(
      <Tool>
        <ToolHeader
          state="approval-requested"
          toolName="delete-file"
          type="dynamic-tool"
        />
      </Tool>
    );
    expect(screen.getByText("Awaiting Approval")).toBeInTheDocument();
  });
});

describe("ToolContent", () => {
  it("renders content", () => {
    render(
      <Tool defaultOpen>
        <ToolHeader state="input-available" title="test" type="tool-test" />
        <ToolContent>Tool details</ToolContent>
      </Tool>
    );
    expect(screen.getByText("Tool details")).toBeInTheDocument();
  });
});

describe("ToolInput", () => {
  it("renders input parameters", async () => {
    const input = { query: "test search" };
    render(
      <Tool defaultOpen>
        <ToolHeader state="input-available" title="test" type="tool-test" />
        <ToolContent>
          <ToolInput input={input} />
        </ToolContent>
      </Tool>
    );
    expect(screen.getByText("Parameters")).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getAllByText(QUERY_REGEX)[0]).toBeInTheDocument();
    });
  });

  it("renders JSON formatted input", () => {
    const input = { key: "value", nested: { data: "test" } };
    render(
      <Tool defaultOpen>
        <ToolHeader state="input-available" title="test" type="tool-test" />
        <ToolContent>
          <ToolInput input={input} />
        </ToolContent>
      </Tool>
    );
    expect(screen.getByText("Parameters")).toBeInTheDocument();
  });
});

describe("ToolOutput", () => {
  it("renders output", () => {
    render(
      <Tool>
        <ToolOutput errorText={undefined} output="Result data" />
      </Tool>
    );
    expect(screen.getByText("Result")).toBeInTheDocument();
  });

  it("renders error output", () => {
    render(
      <Tool>
        <ToolOutput errorText="Error occurred" output={undefined} />
      </Tool>
    );
    expect(screen.getByText("Error")).toBeInTheDocument();
    expect(screen.getByText("Error occurred")).toBeInTheDocument();
  });

  it("renders nothing when no output", () => {
    const { container } = render(
      <Tool>
        <ToolOutput errorText={undefined} output={undefined} />
      </Tool>
    );
    expect(container.textContent).toBe("");
  });

  it("renders object output as JSON", () => {
    const output = { result: "success", data: [1, 2, 3] };
    render(
      <Tool>
        <ToolOutput errorText={undefined} output={output} />
      </Tool>
    );
    expect(screen.getByText("Result")).toBeInTheDocument();
  });
});
