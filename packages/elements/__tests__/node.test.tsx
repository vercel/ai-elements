import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
  Node,
  NodeAction,
  NodeContent,
  NodeDescription,
  NodeFooter,
  NodeHeader,
  NodeTitle,
} from "../src/node";

describe("Node", () => {
  it("renders children without handles", () => {
    render(
      <Node handles={{ target: false, source: false }}>
        <div>Test content</div>
      </Node>
    );
    expect(screen.getByText("Test content")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(
      <Node className="custom-node" handles={{ target: false, source: false }}>
        <div>Content</div>
      </Node>
    );
    expect(container.firstChild).toHaveClass("custom-node");
    expect(container.firstChild).toHaveClass("node-container");
  });
});

describe("NodeHeader", () => {
  it("renders children", () => {
    render(<NodeHeader>Header content</NodeHeader>);
    expect(screen.getByText("Header content")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(
      <NodeHeader className="custom-header">Header</NodeHeader>
    );
    expect(container.firstChild).toHaveClass("custom-header");
  });
});

describe("NodeTitle", () => {
  it("renders title text", () => {
    render(<NodeTitle>Node Title</NodeTitle>);
    expect(screen.getByText("Node Title")).toBeInTheDocument();
  });
});

describe("NodeDescription", () => {
  it("renders description text", () => {
    render(<NodeDescription>Node description</NodeDescription>);
    expect(screen.getByText("Node description")).toBeInTheDocument();
  });
});

describe("NodeAction", () => {
  it("renders action content", () => {
    render(<NodeAction>Action</NodeAction>);
    expect(screen.getByText("Action")).toBeInTheDocument();
  });
});

describe("NodeContent", () => {
  it("renders content", () => {
    render(<NodeContent>Main content</NodeContent>);
    expect(screen.getByText("Main content")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(
      <NodeContent className="custom-content">Content</NodeContent>
    );
    expect(container.firstChild).toHaveClass("custom-content");
  });
});

describe("NodeFooter", () => {
  it("renders footer content", () => {
    render(<NodeFooter>Footer content</NodeFooter>);
    expect(screen.getByText("Footer content")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(
      <NodeFooter className="custom-footer">Footer</NodeFooter>
    );
    expect(container.firstChild).toHaveClass("custom-footer");
  });
});
