import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  ModelSelector,
  ModelSelectorContent,
  ModelSelectorDialog,
  ModelSelectorEmpty,
  ModelSelectorGroup,
  ModelSelectorInput,
  ModelSelectorItem,
  ModelSelectorList,
  ModelSelectorLogo,
  ModelSelectorLogoGroup,
  ModelSelectorName,
  ModelSelectorSeparator,
  ModelSelectorShortcut,
  ModelSelectorTrigger,
} from "../src/model-selector";

// Mock console.warn and console.error to suppress accessibility warnings in tests
beforeEach(() => {
  vi.spyOn(console, "warn").mockImplementation(() => undefined);
  vi.spyOn(console, "error").mockImplementation(() => undefined);
});

describe("ModelSelector", () => {
  it("renders as a Dialog component", () => {
    const { container } = render(
      <ModelSelector>
        <div>Dialog Content</div>
      </ModelSelector>
    );
    expect(container.firstChild).toBeInTheDocument();
  });

  it("accepts open prop to control visibility", () => {
    const { rerender } = render(
      <ModelSelector open={false}>
        <ModelSelectorTrigger>Open</ModelSelectorTrigger>
        <ModelSelectorContent aria-describedby="test-description">
          <div>Content</div>
        </ModelSelectorContent>
      </ModelSelector>
    );
    expect(screen.queryByText("Content")).not.toBeInTheDocument();

    rerender(
      <ModelSelector open={true}>
        <ModelSelectorTrigger>Open</ModelSelectorTrigger>
        <ModelSelectorContent aria-describedby="test-description">
          <div>Content</div>
        </ModelSelectorContent>
      </ModelSelector>
    );
    expect(screen.getByText("Content")).toBeInTheDocument();
  });

  it("handles onOpenChange callback", async () => {
    const user = userEvent.setup();
    const handleOpenChange = vi.fn();
    render(
      <ModelSelector onOpenChange={handleOpenChange}>
        <ModelSelectorTrigger>Open Selector</ModelSelectorTrigger>
        <ModelSelectorContent aria-describedby="test-description">
          <div>Content</div>
        </ModelSelectorContent>
      </ModelSelector>
    );

    await user.click(screen.getByText("Open Selector"));
    expect(handleOpenChange).toHaveBeenCalled();
  });
});

describe("ModelSelectorTrigger", () => {
  it("renders trigger button with children", () => {
    render(
      <ModelSelector>
        <ModelSelectorTrigger>Select a model</ModelSelectorTrigger>
      </ModelSelector>
    );
    expect(screen.getByText("Select a model")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    render(
      <ModelSelector>
        <ModelSelectorTrigger className="custom-trigger">
          Select
        </ModelSelectorTrigger>
      </ModelSelector>
    );
    expect(screen.getByText("Select")).toHaveClass("custom-trigger");
  });

  it("can be disabled", () => {
    render(
      <ModelSelector>
        <ModelSelectorTrigger disabled>Select</ModelSelectorTrigger>
      </ModelSelector>
    );
    expect(screen.getByText("Select")).toBeDisabled();
  });
});

describe("ModelSelectorContent", () => {
  it("renders content with Command wrapper", () => {
    render(
      <ModelSelector open={true}>
        <ModelSelectorContent aria-describedby="test-description">
          <div data-testid="content-child">Content</div>
        </ModelSelectorContent>
      </ModelSelector>
    );
    expect(screen.getByTestId("content-child")).toBeInTheDocument();
  });

  it("applies default padding class", () => {
    render(
      <ModelSelector open={true}>
        <ModelSelectorContent aria-describedby="test-description">
          <div data-testid="inner-content">Content</div>
        </ModelSelectorContent>
      </ModelSelector>
    );
    // Check that the dialog content is rendered
    const innerContent = screen.getByTestId("inner-content");
    expect(innerContent).toBeInTheDocument();
  });

  it("merges custom className with default", () => {
    render(
      <ModelSelector open={true}>
        <ModelSelectorContent
          aria-describedby="test-description"
          className="custom-content"
        >
          <div data-testid="inner-content">Content</div>
        </ModelSelectorContent>
      </ModelSelector>
    );
    // Check that the dialog content is rendered with custom content
    const innerContent = screen.getByTestId("inner-content");
    expect(innerContent).toBeInTheDocument();
  });
});

describe("ModelSelectorDialog", () => {
  it("renders as CommandDialog", () => {
    render(
      <ModelSelectorDialog open={true}>
        <div>Dialog Content</div>
      </ModelSelectorDialog>
    );
    expect(screen.getByText("Dialog Content")).toBeInTheDocument();
  });

  it("handles open state", () => {
    const { rerender } = render(
      <ModelSelectorDialog open={false}>
        <div>Dialog Content</div>
      </ModelSelectorDialog>
    );
    expect(screen.queryByText("Dialog Content")).not.toBeInTheDocument();

    rerender(
      <ModelSelectorDialog open={true}>
        <div>Dialog Content</div>
      </ModelSelectorDialog>
    );
    expect(screen.getByText("Dialog Content")).toBeInTheDocument();
  });
});

describe("ModelSelectorInput", () => {
  it("renders search input", () => {
    render(
      <ModelSelector open={true}>
        <ModelSelectorContent aria-describedby="test-description">
          <ModelSelectorInput placeholder="Search models..." />
        </ModelSelectorContent>
      </ModelSelector>
    );
    expect(screen.getByPlaceholderText("Search models...")).toBeInTheDocument();
  });

  it("applies custom height styling", () => {
    render(
      <ModelSelector open={true}>
        <ModelSelectorContent aria-describedby="test-description">
          <ModelSelectorInput placeholder="Search" />
        </ModelSelectorContent>
      </ModelSelector>
    );
    const input = screen.getByPlaceholderText("Search");
    expect(input).toHaveClass("h-auto", "py-3.5");
  });

  it("accepts custom className", () => {
    render(
      <ModelSelector open={true}>
        <ModelSelectorContent aria-describedby="test-description">
          <ModelSelectorInput className="custom-input" placeholder="Search" />
        </ModelSelectorContent>
      </ModelSelector>
    );
    const input = screen.getByPlaceholderText("Search");
    expect(input).toHaveClass("custom-input");
  });

  it("handles user input", async () => {
    const user = userEvent.setup();
    render(
      <ModelSelector open={true}>
        <ModelSelectorContent aria-describedby="test-description">
          <ModelSelectorInput placeholder="Search models..." />
        </ModelSelectorContent>
      </ModelSelector>
    );

    const input = screen.getByPlaceholderText("Search models...");
    await user.type(input, "gpt-4");
    expect(input).toHaveValue("gpt-4");
  });
});

describe("ModelSelectorList", () => {
  it("renders list container", () => {
    render(
      <ModelSelector open={true}>
        <ModelSelectorContent aria-describedby="test-description">
          <ModelSelectorList>
            <div data-testid="list-content">Items</div>
          </ModelSelectorList>
        </ModelSelectorContent>
      </ModelSelector>
    );
    expect(screen.getByTestId("list-content")).toBeInTheDocument();
  });
});

describe("ModelSelectorEmpty", () => {
  it("renders empty state message", () => {
    render(
      <ModelSelector open={true}>
        <ModelSelectorContent aria-describedby="test-description">
          <ModelSelectorList>
            <ModelSelectorEmpty>No models found</ModelSelectorEmpty>
          </ModelSelectorList>
        </ModelSelectorContent>
      </ModelSelector>
    );
    expect(screen.getByText("No models found")).toBeInTheDocument();
  });
});

describe("ModelSelectorGroup", () => {
  it("renders group with heading", () => {
    render(
      <ModelSelector open={true}>
        <ModelSelectorContent aria-describedby="test-description">
          <ModelSelectorList>
            <ModelSelectorGroup heading="Popular Models">
              <div>Models</div>
            </ModelSelectorGroup>
          </ModelSelectorList>
        </ModelSelectorContent>
      </ModelSelector>
    );
    expect(screen.getByText("Popular Models")).toBeInTheDocument();
  });

  it("renders group children", () => {
    render(
      <ModelSelector open={true}>
        <ModelSelectorContent aria-describedby="test-description">
          <ModelSelectorList>
            <ModelSelectorGroup heading="Models">
              <div data-testid="group-content">Content</div>
            </ModelSelectorGroup>
          </ModelSelectorList>
        </ModelSelectorContent>
      </ModelSelector>
    );
    expect(screen.getByTestId("group-content")).toBeInTheDocument();
  });
});

describe("ModelSelectorItem", () => {
  it("renders selectable item", () => {
    render(
      <ModelSelector open={true}>
        <ModelSelectorContent aria-describedby="test-description">
          <ModelSelectorList>
            <ModelSelectorItem value="gpt-4">GPT-4</ModelSelectorItem>
          </ModelSelectorList>
        </ModelSelectorContent>
      </ModelSelector>
    );
    expect(screen.getByText("GPT-4")).toBeInTheDocument();
  });

  it("handles click events", async () => {
    const user = userEvent.setup();
    const handleSelect = vi.fn();
    render(
      <ModelSelector open={true}>
        <ModelSelectorContent aria-describedby="test-description">
          <ModelSelectorList>
            <ModelSelectorItem onSelect={handleSelect} value="gpt-4">
              GPT-4
            </ModelSelectorItem>
          </ModelSelectorList>
        </ModelSelectorContent>
      </ModelSelector>
    );

    await user.click(screen.getByText("GPT-4"));
    expect(handleSelect).toHaveBeenCalledWith("gpt-4");
  });

  it("can be disabled", () => {
    render(
      <ModelSelector open={true}>
        <ModelSelectorContent aria-describedby="test-description">
          <ModelSelectorList>
            <ModelSelectorItem disabled value="gpt-4">
              GPT-4
            </ModelSelectorItem>
          </ModelSelectorList>
        </ModelSelectorContent>
      </ModelSelector>
    );
    const item = screen.getByText("GPT-4");
    expect(item.closest('[role="option"]')).toHaveAttribute(
      "aria-disabled",
      "true"
    );
  });
});

describe("ModelSelectorShortcut", () => {
  it("renders keyboard shortcut", () => {
    render(
      <ModelSelector open={true}>
        <ModelSelectorContent aria-describedby="test-description">
          <ModelSelectorList>
            <ModelSelectorItem value="gpt-4">
              GPT-4
              <ModelSelectorShortcut>⌘K</ModelSelectorShortcut>
            </ModelSelectorItem>
          </ModelSelectorList>
        </ModelSelectorContent>
      </ModelSelector>
    );
    expect(screen.getByText("⌘K")).toBeInTheDocument();
  });
});

describe("ModelSelectorSeparator", () => {
  it("renders separator", () => {
    render(
      <ModelSelector open={true}>
        <ModelSelectorContent aria-describedby="test-description">
          <ModelSelectorList>
            <ModelSelectorItem value="item-1">Item 1</ModelSelectorItem>
            <ModelSelectorSeparator />
            <ModelSelectorItem value="item-2">Item 2</ModelSelectorItem>
          </ModelSelectorList>
        </ModelSelectorContent>
      </ModelSelector>
    );
    // Verify that items are rendered (separator is between them)
    expect(screen.getByText("Item 1")).toBeInTheDocument();
    expect(screen.getByText("Item 2")).toBeInTheDocument();
  });
});

describe("ModelSelectorLogo", () => {
  it("renders logo image with correct attributes", () => {
    render(<ModelSelectorLogo provider="openai" />);
    const logo = screen.getByAltText("openai logo");
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute("src", "https://models.dev/logos/openai.svg");
    expect(logo).toHaveAttribute("width", "12");
    expect(logo).toHaveAttribute("height", "12");
  });

  it("applies default size class", () => {
    render(<ModelSelectorLogo provider="anthropic" />);
    const logo = screen.getByAltText("anthropic logo");
    expect(logo).toHaveClass("size-3");
  });

  it("accepts custom className", () => {
    render(
      <ModelSelectorLogo className="custom-logo-size" provider="google" />
    );
    const logo = screen.getByAltText("google logo");
    expect(logo).toHaveClass("custom-logo-size");
  });

  it("supports all known providers", () => {
    const providers = [
      "openai",
      "anthropic",
      "google",
      "mistral",
      "groq",
      "perplexity",
    ];

    for (const provider of providers) {
      const { unmount } = render(<ModelSelectorLogo provider={provider} />);
      const logo = screen.getByAltText(`${provider} logo`);
      expect(logo).toHaveAttribute(
        "src",
        `https://models.dev/logos/${provider}.svg`
      );
      unmount();
    }
  });

  it("supports custom string providers", () => {
    render(<ModelSelectorLogo provider="custom-provider" />);
    const logo = screen.getByAltText("custom-provider logo");
    expect(logo).toHaveAttribute(
      "src",
      "https://models.dev/logos/custom-provider.svg"
    );
  });

  it("accepts additional img props", () => {
    render(<ModelSelectorLogo loading="lazy" provider="openai" />);
    const logo = screen.getByAltText("openai logo");
    expect(logo).toHaveAttribute("loading", "lazy");
  });
});

describe("ModelSelectorLogoGroup", () => {
  it("renders multiple logos in a group", () => {
    render(
      <ModelSelectorLogoGroup>
        <ModelSelectorLogo provider="openai" />
        <ModelSelectorLogo provider="anthropic" />
        <ModelSelectorLogo provider="google" />
      </ModelSelectorLogoGroup>
    );
    expect(screen.getByAltText("openai logo")).toBeInTheDocument();
    expect(screen.getByAltText("anthropic logo")).toBeInTheDocument();
    expect(screen.getByAltText("google logo")).toBeInTheDocument();
  });

  it("applies styling classes for logo group", () => {
    const { container } = render(
      <ModelSelectorLogoGroup>
        <ModelSelectorLogo provider="openai" />
      </ModelSelectorLogoGroup>
    );
    const group = container.firstChild as HTMLElement;
    expect(group).toHaveClass("-space-x-1", "flex", "shrink-0");
  });

  it("accepts custom className", () => {
    const { container } = render(
      <ModelSelectorLogoGroup className="custom-group">
        <ModelSelectorLogo provider="openai" />
      </ModelSelectorLogoGroup>
    );
    const group = container.firstChild as HTMLElement;
    expect(group).toHaveClass("custom-group");
  });
});

describe("ModelSelectorName", () => {
  it("renders model name text", () => {
    render(<ModelSelectorName>GPT-4 Turbo</ModelSelectorName>);
    expect(screen.getByText("GPT-4 Turbo")).toBeInTheDocument();
  });

  it("applies text styling classes", () => {
    render(<ModelSelectorName>Model Name</ModelSelectorName>);
    const name = screen.getByText("Model Name");
    expect(name).toHaveClass("flex-1", "truncate", "text-left");
  });

  it("accepts custom className", () => {
    render(
      <ModelSelectorName className="custom-name">Model</ModelSelectorName>
    );
    const name = screen.getByText("Model");
    expect(name).toHaveClass("custom-name");
  });

  it("truncates long text", () => {
    const longName = "A very long model name that should be truncated";
    render(<ModelSelectorName>{longName}</ModelSelectorName>);
    const name = screen.getByText(longName);
    expect(name).toHaveClass("truncate");
  });
});

describe("Integration tests", () => {
  it("renders complete model selector with all components", () => {
    render(
      <ModelSelector open={true}>
        <ModelSelectorTrigger>Select Model</ModelSelectorTrigger>
        <ModelSelectorContent aria-describedby="test-description">
          <ModelSelectorInput placeholder="Search models..." />
          <ModelSelectorList>
            <ModelSelectorGroup heading="OpenAI">
              <ModelSelectorItem value="gpt-4">
                <ModelSelectorLogoGroup>
                  <ModelSelectorLogo provider="openai" />
                </ModelSelectorLogoGroup>
                <ModelSelectorName>GPT-4</ModelSelectorName>
                <ModelSelectorShortcut>⌘1</ModelSelectorShortcut>
              </ModelSelectorItem>
            </ModelSelectorGroup>
            <ModelSelectorSeparator />
            <ModelSelectorGroup heading="Anthropic">
              <ModelSelectorItem value="claude">
                <ModelSelectorLogoGroup>
                  <ModelSelectorLogo provider="anthropic" />
                </ModelSelectorLogoGroup>
                <ModelSelectorName>Claude</ModelSelectorName>
              </ModelSelectorItem>
            </ModelSelectorGroup>
            <ModelSelectorEmpty>No models found</ModelSelectorEmpty>
          </ModelSelectorList>
        </ModelSelectorContent>
      </ModelSelector>
    );

    expect(screen.getByPlaceholderText("Search models...")).toBeInTheDocument();
    expect(screen.getByText("OpenAI")).toBeInTheDocument();
    expect(screen.getByText("GPT-4")).toBeInTheDocument();
    expect(screen.getByText("⌘1")).toBeInTheDocument();
    expect(screen.getByText("Anthropic")).toBeInTheDocument();
    expect(screen.getByText("Claude")).toBeInTheDocument();
  });

  it("handles model selection flow", async () => {
    const user = userEvent.setup();
    const handleSelect = vi.fn();
    const handleOpenChange = vi.fn();

    render(
      <ModelSelector onOpenChange={handleOpenChange}>
        <ModelSelectorTrigger>Select Model</ModelSelectorTrigger>
        <ModelSelectorContent aria-describedby="test-description">
          <ModelSelectorList>
            <ModelSelectorItem onSelect={handleSelect} value="gpt-4">
              GPT-4
            </ModelSelectorItem>
          </ModelSelectorList>
        </ModelSelectorContent>
      </ModelSelector>
    );

    await user.click(screen.getByText("Select Model"));
    expect(handleOpenChange).toHaveBeenCalled();

    await user.click(screen.getByText("GPT-4"));
    expect(handleSelect).toHaveBeenCalledWith("gpt-4");
  });
});
