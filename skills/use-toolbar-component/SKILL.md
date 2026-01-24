---
name: Using the Toolbar component from AI Elements
description: How to use the Toolbar component to display a node toolbar in React Flow diagrams.
---

# Toolbar Component

A toolbar component for React Flow nodes. Wraps the `@xyflow/react` NodeToolbar with consistent styling.

## Import

```tsx
import { Toolbar } from "@repo/elements/toolbar";
```

## Sub-components

| Component | Purpose |
|-----------|---------|
| `Toolbar` | Styled toolbar positioned relative to a React Flow node |

## Basic Usage

```tsx
import { Toolbar } from "@repo/elements/toolbar";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import { Button } from "@repo/shadcn-ui/components/ui/button";
import { EditIcon, TrashIcon, CopyIcon } from "lucide-react";

const CustomNode = ({ id, data }: NodeProps) => (
  <>
    <Toolbar>
      <Button size="icon-sm" variant="ghost">
        <EditIcon className="size-4" />
      </Button>
      <Button size="icon-sm" variant="ghost">
        <CopyIcon className="size-4" />
      </Button>
      <Button size="icon-sm" variant="ghost">
        <TrashIcon className="size-4" />
      </Button>
    </Toolbar>
    <div className="rounded-lg border bg-card p-4">
      {data.label}
    </div>
    <Handle type="target" position={Position.Top} />
    <Handle type="source" position={Position.Bottom} />
  </>
);
```

## Props Reference

### `<Toolbar />`
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `position` | `Position` | `Position.Bottom` | Toolbar position relative to node |
| `className` | `string` | - | Additional CSS classes |
| `children` | `ReactNode` | - | Toolbar content (buttons, etc.) |
| `...props` | `ComponentProps<typeof NodeToolbar>` | - | Props passed to NodeToolbar |

## Requirements

This component requires `@xyflow/react` to be installed and used within a React Flow context:

```tsx
import { ReactFlow, Controls, Background } from "@xyflow/react";
import "@xyflow/react/dist/style.css";

const nodeTypes = {
  custom: CustomNode,
};

const Flow = () => (
  <ReactFlow
    nodes={nodes}
    edges={edges}
    nodeTypes={nodeTypes}
  >
    <Controls />
    <Background />
  </ReactFlow>
);
```

## Styling

The toolbar has default styling:
- Flexbox layout with gap between items
- Rounded border with background
- Padding around content

Override with className:

```tsx
<Toolbar className="bg-primary text-primary-foreground">
  {/* buttons */}
</Toolbar>
```

## Examples

See `scripts/` folder for complete working examples.
