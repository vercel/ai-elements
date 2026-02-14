# Sandbox

A collapsible container for displaying AI-generated code and output in chat interfaces.

The `Sandbox` component provides a structured way to display AI-generated code alongside its execution output in chat conversations. It features a collapsible container with status indicators and tabbed navigation between code and output views. It's designed to be used with `CodeBlock` for displaying code and `StackTrace` for displaying errors.

See `scripts/sandbox.tsx` for this example.

## Installation

```bash
npx ai-elements@latest add sandbox
```

## Features

- Collapsible container with smooth animations
- Status badges showing execution state (Pending, Running, Completed, Error)
- Tabs for Code and Output views
- Syntax-highlighted code display
- Copy button for easy code sharing
- Works with AI SDK tool state patterns

## Usage with AI SDK

The Sandbox component integrates with the AI SDK's tool state to show code generation progress:

```tsx title="components/code-sandbox.tsx"
"use client";

import type { ToolUIPart } from "ai";
import {
  Sandbox,
  SandboxContent,
  SandboxHeader,
  SandboxTabContent,
  SandboxTabs,
  SandboxTabsBar,
  SandboxTabsList,
  SandboxTabsTrigger,
} from "@/components/ai-elements/sandbox";
import { CodeBlock } from "@/components/ai-elements/code-block";

type CodeSandboxProps = {
  toolPart: ToolUIPart;
};

export const CodeSandbox = ({ toolPart }: CodeSandboxProps) => {
  const code = toolPart.input?.code ?? "";
  const output = toolPart.output?.logs ?? "";

  return (
    <Sandbox>
      <SandboxHeader
        state={toolPart.state}
        title={toolPart.input?.filename ?? "code.tsx"}
      />
      <SandboxContent>
        <SandboxTabs defaultValue="code">
          <SandboxTabsBar>
            <SandboxTabsList>
              <SandboxTabsTrigger value="code">Code</SandboxTabsTrigger>
              <SandboxTabsTrigger value="output">Output</SandboxTabsTrigger>
            </SandboxTabsList>
          </SandboxTabsBar>
          <SandboxTabContent value="code">
            <CodeBlock code={code} language="tsx" />
          </SandboxTabContent>
          <SandboxTabContent value="output">
            <CodeBlock code={output} language="log" />
          </SandboxTabContent>
        </SandboxTabs>
      </SandboxContent>
    </Sandbox>
  );
};
```

## Props

### `<Sandbox />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `...props` | `React.ComponentProps<typeof Collapsible>` | - | Any other props are spread to the underlying Collapsible component. |

### `<SandboxHeader />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | `undefined` | The title displayed in the header (e.g., filename). |
| `state` | `ToolUIPart[` | Required | The current execution state, used to display the appropriate status badge. |
| `className` | `string` | - | Additional CSS classes for the header. |

### `<SandboxContent />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `...props` | `React.ComponentProps<typeof CollapsibleContent>` | - | Any other props are spread to the CollapsibleContent. |

### `<SandboxTabs />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `...props` | `React.ComponentProps<typeof Tabs>` | - | Any other props are spread to the underlying Tabs component. |

### `<SandboxTabsBar />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `...props` | `React.HTMLAttributes<HTMLDivElement>` | - | Any other props are spread to the container div. |

### `<SandboxTabsList />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `...props` | `React.ComponentProps<typeof TabsList>` | - | Any other props are spread to the underlying TabsList component. |

### `<SandboxTabsTrigger />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `...props` | `React.ComponentProps<typeof TabsTrigger>` | - | Any other props are spread to the underlying TabsTrigger component. |

### `<SandboxTabContent />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `...props` | `React.ComponentProps<typeof TabsContent>` | - | Any other props are spread to the underlying TabsContent component. |
