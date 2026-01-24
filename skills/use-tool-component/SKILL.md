---
name: Using the Tool component from AI Elements
description: How to use the Tool component to display AI tool calls with input/output states.
---

# Tool Component

A component for displaying AI tool invocations with their parameters, status, and results. Supports all Vercel AI SDK tool states including streaming, approval workflows, and error handling.

## Import

```tsx
import {
  Tool,
  ToolHeader,
  ToolContent,
  ToolInput,
  ToolOutput,
  getStatusBadge,
} from "@repo/elements/tool";
```

## Sub-components

| Component | Purpose |
|-----------|---------|
| `Tool` | Root collapsible container |
| `ToolHeader` | Header with tool name, status badge, and expand toggle |
| `ToolContent` | Collapsible content area |
| `ToolInput` | Displays tool parameters as JSON |
| `ToolOutput` | Displays tool result or error |
| `getStatusBadge` | Helper to render status badge |

## Tool States

The component supports these AI SDK tool states:

| State | Badge | Description |
|-------|-------|-------------|
| `input-streaming` | Pending | Tool input is being streamed |
| `input-available` | Running | Tool is executing |
| `approval-requested` | Awaiting Approval | Waiting for user confirmation |
| `approval-responded` | Responded | User has responded to approval |
| `output-available` | Completed | Tool completed successfully |
| `output-error` | Error | Tool execution failed |
| `output-denied` | Denied | User denied tool execution |

## Basic Usage

```tsx
import type { ToolUIPart } from "ai";

const toolCall: ToolUIPart = {
  type: "tool-web_search",
  toolCallId: "123",
  state: "input-streaming",
  input: { query: "AI trends 2024" },
  output: undefined,
  errorText: undefined,
};

const Example = () => (
  <Tool>
    <ToolHeader state={toolCall.state} type={toolCall.type} />
    <ToolContent>
      <ToolInput input={toolCall.input} />
    </ToolContent>
  </Tool>
);
```

## Complete Example with Output

```tsx
const toolCall: ToolUIPart = {
  type: "tool-database_query",
  toolCallId: "456",
  state: "output-available",
  input: {
    query: "SELECT * FROM users",
    database: "analytics",
  },
  output: [
    { id: 1, name: "John", email: "john@example.com" },
    { id: 2, name: "Jane", email: "jane@example.com" },
  ],
  errorText: undefined,
};

const Example = () => (
  <Tool>
    <ToolHeader state={toolCall.state} type={toolCall.type} />
    <ToolContent>
      <ToolInput input={toolCall.input} />
      {toolCall.state === "output-available" && (
        <ToolOutput errorText={toolCall.errorText} output={toolCall.output} />
      )}
    </ToolContent>
  </Tool>
);
```

## Error State Example

```tsx
const Example = () => (
  <Tool>
    <ToolHeader state="output-error" title="database_query" type="tool-database_query" />
    <ToolContent>
      <ToolInput input={{ query: "SELECT..." }} />
      <ToolOutput
        errorText="Connection timeout: Unable to reach database server"
        output={undefined}
      />
    </ToolContent>
  </Tool>
);
```

## Props Reference

### `<Tool />`
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `defaultOpen` | `boolean` | - | Initial collapsed state |
| `className` | `string` | - | Additional CSS classes |
| `...props` | `ComponentProps<typeof Collapsible>` | - | Props passed to Collapsible |

### `<ToolHeader />`
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `type` | `ToolUIPart["type"] \| DynamicToolUIPart["type"]` | Required | Tool type identifier |
| `state` | `ToolUIPart["state"]` | Required | Current tool state |
| `title` | `string` | - | Custom title (derived from type if not provided) |
| `toolName` | `string` | - | Required for dynamic tools |
| `className` | `string` | - | Additional CSS classes |

### `<ToolInput />`
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `input` | `ToolPart["input"]` | Required | Tool input parameters |
| `className` | `string` | - | Additional CSS classes |

### `<ToolOutput />`
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `output` | `ToolPart["output"]` | - | Tool result (can be ReactNode, object, or string) |
| `errorText` | `ToolPart["errorText"]` | - | Error message if tool failed |
| `className` | `string` | - | Additional CSS classes |

## Examples

See `scripts/` folder for complete working examples.
