---
name: Using the Reasoning component from AI Elements
description: How to use the Reasoning component to display AI thinking/reasoning content with auto-collapse behavior.
---

# Reasoning Component

A collapsible component for displaying AI reasoning or thinking content with streaming support, auto-collapse behavior, and duration tracking.

## Import

```tsx
import {
  Reasoning,
  ReasoningTrigger,
  ReasoningContent,
  useReasoning,
} from "@repo/elements/reasoning";
```

## Sub-components

| Component | Purpose |
|-----------|---------|
| `Reasoning` | Root container with context provider |
| `ReasoningTrigger` | Trigger button with thinking status |
| `ReasoningContent` | Collapsible content with markdown rendering |

## Basic Usage

```tsx
import {
  Reasoning,
  ReasoningContent,
  ReasoningTrigger,
} from "@repo/elements/reasoning";

const Example = () => {
  const [isStreaming, setIsStreaming] = useState(true);
  const [content, setContent] = useState("Thinking about the problem...");

  return (
    <Reasoning isStreaming={isStreaming}>
      <ReasoningTrigger />
      <ReasoningContent>{content}</ReasoningContent>
    </Reasoning>
  );
};
```

## Props Reference

### `<Reasoning />`
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isStreaming` | `boolean` | `false` | Shows shimmer effect and tracks duration |
| `open` | `boolean` | - | Controlled open state |
| `defaultOpen` | `boolean` | `true` | Initial open state |
| `onOpenChange` | `(open: boolean) => void` | - | Callback on open state change |
| `duration` | `number` | - | Override thinking duration in seconds |
| `className` | `string` | - | Additional CSS classes |

### `<ReasoningTrigger />`
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `getThinkingMessage` | `(isStreaming: boolean, duration?: number) => ReactNode` | - | Custom thinking message renderer |
| `className` | `string` | - | Additional CSS classes |

### `<ReasoningContent />`
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `string` | - | Markdown content to render (required) |
| `className` | `string` | - | Additional CSS classes |

## Auto-collapse Behavior

When `defaultOpen` is true:
1. Content starts open when streaming begins
2. After streaming ends, waits 1 second
3. Automatically collapses
4. User can manually toggle after

## useReasoning Hook

Access context values:
- `isStreaming` - Current streaming state
- `isOpen` - Current open state
- `setIsOpen` - Function to set open state
- `duration` - Thinking duration in seconds

## Content Rendering

`ReasoningContent` uses Streamdown with plugins for:
- Code syntax highlighting
- Mermaid diagrams
- Math equations
- CJK character support

## Examples

See `scripts/` folder for complete working examples.
