import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import {
  Sandbox,
  SandboxContent,
  SandboxHeader,
  SandboxTabContent,
  SandboxTabs,
  SandboxTabsBar,
  SandboxTabsList,
  SandboxTabsTrigger,
} from "../src/sandbox";

describe("Sandbox", () => {
  it("renders children", () => {
    render(<Sandbox>Content</Sandbox>);
    expect(screen.getByText("Content")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(<Sandbox className="custom">Test</Sandbox>);
    expect(container.firstChild).toHaveClass("custom");
  });

  it("is open by default", () => {
    const { container } = render(<Sandbox>Content</Sandbox>);
    expect(container.firstChild).toHaveAttribute("data-state", "open");
  });

  it("has base styles", () => {
    const { container } = render(<Sandbox>Test</Sandbox>);
    expect(container.firstChild).toHaveClass("rounded-md");
    expect(container.firstChild).toHaveClass("border");
  });
});

describe("SandboxHeader", () => {
  it("renders title", () => {
    render(
      <Sandbox>
        <SandboxHeader state="input-available" title="Code Sandbox" />
      </Sandbox>
    );
    expect(screen.getByText("Code Sandbox")).toBeInTheDocument();
  });

  it("shows pending status", () => {
    render(
      <Sandbox>
        <SandboxHeader state="input-streaming" title="test" />
      </Sandbox>
    );
    expect(screen.getByText("Pending")).toBeInTheDocument();
  });

  it("shows running status", () => {
    render(
      <Sandbox>
        <SandboxHeader state="input-available" title="test" />
      </Sandbox>
    );
    expect(screen.getByText("Running")).toBeInTheDocument();
  });

  it("shows completed status", () => {
    render(
      <Sandbox>
        <SandboxHeader state="output-available" title="test" />
      </Sandbox>
    );
    expect(screen.getByText("Completed")).toBeInTheDocument();
  });

  it("shows error status", () => {
    render(
      <Sandbox>
        <SandboxHeader state="output-error" title="test" />
      </Sandbox>
    );
    expect(screen.getByText("Error")).toBeInTheDocument();
  });

  it("has code icon", () => {
    const { container } = render(
      <Sandbox>
        <SandboxHeader state="input-available" title="test" />
      </Sandbox>
    );
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    render(
      <Sandbox>
        <SandboxHeader
          className="custom-header"
          state="input-available"
          title="test"
        />
      </Sandbox>
    );
    const trigger = screen.getByRole("button");
    expect(trigger).toHaveClass("custom-header");
  });

  it("toggles content on click", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <Sandbox>
        <SandboxHeader state="input-available" title="test" />
        <SandboxContent>Hidden content</SandboxContent>
      </Sandbox>
    );

    expect(container.firstChild).toHaveAttribute("data-state", "open");

    const trigger = screen.getByRole("button");
    await user.click(trigger);

    expect(container.firstChild).toHaveAttribute("data-state", "closed");
  });
});

describe("SandboxContent", () => {
  it("renders content", () => {
    render(
      <Sandbox defaultOpen>
        <SandboxHeader state="input-available" title="test" />
        <SandboxContent>Sandbox details</SandboxContent>
      </Sandbox>
    );
    expect(screen.getByText("Sandbox details")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    render(
      <Sandbox defaultOpen>
        <SandboxContent className="custom-content">Content</SandboxContent>
      </Sandbox>
    );
    const content = screen.getByText("Content").closest("[class*='custom']");
    expect(content).toHaveClass("custom-content");
  });
});

describe("SandboxTabs", () => {
  it("renders tabs", () => {
    render(
      <Sandbox defaultOpen>
        <SandboxContent>
          <SandboxTabs defaultValue="code">
            <SandboxTabsBar>
              <SandboxTabsList>
                <SandboxTabsTrigger value="code">Code</SandboxTabsTrigger>
                <SandboxTabsTrigger value="output">Output</SandboxTabsTrigger>
              </SandboxTabsList>
            </SandboxTabsBar>
          </SandboxTabs>
        </SandboxContent>
      </Sandbox>
    );
    expect(screen.getByText("Code")).toBeInTheDocument();
    expect(screen.getByText("Output")).toBeInTheDocument();
  });

  it("switches tabs on click", async () => {
    const user = userEvent.setup();
    render(
      <Sandbox defaultOpen>
        <SandboxContent>
          <SandboxTabs defaultValue="code">
            <SandboxTabsBar>
              <SandboxTabsList>
                <SandboxTabsTrigger value="code">Code</SandboxTabsTrigger>
                <SandboxTabsTrigger value="output">Output</SandboxTabsTrigger>
              </SandboxTabsList>
            </SandboxTabsBar>
            <SandboxTabContent value="code">Code content</SandboxTabContent>
            <SandboxTabContent value="output">Output content</SandboxTabContent>
          </SandboxTabs>
        </SandboxContent>
      </Sandbox>
    );

    expect(screen.getByText("Code content")).toBeInTheDocument();

    await user.click(screen.getByText("Output"));

    expect(screen.getByText("Output content")).toBeInTheDocument();
  });

  it("calls onValueChange when tab changes", async () => {
    const onValueChange = vi.fn();
    const user = userEvent.setup();
    render(
      <Sandbox defaultOpen>
        <SandboxContent>
          <SandboxTabs defaultValue="code" onValueChange={onValueChange}>
            <SandboxTabsBar>
              <SandboxTabsList>
                <SandboxTabsTrigger value="code">Code</SandboxTabsTrigger>
                <SandboxTabsTrigger value="output">Output</SandboxTabsTrigger>
              </SandboxTabsList>
            </SandboxTabsBar>
          </SandboxTabs>
        </SandboxContent>
      </Sandbox>
    );

    await user.click(screen.getByText("Output"));

    expect(onValueChange).toHaveBeenCalledWith("output");
  });

  it("applies custom className", () => {
    const { container } = render(
      <Sandbox defaultOpen>
        <SandboxContent>
          <SandboxTabs className="custom-tabs" defaultValue="code">
            <SandboxTabsBar>
              <SandboxTabsList>
                <SandboxTabsTrigger value="code">Code</SandboxTabsTrigger>
              </SandboxTabsList>
            </SandboxTabsBar>
          </SandboxTabs>
        </SandboxContent>
      </Sandbox>
    );
    expect(container.querySelector(".custom-tabs")).toBeInTheDocument();
  });
});

describe("SandboxTabsBar", () => {
  it("renders children", () => {
    render(
      <SandboxTabsBar>
        <span>Bar content</span>
      </SandboxTabsBar>
    );
    expect(screen.getByText("Bar content")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(
      <SandboxTabsBar className="custom-bar">Content</SandboxTabsBar>
    );
    expect(container.firstChild).toHaveClass("custom-bar");
    expect(container.firstChild).toHaveClass("border-t");
    expect(container.firstChild).toHaveClass("border-b");
  });
});

describe("SandboxTabsList", () => {
  it("applies custom className", () => {
    render(
      <Sandbox defaultOpen>
        <SandboxContent>
          <SandboxTabs defaultValue="code">
            <SandboxTabsBar>
              <SandboxTabsList className="custom-list">
                <SandboxTabsTrigger value="code">Code</SandboxTabsTrigger>
              </SandboxTabsList>
            </SandboxTabsBar>
          </SandboxTabs>
        </SandboxContent>
      </Sandbox>
    );
    const list = screen.getByRole("tablist");
    expect(list).toHaveClass("custom-list");
    expect(list).toHaveClass("bg-transparent");
  });
});

describe("SandboxTabsTrigger", () => {
  it("applies custom className", () => {
    render(
      <Sandbox defaultOpen>
        <SandboxContent>
          <SandboxTabs defaultValue="code">
            <SandboxTabsBar>
              <SandboxTabsList>
                <SandboxTabsTrigger className="custom-trigger" value="code">
                  Code
                </SandboxTabsTrigger>
              </SandboxTabsList>
            </SandboxTabsBar>
          </SandboxTabs>
        </SandboxContent>
      </Sandbox>
    );
    const trigger = screen.getByRole("tab");
    expect(trigger).toHaveClass("custom-trigger");
  });

  it("shows active state", () => {
    render(
      <Sandbox defaultOpen>
        <SandboxContent>
          <SandboxTabs defaultValue="code">
            <SandboxTabsBar>
              <SandboxTabsList>
                <SandboxTabsTrigger value="code">Code</SandboxTabsTrigger>
              </SandboxTabsList>
            </SandboxTabsBar>
          </SandboxTabs>
        </SandboxContent>
      </Sandbox>
    );
    const trigger = screen.getByRole("tab");
    expect(trigger).toHaveAttribute("data-state", "active");
  });
});

describe("SandboxTabContent", () => {
  it("renders content for active tab", () => {
    render(
      <Sandbox defaultOpen>
        <SandboxContent>
          <SandboxTabs defaultValue="code">
            <SandboxTabsBar>
              <SandboxTabsList>
                <SandboxTabsTrigger value="code">Code</SandboxTabsTrigger>
              </SandboxTabsList>
            </SandboxTabsBar>
            <SandboxTabContent value="code">Tab content</SandboxTabContent>
          </SandboxTabs>
        </SandboxContent>
      </Sandbox>
    );
    expect(screen.getByText("Tab content")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    render(
      <Sandbox defaultOpen>
        <SandboxContent>
          <SandboxTabs defaultValue="code">
            <SandboxTabsBar>
              <SandboxTabsList>
                <SandboxTabsTrigger value="code">Code</SandboxTabsTrigger>
              </SandboxTabsList>
            </SandboxTabsBar>
            <SandboxTabContent className="custom-content" value="code">
              Content
            </SandboxTabContent>
          </SandboxTabs>
        </SandboxContent>
      </Sandbox>
    );
    const tabPanel = screen.getByRole("tabpanel");
    expect(tabPanel).toHaveClass("custom-content");
  });
});

describe("Sandbox integration", () => {
  it("renders complete sandbox with tabs", async () => {
    const user = userEvent.setup();
    render(
      <Sandbox defaultOpen>
        <SandboxHeader state="output-available" title="Python Sandbox" />
        <SandboxContent>
          <SandboxTabs defaultValue="code">
            <SandboxTabsBar>
              <SandboxTabsList>
                <SandboxTabsTrigger value="code">Code</SandboxTabsTrigger>
                <SandboxTabsTrigger value="output">Output</SandboxTabsTrigger>
              </SandboxTabsList>
            </SandboxTabsBar>
            <SandboxTabContent value="code">Code content</SandboxTabContent>
            <SandboxTabContent value="output">Output content</SandboxTabContent>
          </SandboxTabs>
        </SandboxContent>
      </Sandbox>
    );

    // Check header
    expect(screen.getByText("Python Sandbox")).toBeInTheDocument();
    expect(screen.getByText("Completed")).toBeInTheDocument();

    // Check tabs
    expect(screen.getByText("Code")).toBeInTheDocument();
    expect(screen.getByText("Output")).toBeInTheDocument();

    // Switch to output
    await user.click(screen.getByText("Output"));
    expect(screen.getByText("Output content")).toBeInTheDocument();
  });

  it("can be controlled externally", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(
      <Sandbox defaultOpen>
        <SandboxContent>
          <SandboxTabs onValueChange={onValueChange} value="code">
            <SandboxTabsBar>
              <SandboxTabsList>
                <SandboxTabsTrigger value="code">Code</SandboxTabsTrigger>
                <SandboxTabsTrigger value="output">Output</SandboxTabsTrigger>
              </SandboxTabsList>
            </SandboxTabsBar>
            <SandboxTabContent value="code">Code content</SandboxTabContent>
            <SandboxTabContent value="output">Output content</SandboxTabContent>
          </SandboxTabs>
        </SandboxContent>
      </Sandbox>
    );

    await user.click(screen.getByText("Output"));
    expect(onValueChange).toHaveBeenCalledWith("output");
  });
});
