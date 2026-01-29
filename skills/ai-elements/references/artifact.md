# Artifact

A container component for displaying generated content like code, documents, or other outputs with built-in actions.

The `Artifact` component provides a structured container for displaying generated content like code, documents, or other outputs with built-in header actions.

See `scripts/artifact.tsx` for this example.

## Installation

```bash
npx ai-elements@latest add artifact
```

## Features

- Structured container with header and content areas
- Built-in header with title and description support
- Flexible action buttons with tooltips
- Customizable styling for all subcomponents
- Support for close buttons and action groups
- Clean, modern design with border and shadow
- Responsive layout that adapts to content
- TypeScript support with proper type definitions
- Composable architecture for maximum flexibility

## Examples

### With Code Display

See `scripts/artifact.tsx` for this example.

## Props

### `<Artifact />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `...props` | `React.HTMLAttributes<HTMLDivElement>` | - | Any other props are spread to the underlying div element. |

### `<ArtifactHeader />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `...props` | `React.HTMLAttributes<HTMLDivElement>` | - | Any other props are spread to the underlying div element. |

### `<ArtifactTitle />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `...props` | `React.HTMLAttributes<HTMLParagraphElement>` | - | Any other props are spread to the underlying paragraph element. |

### `<ArtifactDescription />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `...props` | `React.HTMLAttributes<HTMLParagraphElement>` | - | Any other props are spread to the underlying paragraph element. |

### `<ArtifactActions />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `...props` | `React.HTMLAttributes<HTMLDivElement>` | - | Any other props are spread to the underlying div element. |

### `<ArtifactAction />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `tooltip` | `string` | - | Tooltip text to display on hover. |
| `label` | `string` | - | Screen reader label for the action button. |
| `icon` | `LucideIcon` | - | Lucide icon component to display in the button. |
| `...props` | `React.ComponentProps<typeof Button>` | - | Any other props are spread to the underlying shadcn/ui Button component. |

### `<ArtifactClose />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `...props` | `React.ComponentProps<typeof Button>` | - | Any other props are spread to the underlying shadcn/ui Button component. |

### `<ArtifactContent />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `...props` | `React.HTMLAttributes<HTMLDivElement>` | - | Any other props are spread to the underlying div element. |
