---
name: Using the Canvas component from AI Elements
description: How to use the Canvas component to create node-based visual interfaces with React Flow.
---

# Canvas Component

The Canvas component provides a React Flow-based canvas for building node-based visual interfaces. It comes pre-configured with sensible defaults for pan, zoom, and selection behaviors, and includes a subtle background.

## Import

```tsx
import { Canvas } from "@repo/elements/canvas";
```

## Sub-components

| Component | Purpose |
|-----------|---------|
| `Canvas` | React Flow wrapper with preset configurations |

## Basic Usage

```tsx
import { Canvas } from "@repo/elements/canvas";

const nodes = [
  { id: "1", position: { x: 0, y: 0 }, data: { label: "Node 1" } },
  { id: "2", position: { x: 200, y: 100 }, data: { label: "Node 2" } },
];

const edges = [
  { id: "e1-2", source: "1", target: "2" },
];

const Example = () => (
  <div style={{ width: "100%", height: 500 }}>
    <Canvas nodes={nodes} edges={edges}>
      {/* Additional React Flow children like Controls, MiniMap */}
    </Canvas>
  </div>
);
```

## Props Reference

### `<Canvas />`
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `nodes` | `Node[]` | - | Array of nodes to display |
| `edges` | `Edge[]` | - | Array of edges connecting nodes |
| `onNodesChange` | `(changes: NodeChange[]) => void` | - | Callback for node changes |
| `onEdgesChange` | `(changes: EdgeChange[]) => void` | - | Callback for edge changes |
| `onConnect` | `(connection: Connection) => void` | - | Callback for new connections |
| `children` | `ReactNode` | - | Additional React Flow children |
| `...props` | `ReactFlowProps` | - | All React Flow props |

## Default Configuration

The Canvas component comes with these defaults:

- `fitView`: `true` - Automatically fits all nodes in view
- `panOnDrag`: `false` - Disabled to allow selection
- `panOnScroll`: `true` - Scroll to pan
- `selectionOnDrag`: `true` - Drag to select nodes
- `zoomOnDoubleClick`: `false` - Disabled for cleaner UX
- `deleteKeyCode`: `["Backspace", "Delete"]` - Keys for deleting nodes
- Background color: `var(--sidebar)` - Matches theme

## Examples

See `scripts/` folder for complete working examples.
