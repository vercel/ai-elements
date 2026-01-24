---
name: Using the Shimmer component from AI Elements
description: How to use the Shimmer component to add loading shimmer effects to text elements.
---

# Shimmer Component

A text shimmer animation component that creates a sweeping highlight effect. Useful for indicating loading or streaming states in AI interfaces.

## Import

```tsx
import { Shimmer, type TextShimmerProps } from "@repo/elements/shimmer";
```

## Sub-components

| Component | Purpose |
|-----------|---------|
| `Shimmer` | Text element with animated shimmer effect |

## Basic Usage

```tsx
import { Shimmer } from "@repo/elements/shimmer";

const Example = () => (
  <Shimmer>Loading your response...</Shimmer>
);
```

## Props Reference

### `<Shimmer />`
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `string` | - | Text content to shimmer (required) |
| `as` | `ElementType` | `"p"` | HTML element type to render |
| `className` | `string` | - | Additional CSS classes |
| `duration` | `number` | `2` | Animation duration in seconds |
| `spread` | `number` | `2` | Shimmer width multiplier based on text length |

## Element Types

Use the `as` prop to render different HTML elements:

```tsx
// As paragraph (default)
<Shimmer as="p">Loading...</Shimmer>

// As heading
<Shimmer as="h1" className="text-4xl font-bold">
  Large Heading
</Shimmer>

// As span (inline)
<p>
  Processing <Shimmer as="span">with AI magic</Shimmer>...
</p>

// As div
<Shimmer as="div" className="text-lg font-semibold">
  Custom styled
</Shimmer>
```

## Duration Examples

```tsx
// Fast (1 second)
<Shimmer duration={1}>Loading quickly...</Shimmer>

// Default (2 seconds)
<Shimmer duration={2}>Loading at normal speed...</Shimmer>

// Slow (4 seconds)
<Shimmer duration={4}>Loading slowly...</Shimmer>
```

## Spread Examples

The `spread` prop controls how wide the shimmer effect is relative to text length:

```tsx
// Default spread
<Shimmer spread={2}>Normal shimmer width</Shimmer>

// Wider spread
<Shimmer spread={3}>Slower shimmer with wider spread</Shimmer>
```

## How It Works

The Shimmer component uses Motion (Framer Motion) to animate a gradient background that sweeps across the text. The text is clipped to show only the shimmer effect on the letters themselves.

The shimmer width is dynamically calculated based on:
- Text length
- Spread multiplier

## Examples

See `scripts/` folder for complete working examples.
