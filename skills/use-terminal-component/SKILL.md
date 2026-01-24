---
name: Using the Terminal component from AI Elements
description: How to use the Terminal component to display command output with ANSI color support.
---

# Terminal Component

A terminal emulator component that renders command output with ANSI color code support, streaming animations, and clipboard functionality.

## Import

```tsx
import {
  Terminal,
  TerminalHeader,
  TerminalTitle,
  TerminalStatus,
  TerminalActions,
  TerminalCopyButton,
  TerminalClearButton,
  TerminalContent,
} from "@repo/elements/terminal";
```

## Sub-components

| Component | Purpose |
|-----------|---------|
| `Terminal` | Root container providing output context |
| `TerminalHeader` | Header bar with title and actions |
| `TerminalTitle` | Terminal icon and title text |
| `TerminalStatus` | Streaming status indicator (shimmer) |
| `TerminalActions` | Container for action buttons |
| `TerminalCopyButton` | Copy output to clipboard |
| `TerminalClearButton` | Clear terminal output |
| `TerminalContent` | Scrollable output area with ANSI rendering |

## Basic Usage

```tsx
const Example = () => (
  <Terminal output="npm install complete" />
);
```

## Streaming Example

```tsx
const Example = () => {
  const [output, setOutput] = useState("");
  const [isStreaming, setIsStreaming] = useState(true);

  useEffect(() => {
    const lines = ["Installing...", "Done!"];
    let index = 0;
    const interval = setInterval(() => {
      if (index < lines.length) {
        setOutput((prev) => prev + (prev ? "\n" : "") + lines[index]);
        index++;
      } else {
        setIsStreaming(false);
        clearInterval(interval);
      }
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return <Terminal autoScroll isStreaming={isStreaming} output={output} />;
};
```

## Full Composable Example

```tsx
const Example = () => {
  const [output, setOutput] = useState(ansiOutput);

  return (
    <Terminal
      autoScroll={true}
      isStreaming={isStreaming}
      onClear={() => setOutput("")}
      output={output}
    >
      <TerminalHeader>
        <TerminalTitle>Build Output</TerminalTitle>
        <div className="flex items-center gap-1">
          <TerminalStatus />
          <TerminalActions>
            <TerminalCopyButton onCopy={() => console.log("Copied!")} />
            <TerminalClearButton />
          </TerminalActions>
        </div>
      </TerminalHeader>
      <TerminalContent />
    </Terminal>
  );
};
```

## Props Reference

### `<Terminal />`
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `output` | `string` | Required | Terminal output text (supports ANSI codes) |
| `isStreaming` | `boolean` | `false` | Show streaming cursor animation |
| `autoScroll` | `boolean` | `true` | Auto-scroll to bottom on new output |
| `onClear` | `() => void` | - | Callback to clear output (enables clear button) |
| `className` | `string` | - | Additional CSS classes |
| `children` | `ReactNode` | - | Custom layout (overrides default) |

### `<TerminalCopyButton />`
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `onCopy` | `() => void` | - | Callback after successful copy |
| `onError` | `(error: Error) => void` | - | Callback on copy error |
| `timeout` | `number` | `2000` | Duration to show "copied" state (ms) |
| `children` | `ReactNode` | - | Custom button content |

### `<TerminalTitle />`
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | `"Terminal"` | Title text |
| `className` | `string` | - | Additional CSS classes |

## ANSI Color Support

The terminal supports ANSI escape codes for colored output:

```tsx
const output = `\x1b[32m✓\x1b[0m Compiled successfully
\x1b[33mwarn\x1b[0m - Using experimental features
\x1b[31mError:\x1b[0m Something went wrong`;
```

## Examples

See `scripts/` folder for complete working examples.
