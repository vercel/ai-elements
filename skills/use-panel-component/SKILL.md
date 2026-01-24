---
name: Using the Panel component from AI Elements
description: How to use the Panel component to display floating panels within xyflow/react diagrams.
---

# Panel Component

A styled wrapper around the xyflow Panel primitive for displaying floating panels within xyflow/react diagrams. Provides consistent styling with rounded borders and card-like appearance.

## Import

```tsx
import { Panel } from "@repo/elements/panel";
```

## Sub-components

| Component | Purpose |
|-----------|---------|
| `Panel` | Styled xyflow Panel with card styling |

## Basic Usage

```tsx
import { Panel } from "@repo/elements/panel";
import { ReactFlow } from "@xyflow/react";

const FlowWithPanel = () => (
  <ReactFlow nodes={nodes} edges={edges}>
    <Panel position="top-left">
      <div className="p-2">
        <h3 className="font-semibold">Controls</h3>
        <button>Zoom In</button>
        <button>Zoom Out</button>
      </div>
    </Panel>
  </ReactFlow>
);
```

## Props Reference

### `<Panel />`
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `position` | `"top-left" \| "top-center" \| "top-right" \| "bottom-left" \| "bottom-center" \| "bottom-right"` | - | Position of the panel |
| `className` | `string` | - | Additional CSS classes |
| `children` | `ReactNode` | - | Panel content |

All props from `@xyflow/react` Panel component are also supported.

## Styling

The Panel component comes with default styling:
- `m-4` - Margin around the panel
- `overflow-hidden` - Clips overflow content
- `rounded-md` - Rounded corners
- `border` - Border styling
- `bg-card` - Card background color
- `p-1` - Internal padding

## Examples

See `scripts/` folder for complete working examples.
