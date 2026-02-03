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
  decision: "decision",
  output1: "output1",
  output2: "output2",
  process1: "process1",
  process2: "process2",
  start: "start",
};

const nodes = [
  {
    data: {
      content: "Triggered by user action at 09:30 AM",
      description: "Initialize workflow",
      footer: "Status: Ready",
      handles: { source: true, target: false },
      label: "Start",
    },
    id: nodeIds.start,
    position: { x: 0, y: 0 },
    type: "workflow",
  },
  {
    data: {
      content: "Validating 1,234 records and applying business rules",
      description: "Transform input",
      footer: "Duration: ~2.5s",
      handles: { source: true, target: true },
      label: "Process Data",
    },
    id: nodeIds.process1,
    position: { x: 500, y: 0 },
    type: "workflow",
  },
  {
    data: {
      content: "Evaluating: data.status === 'valid' && data.score > 0.8",
      description: "Route based on conditions",
      footer: "Confidence: 94%",
      handles: { source: true, target: true },
      label: "Decision Point",
    },
    id: nodeIds.decision,
    position: { x: 1000, y: 0 },
    type: "workflow",
  },
  {
    data: {
      content: "1,156 records passed validation (93.7%)",
      description: "Handle success case",
      footer: "Next: Send to production",
      handles: { source: true, target: true },
      label: "Success Path",
    },
    id: nodeIds.output1,
    position: { x: 1500, y: -300 },
    type: "workflow",
  },
  {
    data: {
      content: "78 records failed validation (6.3%)",
      description: "Handle error case",
      footer: "Next: Queue for review",
      handles: { source: true, target: true },
      label: "Error Path",
    },
    id: nodeIds.output2,
    position: { x: 1500, y: 300 },
    type: "workflow",
  },
  {
    data: {
      content: "All records processed and routed successfully",
      description: "Finalize workflow",
      footer: "Total time: 4.2s",
      handles: { source: false, target: true },
      label: "Complete",
    },
    id: nodeIds.process2,
    position: { x: 2000, y: 0 },
    type: "workflow",
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
  <div style={{ height: "100%", width: "100%" }}>
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
