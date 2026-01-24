---
name: Using the Controls component from AI Elements
description: How to use the Controls component to add zoom and navigation controls to React Flow diagrams.
---

# Controls Component

A styled wrapper around React Flow's Controls component that provides zoom and navigation buttons for flow diagrams. Integrates with the xyflow/react library.

## Import

```tsx
import { Controls } from "@repo/elements/controls";
```

## Sub-components

| Component | Purpose |
|-----------|---------|
| `Controls` | Styled controls panel for React Flow diagrams |

## Basic Usage

```tsx
import { ReactFlow } from "@xyflow/react";
import { Controls } from "@repo/elements/controls";

const FlowDiagram = () => (
  <ReactFlow nodes={nodes} edges={edges}>
    <Controls />
  </ReactFlow>
);
```

## Props Reference

### `<Controls />`
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | - | Additional CSS classes |
| `...props` | `ComponentProps<typeof ControlsPrimitive>` | - | All React Flow Controls props are supported |

## Styling

The component applies these default styles:
- Rounded corners with border and card background
- Removes default button borders
- Hover state with secondary background color

## Examples

See `scripts/` folder for complete working examples.
