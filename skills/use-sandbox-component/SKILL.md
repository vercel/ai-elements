---
name: Using the Sandbox component from AI Elements
description: How to use the Sandbox component to display code execution environments with tabs for code and output.
---

# Sandbox Component

A collapsible code sandbox component with tabs for displaying code and execution output. Integrates with tool state for showing execution status.

## Import

```tsx
import {
  Sandbox,
  SandboxHeader,
  SandboxContent,
  SandboxTabs,
  SandboxTabsBar,
  SandboxTabsList,
  SandboxTabsTrigger,
  SandboxTabContent,
} from "@repo/elements/sandbox";
```

## Sub-components

| Component | Purpose |
|-----------|---------|
| `Sandbox` | Root collapsible container |
| `SandboxHeader` | Header with title and status badge |
| `SandboxContent` | Collapsible content area |
| `SandboxTabs` | Tabs container |
| `SandboxTabsBar` | Tab bar with border styling |
| `SandboxTabsList` | Tab list container |
| `SandboxTabsTrigger` | Individual tab trigger |
| `SandboxTabContent` | Tab panel content |

## Basic Usage

```tsx
import {
  Sandbox,
  SandboxContent,
  SandboxHeader,
  SandboxTabContent,
  SandboxTabs,
  SandboxTabsBar,
  SandboxTabsList,
  SandboxTabsTrigger,
} from "@repo/elements/sandbox";
import { CodeBlock } from "@repo/elements/code-block";

const Example = () => (
  <Sandbox>
    <SandboxHeader state="output-available" title="script.py" />
    <SandboxContent>
      <SandboxTabs defaultValue="code">
        <SandboxTabsBar>
          <SandboxTabsList>
            <SandboxTabsTrigger value="code">Code</SandboxTabsTrigger>
            <SandboxTabsTrigger value="output">Output</SandboxTabsTrigger>
          </SandboxTabsList>
        </SandboxTabsBar>
        <SandboxTabContent value="code">
          <CodeBlock code="print('Hello')" language="python" />
        </SandboxTabContent>
        <SandboxTabContent value="output">
          <CodeBlock code="Hello" language="log" />
        </SandboxTabContent>
      </SandboxTabs>
    </SandboxContent>
  </Sandbox>
);
```

## Props Reference

### `<Sandbox />`
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `defaultOpen` | `boolean` | `true` | Initial collapsed state |
| `className` | `string` | - | Additional CSS classes |

### `<SandboxHeader />`
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | - | File name or title |
| `state` | `ToolUIPart["state"]` | - | Tool execution state (required) |
| `className` | `string` | - | Additional CSS classes |

### `<SandboxTabs />`
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `defaultValue` | `string` | - | Initially active tab |

### `<SandboxTabsTrigger />`
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | - | Tab value (required) |

### `<SandboxTabContent />`
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | - | Tab value (required) |

## Tool States

The `state` prop on `SandboxHeader` accepts:
- `"input-streaming"` - Code is being generated
- `"input-available"` - Code is ready to execute
- `"output-available"` - Execution completed successfully
- `"output-error"` - Execution failed with error

## Examples

See `scripts/` folder for complete working examples.
