# Shimmer

An animated text shimmer component for creating eye-catching loading states and progressive reveal effects.

The `Shimmer` component provides an animated shimmer effect that sweeps across text, perfect for indicating loading states, progressive reveals, or drawing attention to dynamic content in AI applications.

See `scripts/shimmer.tsx` for this example.

## Installation

```bash
npx ai-elements@latest add shimmer
```

## Features

- Smooth animated shimmer effect using CSS gradients and Framer Motion
- Customizable animation duration and spread
- Polymorphic component - render as any HTML element via the `as` prop
- Automatic spread calculation based on text length
- Theme-aware styling using CSS custom properties
- Infinite looping animation with linear easing
- TypeScript support with proper type definitions
- Memoized for optimal performance
- Responsive and accessible design
- Uses `text-transparent` with background-clip for crisp text rendering

## Examples

### Different Durations

See `scripts/shimmer-duration.tsx` for this example.

### Custom Elements

See `scripts/shimmer-elements.tsx` for this example.

## Props

### `<Shimmer />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `string` | - | The text content to apply the shimmer effect to. |
| `as` | `ElementType` | - | The HTML element or React component to render. |
| `className` | `string` | - | Additional CSS classes to apply to the component. |
| `duration` | `number` | `2` | The duration of the shimmer animation in seconds. |
| `spread` | `number` | `2` | The spread multiplier for the shimmer gradient, multiplied by text length. |
