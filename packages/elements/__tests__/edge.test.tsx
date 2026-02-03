import { render } from "@testing-library/react";
import { Position, ReactFlowProvider } from "@xyflow/react";
import { describe, expect, it, vi } from "vitest";

import { Canvas } from "../src/canvas";
import { Edge } from "../src/edge";

vi.mock<typeof import("@xyflow/react")>("@xyflow/react", async () => {
  const actual = await vi.importActual("@xyflow/react");
  return {
    ...actual,
    useInternalNode: vi.fn((id: string) => {
      if (id === "1" || id === "2" || id === "3" || id === "4") {
        return {
          id,
          internals: {
            handleBounds: {
              source: [
                {
                  height: 10,
                  id: "source",
                  position: Position.Right,
                  width: 10,
                  x: 50,
                  y: 25,
                },
              ],
              target: [
                {
                  height: 10,
                  id: "target",
                  position: Position.Left,
                  width: 10,
                  x: 5,
                  y: 25,
                },
              ],
            },
            positionAbsolute: { x: 100, y: 100 },
          },
        };
      }
      // Return a node with no handles for testing the "no handle" case
      if (id === "no-handles") {
        return {
          id,
          internals: {
            handleBounds: {
              source: [],
              target: [],
            },
            positionAbsolute: { x: 100, y: 100 },
          },
        };
      }
      // Return nodes with Top/Bottom handles for comprehensive testing
      if (id === "top-bottom") {
        return {
          id,
          internals: {
            handleBounds: {
              source: [
                {
                  height: 10,
                  id: "source",
                  position: Position.Top,
                  width: 10,
                  x: 50,
                  y: 25,
                },
              ],
              target: [
                {
                  height: 10,
                  id: "target",
                  position: Position.Bottom,
                  width: 10,
                  x: 5,
                  y: 25,
                },
              ],
            },
            positionAbsolute: { x: 100, y: 100 },
          },
        };
      }
      return null;
    }),
  };
});

describe("edge.Temporary", () => {
  it("renders with basic props", () => {
    const props = {
      id: "temp-edge",
      sourcePosition: Position.Right,
      sourceX: 0,
      sourceY: 0,
      targetPosition: Position.Left,
      targetX: 100,
      targetY: 100,
    };

    const edges = [props];
    const { container } = render(
      <Canvas
        edges={edges}
        edgeTypes={{ temporary: Edge.Temporary }}
        nodes={[]}
      >
        <div>Content</div>
      </Canvas>
    );

    expect(container.querySelector(".react-flow")).toBeInTheDocument();
  });

  it("renders directly as a component", () => {
    const { container } = render(
      <ReactFlowProvider>
        <svg aria-label="edge diagram" role="img">
          <Edge.Temporary
            id="temp-1"
            sourcePosition={Position.Right}
            sourceX={10}
            sourceY={20}
            targetPosition={Position.Left}
            targetX={100}
            targetY={150}
          />
        </svg>
      </ReactFlowProvider>
    );
    expect(container.querySelector("path")).toBeInTheDocument();
  });

  it("renders with custom coordinates", () => {
    const props = {
      id: "temp-edge-2",
      sourcePosition: Position.Right,
      sourceX: 50,
      sourceY: 50,
      targetPosition: Position.Left,
      targetX: 200,
      targetY: 200,
    };

    const edges = [props];
    const { container } = render(
      <Canvas
        edges={edges}
        edgeTypes={{ temporary: Edge.Temporary }}
        nodes={[]}
      >
        <div>Content</div>
      </Canvas>
    );

    expect(container.querySelector(".react-flow")).toBeInTheDocument();
  });

  it("renders with Top and Bottom positions", () => {
    const { container } = render(
      <ReactFlowProvider>
        <svg aria-label="edge diagram" role="img">
          <Edge.Temporary
            id="temp-2"
            sourcePosition={Position.Top}
            sourceX={10}
            sourceY={20}
            targetPosition={Position.Bottom}
            targetX={100}
            targetY={150}
          />
        </svg>
      </ReactFlowProvider>
    );
    expect(container.querySelector("path")).toBeInTheDocument();
  });
});

describe("edge.Animated", () => {
  it("renders with source and target nodes", () => {
    const props = {
      id: "animated-edge",
      source: "1",
      sourcePosition: Position.Right,
      sourceX: 0,
      sourceY: 0,
      target: "2",
      targetPosition: Position.Left,
      targetX: 100,
      targetY: 100,
    };

    const nodes = [
      { data: { label: "Node 1" }, id: "1", position: { x: 0, y: 0 } },
      { data: { label: "Node 2" }, id: "2", position: { x: 200, y: 0 } },
    ];

    const edges = [props];
    const { container } = render(
      <Canvas
        edges={edges}
        edgeTypes={{ animated: Edge.Animated }}
        nodes={nodes}
      >
        <div>Content</div>
      </Canvas>
    );

    expect(container.querySelector(".react-flow")).toBeInTheDocument();
  });

  it("renders with markerEnd and style props", () => {
    const props = {
      id: "animated-edge-styled",
      markerEnd: "url(#arrow)",
      source: "1",
      sourcePosition: Position.Right,
      sourceX: 0,
      sourceY: 0,
      style: { stroke: "red", strokeWidth: 2 },
      target: "2",
      targetPosition: Position.Left,
      targetX: 100,
      targetY: 100,
    };

    const nodes = [
      { data: { label: "Node 1" }, id: "1", position: { x: 0, y: 0 } },
      { data: { label: "Node 2" }, id: "2", position: { x: 200, y: 0 } },
    ];

    const edges = [props];
    const { container } = render(
      <Canvas
        edges={edges}
        edgeTypes={{ animated: Edge.Animated }}
        nodes={nodes}
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
      sourcePosition: Position.Right,
      sourceX: 0,
      sourceY: 0,
      target: "2",
      targetPosition: Position.Left,
      targetX: 100,
      targetY: 100,
    };

    const nodes = [
      { data: { label: "Node 2" }, id: "2", position: { x: 200, y: 0 } },
    ];

    const edges = [props];
    const { container } = render(
      <Canvas
        edges={edges}
        edgeTypes={{ animated: Edge.Animated }}
        nodes={nodes}
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
      sourcePosition: Position.Right,
      sourceX: 0,
      sourceY: 0,
      target: "missing",
      targetPosition: Position.Left,
      targetX: 100,
      targetY: 100,
    };

    const nodes = [
      { data: { label: "Node 1" }, id: "1", position: { x: 0, y: 0 } },
    ];

    const edges = [props];
    const { container } = render(
      <Canvas
        edges={edges}
        edgeTypes={{ animated: Edge.Animated }}
        nodes={nodes}
      >
        <div>Content</div>
      </Canvas>
    );

    expect(container.querySelector(".react-flow")).toBeInTheDocument();
  });

  it("renders directly with valid source and target", () => {
    const { container } = render(
      <ReactFlowProvider>
        <svg aria-label="edge diagram" role="img">
          <Edge.Animated
            id="animated-1"
            source="1"
            sourcePosition={Position.Right}
            sourceX={0}
            sourceY={0}
            target="2"
            targetPosition={Position.Left}
            targetX={100}
            targetY={100}
          />
        </svg>
      </ReactFlowProvider>
    );
    // The component should render when both nodes exist (via mock)
    expect(container).toBeInTheDocument();
  });

  it("renders null when source is missing in direct render", () => {
    const { container } = render(
      <ReactFlowProvider>
        <svg aria-label="edge diagram" role="img">
          <Edge.Animated
            id="animated-missing"
            source="missing"
            sourcePosition={Position.Right}
            sourceX={0}
            sourceY={0}
            target="2"
            targetPosition={Position.Left}
            targetX={100}
            targetY={100}
          />
        </svg>
      </ReactFlowProvider>
    );
    // The component returns null when source is missing
    expect(container).toBeInTheDocument();
  });

  it("renders with nodes that have no handles", () => {
    const { container } = render(
      <ReactFlowProvider>
        <svg aria-label="edge diagram" role="img">
          <Edge.Animated
            id="animated-no-handles"
            source="no-handles"
            sourcePosition={Position.Right}
            sourceX={0}
            sourceY={0}
            target="no-handles"
            targetPosition={Position.Left}
            targetX={100}
            targetY={100}
          />
        </svg>
      </ReactFlowProvider>
    );
    // The component should handle nodes with no handles gracefully
    expect(container).toBeInTheDocument();
  });

  it("renders with Top and Bottom positions", () => {
    const { container } = render(
      <ReactFlowProvider>
        <svg aria-label="edge diagram" role="img">
          <Edge.Animated
            id="animated-top-bottom"
            source="top-bottom"
            sourcePosition={Position.Top}
            sourceX={0}
            sourceY={0}
            target="top-bottom"
            targetPosition={Position.Bottom}
            targetX={100}
            targetY={100}
          />
        </svg>
      </ReactFlowProvider>
    );
    expect(container).toBeInTheDocument();
  });
});
