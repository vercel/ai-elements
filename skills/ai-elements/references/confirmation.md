# Confirmation

An alert-based component for managing tool execution approval workflows with request, accept, and reject states.

The `Confirmation` component provides a flexible system for displaying tool approval requests and their outcomes. Perfect for showing users when AI tools require approval before execution, and displaying the approval status afterward.

See `scripts/confirmation.tsx` for this example.

## Installation

```bash
npx ai-elements@latest add confirmation
```

## Usage with AI SDK

Build a chat UI with tool approval workflow where dangerous tools require user confirmation before execution.

Add the following component to your frontend:

```tsx title="app/page.tsx"
"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type ToolUIPart } from "ai";
import { useState } from "react";
import { CheckIcon, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Confirmation,
  ConfirmationRequest,
  ConfirmationAccepted,
  ConfirmationRejected,
  ConfirmationActions,
  ConfirmationAction,
} from "@/components/ai-elements/confirmation";
import { MessageResponse } from "@/components/ai-elements/message";

type DeleteFileInput = {
  filePath: string;
  confirm: boolean;
};

type DeleteFileToolUIPart = ToolUIPart<{
  delete_file: {
    input: DeleteFileInput;
    output: { success: boolean; message: string };
  };
}>;

const Example = () => {
  const { messages, sendMessage, status, addToolApprovalResponse } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
    }),
  });

  const handleDeleteFile = () => {
    sendMessage({ text: "Delete the file at /tmp/example.txt" });
  };

  const latestMessage = messages[messages.length - 1];
  const deleteTool = latestMessage?.parts?.find(
    (part) => part.type === "tool-delete_file"
  ) as DeleteFileToolUIPart | undefined;

  return (
    <div className="max-w-4xl mx-auto p-6 relative size-full rounded-lg border h-[600px]">
      <div className="flex flex-col h-full space-y-4">
        <Button onClick={handleDeleteFile} disabled={status !== "ready"}>
          Delete Example File
        </Button>

        {deleteTool?.approval && (
          <Confirmation approval={deleteTool.approval} state={deleteTool.state}>
            <ConfirmationRequest>
              This tool wants to delete:{" "}
              <code>{deleteTool.input?.filePath}</code>
              <br />
              Do you approve this action?
            </ConfirmationRequest>
            <ConfirmationAccepted>
              <CheckIcon className="size-4" />
              <span>You approved this tool execution</span>
            </ConfirmationAccepted>
            <ConfirmationRejected>
              <XIcon className="size-4" />
              <span>You rejected this tool execution</span>
            </ConfirmationRejected>
            <ConfirmationActions>
              <ConfirmationAction
                variant="outline"
                onClick={() =>
                  addToolApprovalResponse({
                    id: deleteTool.approval!.id,
                    approved: false,
                  })
                }
              >
                Reject
              </ConfirmationAction>
              <ConfirmationAction
                variant="default"
                onClick={() =>
                  addToolApprovalResponse({
                    id: deleteTool.approval!.id,
                    approved: true,
                  })
                }
              >
                Approve
              </ConfirmationAction>
            </ConfirmationActions>
          </Confirmation>
        )}

        {deleteTool?.output && (
          <MessageResponse>
            {deleteTool.output.success
              ? deleteTool.output.message
              : `Error: ${deleteTool.output.message}`}
          </MessageResponse>
        )}
      </div>
    </div>
  );
};

export default Example;
```

Add the following route to your backend:

```ts title="app/api/chat/route.tsx"
import { streamText, UIMessage, convertToModelMessages } from "ai";
import { z } from "zod";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: "openai/gpt-4o",
    messages: await convertToModelMessages(messages),
    tools: {
      delete_file: {
        description: "Delete a file from the file system",
        parameters: z.object({
          filePath: z.string().describe("The path to the file to delete"),
          confirm: z
            .boolean()
            .default(false)
            .describe("Confirmation that the user wants to delete the file"),
        }),
        requireApproval: true, // Enable approval workflow
        execute: async ({ filePath, confirm }) => {
          if (!confirm) {
            return {
              success: false,
              message: "Deletion not confirmed",
            };
          }

          // Simulate file deletion
          await new Promise((resolve) => setTimeout(resolve, 500));

          return {
            success: true,
            message: `Successfully deleted ${filePath}`,
          };
        },
      },
    },
  });

  return result.toUIMessageStreamResponse();
}
```

## Features

- Context-based state management for approval workflow
- Conditional rendering based on approval state
- Support for approval-requested, approval-responded, output-denied, and output-available states
- Built on shadcn/ui Alert and Button components
- TypeScript support with comprehensive type definitions
- Customizable styling with Tailwind CSS
- Keyboard navigation and accessibility support
- Theme-aware with automatic dark mode support

## Examples

### Approval Request State

Shows the approval request with action buttons when state is `approval-requested`.

See `scripts/confirmation-request.tsx` for this example.

### Approved State

Shows the accepted status when user approves and state is `approval-responded` or `output-available`.

See `scripts/confirmation-accepted.tsx` for this example.

### Rejected State

Shows the rejected status when user rejects and state is `output-denied`.

See `scripts/confirmation-rejected.tsx` for this example.

## Props

### `<Confirmation />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `approval` | `ToolUIPart[` | - | The approval object containing the approval ID and status. If not provided or undefined, the component will not render. |
| `state` | `ToolUIPart[` | - | The current state of the tool (input-streaming, input-available, approval-requested, approval-responded, output-denied, or output-available). Will not render for input-streaming or input-available states. |
| `className` | `string` | - | Additional CSS classes to apply to the Alert component. |
| `...props` | `React.ComponentProps<typeof Alert>` | - | Any other props are spread to the Alert component. |

### `<ConfirmationRequest />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `React.ReactNode` | - | The content to display when approval is requested. Only renders when state is  |

### `<ConfirmationAccepted />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `React.ReactNode` | - | The content to display when approval is accepted. Only renders when approval.approved is true and state is  |

### `<ConfirmationRejected />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `React.ReactNode` | - | The content to display when approval is rejected. Only renders when approval.approved is false and state is  |

### `<ConfirmationActions />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | - | Additional CSS classes to apply to the actions container. |
| `...props` | `React.ComponentProps<` | - | Any other props are spread to the div element. Only renders when state is  |

### `<ConfirmationAction />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `...props` | `React.ComponentProps<typeof Button>` | - | Any other props are spread to the Button component. Styled with h-8 px-3 text-sm classes by default. |
