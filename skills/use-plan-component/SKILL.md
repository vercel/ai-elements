---
name: Using the Plan component from AI Elements
description: How to use the Plan component to display AI-generated plans with collapsible content.
---

# Plan Component

A collapsible card component for displaying AI-generated plans with title, description, content, and action buttons. Supports streaming state with shimmer effects.

## Import

```tsx
import {
  Plan,
  PlanHeader,
  PlanTitle,
  PlanDescription,
  PlanAction,
  PlanContent,
  PlanFooter,
  PlanTrigger,
} from "@repo/elements/plan";
```

## Sub-components

| Component | Purpose |
|-----------|---------|
| `Plan` | Root container with collapsible functionality |
| `PlanHeader` | Header section for title, description, and trigger |
| `PlanTitle` | Plan title with optional streaming shimmer |
| `PlanDescription` | Plan description with optional streaming shimmer |
| `PlanAction` | Container for action buttons |
| `PlanContent` | Collapsible content area |
| `PlanFooter` | Footer section for actions |
| `PlanTrigger` | Button to toggle content visibility |

## Basic Usage

```tsx
import {
  Plan,
  PlanAction,
  PlanContent,
  PlanDescription,
  PlanFooter,
  PlanHeader,
  PlanTitle,
  PlanTrigger,
} from "@repo/elements/plan";
import { Button } from "@repo/shadcn-ui/components/ui/button";

const Example = () => (
  <Plan defaultOpen={false}>
    <PlanHeader>
      <div>
        <PlanTitle>Migrate to SolidJS</PlanTitle>
        <PlanDescription>
          Rewrite the component library from React to SolidJS
        </PlanDescription>
      </div>
      <PlanTrigger />
    </PlanHeader>
    <PlanContent>
      <div className="space-y-4 text-sm">
        <h3 className="font-semibold">Key Steps</h3>
        <ul className="list-inside list-disc">
          <li>Set up SolidJS project</li>
          <li>Migrate components</li>
          <li>Update tests</li>
        </ul>
      </div>
    </PlanContent>
    <PlanFooter className="justify-end">
      <PlanAction>
        <Button size="sm">Build</Button>
      </PlanAction>
    </PlanFooter>
  </Plan>
);
```

## Props Reference

### `<Plan />`
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isStreaming` | `boolean` | `false` | Shows shimmer effect on title/description |
| `defaultOpen` | `boolean` | - | Initial open state |
| `open` | `boolean` | - | Controlled open state |
| `onOpenChange` | `(open: boolean) => void` | - | Callback on open state change |
| `className` | `string` | - | Additional CSS classes |

### `<PlanTitle />`
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `string` | - | Title text (required) |

### `<PlanDescription />`
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `string` | - | Description text (required) |

## Streaming State

When `isStreaming` is true, the `PlanTitle` and `PlanDescription` components automatically display a shimmer effect to indicate loading.

## Examples

See `scripts/` folder for complete working examples.
