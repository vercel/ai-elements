import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DotIcon } from "lucide-react";
import { describe, expect, it, vi } from "vitest";
import {
  ChainOfThought,
  ChainOfThoughtContent,
  ChainOfThoughtHeader,
  ChainOfThoughtImage,
  ChainOfThoughtSearchResult,
  ChainOfThoughtSearchResults,
  ChainOfThoughtStep,
} from "../src/chain-of-thought";

describe("ChainOfThought", () => {
  it("renders children", () => {
    render(<ChainOfThought>Content</ChainOfThought>);
    expect(screen.getByText("Content")).toBeInTheDocument();
  });

  it("throws error when component used outside provider", () => {
    // Suppress console.error for this test
    const spy = vi.spyOn(console, "error").mockImplementation(() => undefined);

    expect(() =>
      render(<ChainOfThoughtHeader>Test</ChainOfThoughtHeader>)
    ).toThrow("ChainOfThought components must be used within ChainOfThought");

    spy.mockRestore();
  });

  it("starts closed by default", () => {
    render(
      <ChainOfThought>
        <ChainOfThoughtHeader />
        <ChainOfThoughtContent>Hidden content</ChainOfThoughtContent>
      </ChainOfThought>
    );

    const content = screen.queryByText("Hidden content");
    expect(content).not.toBeInTheDocument();
  });

  it("can start open", () => {
    render(
      <ChainOfThought defaultOpen>
        <ChainOfThoughtHeader />
        <ChainOfThoughtContent>Visible content</ChainOfThoughtContent>
      </ChainOfThought>
    );

    expect(screen.getByText("Visible content")).toBeVisible();
  });

  it("calls onOpenChange", async () => {
    const onOpenChange = vi.fn();
    const user = userEvent.setup();

    render(
      <ChainOfThought onOpenChange={onOpenChange}>
        <ChainOfThoughtHeader />
        <ChainOfThoughtContent>Content</ChainOfThoughtContent>
      </ChainOfThought>
    );

    const trigger = screen.getByRole("button");
    await user.click(trigger);

    expect(onOpenChange).toHaveBeenCalled();
  });
});

describe("ChainOfThoughtHeader", () => {
  it("renders default text", () => {
    render(
      <ChainOfThought>
        <ChainOfThoughtHeader />
      </ChainOfThought>
    );

    expect(screen.getByText("Chain of Thought")).toBeInTheDocument();
  });

  it("renders custom children", () => {
    render(
      <ChainOfThought>
        <ChainOfThoughtHeader>Custom Header</ChainOfThoughtHeader>
      </ChainOfThought>
    );

    expect(screen.getByText("Custom Header")).toBeInTheDocument();
  });
});

describe("ChainOfThoughtStep", () => {
  it("renders label", () => {
    render(
      <ChainOfThought>
        <ChainOfThoughtStep label="Step 1" />
      </ChainOfThought>
    );

    expect(screen.getByText("Step 1")).toBeInTheDocument();
  });

  it("renders description", () => {
    render(
      <ChainOfThought>
        <ChainOfThoughtStep description="Details" label="Step" />
      </ChainOfThought>
    );

    expect(screen.getByText("Details")).toBeInTheDocument();
  });

  it("renders with custom icon", () => {
    const { container } = render(
      <ChainOfThought>
        <ChainOfThoughtStep icon={DotIcon} label="Step" />
      </ChainOfThought>
    );

    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("applies status styles", () => {
    const { rerender } = render(
      <ChainOfThought>
        <ChainOfThoughtStep label="Step" status="complete" />
      </ChainOfThought>
    );

    expect(screen.getByText("Step")).toBeInTheDocument();

    rerender(
      <ChainOfThought>
        <ChainOfThoughtStep label="Step" status="active" />
      </ChainOfThought>
    );

    expect(screen.getByText("Step")).toBeInTheDocument();
  });
});

describe("ChainOfThoughtSearchResults", () => {
  it("renders search results", () => {
    render(
      <ChainOfThought>
        <ChainOfThoughtSearchResults>
          <span>Result 1</span>
        </ChainOfThoughtSearchResults>
      </ChainOfThought>
    );

    expect(screen.getByText("Result 1")).toBeInTheDocument();
  });
});

describe("ChainOfThoughtSearchResult", () => {
  it("renders result badge", () => {
    render(
      <ChainOfThought>
        <ChainOfThoughtSearchResult>Source</ChainOfThoughtSearchResult>
      </ChainOfThought>
    );

    expect(screen.getByText("Source")).toBeInTheDocument();
  });
});

describe("ChainOfThoughtContent", () => {
  it("renders content", () => {
    render(
      <ChainOfThought defaultOpen>
        <ChainOfThoughtHeader />
        <ChainOfThoughtContent>Content text</ChainOfThoughtContent>
      </ChainOfThought>
    );

    expect(screen.getByText("Content text")).toBeInTheDocument();
  });
});

describe("ChainOfThoughtImage", () => {
  it("renders image container", () => {
    render(
      <ChainOfThought>
        <ChainOfThoughtImage>
          <img alt="test" height={100} src="test.jpg" width={100} />
        </ChainOfThoughtImage>
      </ChainOfThought>
    );

    expect(screen.getByAltText("test")).toBeInTheDocument();
  });

  it("renders caption", () => {
    render(
      <ChainOfThought>
        <ChainOfThoughtImage caption="Image caption">
          <img alt="test" height={100} src="test.jpg" width={100} />
        </ChainOfThoughtImage>
      </ChainOfThought>
    );

    expect(screen.getByText("Image caption")).toBeInTheDocument();
  });
});
