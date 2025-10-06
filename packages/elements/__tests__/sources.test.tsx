import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import {
  Source,
  Sources,
  SourcesContent,
  SourcesTrigger,
} from "../src/sources";

describe("Sources", () => {
  it("renders children", () => {
    render(<Sources>Content</Sources>);
    expect(screen.getByText("Content")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(<Sources className="custom">Test</Sources>);
    expect(container.firstChild).toHaveClass("custom");
  });
});

describe("SourcesTrigger", () => {
  it("renders default trigger with count", () => {
    render(
      <Sources>
        <SourcesTrigger count={3} />
      </Sources>
    );
    expect(screen.getByText("Used 3 sources")).toBeInTheDocument();
  });

  it("renders custom children", () => {
    render(
      <Sources>
        <SourcesTrigger count={5}>Custom trigger</SourcesTrigger>
      </Sources>
    );
    expect(screen.getByText("Custom trigger")).toBeInTheDocument();
  });

  it("has chevron icon", () => {
    const { container } = render(
      <Sources>
        <SourcesTrigger count={2} />
      </Sources>
    );
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("is clickable", async () => {
    const user = userEvent.setup();
    render(
      <Sources>
        <SourcesTrigger count={1} />
        <SourcesContent>Hidden</SourcesContent>
      </Sources>
    );

    const button = screen.getByRole("button");
    await user.click(button);

    expect(screen.getByText("Hidden")).toBeVisible();
  });
});

describe("SourcesContent", () => {
  it("renders content when open", async () => {
    const user = userEvent.setup();
    render(
      <Sources>
        <SourcesTrigger count={1} />
        <SourcesContent>
          <Source href="https://example.com" title="Example" />
        </SourcesContent>
      </Sources>
    );

    const button = screen.getByRole("button");
    await user.click(button);

    expect(screen.getByText("Example")).toBeVisible();
  });
});

describe("Source", () => {
  it("renders source link", () => {
    render(<Source href="https://example.com" title="Example" />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "https://example.com");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noreferrer");
  });

  it("renders default with icon and title", () => {
    render(<Source href="https://example.com" title="Example" />);
    expect(screen.getByText("Example")).toBeInTheDocument();
  });

  it("renders custom children", () => {
    render(
      <Source href="https://example.com" title="Example">
        <span>Custom content</span>
      </Source>
    );
    expect(screen.getByText("Custom content")).toBeInTheDocument();
  });

  it("has book icon by default", () => {
    const { container } = render(
      <Source href="https://example.com" title="Example" />
    );
    expect(container.querySelector("svg")).toBeInTheDocument();
  });
});
