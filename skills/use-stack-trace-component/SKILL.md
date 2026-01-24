---
name: Using the StackTrace component from AI Elements
description: How to use the StackTrace component to display formatted error stack traces.
---

# StackTrace Component

A composable component for displaying and interacting with JavaScript stack traces. Parses stack trace strings and renders them with syntax highlighting, copy functionality, and clickable file paths.

## Import

```tsx
import {
  StackTrace,
  StackTraceHeader,
  StackTraceError,
  StackTraceErrorType,
  StackTraceErrorMessage,
  StackTraceActions,
  StackTraceCopyButton,
  StackTraceExpandButton,
  StackTraceContent,
  StackTraceFrames,
} from "@repo/elements/stack-trace";
```

## Sub-components

| Component | Purpose |
|-----------|---------|
| `StackTrace` | Root container that parses and provides stack trace context |
| `StackTraceHeader` | Clickable header section with collapsible trigger |
| `StackTraceError` | Container for error type and message |
| `StackTraceErrorType` | Displays the error type (e.g., "TypeError") |
| `StackTraceErrorMessage` | Displays the error message |
| `StackTraceActions` | Container for action buttons |
| `StackTraceCopyButton` | Button to copy the full stack trace |
| `StackTraceExpandButton` | Chevron icon showing expand/collapse state |
| `StackTraceContent` | Collapsible content area for stack frames |
| `StackTraceFrames` | Renders the parsed stack frames |

## Basic Usage

```tsx
const sampleStackTrace = `TypeError: Cannot read properties of undefined (reading 'map')
    at UserList (/app/components/UserList.tsx:15:23)
    at renderWithHooks (node_modules/react-dom/cjs/react-dom.development.js:14985:18)
    at beginWork (node_modules/react-dom/cjs/react-dom.development.js:19049:16)`;

const Example = () => (
  <StackTrace
    defaultOpen
    onFilePathClick={(path, line, col) => console.log(`Open: ${path}:${line}:${col}`)}
    trace={sampleStackTrace}
  >
    <StackTraceHeader>
      <StackTraceError>
        <StackTraceErrorType />
        <StackTraceErrorMessage />
      </StackTraceError>
      <StackTraceActions>
        <StackTraceCopyButton />
        <StackTraceExpandButton />
      </StackTraceActions>
    </StackTraceHeader>
    <StackTraceContent>
      <StackTraceFrames />
    </StackTraceContent>
  </StackTrace>
);
```

## Props Reference

### `<StackTrace />`
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `trace` | `string` | Required | The stack trace string to parse |
| `open` | `boolean` | - | Controlled open state |
| `defaultOpen` | `boolean` | `false` | Initial open state |
| `onOpenChange` | `(open: boolean) => void` | - | Callback when open state changes |
| `onFilePathClick` | `(filePath: string, line?: number, column?: number) => void` | - | Callback when a file path is clicked |
| `className` | `string` | - | Additional CSS classes |

### `<StackTraceFrames />`
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `showInternalFrames` | `boolean` | `true` | Whether to show node_modules/internal frames |
| `className` | `string` | - | Additional CSS classes |

### `<StackTraceCopyButton />`
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `onCopy` | `() => void` | - | Callback after successful copy |
| `onError` | `(error: Error) => void` | - | Callback on copy error |
| `timeout` | `number` | `2000` | Duration to show "copied" state (ms) |

### `<StackTraceContent />`
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `maxHeight` | `number` | `400` | Maximum height in pixels |
| `className` | `string` | - | Additional CSS classes |

## Examples

See `scripts/` folder for complete working examples.
