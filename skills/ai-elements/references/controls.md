# Controls

A styled controls component for React Flow-based canvases with zoom and fit view functionality.

The `Controls` component provides interactive zoom and fit view controls for React Flow canvases. It includes a modern, themed design with backdrop blur and card styling.



## Installation

```bash
npx ai-elements@latest add controls
```

## Features

- Zoom in/out controls
- Fit view button to center and scale content
- Rounded pill design with backdrop blur
- Theme-aware card background
- Subtle drop shadow for depth
- Full TypeScript support
- Compatible with all React Flow control features

## Props

### `<Controls />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | - | Additional CSS classes to apply to the controls. |
| `...props` | `ComponentProps<typeof Controls>` | - | Any other props from @xyflow/react Controls component (showZoom, showFitView, showInteractive, position, etc.). |
