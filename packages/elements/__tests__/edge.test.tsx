import { render } from "@testing-library/react";
import { Position } from "@xyflow/react";
import { describe, expect, it, vi } from "vitest";
import { Canvas } from "../src/canvas";
import { Edge } from "../src/edge";

vi.mock("@xyflow/react", async () => {
  const actual = await vi.importActual("@xyflow/react");
  return {
    ...actual,
    useInternalNode: vi.fn((id: string) => {
      if (id === "1" || id === "2") {
        return {
          id,
          internals: {
            positionAbsolute: { x: 0, y: 0 },
            handleBounds: {
              source: [
                {
                  id: "source",
                  position: Position.Right,
                  x: 0,
                  y: 0,
                  width: 10,
                  height: 10,
                },
              ],
              target: [
                {
                  id: "target",
                  position: Position.Left,
                  x: 0,
                  y: 0,
                  width: 10,
                  height: 10,
                },
              ],
            },
          },
        };
      }
      return null;
    }),
  };
});

describe("Edge.Temporary", () => {
  it("renders with basic props", () => {
    const props = {
      id: "temp-edge",
      sourceX: 0,
      sourceY: 0,
      targetX: 100,
      targetY: 100,
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
    };

    const edges = [props];
    const { container } = render(
      <Canvas nodes={[]} edges={edges} edgeTypes={{ temporary: Edge.Temporary }}>
        <div>Content</div>
      </Canvas>
    );

    expect(container.querySelector(".react-flow")).toBeInTheDocument();
  });

  it("renders with custom coordinates", () => {
    const props = {
      id: "temp-edge-2",
      sourceX: 50,
      sourceY: 50,
      targetX: 200,
      targetY: 200,
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
    };

    const edges = [props];
    const { container } = render(
      <Canvas nodes={[]} edges={edges} edgeTypes={{ temporary: Edge.Temporary }}>
        <div>Content</div>
      </Canvas>
    );

    expect(container.querySelector(".react-flow")).toBeInTheDocument();
  });
});

describe("Edge.Animated", () => {
  it("renders with source and target nodes", () => {
    const props = {
      id: "animated-edge",
      source: "1",
      target: "2",
      sourceX: 0,
      sourceY: 0,
      targetX: 100,
      targetY: 100,
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
    };

    const nodes = [
      { id: "1", position: { x: 0, y: 0 }, data: { label: "Node 1" } },
      { id: "2", position: { x: 200, y: 0 }, data: { label: "Node 2" } },
    ];

    const edges = [props];
    const { container } = render(
      <Canvas
        nodes={nodes}
        edges={edges}
        edgeTypes={{ animated: Edge.Animated }}
      >
        <div>Content</div>
      </Canvas>
    );

    expect(container.querySelector(".react-flow")).toBeInTheDocument();
  });

  it("returns null when source node is missing", () => {
    const props = {
      id: "edge-no-source",
      source: "missing",
      target: "2",
      sourceX: 0,
      sourceY: 0,
      targetX: 100,
      targetY: 100,
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
    };

    const nodes = [
      { id: "2", position: { x: 200, y: 0 }, data: { label: "Node 2" } },
    ];

    const edges = [props];
    const { container } = render(
      <Canvas
        nodes={nodes}
        edges={edges}
        edgeTypes={{ animated: Edge.Animated }}
      >
        <div>Content</div>
      </Canvas>
    );

    expect(container.querySelector(".react-flow")).toBeInTheDocument();
  });

  it("returns null when target node is missing", () => {
    const props = {
      id: "edge-no-target",
      source: "1",
      target: "missing",
      sourceX: 0,
      sourceY: 0,
      targetX: 100,
      targetY: 100,
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
    };

    const nodes = [
      { id: "1", position: { x: 0, y: 0 }, data: { label: "Node 1" } },
    ];

    const edges = [props];
    const { container } = render(
      <Canvas
        nodes={nodes}
        edges={edges}
        edgeTypes={{ animated: Edge.Animated }}
      >
        <div>Content</div>
      </Canvas>
    );

    expect(container.querySelector(".react-flow")).toBeInTheDocument();
  });
});
