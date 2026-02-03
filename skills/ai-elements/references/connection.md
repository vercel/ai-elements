# Connection

A custom connection line component for React Flow-based canvases with animated bezier curve styling.

The `Connection` component provides a styled connection line for React Flow canvases. It renders an animated bezier curve with a circle indicator at the target end, using consistent theming through CSS variables.



## Installation

```bash
npx ai-elements@latest add connection
```

## Features

- Smooth bezier curve animation for connection lines
- Visual indicator circle at the target position
- Theme-aware styling using CSS variables
- Cubic bezier curve calculation for natural flow
- Lightweight implementation with minimal props
- Full TypeScript support with React Flow types
- Compatible with React Flow's connection system

## Props

### `<Connection />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `fromX` | `number` | - | The x-coordinate of the connection start point. |
| `fromY` | `number` | - | The y-coordinate of the connection start point. |
| `toX` | `number` | - | The x-coordinate of the connection end point. |
| `toY` | `number` | - | The y-coordinate of the connection end point. |
