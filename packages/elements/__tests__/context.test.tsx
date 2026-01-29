import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import {
  Context,
  ContextCacheUsage,
  ContextContent,
  ContextContentBody,
  ContextContentFooter,
  ContextContentHeader,
  ContextInputUsage,
  ContextOutputUsage,
  ContextReasoningUsage,
  ContextTrigger,
} from "../src/context";

describe("Context", () => {
  it("renders children", () => {
    render(
      <Context defaultOpen maxTokens={100} usedTokens={50}>
        <ContextTrigger />
        <ContextContent>Content</ContextContent>
      </Context>
    );
    expect(screen.getByText("Content")).toBeInTheDocument();
  });

  it("displays percentage", () => {
    render(
      <Context maxTokens={100} usedTokens={50}>
        <ContextTrigger />
      </Context>
    );
    expect(screen.getByText("50%")).toBeInTheDocument();
  });

  it("throws error when components used outside Context provider", () => {
    // Suppress console.error for this test
    const spy = vi.spyOn(console, "error").mockImplementation(() => undefined);

    expect(() => render(<ContextTrigger />)).toThrow(
      "Context components must be used within Context"
    );

    spy.mockRestore();
  });
});

describe("ContextTrigger", () => {
  it("renders trigger button", () => {
    render(
      <Context maxTokens={100} usedTokens={25}>
        <ContextTrigger />
      </Context>
    );
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("displays formatted percentage", () => {
    render(
      <Context maxTokens={100} usedTokens={33}>
        <ContextTrigger />
      </Context>
    );
    expect(screen.getByText("33%")).toBeInTheDocument();
  });
});

describe("ContextContent", () => {
  it("renders content", () => {
    render(
      <Context defaultOpen maxTokens={100} usedTokens={50}>
        <ContextTrigger />
        <ContextContent>Details</ContextContent>
      </Context>
    );
    expect(screen.getByText("Details")).toBeInTheDocument();
  });
});

describe("ContextContentHeader", () => {
  it("renders default header with stats", () => {
    const { container } = render(
      <Context defaultOpen maxTokens={1000} usedTokens={500}>
        <ContextTrigger />
        <ContextContent>
          <ContextContentHeader />
        </ContextContent>
      </Context>
    );
    expect(container.textContent).toContain("50%");
  });

  it("renders custom children", () => {
    render(
      <Context defaultOpen maxTokens={100} usedTokens={50}>
        <ContextTrigger />
        <ContextContent>
          <ContextContentHeader>Custom Header</ContextContentHeader>
        </ContextContent>
      </Context>
    );
    expect(screen.getByText("Custom Header")).toBeInTheDocument();
  });
});

describe("ContextContentBody", () => {
  it("renders body content", () => {
    render(
      <Context defaultOpen maxTokens={100} usedTokens={50}>
        <ContextContent>
          <ContextContentBody>Body content</ContextContentBody>
        </ContextContent>
      </Context>
    );
    expect(screen.getByText("Body content")).toBeInTheDocument();
  });
});

describe("ContextContentFooter", () => {
  it("renders default footer with cost", () => {
    render(
      <Context defaultOpen maxTokens={100} modelId="gpt-4" usedTokens={50}>
        <ContextContent>
          <ContextContentFooter />
        </ContextContent>
      </Context>
    );
    expect(screen.getByText("Total cost")).toBeInTheDocument();
  });

  it("renders custom children", () => {
    render(
      <Context defaultOpen maxTokens={100} usedTokens={50}>
        <ContextContent>
          <ContextContentFooter>Custom Footer</ContextContentFooter>
        </ContextContent>
      </Context>
    );
    expect(screen.getByText("Custom Footer")).toBeInTheDocument();
  });
});

describe("ContextInputUsage", () => {
  it("renders input usage", () => {
    render(
      <Context
        defaultOpen
        maxTokens={100}
        modelId="gpt-4"
        usage={{ inputTokens: 50, outputTokens: 25 }}
        usedTokens={75}
      >
        <ContextTrigger />
        <ContextContent>
          <ContextInputUsage />
        </ContextContent>
      </Context>
    );
    expect(screen.getByText("Input")).toBeInTheDocument();
  });

  it("renders input usage without modelId", () => {
    render(
      <Context
        defaultOpen
        maxTokens={100}
        usage={{ inputTokens: 50 }}
        usedTokens={50}
      >
        <ContextContent>
          <ContextInputUsage />
        </ContextContent>
      </Context>
    );
    expect(screen.getByText("Input")).toBeInTheDocument();
  });

  it("renders nothing when no input tokens", () => {
    render(
      <Context defaultOpen maxTokens={100} usedTokens={0}>
        <ContextTrigger />
        <ContextContent>
          <ContextInputUsage />
        </ContextContent>
      </Context>
    );
    expect(screen.queryByText("Input")).not.toBeInTheDocument();
  });

  it("renders custom children", () => {
    render(
      <Context defaultOpen maxTokens={100} usedTokens={50}>
        <ContextContent>
          <ContextInputUsage>Custom Input</ContextInputUsage>
        </ContextContent>
      </Context>
    );
    expect(screen.getByText("Custom Input")).toBeInTheDocument();
  });
});

describe("ContextOutputUsage", () => {
  it("renders output usage", () => {
    render(
      <Context
        defaultOpen
        maxTokens={100}
        modelId="gpt-4"
        usage={{ inputTokens: 50, outputTokens: 25 }}
        usedTokens={75}
      >
        <ContextContent>
          <ContextOutputUsage />
        </ContextContent>
      </Context>
    );
    expect(screen.getByText("Output")).toBeInTheDocument();
  });

  it("renders output usage without modelId", () => {
    render(
      <Context
        defaultOpen
        maxTokens={100}
        usage={{ outputTokens: 25 }}
        usedTokens={25}
      >
        <ContextContent>
          <ContextOutputUsage />
        </ContextContent>
      </Context>
    );
    expect(screen.getByText("Output")).toBeInTheDocument();
  });

  it("renders nothing when no output tokens", () => {
    render(
      <Context defaultOpen maxTokens={100} usedTokens={0}>
        <ContextContent>
          <ContextOutputUsage />
        </ContextContent>
      </Context>
    );
    expect(screen.queryByText("Output")).not.toBeInTheDocument();
  });

  it("renders custom children", () => {
    render(
      <Context defaultOpen maxTokens={100} usedTokens={50}>
        <ContextContent>
          <ContextOutputUsage>Custom Output</ContextOutputUsage>
        </ContextContent>
      </Context>
    );
    expect(screen.getByText("Custom Output")).toBeInTheDocument();
  });
});

describe("ContextReasoningUsage", () => {
  it("renders reasoning usage", () => {
    render(
      <Context
        defaultOpen
        maxTokens={100}
        modelId="gpt-4"
        usage={{ reasoningTokens: 10 }}
        usedTokens={50}
      >
        <ContextContent>
          <ContextReasoningUsage />
        </ContextContent>
      </Context>
    );
    expect(screen.getByText("Reasoning")).toBeInTheDocument();
  });

  it("renders reasoning usage without modelId", () => {
    render(
      <Context
        defaultOpen
        maxTokens={100}
        usage={{ reasoningTokens: 10 }}
        usedTokens={10}
      >
        <ContextContent>
          <ContextReasoningUsage />
        </ContextContent>
      </Context>
    );
    expect(screen.getByText("Reasoning")).toBeInTheDocument();
  });

  it("renders nothing when no reasoning tokens", () => {
    render(
      <Context defaultOpen maxTokens={100} usedTokens={0}>
        <ContextContent>
          <ContextReasoningUsage />
        </ContextContent>
      </Context>
    );
    expect(screen.queryByText("Reasoning")).not.toBeInTheDocument();
  });

  it("renders custom children", () => {
    render(
      <Context defaultOpen maxTokens={100} usedTokens={50}>
        <ContextContent>
          <ContextReasoningUsage>Custom Reasoning</ContextReasoningUsage>
        </ContextContent>
      </Context>
    );
    expect(screen.getByText("Custom Reasoning")).toBeInTheDocument();
  });
});

describe("ContextCacheUsage", () => {
  it("renders cache usage", () => {
    render(
      <Context
        defaultOpen
        maxTokens={100}
        modelId="gpt-4"
        usage={{ cachedInputTokens: 20 }}
        usedTokens={50}
      >
        <ContextContent>
          <ContextCacheUsage />
        </ContextContent>
      </Context>
    );
    expect(screen.getByText("Cache")).toBeInTheDocument();
  });

  it("renders cache usage without modelId", () => {
    render(
      <Context
        defaultOpen
        maxTokens={100}
        usage={{ cachedInputTokens: 20 }}
        usedTokens={20}
      >
        <ContextContent>
          <ContextCacheUsage />
        </ContextContent>
      </Context>
    );
    expect(screen.getByText("Cache")).toBeInTheDocument();
  });

  it("renders nothing when no cache tokens", () => {
    render(
      <Context defaultOpen maxTokens={100} usedTokens={0}>
        <ContextContent>
          <ContextCacheUsage />
        </ContextContent>
      </Context>
    );
    expect(screen.queryByText("Cache")).not.toBeInTheDocument();
  });

  it("renders custom children", () => {
    render(
      <Context defaultOpen maxTokens={100} usedTokens={50}>
        <ContextContent>
          <ContextCacheUsage>Custom Cache</ContextCacheUsage>
        </ContextContent>
      </Context>
    );
    expect(screen.getByText("Custom Cache")).toBeInTheDocument();
  });
});
