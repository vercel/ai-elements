# Panel

A styled panel component for React Flow-based canvases to position custom UI elements.

The `Panel` component provides a positioned container for custom UI elements on React Flow canvases. It includes modern card styling with backdrop blur and flexible positioning options.



## Installation

```bash
npx ai-elements@latest add panel
```

## Features

- Flexible positioning (top-left, top-right, bottom-left, bottom-right, top-center, bottom-center)
- Rounded pill design with backdrop blur
- Theme-aware card background
- Flexbox layout for easy content alignment
- Subtle drop shadow for depth
- Full TypeScript support
- Compatible with React Flow's panel system

## Props

### `<Panel />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `position` | `unknown` | - | Position of the panel on the canvas. |
| `className` | `string` | - | Additional CSS classes to apply to the panel. |
| `...props` | `ComponentProps<typeof Panel>` | - | Any other props from @xyflow/react Panel component. |
