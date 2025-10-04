"use client";

import { Canvas } from "@repo/elements/canvas";
import { Connection } from "@repo/elements/connection";
import { Edge } from "@repo/elements/edge";
import {
  Node,
  NodeContent,
  NodeDescription,
  NodeFooter,
  NodeHeader,
  NodeTitle,
} from "@repo/elements/node";

const nodeIds = {
  start: "start",
  process1: "process1",
  process2: "process2",
  decision: "decision",
  output1: "output1",
  output2: "output2",
};

const nodes = [
  {
    id: nodeIds.start,
    type: "workflow",
    position: { x: 0, y: 0 },
    data: {
      label: "Start",
      description: "Initialize workflow",
      handles: { target: false, source: true },
      content: "Triggered by user action at 09:30 AM",
      footer: "Status: Ready",
    },
  },
  {
    id: nodeIds.process1,
    type: "workflow",
    position: { x: 500, y: 0 },
    data: {
      label: "Process Data",
      description: "Transform input",
      handles: { target: true, source: true },
      content: "Validating 1,234 records and applying business rules",
      footer: "Duration: ~2.5s",
    },
  },
  {
    id: nodeIds.decision,
    type: "workflow",
    position: { x: 1000, y: 0 },
    data: {
      label: "Decision Point",
      description: "Route based on conditions",
      handles: { target: true, source: true },
      content: "Evaluating: data.status === 'valid' && data.score > 0.8",
      footer: "Confidence: 94%",
    },
  },
  {
    id: nodeIds.output1,
    type: "workflow",
    position: { x: 1500, y: -300 },
    data: {
      label: "Success Path",
      description: "Handle success case",
      handles: { target: true, source: true },
      content: "1,156 records passed validation (93.7%)",
      footer: "Next: Send to production",
    },
  },
  {
    id: nodeIds.output2,
    type: "workflow",
    position: { x: 1500, y: 300 },
    data: {
      label: "Error Path",
      description: "Handle error case",
      handles: { target: true, source: true },
      content: "78 records failed validation (6.3%)",
      footer: "Next: Queue for review",
    },
  },
  {
    id: nodeIds.process2,
    type: "workflow",
    position: { x: 2000, y: 0 },
    data: {
      label: "Complete",
      description: "Finalize workflow",
      handles: { target: true, source: false },
      content: "All records processed and routed successfully",
      footer: "Total time: 4.2s",
    },
  },
];

const edges = [
  {
    id: "edge1",
    source: nodeIds.start,
    target: nodeIds.process1,
    type: "animated",
  },
  {
    id: "edge2",
    source: nodeIds.process1,
    target: nodeIds.decision,
    type: "animated",
  },
  {
    id: "edge3",
    source: nodeIds.decision,
    target: nodeIds.output1,
    type: "animated",
  },
  {
    id: "edge4",
    source: nodeIds.decision,
    target: nodeIds.output2,
    type: "temporary",
  },
  {
    id: "edge5",
    source: nodeIds.output1,
    target: nodeIds.process2,
    type: "animated",
  },
  {
    id: "edge6",
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
      content: string;
      footer: string;
    };
  }) => (
    <Node handles={data.handles}>
      <NodeHeader>
        <NodeTitle>{data.label}</NodeTitle>
        <NodeDescription>{data.description}</NodeDescription>
      </NodeHeader>
      <NodeContent>
        <p className="text-sm">{data.content}</p>
      </NodeContent>
      <NodeFooter>
        <p className="text-muted-foreground text-xs">{data.footer}</p>
      </NodeFooter>
    </Node>
  ),
};

const edgeTypes = {
  animated: Edge.Animated,
  temporary: Edge.Temporary,
};

const Example = () => (
  <div style={{ height: "400px", width: "100%" }}>
    <Canvas
      connectionLineComponent={Connection}
      edges={edges}
      edgeTypes={edgeTypes}
      fitView
      nodes={nodes}
      nodeTypes={nodeTypes}
    />
  </div>
);

export default Example;
