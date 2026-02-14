# Snippet

Lightweight inline code display for terminal commands and short code references.

The `Snippet` component provides a lightweight way to display terminal commands and short code snippets with copy functionality. Built on top of InputGroup, it's designed for brief code references in text.

See `scripts/snippet.tsx` for this example.

## Installation

```bash
npx ai-elements@latest add snippet
```

## Features

- Composable architecture with InputGroup
- Optional prefix text (e.g., `$` for terminal commands)
- Built-in copy button
- Compact design for chat/markdown

## Examples

### Without Prefix

See `scripts/snippet-plain.tsx` for this example.

## Props

### `<Snippet />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `code` | `string` | Required | The code content to display. |
| `children` | `React.ReactNode` | - | Child elements like SnippetAddon, SnippetInput, etc. |
| `...props` | `React.ComponentProps<typeof InputGroup>` | - | Spread to the InputGroup component. |

### `<SnippetAddon />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `...props` | `React.ComponentProps<typeof InputGroupAddon>` | - | Spread to the InputGroupAddon component. |

### `<SnippetText />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `...props` | `React.ComponentProps<typeof InputGroupText>` | - | Spread to the InputGroupText component. |

### `<SnippetInput />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `...props` | `Omit<React.ComponentProps<typeof InputGroupInput>, ` | - | Spread to the InputGroupInput component. Value and readOnly are set automatically. |

### `<SnippetCopyButton />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `onCopy` | `() => void` | - | Callback fired after a successful copy. |
| `onError` | `(error: Error) => void` | - | Callback fired if copying fails. |
| `timeout` | `number` | `2000` | How long to show the copied state (ms). |
| `children` | `React.ReactNode` | - | Custom button content. |
| `...props` | `React.ComponentProps<typeof InputGroupButton>` | - | Spread to the InputGroupButton component. |
