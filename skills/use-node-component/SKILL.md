---
name: Using the Node component from AI Elements
description: How to use the Node component to create styled nodes for React Flow diagrams with handles.
---

# Node Component

A composable node component for React Flow diagrams. Provides a card-based design with optional source/target handles, header, content, and footer sections. Built on shadcn/ui Card components.

## Import

```tsx
import {
  Node,
  NodeHeader,
  NodeTitle,
  NodeDescription,
  NodeAction,
  NodeContent,
  NodeFooter,
} from "@repo/elements/node";
```

## Sub-components

| Component | Purpose |
|-----------|---------|
| `Node` | Root card with configurable handles |
| `NodeHeader` | Header section with secondary background |
| `NodeTitle` | Node title text |
| `NodeDescription` | Subtitle/description text |
| `NodeAction` | Action button in header area |
| `NodeContent` | Main content area |
| `NodeFooter` | Footer section with secondary background |

## Basic Usage

```tsx
import { ReactFlow } from "@xyflow/react";
import {
  Node,
  NodeHeader,
  NodeTitle,
  NodeDescription,
  NodeContent,
} from "@repo/elements/node";

const CustomNode = ({ data }) => (
  <Node handles={{ target: true, source: true }}>
    <NodeHeader>
      <NodeTitle>{data.title}</NodeTitle>
      <NodeDescription>{data.description}</NodeDescription>
    </NodeHeader>
    <NodeContent>{data.content}</NodeContent>
  </Node>
);

const nodeTypes = {
  custom: CustomNode,
};

const FlowDiagram = () => (
  <ReactFlow nodes={nodes} edges={edges} nodeTypes={nodeTypes} />
);
```

## Props Reference

### `<Node />`
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `handles` | `{ target: boolean; source: boolean }` | - | Handle visibility (required) |
| `className` | `string` | - | Additional CSS classes |
| `...props` | `ComponentProps<typeof Card>` | - | All Card props supported |

### `<NodeHeader />`
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | - | Additional CSS classes |
| `...props` | `ComponentProps<typeof CardHeader>` | - | All CardHeader props |

### `<NodeTitle />`
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `...props` | `ComponentProps<typeof CardTitle>` | - | All CardTitle props |

### `<NodeDescription />`
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `...props` | `ComponentProps<typeof CardDescription>` | - | All CardDescription props |

### `<NodeAction />`
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `...props` | `ComponentProps<typeof CardAction>` | - | All CardAction props |

### `<NodeContent />`
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | - | Additional CSS classes |
| `...props` | `ComponentProps<typeof CardContent>` | - | All CardContent props |

### `<NodeFooter />`
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | - | Additional CSS classes |
| `...props` | `ComponentProps<typeof CardFooter>` | - | All CardFooter props |

## Handle Positions

The component uses fixed handle positions:
- **Target handle**: Left side (`Position.Left`)
- **Source handle**: Right side (`Position.Right`)

## Styling

Default node styles:
- Width: `w-sm` (24rem)
- Rounded corners: `rounded-md`
- Header/Footer: Secondary background with border

## Examples

See `scripts/` folder for complete working examples.
