import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Canvas } from "../src/canvas";
import { Toolbar } from "../src/toolbar";

describe("Toolbar", () => {
  it("renders within Canvas context", () => {
    const { container } = render(
      <Canvas
        edges={[]}
        nodes={[
          { id: "1", position: { x: 0, y: 0 }, data: { label: "Node 1" } },
        ]}
        nodeTypes={{
          custom: () => (
            <div>
              <Toolbar>Test content</Toolbar>
            </div>
          ),
        }}
      >
        <div>Canvas content</div>
      </Canvas>
    );
    expect(container.querySelector(".react-flow")).toBeInTheDocument();
  });

  it("renders with custom className", () => {
    const { container } = render(
      <Canvas
        edges={[]}
        nodes={[
          {
            id: "1",
            position: { x: 0, y: 0 },
            type: "custom",
            data: { label: "Node 1" },
          },
        ]}
        nodeTypes={{
          custom: () => (
            <div>
              <Toolbar className="custom-toolbar">Content</Toolbar>
            </div>
          ),
        }}
      >
        <div>Canvas content</div>
      </Canvas>
    );
    expect(container.querySelector(".react-flow")).toBeInTheDocument();
  });

  it("renders with additional props", () => {
    const { container } = render(
      <Canvas
        edges={[]}
        nodes={[
          {
            id: "1",
            position: { x: 0, y: 0 },
            type: "custom",
            data: { label: "Node 1" },
          },
        ]}
        nodeTypes={{
          custom: () => (
            <div>
              <Toolbar data-testid="toolbar">Content</Toolbar>
            </div>
          ),
        }}
      >
        <div>Canvas content</div>
      </Canvas>
    );
    expect(container.querySelector(".react-flow")).toBeInTheDocument();
  });
});
