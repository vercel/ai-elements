# Code Block

Provides syntax highlighting, line numbers, and copy to clipboard functionality for code blocks.

The `CodeBlock` component provides syntax highlighting, line numbers, and copy to clipboard functionality for code blocks. It's fully composable, allowing you to customize the header, actions, and content.

See `scripts/code-block.tsx` for this example.

## Installation

```bash
npx ai-elements@latest add code-block
```

## Usage

The CodeBlock is fully composable. Here's a basic example:

```tsx
import {
  CodeBlock,
  CodeBlockActions,
  CodeBlockCopyButton,
  CodeBlockFilename,
  CodeBlockHeader,
  CodeBlockTitle,
} from "@/components/ai-elements/code-block";
import { FileIcon } from "lucide-react";

export const Example = () => (
  <CodeBlock code={code} language="typescript">
    <CodeBlockHeader>
      <CodeBlockTitle>
        <FileIcon size={14} />
        <CodeBlockFilename>example.ts</CodeBlockFilename>
      </CodeBlockTitle>
      <CodeBlockActions>
        <CodeBlockCopyButton />
      </CodeBlockActions>
    </CodeBlockHeader>
  </CodeBlock>
);
```

## Features

- Syntax highlighting with Shiki
- Line numbers (optional)
- Copy to clipboard functionality
- Automatic light/dark theme switching via CSS variables
- Language selector for multi-language examples
- Fully composable architecture
- Accessible design

## Examples

### Dark Mode

To use the `CodeBlock` component in dark mode, wrap it in a `div` with the `dark` class.

See `scripts/code-block-dark.tsx` for this example.

### Language Selector

Add a language selector to switch between different code implementations:

See `scripts/code-block.tsx` for this example.

## Props

### `<CodeBlock />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `code` | `string` | - | The code content to display. |
| `language` | `BundledLanguage` | - | The programming language for syntax highlighting. |
| `showLineNumbers` | `boolean` | `false` | Whether to show line numbers. |
| `children` | `React.ReactNode` | - | Child elements like CodeBlockHeader. |
| `className` | `string` | - | Additional CSS classes. |

### `<CodeBlockHeader />`

Container for the header row. Uses flexbox with `justify-between`.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `React.ReactNode` | - | Header content (CodeBlockTitle, CodeBlockActions, etc.). |
| `className` | `string` | - | Additional CSS classes. |

### `<CodeBlockTitle />`

Left-aligned container for icon and filename. Uses flexbox with `gap-2`.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `React.ReactNode` | - | Title content (icon, CodeBlockFilename, etc.). |
| `className` | `string` | - | Additional CSS classes. |

### `<CodeBlockFilename />`

Displays the filename in monospace font.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `React.ReactNode` | - | The filename to display. |
| `className` | `string` | - | Additional CSS classes. |

### `<CodeBlockActions />`

Right-aligned container for action buttons. Uses flexbox with `gap-2`.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `React.ReactNode` | - | Action buttons (CodeBlockCopyButton, CodeBlockLanguageSelector, etc.). |
| `className` | `string` | - | Additional CSS classes. |

### `<CodeBlockCopyButton />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `onCopy` | `() => void` | - | Callback fired after a successful copy. |
| `onError` | `(error: Error) => void` | - | Callback fired if copying fails. |
| `timeout` | `number` | `2000` | How long to show the copied state (ms). |
| `children` | `React.ReactNode` | - | Custom content for the button. Defaults to copy/check icons. |
| `className` | `string` | - | Additional CSS classes. |

### `<CodeBlockLanguageSelector />`

Wrapper for the language selector. Extends shadcn/ui Select.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | - | The currently selected language. |
| `onValueChange` | `(value: string) => void` | - | Callback when the language changes. |
| `children` | `React.ReactNode` | - | Selector components (Trigger, Content, Items). |

### `<CodeBlockLanguageSelectorTrigger />`

Trigger button for the language selector dropdown. Pre-styled for code block header.

### `<CodeBlockLanguageSelectorValue />`

Displays the selected language value.

### `<CodeBlockLanguageSelectorContent />`

Dropdown content container. Defaults to `align="end"`.

### `<CodeBlockLanguageSelectorItem />`

Individual language option in the dropdown.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | - | The language value. |
| `children` | `React.ReactNode` | - | The display label. |

### `<CodeBlockContainer />`

Low-level container component with performance optimizations (`contentVisibility`). Used internally by CodeBlock.

### `<CodeBlockContent />`

Low-level component that handles syntax highlighting. Used internally by CodeBlock, but can be used directly for custom layouts.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `code` | `string` | - | The code content to display. |
| `language` | `BundledLanguage` | - | The programming language for syntax highlighting. |
| `showLineNumbers` | `boolean` | `false` | Whether to show line numbers. |
