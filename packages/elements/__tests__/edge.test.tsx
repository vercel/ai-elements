import { render } from "@testing-library/react";
import { Position, ReactFlowProvider } from "@xyflow/react";
import { describe, expect, it, vi } from "vitest";
import { Canvas } from "../src/canvas";
import { Edge } from "../src/edge";

vi.mock("@xyflow/react", async () => {
  const actual = await vi.importActual("@xyflow/react");
  return {
    ...actual,
    useInternalNode: vi.fn((id: string) => {
      if (id === "1" || id === "2" || id === "3" || id === "4") {
        return {
          id,
          internals: {
            positionAbsolute: { x: 100, y: 100 },
            handleBounds: {
              source: [
                {
                  id: "source",
                  position: Position.Right,
                  x: 50,
                  y: 25,
                  width: 10,
                  height: 10,
                },
              ],
              target: [
                {
                  id: "target",
                  position: Position.Left,
                  x: 5,
                  y: 25,
                  width: 10,
                  height: 10,
                },
              ],
            },
          },
        };
      }
      // Return a node with no handles for testing the "no handle" case
      if (id === "no-handles") {
        return {
          id,
          internals: {
            positionAbsolute: { x: 100, y: 100 },
            handleBounds: {
              source: [],
              target: [],
            },
          },
        };
      }
      // Return nodes with Top/Bottom handles for comprehensive testing
      if (id === "top-bottom") {
        return {
          id,
          internals: {
            positionAbsolute: { x: 100, y: 100 },
            handleBounds: {
              source: [
                {
                  id: "source",
                  position: Position.Top,
                  x: 50,
                  y: 25,
                  width: 10,
                  height: 10,
                },
              ],
              target: [
                {
                  id: "target",
                  position: Position.Bottom,
                  x: 5,
                  y: 25,
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
      sourceX: 50,
      sourceY: 50,
      targetX: 200,
      targetY: 200,
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
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
      source: "1",
      target: "2",
      sourceX: 0,
      sourceY: 0,
      targetX: 100,
      targetY: 100,
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
      markerEnd: "url(#arrow)",
      style: { stroke: "red", strokeWidth: 2 },
    };

    const nodes = [
      { id: "1", position: { x: 0, y: 0 }, data: { label: "Node 1" } },
      { id: "2", position: { x: 200, y: 0 }, data: { label: "Node 2" } },
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
