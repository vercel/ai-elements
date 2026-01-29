# Node

A composable node component for React Flow-based canvases with Card-based styling.

The `Node` component provides a composable, Card-based node for React Flow canvases. It includes support for connection handles, structured layouts, and consistent styling using shadcn/ui components.



## Installation

```bash
npx ai-elements@latest add node
```

## Features

- Built on shadcn/ui Card components for consistent styling
- Automatic handle placement (left for target, right for source)
- Composable sub-components (Header, Title, Description, Action, Content, Footer)
- Semantic structure for organizing node information
- Pre-styled sections with borders and backgrounds
- Responsive sizing with fixed small width
- Full TypeScript support with proper type definitions
- Compatible with React Flow's node system

## Props

### `<Node />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `handles` | `unknown` | - | Configuration for connection handles. Target renders on the left, source on the right. |
| `className` | `string` | - | Additional CSS classes to apply to the node. |
| `...props` | `ComponentProps<typeof Card>` | - | Any other props are spread to the underlying Card component. |

### `<NodeHeader />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | - | Additional CSS classes to apply to the header. |
| `...props` | `ComponentProps<typeof CardHeader>` | - | Any other props are spread to the underlying CardHeader component. |

### `<NodeTitle />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `...props` | `ComponentProps<typeof CardTitle>` | - | Any other props are spread to the underlying CardTitle component. |

### `<NodeDescription />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `...props` | `ComponentProps<typeof CardDescription>` | - | Any other props are spread to the underlying CardDescription component. |

### `<NodeAction />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `...props` | `ComponentProps<typeof CardAction>` | - | Any other props are spread to the underlying CardAction component. |

### `<NodeContent />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | - | Additional CSS classes to apply to the content. |
| `...props` | `ComponentProps<typeof CardContent>` | - | Any other props are spread to the underlying CardContent component. |

### `<NodeFooter />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | - | Additional CSS classes to apply to the footer. |
| `...props` | `ComponentProps<typeof CardFooter>` | - | Any other props are spread to the underlying CardFooter component. |
