---
name: Using the Context component from AI Elements
description: How to use the Context component to display token usage and cost information.
---

# Context Component

The Context component displays AI model context window usage with a circular progress indicator, detailed token breakdown, and cost calculations. It uses a hover card to show detailed information on demand.

## Import

```tsx
import {
  Context,
  ContextTrigger,
  ContextContent,
  ContextContentHeader,
  ContextContentBody,
  ContextContentFooter,
  ContextInputUsage,
  ContextOutputUsage,
  ContextReasoningUsage,
  ContextCacheUsage,
} from "@repo/elements/context";
```

## Sub-components

| Component | Purpose |
|-----------|---------|
| `Context` | Root container with hover card and context provider |
| `ContextTrigger` | Button showing percentage with circular indicator |
| `ContextContent` | Hover card content container |
| `ContextContentHeader` | Progress bar and token counts |
| `ContextContentBody` | Container for usage breakdowns |
| `ContextContentFooter` | Total cost display |
| `ContextInputUsage` | Input token count and cost |
| `ContextOutputUsage` | Output token count and cost |
| `ContextReasoningUsage` | Reasoning token count and cost |
| `ContextCacheUsage` | Cached token count and cost |

## Basic Usage

```tsx
const Example = () => (
  <Context
    usedTokens={40_000}
    maxTokens={128_000}
    modelId="openai:gpt-4"
    usage={{
      inputTokens: 32_000,
      outputTokens: 8_000,
      totalTokens: 40_000,
      cachedInputTokens: 0,
      reasoningTokens: 0,
    }}
  >
    <ContextTrigger />
    <ContextContent>
      <ContextContentHeader />
      <ContextContentBody>
        <ContextInputUsage />
        <ContextOutputUsage />
        <ContextReasoningUsage />
        <ContextCacheUsage />
      </ContextContentBody>
      <ContextContentFooter />
    </ContextContent>
  </Context>
);
```

## Minimal Usage

```tsx
<Context usedTokens={10_000} maxTokens={100_000}>
  <ContextTrigger />
  <ContextContent>
    <ContextContentHeader />
  </ContextContent>
</Context>
```

## Props Reference

### `<Context />`
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `usedTokens` | `number` | Required | Number of tokens used |
| `maxTokens` | `number` | Required | Maximum context window size |
| `usage` | `LanguageModelUsage` | - | Detailed usage breakdown from AI SDK |
| `modelId` | `string` | - | Model identifier for cost calculation |
| `...props` | `ComponentProps<typeof HoverCard>` | - | Hover card props |

### `<ContextTrigger />`
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | - | Custom trigger content (defaults to percentage + icon) |
| `...props` | `ComponentProps<typeof Button>` | - | Button props |

### `<ContextContent />`
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | - | Additional CSS classes |
| `...props` | `ComponentProps<typeof HoverCardContent>` | - | Hover card content props |

### `<ContextContentHeader />`
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | - | Custom header content (defaults to progress bar) |
| `className` | `string` | - | Additional CSS classes |

### `<ContextContentBody />`
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | Required | Usage breakdown components |
| `className` | `string` | - | Additional CSS classes |

### `<ContextContentFooter />`
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | - | Custom footer content (defaults to total cost) |
| `className` | `string` | - | Additional CSS classes |

### `<ContextInputUsage />`
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | - | Custom content |
| `className` | `string` | - | Additional CSS classes |

### `<ContextOutputUsage />`
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | - | Custom content |
| `className` | `string` | - | Additional CSS classes |

### `<ContextReasoningUsage />`
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | - | Custom content |
| `className` | `string` | - | Additional CSS classes |

### `<ContextCacheUsage />`
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | - | Custom content |
| `className` | `string` | - | Additional CSS classes |

## Cost Calculation

The component uses the `tokenlens` library to calculate costs based on:
- Model ID (e.g., `"openai:gpt-4"`, `"anthropic:claude-sonnet-4"`)
- Input, output, reasoning, and cache token counts

If no `modelId` is provided, cost displays will show `$0.00`.

## Examples

See `scripts/` folder for complete working examples.
