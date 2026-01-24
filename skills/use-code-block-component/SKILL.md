---
name: Using the CodeBlock component from AI Elements
description: How to use the CodeBlock component to display syntax-highlighted code with copy and language selection.
---

# CodeBlock Component

The CodeBlock component displays syntax-highlighted code using Shiki with support for light/dark themes, line numbers, copy functionality, and language selection. It includes intelligent caching for optimal performance.

## Import

```tsx
import {
  CodeBlock,
  CodeBlockContainer,
  CodeBlockHeader,
  CodeBlockTitle,
  CodeBlockFilename,
  CodeBlockActions,
  CodeBlockCopyButton,
  CodeBlockContent,
  CodeBlockLanguageSelector,
  CodeBlockLanguageSelectorTrigger,
  CodeBlockLanguageSelectorValue,
  CodeBlockLanguageSelectorContent,
  CodeBlockLanguageSelectorItem,
  highlightCode,
} from "@repo/elements/code-block";
```

## Sub-components

| Component | Purpose |
|-----------|---------|
| `CodeBlock` | Root component with context provider |
| `CodeBlockContainer` | Styled container with border |
| `CodeBlockHeader` | Top bar for filename and actions |
| `CodeBlockTitle` | Container for icon and filename |
| `CodeBlockFilename` | Monospace filename display |
| `CodeBlockActions` | Container for action buttons |
| `CodeBlockCopyButton` | Copy to clipboard button |
| `CodeBlockContent` | Syntax-highlighted code content |
| `CodeBlockLanguageSelector` | Language dropdown selector |
| `CodeBlockLanguageSelectorTrigger` | Dropdown trigger |
| `CodeBlockLanguageSelectorValue` | Selected language display |
| `CodeBlockLanguageSelectorContent` | Dropdown content |
| `CodeBlockLanguageSelectorItem` | Individual language option |

## Basic Usage

```tsx
const code = `function greet(name: string) {
  return \`Hello, \${name}!\`;
}`;

const Example = () => (
  <CodeBlock code={code} language="typescript" showLineNumbers>
    <CodeBlockHeader>
      <CodeBlockTitle>
        <FileIcon size={14} />
        <CodeBlockFilename>greet.ts</CodeBlockFilename>
      </CodeBlockTitle>
      <CodeBlockActions>
        <CodeBlockCopyButton />
      </CodeBlockActions>
    </CodeBlockHeader>
  </CodeBlock>
);
```

## With Language Selector

```tsx
const [language, setLanguage] = useState("typescript");

const Example = () => (
  <CodeBlock code={code} language={language}>
    <CodeBlockHeader>
      <CodeBlockTitle>
        <CodeBlockFilename>{filename}</CodeBlockFilename>
      </CodeBlockTitle>
      <CodeBlockActions>
        <CodeBlockLanguageSelector value={language} onValueChange={setLanguage}>
          <CodeBlockLanguageSelectorTrigger>
            <CodeBlockLanguageSelectorValue />
          </CodeBlockLanguageSelectorTrigger>
          <CodeBlockLanguageSelectorContent>
            <CodeBlockLanguageSelectorItem value="typescript">TypeScript</CodeBlockLanguageSelectorItem>
            <CodeBlockLanguageSelectorItem value="python">Python</CodeBlockLanguageSelectorItem>
            <CodeBlockLanguageSelectorItem value="rust">Rust</CodeBlockLanguageSelectorItem>
          </CodeBlockLanguageSelectorContent>
        </CodeBlockLanguageSelector>
        <CodeBlockCopyButton />
      </CodeBlockActions>
    </CodeBlockHeader>
  </CodeBlock>
);
```

## Props Reference

### `<CodeBlock />`
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `code` | `string` | Required | The code to display |
| `language` | `BundledLanguage` | Required | Programming language for syntax highlighting |
| `showLineNumbers` | `boolean` | `false` | Show line numbers |
| `className` | `string` | - | Additional CSS classes |
| `children` | `ReactNode` | - | Header and other components |

### `<CodeBlockContainer />`
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `language` | `string` | Required | Language for data attribute |
| `className` | `string` | - | Additional CSS classes |
| `style` | `CSSProperties` | - | Custom styles |

### `<CodeBlockHeader />`
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | - | Additional CSS classes |
| `children` | `ReactNode` | Required | Title and actions |

### `<CodeBlockTitle />`
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | - | Additional CSS classes |
| `children` | `ReactNode` | Required | Icon and filename |

### `<CodeBlockFilename />`
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | - | Additional CSS classes |
| `children` | `ReactNode` | Required | Filename text |

### `<CodeBlockActions />`
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | - | Additional CSS classes |
| `children` | `ReactNode` | Required | Action buttons |

### `<CodeBlockCopyButton />`
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `onCopy` | `() => void` | - | Callback on successful copy |
| `onError` | `(error: Error) => void` | - | Callback on copy error |
| `timeout` | `number` | `2000` | Reset copied state after ms |
| `className` | `string` | - | Additional CSS classes |

### `<CodeBlockContent />`
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `code` | `string` | Required | Code to highlight |
| `language` | `BundledLanguage` | Required | Language for highlighting |
| `showLineNumbers` | `boolean` | `false` | Display line numbers |

### `<CodeBlockLanguageSelector />`
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | - | Selected language value |
| `onValueChange` | `(value: string) => void` | - | Selection change handler |
| `...props` | `ComponentProps<typeof Select>` | - | Select props |

## Utility Functions

### `highlightCode(code, language, callback?)`
Synchronously returns cached tokens or `null`, and optionally calls callback when highlighting completes asynchronously.

## Examples

See `scripts/` folder for complete working examples.
