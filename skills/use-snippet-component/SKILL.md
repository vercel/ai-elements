---
name: Using the Snippet component from AI Elements
description: How to use the Snippet component to display copyable code snippets with one-click copy functionality.
---

# Snippet Component

A code snippet component with a read-only input field and one-click copy button. Perfect for displaying CLI commands, API keys, or any copyable text.

## Import

```tsx
import {
  Snippet,
  SnippetAddon,
  SnippetText,
  SnippetInput,
  SnippetCopyButton,
} from "@repo/elements/snippet";
```

## Sub-components

| Component | Purpose |
|-----------|---------|
| `Snippet` | Root container with context provider |
| `SnippetAddon` | Side addon container (prefix/suffix) |
| `SnippetText` | Static text content (e.g., "$" prompt) |
| `SnippetInput` | Read-only input displaying the code |
| `SnippetCopyButton` | Copy to clipboard button |

## Basic Usage

```tsx
import {
  Snippet,
  SnippetAddon,
  SnippetCopyButton,
  SnippetInput,
} from "@repo/elements/snippet";

const Example = () => (
  <Snippet code="git clone https://github.com/user/repo">
    <SnippetInput />
    <SnippetAddon align="inline-end">
      <SnippetCopyButton />
    </SnippetAddon>
  </Snippet>
);
```

## With Command Prompt

```tsx
import {
  Snippet,
  SnippetAddon,
  SnippetCopyButton,
  SnippetInput,
  SnippetText,
} from "@repo/elements/snippet";

const Example = () => (
  <Snippet code="npx ai-elements add snippet">
    <SnippetAddon className="pl-1">
      <SnippetText>$</SnippetText>
    </SnippetAddon>
    <SnippetInput />
    <SnippetAddon align="inline-end" className="pr-2">
      <SnippetCopyButton />
    </SnippetAddon>
  </Snippet>
);
```

## Props Reference

### `<Snippet />`
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `code` | `string` | - | The code to display and copy (required) |
| `className` | `string` | - | Additional CSS classes |

### `<SnippetAddon />`
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `align` | `"inline-start" \| "inline-end" \| "block-start" \| "block-end"` | - | Position of the addon |
| `className` | `string` | - | Additional CSS classes |

### `<SnippetText />`
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | - | Additional CSS classes |

### `<SnippetInput />`
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | - | Additional CSS classes |

Note: `SnippetInput` is always read-only and displays the `code` from the parent `Snippet`.

### `<SnippetCopyButton />`
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `onCopy` | `() => void` | - | Callback after successful copy |
| `onError` | `(error: Error) => void` | - | Callback on copy error |
| `timeout` | `number` | `2000` | Duration to show checkmark after copy (ms) |
| `className` | `string` | - | Additional CSS classes |

## Copy Behavior

The `SnippetCopyButton` component:
1. Copies the code to clipboard on click
2. Shows a checkmark icon for the specified timeout
3. Returns to the copy icon after timeout
4. Calls `onCopy` callback on success
5. Calls `onError` callback if clipboard API fails

## Styling

The Snippet uses `font-mono` for monospace text styling. The component is built on the InputGroup primitives for consistent form-like styling.

## Examples

See `scripts/` folder for complete working examples.
