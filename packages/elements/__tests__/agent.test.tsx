import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { z } from "zod";
import {
  Agent,
  AgentContent,
  AgentHeader,
  AgentInstructions,
  AgentOutput,
  AgentTool,
  AgentTools,
} from "../src/agent";

const mockTool = {
  description: "Search the web for information",
  inputSchema: z.object({
    query: z.string().describe("Search query"),
  }),
};

const ZOD_OBJECT_REGEX = /"ZodObject"/;

describe("Agent", () => {
  it("renders children", () => {
    render(<Agent>Content</Agent>);
    expect(screen.getByText("Content")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(<Agent className="custom">Test</Agent>);
    expect(container.firstChild).toHaveClass("custom");
  });
});

describe("AgentHeader", () => {
  it("renders agent name", () => {
    render(<AgentHeader name="Research Assistant" />);
    expect(screen.getByText("Research Assistant")).toBeInTheDocument();
  });

  it("renders model badge when provided", () => {
    render(
      <AgentHeader model="anthropic/claude-sonnet-4-5" name="Test Agent" />
    );
    expect(screen.getByText("anthropic/claude-sonnet-4-5")).toBeInTheDocument();
  });

  it("does not render model badge when not provided", () => {
    render(<AgentHeader name="Test Agent" />);
    expect(
      screen.queryByText("anthropic/claude-sonnet-4-5")
    ).not.toBeInTheDocument();
  });

  it("has bot icon", () => {
    const { container } = render(<AgentHeader name="Test Agent" />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });
});

describe("AgentContent", () => {
  it("renders content", () => {
    render(<AgentContent>Content text</AgentContent>);
    expect(screen.getByText("Content text")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(
      <AgentContent className="custom-class">Content</AgentContent>
    );
    expect(container.querySelector(".custom-class")).toBeInTheDocument();
  });
});

describe("AgentInstructions", () => {
  it("renders instructions label", () => {
    render(<AgentInstructions>Test instructions</AgentInstructions>);
    expect(screen.getByText("Instructions")).toBeInTheDocument();
  });

  it("renders instructions content", () => {
    render(<AgentInstructions>You are a helpful assistant.</AgentInstructions>);
    expect(
      screen.getByText("You are a helpful assistant.")
    ).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(
      <AgentInstructions className="custom-instructions">
        Instructions
      </AgentInstructions>
    );
    expect(container.querySelector(".custom-instructions")).toBeInTheDocument();
  });
});

describe("AgentTools", () => {
  it("renders tools label", () => {
    render(
      <AgentTools>
        <AgentTool tool={mockTool} value="search" />
      </AgentTools>
    );
    expect(screen.getByText("Tools")).toBeInTheDocument();
  });
});

describe("AgentTool", () => {
  it("renders tool description as trigger", () => {
    render(
      <AgentTools>
        <AgentTool tool={mockTool} value="search" />
      </AgentTools>
    );
    expect(
      screen.getByText("Search the web for information")
    ).toBeInTheDocument();
  });

  it("shows inputSchema when expanded", async () => {
    const user = userEvent.setup();

    render(
      <AgentTools>
        <AgentTool tool={mockTool} value="search" />
      </AgentTools>
    );

    const trigger = screen.getByText("Search the web for information");
    await user.click(trigger);

    // Zod schemas serialize to internal structure with _def and typeName
    await waitFor(() => {
      expect(screen.getByText(ZOD_OBJECT_REGEX)).toBeInTheDocument();
    });
  });

  it("renders multiple tools", () => {
    const tool2 = {
      description: "Read a file",
      inputSchema: z.object({
        path: z.string(),
      }),
    };

    render(
      <AgentTools>
        <AgentTool tool={mockTool} value="search" />
        <AgentTool tool={tool2} value="read" />
      </AgentTools>
    );

    expect(
      screen.getByText("Search the web for information")
    ).toBeInTheDocument();
    expect(screen.getByText("Read a file")).toBeInTheDocument();
  });

  it("handles tool without description", () => {
    const toolNoDesc = {
      inputSchema: z.object({ id: z.string() }),
    };

    render(
      <AgentTools>
        <AgentTool tool={toolNoDesc} value="no-desc" />
      </AgentTools>
    );

    expect(screen.getByText("No description")).toBeInTheDocument();
  });
});

describe("AgentOutput", () => {
  it("renders output schema label", () => {
    render(<AgentOutput schema="z.object({ name: z.string() })" />);
    expect(screen.getByText("Output Schema")).toBeInTheDocument();
  });

  it("renders schema code", async () => {
    const { container } = render(
      <AgentOutput schema="z.object({ name: z.string() })" />
    );

    await waitFor(() => {
      expect(container.querySelector("pre")).toBeInTheDocument();
      expect(container.querySelector("code")).toBeInTheDocument();
    });
  });

  it("applies custom className", () => {
    const { container } = render(
      <AgentOutput className="custom-output" schema="z.string()" />
    );
    expect(container.querySelector(".custom-output")).toBeInTheDocument();
  });
});

describe("Agent integration", () => {
  it("renders complete agent configuration", () => {
    const schema = `z.object({
  sentiment: z.enum(['positive', 'negative']),
  score: z.number(),
})`;

    render(
      <Agent>
        <AgentHeader
          model="anthropic/claude-sonnet-4-5"
          name="Sentiment Analyzer"
        />
        <AgentContent>
          <AgentInstructions>Analyze sentiment of text.</AgentInstructions>
          <AgentTools>
            <AgentTool tool={mockTool} value="analyze" />
          </AgentTools>
          <AgentOutput schema={schema} />
        </AgentContent>
      </Agent>
    );

    expect(screen.getByText("Sentiment Analyzer")).toBeInTheDocument();
    expect(screen.getByText("anthropic/claude-sonnet-4-5")).toBeInTheDocument();
    expect(screen.getByText("Instructions")).toBeInTheDocument();
    expect(screen.getByText("Analyze sentiment of text.")).toBeInTheDocument();
    expect(screen.getByText("Tools")).toBeInTheDocument();
    expect(
      screen.getByText("Search the web for information")
    ).toBeInTheDocument();
    expect(screen.getByText("Output Schema")).toBeInTheDocument();
  });

  it("renders agent without optional fields", () => {
    render(
      <Agent>
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
