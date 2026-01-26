# Terminal

Display streaming console output with full ANSI color support.

The `Terminal` component displays console output with ANSI color support, streaming indicators, and auto-scroll functionality.

See `scripts/terminal.tsx` for this example.

## Installation

```bash
npx ai-elements@latest add terminal
```

## Features

- Full ANSI color support (256 colors, bold, italic, underline)
- Streaming mode with cursor animation
- Auto-scroll to latest output
- Copy output to clipboard
- Clear button support
- Dark terminal theme

## ANSI Support

The Terminal uses `ansi-to-react` to parse ANSI escape codes:

```bash
\x1b[32m✓\x1b[0m Success    # Green checkmark
\x1b[31m✗\x1b[0m Error      # Red X
\x1b[33mwarn\x1b[0m Warning   # Yellow text
\x1b[1mBold\x1b[0m           # Bold text
```

## Examples

### Basic Usage

See `scripts/terminal-basic.tsx` for this example.

### Streaming Mode

See `scripts/terminal-streaming.tsx` for this example.

### With Clear Button

See `scripts/terminal-clear.tsx` for this example.

## Props

### `<Terminal />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `output` | `string` | - | Terminal output text (supports ANSI codes). |
| `isStreaming` | `boolean` | `false` | Show streaming indicator. |
| `autoScroll` | `boolean` | `true` | Auto-scroll to bottom on new output. |
| `onClear` | `() => void` | - | Callback to clear output (enables clear button). |
| `className` | `string` | - | Additional CSS classes. |

### `<TerminalCopyButton />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `onCopy` | `() => void` | - | Callback after successful copy. |
| `onError` | `(error: Error) => void` | - | Callback if copying fails. |
| `timeout` | `number` | `2000` | Duration to show copied state (ms). |

### `<TerminalHeader />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `...props` | `React.HTMLAttributes<HTMLDivElement>` | - | Any other props are spread to the div element. |

### `<TerminalTitle />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `...props` | `React.HTMLAttributes<HTMLDivElement>` | - | Any other props are spread to the div element. |

### `<TerminalStatus />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `...props` | `React.HTMLAttributes<HTMLDivElement>` | - | Any other props are spread to the div element. |

### `<TerminalActions />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `...props` | `React.HTMLAttributes<HTMLDivElement>` | - | Any other props are spread to the div element. |

### `<TerminalClearButton />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `...props` | `React.ComponentProps<typeof Button>` | - | Any other props are spread to the Button component. |

### `<TerminalContent />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `...props` | `React.HTMLAttributes<HTMLDivElement>` | - | Any other props are spread to the div element. |
