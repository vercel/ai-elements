import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Canvas } from "../src/canvas";

describe("Canvas", () => {
  it("renders with default props", () => {
    const { container } = render(
      <Canvas edges={[]} nodes={[]}>
        <div>Test content</div>
      </Canvas>
    );
    expect(container.querySelector(".react-flow")).toBeInTheDocument();
  });

  it("renders children", () => {
    render(
      <Canvas edges={[]} nodes={[]}>
        <div>Test children</div>
      </Canvas>
    );
    expect(screen.getByText("Test children")).toBeInTheDocument();
  });

  it("applies custom props", () => {
    const { container } = render(
      <Canvas className="custom-class" edges={[]} nodes={[]}>
        <div>Content</div>
      </Canvas>
    );
    const reactFlow = container.querySelector(".react-flow");
    expect(reactFlow).toBeInTheDocument();
    expect(reactFlow).toHaveClass("custom-class");
  });

  it("renders with nodes and edges", () => {
    const nodes = [
      { id: "1", position: { x: 0, y: 0 }, data: { label: "Node 1" } },
    ];
    const edges = [{ id: "e1-2", source: "1", target: "2" }];

    const { container } = render(
      <Canvas edges={edges} nodes={nodes}>
        <div>Content</div>
      </Canvas>
    );
    expect(container.querySelector(".react-flow")).toBeInTheDocument();
  });
});
