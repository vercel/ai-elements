---
name: Using the Edge component from AI Elements
description: How to use the Edge component to render styled connection lines in React Flow diagrams.
---

# Edge Component

Custom edge components for React Flow diagrams. Provides two edge variants: `Temporary` for dashed placeholder edges and `Animated` for edges with animated flowing particles.

## Import

```tsx
import { Edge } from "@repo/elements/edge";
```

## Sub-components

| Component | Purpose |
|-----------|---------|
| `Edge.Temporary` | Dashed edge for temporary/preview connections |
| `Edge.Animated` | Bezier edge with animated particle flowing along the path |

## Basic Usage

```tsx
import { ReactFlow } from "@xyflow/react";
import { Edge } from "@repo/elements/edge";

const edgeTypes = {
  temporary: Edge.Temporary,
  animated: Edge.Animated,
};

const edges = [
  { id: "e1", source: "1", target: "2", type: "animated" },
  { id: "e2", source: "2", target: "3", type: "temporary" },
];

const FlowDiagram = () => (
  <ReactFlow
    nodes={nodes}
    edges={edges}
    edgeTypes={edgeTypes}
  />
);
```

## Props Reference

### `<Edge.Temporary />`
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `id` | `string` | - | Edge identifier |
| `sourceX` | `number` | - | Source X coordinate |
| `sourceY` | `number` | - | Source Y coordinate |
| `targetX` | `number` | - | Target X coordinate |
| `targetY` | `number` | - | Target Y coordinate |
| `sourcePosition` | `Position` | - | Source handle position |
| `targetPosition` | `Position` | - | Target handle position |

### `<Edge.Animated />`
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `id` | `string` | - | Edge identifier |
| `source` | `string` | - | Source node ID |
| `target` | `string` | - | Target node ID |
| `markerEnd` | `string` | - | Arrow marker at edge end |
| `style` | `CSSProperties` | - | Custom edge styling |

## Styling

- `Temporary`: Uses dashed stroke (`strokeDasharray: "5, 5"`) with `stroke-ring` color
- `Animated`: Renders a circle that animates along the bezier path using `animateMotion` with 2-second duration

## Examples

See `scripts/` folder for complete working examples.
