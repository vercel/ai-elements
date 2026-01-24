---
name: Using the Connection component from AI Elements
description: How to use the Connection component to render custom connection lines in React Flow canvases.
---

# Connection Component

The Connection component renders custom bezier curve connection lines between nodes in React Flow canvases. It provides a smooth, animated connection with a terminal circle indicator.

## Import

```tsx
import { Connection } from "@repo/elements/connection";
```

## Sub-components

| Component | Purpose |
|-----------|---------|
| `Connection` | Custom connection line renderer for React Flow |

## Basic Usage

```tsx
import { Canvas } from "@repo/elements/canvas";
import { Connection } from "@repo/elements/connection";

const Example = () => (
  <div style={{ width: "100%", height: 500 }}>
    <Canvas
      nodes={nodes}
      edges={edges}
      connectionLineComponent={Connection}
    />
  </div>
);
```

## Props Reference

### `<Connection />`

The Connection component implements the `ConnectionLineComponent` interface from React Flow:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `fromX` | `number` | Required | X coordinate of the source point |
| `fromY` | `number` | Required | Y coordinate of the source point |
| `toX` | `number` | Required | X coordinate of the target point |
| `toY` | `number` | Required | Y coordinate of the target point |

## Visual Details

The connection line consists of:
- A bezier curve path from source to target
- Stroke color: `var(--color-ring)` (theme-aware)
- Stroke width: 1px
- A terminal circle at the target point:
  - Radius: 3px
  - Fill: white
  - Stroke: `var(--color-ring)`

## With Custom Nodes

```tsx
import { Canvas } from "@repo/elements/canvas";
import { Connection } from "@repo/elements/connection";
import { Handle, Position } from "@xyflow/react";

const CustomNode = ({ data }) => (
  <div className="rounded-lg border bg-background p-4">
    <Handle type="target" position={Position.Left} />
    <span>{data.label}</span>
    <Handle type="source" position={Position.Right} />
  </div>
);

const nodeTypes = { custom: CustomNode };

const Example = () => (
  <Canvas
    nodes={nodes}
    edges={edges}
    nodeTypes={nodeTypes}
    connectionLineComponent={Connection}
  />
);
```

## Examples

See `scripts/` folder for complete working examples.
