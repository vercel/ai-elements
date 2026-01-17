import { TooltipProvider } from "@repo/shadcn-ui/components/ui/tooltip";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import {
  Agent,
  AgentContent,
  AgentHeader,
  AgentInstructions,
  AgentOutput,
  AgentTool,
  AgentTools,
} from "../src/agent";

describe("Agent", () => {
  it("renders children", () => {
    render(<Agent>Content</Agent>);
    expect(screen.getByText("Content")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(<Agent className="custom">Test</Agent>);
    expect(container.firstChild).toHaveClass("custom");
  });

  it("throws error when AgentHeader used outside provider", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});

    expect(() => render(<AgentHeader name="Test" />)).toThrow(
      "Agent components must be used within Agent"
    );

    spy.mockRestore();
  });

  it("starts closed by default", () => {
    render(
      <Agent>
        <AgentHeader name="Test Agent" />
        <AgentContent>Hidden content</AgentContent>
      </Agent>
    );

    const content = screen.queryByText("Hidden content");
    expect(content).not.toBeInTheDocument();
  });

  it("can start open", () => {
    render(
      <Agent defaultOpen>
        <AgentHeader name="Test Agent" />
        <AgentContent>Visible content</AgentContent>
      </Agent>
    );

    expect(screen.getByText("Visible content")).toBeVisible();
  });

  it("calls onOpenChange", async () => {
    const onOpenChange = vi.fn();
    const user = userEvent.setup();

    render(
      <Agent onOpenChange={onOpenChange}>
        <AgentHeader name="Test Agent" />
        <AgentContent>Content</AgentContent>
      </Agent>
    );

    const trigger = screen.getByRole("button");
    await user.click(trigger);

    expect(onOpenChange).toHaveBeenCalled();
  });

  it("supports controlled open state", async () => {
    const user = userEvent.setup();

    const { rerender } = render(
      <Agent open={false}>
        <AgentHeader name="Test Agent" />
        <AgentContent>Content</AgentContent>
      </Agent>
    );

    expect(screen.queryByText("Content")).not.toBeInTheDocument();

    rerender(
      <Agent open={true}>
        <AgentHeader name="Test Agent" />
        <AgentContent>Content</AgentContent>
      </Agent>
    );

    expect(screen.getByText("Content")).toBeVisible();
  });
});

describe("AgentHeader", () => {
  it("renders agent name", () => {
    render(
      <Agent>
        <AgentHeader name="Research Assistant" />
      </Agent>
    );

    expect(screen.getByText("Research Assistant")).toBeInTheDocument();
  });

  it("renders model badge when provided", () => {
    render(
      <Agent>
        <AgentHeader name="Test Agent" model="anthropic/claude-sonnet-4-5" />
      </Agent>
    );

    expect(screen.getByText("anthropic/claude-sonnet-4-5")).toBeInTheDocument();
  });

  it("does not render model badge when not provided", () => {
    render(
      <Agent>
        <AgentHeader name="Test Agent" />
      </Agent>
    );

    expect(
      screen.queryByText("anthropic/claude-sonnet-4-5")
    ).not.toBeInTheDocument();
  });

  it("has bot icon", () => {
    const { container } = render(
      <Agent>
        <AgentHeader name="Test Agent" />
      </Agent>
    );

    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("toggles content on click", async () => {
    const user = userEvent.setup();

    render(
      <Agent>
        <AgentHeader name="Test Agent" />
        <AgentContent>Toggle content</AgentContent>
      </Agent>
    );

    expect(screen.queryByText("Toggle content")).not.toBeInTheDocument();

    const trigger = screen.getByRole("button");
    await user.click(trigger);

    expect(screen.getByText("Toggle content")).toBeVisible();
  });
});

describe("AgentContent", () => {
  it("renders content when open", () => {
    render(
      <Agent defaultOpen>
        <AgentHeader name="Test Agent" />
        <AgentContent>Content text</AgentContent>
      </Agent>
    );

    expect(screen.getByText("Content text")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(
      <Agent defaultOpen>
        <AgentHeader name="Test Agent" />
        <AgentContent className="custom-class">Content</AgentContent>
      </Agent>
    );

    expect(container.querySelector(".custom-class")).toBeInTheDocument();
  });
});

describe("AgentInstructions", () => {
  it("renders instructions label", () => {
    render(
      <Agent defaultOpen>
        <AgentHeader name="Test Agent" />
        <AgentContent>
          <AgentInstructions>Test instructions</AgentInstructions>
        </AgentContent>
      </Agent>
    );

    expect(screen.getByText("Instructions")).toBeInTheDocument();
  });

  it("renders instructions content", () => {
    render(
      <Agent defaultOpen>
        <AgentHeader name="Test Agent" />
        <AgentContent>
          <AgentInstructions>
            You are a helpful assistant.
          </AgentInstructions>
        </AgentContent>
      </Agent>
    );

    expect(screen.getByText("You are a helpful assistant.")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(
      <Agent defaultOpen>
        <AgentHeader name="Test Agent" />
        <AgentContent>
          <AgentInstructions className="custom-instructions">
            Instructions
          </AgentInstructions>
        </AgentContent>
      </Agent>
    );

    expect(container.querySelector(".custom-instructions")).toBeInTheDocument();
  });
});

describe("AgentTools", () => {
  it("renders tools label", () => {
    render(
      <Agent defaultOpen>
        <AgentHeader name="Test Agent" />
        <AgentContent>
          <AgentTools>
            <AgentTool name="search" />
          </AgentTools>
        </AgentContent>
      </Agent>
    );

    expect(screen.getByText("Tools")).toBeInTheDocument();
  });

  it("renders children", () => {
    render(
      <Agent defaultOpen>
        <AgentHeader name="Test Agent" />
        <AgentContent>
          <AgentTools>
            <span>Tool child</span>
          </AgentTools>
        </AgentContent>
      </Agent>
    );

    expect(screen.getByText("Tool child")).toBeInTheDocument();
  });
});

describe("AgentTool", () => {
  it("renders tool name", () => {
    render(
      <Agent defaultOpen>
        <AgentHeader name="Test Agent" />
        <AgentContent>
          <AgentTools>
            <AgentTool name="web_search" />
          </AgentTools>
        </AgentContent>
      </Agent>
    );

    expect(screen.getByText("web_search")).toBeInTheDocument();
  });

  it("renders as badge", () => {
    render(
      <Agent defaultOpen>
        <AgentHeader name="Test Agent" />
        <AgentContent>
          <AgentTools>
            <AgentTool name="search" />
          </AgentTools>
        </AgentContent>
      </Agent>
    );

    const badge = screen.getByText("search");
    expect(badge).toHaveClass("text-xs");
  });

  it("renders with tooltip when description provided", async () => {
    const user = userEvent.setup();

    render(
      <TooltipProvider>
        <Agent defaultOpen>
          <AgentHeader name="Test Agent" />
          <AgentContent>
            <AgentTools>
              <AgentTool name="search" description="Search the web" />
            </AgentTools>
          </AgentContent>
        </Agent>
      </TooltipProvider>
    );

    const badge = screen.getByText("search");
    await user.hover(badge);

    await waitFor(() => {
      expect(screen.getAllByText("Search the web").length).toBeGreaterThan(0);
    });
  });

  it("renders multiple tools", () => {
    render(
      <Agent defaultOpen>
        <AgentHeader name="Test Agent" />
        <AgentContent>
          <AgentTools>
            <AgentTool name="search" />
            <AgentTool name="read" />
            <AgentTool name="write" />
          </AgentTools>
        </AgentContent>
      </Agent>
    );

    expect(screen.getByText("search")).toBeInTheDocument();
    expect(screen.getByText("read")).toBeInTheDocument();
    expect(screen.getByText("write")).toBeInTheDocument();
  });
});

describe("AgentOutput", () => {
  it("renders output schema label", () => {
    render(
      <Agent defaultOpen>
        <AgentHeader name="Test Agent" />
        <AgentContent>
          <AgentOutput schema="z.object({ name: z.string() })" />
        </AgentContent>
      </Agent>
    );

    expect(screen.getByText("Output Schema")).toBeInTheDocument();
  });

  it("renders schema code", async () => {
    const { container } = render(
      <Agent defaultOpen>
        <AgentHeader name="Test Agent" />
        <AgentContent>
          <AgentOutput schema="z.object({ name: z.string() })" />
        </AgentContent>
      </Agent>
    );

    await waitFor(() => {
      expect(container.querySelector("pre")).toBeInTheDocument();
      expect(container.querySelector("code")).toBeInTheDocument();
    });
  });

  it("applies custom className", () => {
    const { container } = render(
      <Agent defaultOpen>
        <AgentHeader name="Test Agent" />
        <AgentContent>
          <AgentOutput className="custom-output" schema="z.string()" />
        </AgentContent>
      </Agent>
    );

    expect(container.querySelector(".custom-output")).toBeInTheDocument();
  });
});

describe("Agent integration", () => {
  it("renders complete agent configuration", async () => {
    const schema = `z.object({
  sentiment: z.enum(['positive', 'negative']),
  score: z.number(),
})`;

    render(
      <TooltipProvider>
        <Agent defaultOpen>
          <AgentHeader
            name="Sentiment Analyzer"
            model="anthropic/claude-sonnet-4-5"
          />
          <AgentContent>
            <AgentInstructions>Analyze sentiment of text.</AgentInstructions>
            <AgentTools>
              <AgentTool name="analyze" description="Analyze text" />
            </AgentTools>
            <AgentOutput schema={schema} />
          </AgentContent>
        </Agent>
      </TooltipProvider>
    );

    expect(screen.getByText("Sentiment Analyzer")).toBeInTheDocument();
    expect(screen.getByText("anthropic/claude-sonnet-4-5")).toBeInTheDocument();
    expect(screen.getByText("Instructions")).toBeInTheDocument();
    expect(screen.getByText("Analyze sentiment of text.")).toBeInTheDocument();
    expect(screen.getByText("Tools")).toBeInTheDocument();
    expect(screen.getByText("analyze")).toBeInTheDocument();
    expect(screen.getByText("Output Schema")).toBeInTheDocument();
  });

  it("renders agent without optional fields", () => {
    render(
      <Agent defaultOpen>
        <AgentHeader name="Simple Agent" />
        <AgentContent>
          <AgentInstructions>Basic instructions.</AgentInstructions>
        </AgentContent>
      </Agent>
    );

    expect(screen.getByText("Simple Agent")).toBeInTheDocument();
    expect(screen.getByText("Basic instructions.")).toBeInTheDocument();
    expect(screen.queryByText("Tools")).not.toBeInTheDocument();
    expect(screen.queryByText("Output Schema")).not.toBeInTheDocument();
  });
});
