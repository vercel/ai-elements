"use client";

import { Canvas } from "@repo/elements/canvas";
import { Edge } from "@repo/elements/edge";
import {
  Node,
  NodeContent,
  NodeDescription,
  NodeFooter,
  NodeHeader,
  NodeTitle,
} from "@repo/elements/node";
import { nanoid } from "nanoid";

const nodeIds = {
  decision: nanoid(),
  output1: nanoid(),
  output2: nanoid(),
  process1: nanoid(),
  process2: nanoid(),
  start: nanoid(),
};

const nodes = [
  {
    data: {
      description: "Initialize workflow",
      handles: { target: false, source: true },
      label: "Start",
    },
    id: nodeIds.start,
    position: { x: 0, y: 0 },
    type: "workflow",
  },
  {
    data: {
      description: "Transform input",
      handles: { target: true, source: true },
      label: "Process Data",
    },
    id: nodeIds.process1,
    position: { x: 500, y: 0 },
    type: "workflow",
  },
  {
    data: {
      description: "Route based on conditions",
      handles: { target: true, source: true },
      label: "Decision Point",
    },
    id: nodeIds.decision,
    position: { x: 1000, y: 0 },
    type: "workflow",
  },
  {
    data: {
      description: "Handle success case",
      handles: { target: true, source: true },
      label: "Success Path",
    },
    id: nodeIds.output1,
    position: { x: 1500, y: -100 },
    type: "workflow",
  },
  {
    data: {
      description: "Handle error case",
      handles: { target: true, source: true },
      label: "Error Path",
    },
    id: nodeIds.output2,
    position: { x: 1500, y: 100 },
    type: "workflow",
  },
  {
    data: {
      description: "Finalize workflow",
      handles: { target: true, source: false },
      label: "Complete",
    },
    id: nodeIds.process2,
    position: { x: 2000, y: 0 },
    type: "workflow",
  },
];

const edges = [
  {
    id: nanoid(),
    source: nodeIds.start,
    target: nodeIds.process1,
    type: "animated",
  },
  {
    id: nanoid(),
    source: nodeIds.process1,
    target: nodeIds.decision,
    type: "animated",
  },
  {
    id: nanoid(),
    source: nodeIds.decision,
    target: nodeIds.output1,
    type: "animated",
  },
  {
    id: nanoid(),
    source: nodeIds.decision,
    target: nodeIds.output2,
    type: "temporary",
  },
  {
    id: nanoid(),
    source: nodeIds.output1,
    target: nodeIds.process2,
    type: "animated",
  },
  {
    id: nanoid(),
    source: nodeIds.output2,
    target: nodeIds.process2,
    type: "temporary",
  },
];

const nodeTypes = {
  workflow: ({
    data,
  }: {
    data: {
      label: string;
      description: string;
      handles: { target: boolean; source: boolean };
    };
  }) => (
    <Node handles={data.handles}>
      <NodeHeader>
        <NodeTitle>{data.label}</NodeTitle>
        <NodeDescription>{data.description}</NodeDescription>
      </NodeHeader>
      <NodeContent>
        <p>test</p>
      </NodeContent>
      <NodeFooter>
        <p>test</p>
      </NodeFooter>
    </Node>
  ),
};

const edgeTypes = {
  animated: Edge.Animated,
  temporary: Edge.Temporary,
};

const Example = () => (
  <Canvas
    edges={edges}
    edgeTypes={edgeTypes}
    fitView
    nodes={nodes}
    nodeTypes={nodeTypes}
  />
);

export default Example;
