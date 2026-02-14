# Chain of Thought

A collapsible component that visualizes AI reasoning steps with support for search results, images, and step-by-step progress indicators.

The `ChainOfThought` component provides a visual representation of an AI's reasoning process, showing step-by-step thinking with support for search results, images, and progress indicators. It helps users understand how AI arrives at conclusions.

See `scripts/chain-of-thought.tsx` for this example.

## Installation

```bash
npx ai-elements@latest add chain-of-thought
```

## Features

- Collapsible interface with smooth animations powered by Radix UI
- Step-by-step visualization of AI reasoning process
- Support for different step statuses (complete, active, pending)
- Built-in search results display with badge styling
- Image support with captions for visual content
- Custom icons for different step types
- Context-aware components using React Context API
- Fully typed with TypeScript
- Accessible with keyboard navigation support
- Responsive design that adapts to different screen sizes
- Smooth fade and slide animations for content transitions
- Composable architecture for flexible customization

## Props

### `<ChainOfThought />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `open` | `boolean` | - | Controlled open state of the collapsible. |
| `defaultOpen` | `boolean` | `false` | Default open state when uncontrolled. |
| `onOpenChange` | `(open: boolean) => void` | - | Callback when the open state changes. |
| `...props` | `React.ComponentProps<` | - | Any other props are spread to the root div element. |

### `<ChainOfThoughtHeader />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `React.ReactNode` | - | Custom header text. |
| `...props` | `React.ComponentProps<typeof CollapsibleTrigger>` | - | Any other props are spread to the CollapsibleTrigger component. |

### `<ChainOfThoughtStep />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `icon` | `LucideIcon` | `DotIcon` | Icon to display for the step. |
| `label` | `string` | - | The main text label for the step. |
| `description` | `string` | - | Optional description text shown below the label. |
| `status` | `unknown` | - | Visual status of the step. |
| `...props` | `React.ComponentProps<` | - | Any other props are spread to the root div element. |

### `<ChainOfThoughtSearchResults />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `...props` | `React.ComponentProps<` | - | Any props are spread to the container div element. |

### `<ChainOfThoughtSearchResult />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `...props` | `React.ComponentProps<typeof Badge>` | - | Any props are spread to the Badge component. |

### `<ChainOfThoughtContent />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `...props` | `React.ComponentProps<typeof CollapsibleContent>` | - | Any props are spread to the CollapsibleContent component. |

### `<ChainOfThoughtImage />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `caption` | `string` | - | Optional caption text displayed below the image. |
| `...props` | `React.ComponentProps<` | - | Any other props are spread to the container div element. |
