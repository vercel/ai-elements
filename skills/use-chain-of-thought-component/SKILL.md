---
name: Using the ChainOfThought component from AI Elements
description: How to use the ChainOfThought component to display AI reasoning steps and search results.
---

# ChainOfThought Component

The ChainOfThought component displays AI reasoning processes with collapsible steps, search results, and images. It provides a clear visual representation of how an AI reached its conclusions.

## Import

```tsx
import {
  ChainOfThought,
  ChainOfThoughtHeader,
  ChainOfThoughtContent,
  ChainOfThoughtStep,
  ChainOfThoughtSearchResults,
  ChainOfThoughtSearchResult,
  ChainOfThoughtImage,
} from "@repo/elements/chain-of-thought";
```

## Sub-components

| Component | Purpose |
|-----------|---------|
| `ChainOfThought` | Root container with open/close state |
| `ChainOfThoughtHeader` | Collapsible trigger with brain icon |
| `ChainOfThoughtContent` | Collapsible content area for steps |
| `ChainOfThoughtStep` | Individual reasoning step with icon and status |
| `ChainOfThoughtSearchResults` | Container for search result badges |
| `ChainOfThoughtSearchResult` | Individual search result badge |
| `ChainOfThoughtImage` | Image display with optional caption |

## Basic Usage

```tsx
import { SearchIcon, CheckIcon } from "lucide-react";

const Example = () => (
  <ChainOfThought defaultOpen>
    <ChainOfThoughtHeader>Reasoning</ChainOfThoughtHeader>
    <ChainOfThoughtContent>
      <ChainOfThoughtStep
        icon={SearchIcon}
        label="Searching for information"
        status="complete"
      >
        <ChainOfThoughtSearchResults>
          <ChainOfThoughtSearchResult>React docs</ChainOfThoughtSearchResult>
          <ChainOfThoughtSearchResult>MDN Web Docs</ChainOfThoughtSearchResult>
        </ChainOfThoughtSearchResults>
      </ChainOfThoughtStep>
      <ChainOfThoughtStep
        icon={CheckIcon}
        label="Analyzing results"
        status="active"
        description="Processing the gathered information"
      />
    </ChainOfThoughtContent>
  </ChainOfThought>
);
```

## Props Reference

### `<ChainOfThought />`
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `open` | `boolean` | - | Controlled open state |
| `defaultOpen` | `boolean` | `false` | Initial open state (uncontrolled) |
| `onOpenChange` | `(open: boolean) => void` | - | Callback when open state changes |
| `className` | `string` | - | Additional CSS classes |

### `<ChainOfThoughtHeader />`
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | `"Chain of Thought"` | Header text |
| `className` | `string` | - | Additional CSS classes |

### `<ChainOfThoughtContent />`
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | - | Additional CSS classes |
| `...props` | `ComponentProps<typeof CollapsibleContent>` | - | Collapsible content props |

### `<ChainOfThoughtStep />`
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `icon` | `LucideIcon` | `DotIcon` | Icon for the step |
| `label` | `ReactNode` | Required | Step label/title |
| `description` | `ReactNode` | - | Optional description text |
| `status` | `"complete" \| "active" \| "pending"` | `"complete"` | Visual status indicator |
| `children` | `ReactNode` | - | Additional content (e.g., search results) |
| `className` | `string` | - | Additional CSS classes |

### `<ChainOfThoughtSearchResults />`
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | - | Additional CSS classes |

### `<ChainOfThoughtSearchResult />`
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | Required | Result text/content |
| `className` | `string` | - | Additional CSS classes |
| `...props` | `ComponentProps<typeof Badge>` | - | Badge props |

### `<ChainOfThoughtImage />`
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `caption` | `string` | - | Image caption text |
| `children` | `ReactNode` | Required | Image element |
| `className` | `string` | - | Additional CSS classes |

## Examples

See `scripts/` folder for complete working examples.
