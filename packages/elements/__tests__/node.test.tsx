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

describe("node", () => {
  it("renders children without handles", () => {
    render(
      <Node handles={{ source: false, target: false }}>
        <div>Test content</div>
      </Node>
    );
    expect(screen.getByText("Test content")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(
      <Node className="custom-node" handles={{ source: false, target: false }}>
        <div>Content</div>
      </Node>
    );
    expect(container.firstChild).toHaveClass("custom-node");
    expect(container.firstChild).toHaveClass("node-container");
  });
});

describe("nodeHeader", () => {
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

describe("nodeTitle", () => {
  it("renders title text", () => {
    render(<NodeTitle>Node Title</NodeTitle>);
    expect(screen.getByText("Node Title")).toBeInTheDocument();
  });
});

describe("nodeDescription", () => {
  it("renders description text", () => {
    render(<NodeDescription>Node description</NodeDescription>);
    expect(screen.getByText("Node description")).toBeInTheDocument();
  });
});

describe("nodeAction", () => {
  it("renders action content", () => {
    render(<NodeAction>Action</NodeAction>);
    expect(screen.getByText("Action")).toBeInTheDocument();
  });
});

describe("nodeContent", () => {
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

describe("nodeFooter", () => {
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
