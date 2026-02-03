# Queue

A comprehensive queue component system for displaying message lists, todos, and collapsible task sections in AI applications.

The `Queue` component provides a flexible system for displaying lists of messages, todos, attachments, and collapsible sections. Perfect for showing AI workflow progress, pending tasks, message history, or any structured list of items in your application.

See `scripts/queue.tsx` for this example.

## Installation

```bash
npx ai-elements@latest add queue
```

## Features

- Flexible component system with composable parts
- Collapsible sections with smooth animations
- Support for completed/pending state indicators
- Built-in scroll area for long lists
- Attachment display with images and file indicators
- Hover-revealed action buttons for queue items
- TypeScript support with comprehensive type definitions
- Customizable styling with Tailwind CSS
- Responsive design with mobile-friendly interactions
- Keyboard navigation and accessibility support
- Theme-aware with automatic dark mode support

## Examples

### With PromptInput

See `scripts/queue-prompt-input.tsx` for this example.

## Props

### `<Queue />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `...props` | `React.ComponentProps<` | - | Any other props are spread to the root div. |

### `<QueueSection />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `defaultOpen` | `boolean` | `true` | Whether the section is open by default. |
| `...props` | `React.ComponentProps<typeof Collapsible>` | - | Any other props are spread to the Collapsible component. |

### `<QueueSectionTrigger />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `...props` | `React.ComponentProps<` | - | Any other props are spread to the button element. |

### `<QueueSectionLabel />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | - | The label text to display. |
| `count` | `number` | - | The count to display before the label. |
| `icon` | `React.ReactNode` | - | An optional icon to display before the count. |
| `...props` | `React.ComponentProps<` | - | Any other props are spread to the span element. |

### `<QueueSectionContent />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `...props` | `React.ComponentProps<typeof CollapsibleContent>` | - | Any other props are spread to the CollapsibleContent component. |

### `<QueueList />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `...props` | `React.ComponentProps<typeof ScrollArea>` | - | Any other props are spread to the ScrollArea component. |

### `<QueueItem />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `...props` | `React.ComponentProps<` | - | Any other props are spread to the li element. |

### `<QueueItemIndicator />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `completed` | `boolean` | `false` | Whether the item is completed. Affects the indicator styling. |
| `...props` | `React.ComponentProps<` | - | Any other props are spread to the span element. |

### `<QueueItemContent />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `completed` | `boolean` | `false` | Whether the item is completed. Affects text styling with strikethrough and opacity. |
| `...props` | `React.ComponentProps<` | - | Any other props are spread to the span element. |

### `<QueueItemDescription />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `completed` | `boolean` | `false` | Whether the item is completed. Affects text styling. |
| `...props` | `React.ComponentProps<` | - | Any other props are spread to the div element. |

### `<QueueItemActions />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `...props` | `React.ComponentProps<` | - | Any other props are spread to the div element. |

### `<QueueItemAction />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `...props` | `Omit<React.ComponentProps<typeof Button>, ` | - | Any other props (except variant and size) are spread to the Button component. |

### `<QueueItemAttachment />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `...props` | `React.ComponentProps<` | - | Any other props are spread to the div element. |

### `<QueueItemImage />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `...props` | `React.ComponentProps<` | - | Any other props are spread to the img element. |

### `<QueueItemFile />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `...props` | `React.ComponentProps<` | - | Any other props are spread to the span element. |

## Type Exports

### `QueueMessagePart`

Interface for message parts within queue messages.

```tsx
interface QueueMessagePart {
  type: string;
  text?: string;
  url?: string;
  filename?: string;
  mediaType?: string;
}
```

### `QueueMessage`

Interface for queue message items.

```tsx
interface QueueMessage {
  id: string;
  parts: QueueMessagePart[];
}
```

### `QueueTodo`

Interface for todo items in the queue.

```tsx
interface QueueTodo {
  id: string;
  title: string;
  description?: string;
  status?: "pending" | "completed";
}
```
