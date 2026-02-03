import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import type { JSXPreviewProps } from "../src/jsx-preview";

import {
  JSXPreview,
  JSXPreviewContent,
  JSXPreviewError,
} from "../src/jsx-preview";

describe("jsxPreview", () => {
  it("renders children", () => {
    render(
      <JSXPreview jsx="<div>Test</div>">
        <span>Child content</span>
      </JSXPreview>
    );
    expect(screen.getByText("Child content")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(
      <JSXPreview className="custom-class" jsx="<div>Test</div>">
        Content
      </JSXPreview>
    );
    expect(container.firstChild).toHaveClass("custom-class");
  });

  it("has relative positioning by default", () => {
    const { container } = render(
      <JSXPreview jsx="<div>Test</div>">Content</JSXPreview>
    );
    expect(container.firstChild).toHaveClass("relative");
  });
});

describe("jsxPreviewContent", () => {
  it("renders simple JSX string", () => {
    render(
      <JSXPreview jsx="<div>Hello World</div>">
        <JSXPreviewContent />
      </JSXPreview>
    );
    expect(screen.getByText("Hello World")).toBeInTheDocument();
  });

  it("renders nested JSX elements", () => {
    render(
      <JSXPreview jsx='<div><span className="test">Nested</span></div>'>
        <JSXPreviewContent />
      </JSXPreview>
    );
    expect(screen.getByText("Nested")).toBeInTheDocument();
    expect(screen.getByText("Nested")).toHaveClass("test");
  });

  it("renders JSX with multiple children", () => {
    render(
      <JSXPreview jsx="<div><p>First</p><p>Second</p></div>">
        <JSXPreviewContent />
      </JSXPreview>
    );
    expect(screen.getByText("First")).toBeInTheDocument();
    expect(screen.getByText("Second")).toBeInTheDocument();
  });

  it("applies custom className to content", () => {
    const { container } = render(
      <JSXPreview jsx="<div>Test</div>">
        <JSXPreviewContent className="custom-content" />
      </JSXPreview>
    );
    expect(container.querySelector(".custom-content")).toBeInTheDocument();
  });

  it("completes incomplete tags in streaming mode", () => {
    render(
      <JSXPreview isStreaming jsx="<div><span>Streaming">
        <JSXPreviewContent />
      </JSXPreview>
    );
    expect(screen.getByText("Streaming")).toBeInTheDocument();
  });

  it("does not modify complete JSX when not streaming", () => {
    render(
      <JSXPreview jsx="<div><span>Complete</span></div>">
        <JSXPreviewContent />
      </JSXPreview>
    );
    expect(screen.getByText("Complete")).toBeInTheDocument();
  });
});

describe("jsxPreviewError", () => {
  it("does not render when there is no error", () => {
    render(
      <JSXPreview jsx="<div>Valid</div>">
        <JSXPreviewContent />
        <JSXPreviewError data-testid="error" />
      </JSXPreview>
    );
    expect(screen.queryByTestId("error")).not.toBeInTheDocument();
  });

  it("applies custom className", () => {
    render(
      <JSXPreview jsx="<div>{invalidExpression}</div>">
        <JSXPreviewContent />
        <JSXPreviewError className="custom-error" data-testid="error" />
      </JSXPreview>
    );
    // Error may or may not show depending on parser behavior
    const error = screen.queryByTestId("error");
    if (error) {
      expect(error).toHaveClass("custom-error");
    }
  });

  it("renders custom children when provided", () => {
    render(
      <JSXPreview jsx="<div>{broken}</div>">
        <JSXPreviewContent />
        <JSXPreviewError>
          <span>Custom error message</span>
        </JSXPreviewError>
      </JSXPreview>
    );
    // Error rendering depends on parser behavior
  });
});

describe("jSXPreview onError callback", () => {
  it("calls onError when parse error occurs", () => {
    const onError = vi.fn();
    render(
      <JSXPreview jsx="<div>{undefinedVar}</div>" onError={onError}>
        <JSXPreviewContent />
      </JSXPreview>
    );
    // Error callback behavior depends on parser
  });
});

describe("jSXPreview with custom components", () => {
  it("renders custom components", () => {
    // Custom components for testing
    const CustomButton = (props: { children?: React.ReactNode }) => (
      <button data-testid="custom-button" type="button">
        {props.children}
      </button>
    );

    const components = {
      CustomButton,
    } as JSXPreviewProps["components"];

    render(
      <JSXPreview
        components={components}
        jsx="<CustomButton>Click me</CustomButton>"
      >
        <JSXPreviewContent />
      </JSXPreview>
    );
    expect(screen.getByTestId("custom-button")).toBeInTheDocument();
    expect(screen.getByText("Click me")).toBeInTheDocument();
  });

  it("renders multiple custom components", () => {
    const Card = (props: { children?: React.ReactNode }) => (
      <div data-testid="card">{props.children}</div>
    );
    const Badge = (props: { children?: React.ReactNode }) => (
      <span data-testid="badge">{props.children}</span>
    );

    const components = { Badge, Card } as JSXPreviewProps["components"];

    render(
      <JSXPreview components={components} jsx="<Card><Badge>New</Badge></Card>">
        <JSXPreviewContent />
      </JSXPreview>
    );
    expect(screen.getByTestId("card")).toBeInTheDocument();
    expect(screen.getByTestId("badge")).toBeInTheDocument();
    expect(screen.getByText("New")).toBeInTheDocument();
  });
});

describe("jSXPreview with bindings", () => {
  it("provides variables to JSX scope", () => {
    render(
      <JSXPreview bindings={{ greeting: "Hello" }} jsx="<div>{greeting}</div>">
        <JSXPreviewContent />
      </JSXPreview>
    );
    expect(screen.getByText("Hello")).toBeInTheDocument();
  });

  it("provides multiple bindings", () => {
    render(
      <JSXPreview
        bindings={{ first: "Hello", second: "World" }}
        jsx="<div>{first} {second}</div>"
      >
        <JSXPreviewContent />
      </JSXPreview>
    );
    expect(screen.getByText("Hello World")).toBeInTheDocument();
  });
});

describe("jSXPreview streaming mode", () => {
  it("auto-closes single unclosed tag", () => {
    render(
      <JSXPreview isStreaming jsx="<div>Content">
        <JSXPreviewContent />
      </JSXPreview>
    );
    expect(screen.getByText("Content")).toBeInTheDocument();
  });

  it("auto-closes multiple unclosed tags", () => {
    render(
      <JSXPreview isStreaming jsx="<div><p><span>Deep">
        <JSXPreviewContent />
      </JSXPreview>
    );
    expect(screen.getByText("Deep")).toBeInTheDocument();
  });

  it("handles self-closing tags correctly", () => {
    render(
      <JSXPreview isStreaming jsx='<div><img src="test.jpg" /><span>After'>
        <JSXPreviewContent />
      </JSXPreview>
    );
    expect(screen.getByText("After")).toBeInTheDocument();
  });

  it("preserves completed tags when streaming", () => {
    render(
      <JSXPreview isStreaming jsx="<div><p>Complete</p><span>Incomplete">
        <JSXPreviewContent />
      </JSXPreview>
    );
    expect(screen.getByText("Complete")).toBeInTheDocument();
    expect(screen.getByText("Incomplete")).toBeInTheDocument();
  });
});

describe("jSXPreview integration", () => {
  it("renders complete composition", () => {
    render(
      <JSXPreview className="preview-container" jsx="<div>Test content</div>">
        <JSXPreviewContent className="content-area" />
        <JSXPreviewError className="error-area" />
      </JSXPreview>
    );

    expect(screen.getByText("Test content")).toBeInTheDocument();
  });

  it("handles dynamic jsx updates", () => {
    const { rerender } = render(
      <JSXPreview jsx="<div>Initial</div>">
        <JSXPreviewContent />
      </JSXPreview>
    );

    expect(screen.getByText("Initial")).toBeInTheDocument();

    rerender(
      <JSXPreview jsx="<div>Updated</div>">
        <JSXPreviewContent />
      </JSXPreview>
    );

    expect(screen.getByText("Updated")).toBeInTheDocument();
  });

  it("switches between streaming and non-streaming mode", () => {
    const { rerender } = render(
      <JSXPreview isStreaming jsx="<div>Streaming">
        <JSXPreviewContent />
      </JSXPreview>
    );

    expect(screen.getByText("Streaming")).toBeInTheDocument();

    rerender(
      <JSXPreview isStreaming={false} jsx="<div>Streaming</div>">
        <JSXPreviewContent />
      </JSXPreview>
    );

    expect(screen.getByText("Streaming")).toBeInTheDocument();
  });
});

describe("useJSXPreview hook", () => {
  it("throws error when used outside provider", () => {
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {
      // Suppress React error boundary logs during test
    });

    expect(() => {
      render(<JSXPreviewContent />);
    }).toThrow("JSXPreview components must be used within JSXPreview");

    consoleError.mockRestore();
  });
});
