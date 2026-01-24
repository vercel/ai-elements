---
name: Using the Loader component from AI Elements
description: How to use the Loader component to display a spinning loading indicator.
---

# Loader Component

A Vercel-style animated loader with configurable size. Uses an SVG spinner with varying opacity segments for a smooth loading animation.

## Import

```tsx
import { Loader } from "@repo/elements/loader";
```

## Sub-components

| Component | Purpose |
|-----------|---------|
| `Loader` | Spinning SVG loader with configurable size |

## Basic Usage

```tsx
import { Loader } from "@repo/elements/loader";

const LoadingState = () => (
  <div className="flex items-center justify-center">
    <Loader />
  </div>
);
```

## Props Reference

### `<Loader />`
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `number` | `16` | Size in pixels (width and height) |
| `className` | `string` | - | Additional CSS classes |
| `...props` | `HTMLAttributes<HTMLDivElement>` | - | All div props supported |

## Styling

The loader uses `currentColor` for the stroke, so you can change its color using text color utilities:

```tsx
<Loader className="text-blue-500" size={24} />
<Loader className="text-red-500" size={32} />
```

Custom animation speed:

```tsx
<Loader
  className="animate-spin text-blue-500"
  size={24}
  style={{ animationDuration: "0.5s" }}
/>
```

## Size Examples

```tsx
// Small (default)
<Loader size={16} />

// Medium
<Loader size={24} />

// Large
<Loader size={32} />

// Extra Large
<Loader size={48} />
```

## Examples

See `scripts/` folder for complete working examples.
