# Context

A compound component system for displaying AI model context window usage, token consumption, and cost estimation.

The `Context` component provides a comprehensive view of AI model usage through a compound component system. It displays context window utilization, token consumption breakdown (input, output, reasoning, cache), and cost estimation in an interactive hover card interface.

See `scripts/context.tsx` for this example.

## Installation

```bash
npx ai-elements@latest add context
```

## Features

- **Compound Component Architecture**: Flexible composition of context display elements
- **Visual Progress Indicator**: Circular SVG progress ring showing context usage percentage
- **Token Breakdown**: Detailed view of input, output, reasoning, and cached tokens
- **Cost Estimation**: Real-time cost calculation using the `tokenlens` library
- **Intelligent Formatting**: Automatic token count formatting (K, M, B suffixes)
- **Interactive Hover Card**: Detailed information revealed on hover
- **Context Provider Pattern**: Clean data flow through React Context API
- **TypeScript Support**: Full type definitions for all components
- **Accessible Design**: Proper ARIA labels and semantic HTML
- **Theme Integration**: Uses currentColor for automatic theme adaptation

## Props

### `<Context />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `maxTokens` | `number` | - | The total context window size in tokens. |
| `usedTokens` | `number` | - | The number of tokens currently used. |
| `usage` | `LanguageModelUsage` | - | Detailed token usage breakdown from the AI SDK (input, output, reasoning, cached tokens). |
| `modelId` | `ModelId` | - | Model identifier for cost calculation (e.g.,  |
| `...props` | `ComponentProps<HoverCard>` | - | Any other props are spread to the HoverCard component. |

### `<ContextTrigger />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `React.ReactNode` | - | Custom trigger element. If not provided, renders a default button with percentage and icon. |
| `...props` | `ComponentProps<Button>` | - | Props spread to the default button element. |

### `<ContextContent />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | - | Additional CSS classes for the hover card content. |
| `...props` | `ComponentProps<HoverCardContent>` | - | Props spread to the HoverCardContent component. |

### `<ContextContentHeader />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `React.ReactNode` | - | Custom header content. If not provided, renders percentage and token count with progress bar. |
| `...props` | `ComponentProps<div>` | - | Props spread to the header div element. |

### `<ContextContentBody />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `React.ReactNode` | - | Body content, typically containing usage breakdown components. |
| `...props` | `ComponentProps<div>` | - | Props spread to the body div element. |

### `<ContextContentFooter />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `React.ReactNode` | - | Custom footer content. If not provided, renders total cost when modelId is provided. |
| `...props` | `ComponentProps<div>` | - | Props spread to the footer div element. |

### Usage Components

All usage components (`ContextInputUsage`, `ContextOutputUsage`, `ContextReasoningUsage`, `ContextCacheUsage`) share the same props:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `React.ReactNode` | - | Custom content. If not provided, renders token count and cost for the respective usage type. |
| `className` | `string` | - | Additional CSS classes. |
| `...props` | `ComponentProps<div>` | - | Props spread to the div element. |

## Component Architecture

The Context component uses a compound component pattern with React Context for data sharing:

1. **`<Context>`** - Root provider component that holds all context data
2. **`<ContextTrigger>`** - Interactive trigger element (default: button with percentage)
3. **`<ContextContent>`** - Hover card content container
4. **`<ContextContentHeader>`** - Header section with progress visualization
5. **`<ContextContentBody>`** - Body section for usage breakdowns
6. **`<ContextContentFooter>`** - Footer section for total cost
7. **Usage Components** - Individual token usage displays (Input, Output, Reasoning, Cache)

## Token Formatting

The component uses `Intl.NumberFormat` with compact notation for automatic formatting:

- Under 1,000: Shows exact count (e.g., "842")
- 1,000+: Shows with K suffix (e.g., "32K")
- 1,000,000+: Shows with M suffix (e.g., "1.5M")
- 1,000,000,000+: Shows with B suffix (e.g., "2.1B")

## Cost Calculation

When a `modelId` is provided, the component automatically calculates costs using the `tokenlens` library:

- **Input tokens**: Cost based on model's input pricing
- **Output tokens**: Cost based on model's output pricing
- **Reasoning tokens**: Special pricing for reasoning-capable models
- **Cached tokens**: Reduced pricing for cached input tokens
- **Total cost**: Sum of all token type costs

Costs are formatted using `Intl.NumberFormat` with USD currency.

## Styling

The component uses Tailwind CSS classes and follows your design system:

- Progress indicator uses `currentColor` for theme adaptation
- Hover card has customizable width and padding
- Footer has a secondary background for visual separation
- All text sizes use the `text-xs` class for consistency
- Muted foreground colors for secondary information
