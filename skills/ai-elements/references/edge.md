# Edge

Customizable edge components for React Flow canvases with animated and temporary states.

The `Edge` component provides two pre-styled edge types for React Flow canvases: `Temporary` for dashed temporary connections and `Animated` for connections with animated indicators.



## Installation

```bash
npx ai-elements@latest add edge
```

## Features

- Two distinct edge types: Temporary and Animated
- Temporary edges use dashed lines with ring color
- Animated edges include a moving circle indicator
- Automatic handle position calculation
- Smart offset calculation based on handle type and position
- Uses Bezier curves for smooth, natural-looking connections
- Fully compatible with React Flow's edge system
- Type-safe implementation with TypeScript

## Edge Types

### `Edge.Temporary`

A dashed edge style for temporary or preview connections. Uses a simple Bezier path with a dashed stroke pattern.

### `Edge.Animated`

A solid edge with an animated circle that moves along the path. The animation repeats indefinitely with a 2-second duration, providing visual feedback for active connections.

## Props

Both edge types accept standard React Flow `EdgeProps`:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `id` | `string` | - | Unique identifier for the edge. |
| `source` | `string` | - | ID of the source node. |
| `target` | `string` | - | ID of the target node. |
| `sourceX` | `number` | - | X coordinate of the source handle (Temporary only). |
| `sourceY` | `number` | - | Y coordinate of the source handle (Temporary only). |
| `targetX` | `number` | - | X coordinate of the target handle (Temporary only). |
| `targetY` | `number` | - | Y coordinate of the target handle (Temporary only). |
| `sourcePosition` | `Position` | - | Position of the source handle (Left, Right, Top, Bottom). |
| `targetPosition` | `Position` | - | Position of the target handle (Left, Right, Top, Bottom). |
| `markerEnd` | `string` | - | SVG marker ID for the edge end (Animated only). |
| `style` | `React.CSSProperties` | - | Custom styles for the edge (Animated only). |
