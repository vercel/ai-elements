# Stack Trace

Displays formatted JavaScript/Node.js error stack traces with syntax highlighting and collapsible frames.

The `StackTrace` component displays formatted JavaScript/Node.js error stack traces with clickable file paths, internal frame dimming, and collapsible content.

See `scripts/stack-trace.tsx` for this example.

## Installation

```bash
npx ai-elements@latest add stack-trace
```

## Usage with AI SDK

Build an error display tool that shows stack traces from AI-generated code using the [`useChat`](https://ai-sdk.dev/docs/reference/ai-sdk-ui/use-chat) hook.

Add the following component to your frontend:

```tsx title="app/page.tsx"
"use client";

import { useChat } from "@ai-sdk/react";
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
} from "@/components/ai-elements/stack-trace";

export default function Page() {
  const { messages } = useChat({
    api: "/api/run-code",
  });

  return (
    <div className="max-w-4xl mx-auto p-6">
      {messages.map((message) => {
        const toolInvocations = message.parts?.filter(
          (part) => part.type === "tool-invocation"
        );

        return toolInvocations?.map((tool) => {
          if (tool.toolName === "runCode" && tool.result?.error) {
            return (
              <StackTrace
                key={tool.toolCallId}
                trace={tool.result.error}
                defaultOpen
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
          }
          return null;
        });
      })}
    </div>
  );
}
```

Add the following route to your backend:

```tsx title="api/run-code/route.ts"
import { streamText, tool } from "ai";
import { z } from "zod";

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: "openai/gpt-4o",
    messages,
    tools: {
      runCode: tool({
        description: "Execute JavaScript code and return any errors",
        parameters: z.object({
          code: z.string(),
        }),
        execute: async ({ code }) => {
          try {
            // Execute code in sandbox
            eval(code);
            return { success: true };
          } catch (error) {
            return { error: (error as Error).stack };
          }
        },
      }),
    },
  });

  return result.toDataStreamResponse();
}
```

## Features

- Parses standard JavaScript/Node.js stack trace format
- Highlights error type in red
- Dims internal frames (node_modules, node: paths)
- Collapsible content with smooth animation
- Copy full stack trace to clipboard
- Clickable file paths with line/column numbers

## Examples

### Collapsed by Default

See `scripts/stack-trace-collapsed.tsx` for this example.

### Hide Internal Frames

See `scripts/stack-trace-no-internal.tsx` for this example.

## Props

### `<StackTrace />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `trace` | `string` | - | The raw stack trace string to parse and display. |
| `open` | `boolean` | - | Controlled open state. |
| `defaultOpen` | `boolean` | `false` | Whether the content is expanded by default. |
| `onOpenChange` | `(open: boolean) => void` | - | Callback when open state changes. |
| `onFilePathClick` | `(path: string, line?: number, column?: number) => void` | - | Callback when a file path is clicked. Receives the file path, line number, and column number. |
| `children` | `React.ReactNode` | - | Child elements (StackTraceHeader, StackTraceContent, etc.). |
| `className` | `string` | - | Additional CSS classes. |
| `...props` | `React.HTMLAttributes<HTMLDivElement>` | - | Any other props are spread to the root div. |

### `<StackTraceHeader />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `React.ReactNode` | - | Header content (typically StackTraceError and StackTraceActions). |
| `className` | `string` | - | Additional CSS classes. |
| `...props` | `React.ComponentProps<typeof CollapsibleTrigger>` | - | Any other props are spread to the CollapsibleTrigger. |

### `<StackTraceError />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `React.ReactNode` | - | Error content (typically StackTraceErrorType and StackTraceErrorMessage). |
| `className` | `string` | - | Additional CSS classes. |
| `...props` | `React.HTMLAttributes<HTMLDivElement>` | - | Any other props are spread to the container div. |

### `<StackTraceErrorType />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `React.ReactNode` | - | Custom content. Defaults to the parsed error type (e.g.,  |
| `className` | `string` | - | Additional CSS classes. |
| `...props` | `React.HTMLAttributes<HTMLSpanElement>` | - | Any other props are spread to the span element. |

### `<StackTraceErrorMessage />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `React.ReactNode` | - | Custom content. Defaults to the parsed error message. |
| `className` | `string` | - | Additional CSS classes. |
| `...props` | `React.HTMLAttributes<HTMLSpanElement>` | - | Any other props are spread to the span element. |

### `<StackTraceActions />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `React.ReactNode` | - | Action buttons (typically StackTraceCopyButton and StackTraceExpandButton). |
| `className` | `string` | - | Additional CSS classes. |
| `...props` | `React.HTMLAttributes<HTMLDivElement>` | - | Any other props are spread to the container div. |

### `<StackTraceCopyButton />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `onCopy` | `() => void` | - | Callback fired after a successful copy. |
| `onError` | `(error: Error) => void` | - | Callback fired if copying fails. |
| `timeout` | `number` | `2000` | How long to show the copied state (ms). |
| `children` | `React.ReactNode` | - | Custom content for the button. Defaults to copy/check icons. |
| `className` | `string` | - | Additional CSS classes. |
| `...props` | `React.ComponentProps<typeof Button>` | - | Any other props are spread to the underlying shadcn/ui Button component. |

### `<StackTraceExpandButton />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | - | Additional CSS classes. |
| `...props` | `React.HTMLAttributes<HTMLDivElement>` | - | Any other props are spread to the container div. |

### `<StackTraceContent />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `maxHeight` | `number` | `400` | Maximum height of the content area. Enables scrolling when content exceeds this height. |
| `children` | `React.ReactNode` | - | Content to display (typically StackTraceFrames). |
| `className` | `string` | - | Additional CSS classes. |
| `...props` | `React.ComponentProps<typeof CollapsibleContent>` | - | Any other props are spread to the CollapsibleContent. |

### `<StackTraceFrames />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `showInternalFrames` | `boolean` | `true` | Whether to show internal frames (node_modules, node: paths). |
| `className` | `string` | - | Additional CSS classes. |
| `...props` | `React.HTMLAttributes<HTMLDivElement>` | - | Any other props are spread to the container div. |
