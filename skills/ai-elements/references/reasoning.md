# Reasoning

A collapsible component that displays AI reasoning content, automatically opening during streaming and closing when finished.

The `Reasoning` component displays AI reasoning content, automatically opening during streaming and closing when finished.

See `scripts/reasoning.tsx` for this example.

## Installation

```bash
npx ai-elements@latest add reasoning
```

## Usage with AI SDK

Build a chatbot with reasoning using Deepseek R1 or other reasoning models.

Some models (like GPT with high reasoning effort) return multiple reasoning parts instead of a single streaming block. The example below consolidates all reasoning parts into a single component to avoid displaying multiple "Thinking..." indicators.

Add the following component to your frontend:

```tsx title="app/page.tsx"
"use client";

import {
  Reasoning,
  ReasoningContent,
  ReasoningTrigger,
} from "@/components/ai-elements/reasoning";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import {
  PromptInput,
  PromptInputTextarea,
  PromptInputSubmit,
} from "@/components/ai-elements/prompt-input";
import { Spinner } from "@/components/ui/spinner";
import {
  Message,
  MessageContent,
  MessageResponse,
} from "@/components/ai-elements/message";
import { useState } from "react";
import { useChat } from "@ai-sdk/react";
import type { UIMessage } from "ai";

const MessageParts = ({
  message,
  isLastMessage,
  isStreaming,
}: {
  message: UIMessage;
  isLastMessage: boolean;
  isStreaming: boolean;
}) => {
  // Consolidate all reasoning parts into one block
  const reasoningParts = message.parts.filter(
    (part) => part.type === "reasoning"
  );
  const reasoningText = reasoningParts.map((part) => part.text).join("\n\n");
  const hasReasoning = reasoningParts.length > 0;

  // Check if reasoning is still streaming (last part is reasoning on last message)
  const lastPart = message.parts.at(-1);
  const isReasoningStreaming =
    isLastMessage && isStreaming && lastPart?.type === "reasoning";

  return (
    <>
      {hasReasoning && (
        <Reasoning className="w-full" isStreaming={isReasoningStreaming}>
          <ReasoningTrigger />
          <ReasoningContent>{reasoningText}</ReasoningContent>
        </Reasoning>
      )}
      {message.parts.map((part, i) => {
        if (part.type === "text") {
          return (
            <MessageResponse key={`${message.id}-${i}`}>
              {part.text}
            </MessageResponse>
          );
        }
        return null;
      })}
    </>
  );
};

const ReasoningDemo = () => {
  const [input, setInput] = useState("");

  const { messages, sendMessage, status } = useChat();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage({ text: input });
    setInput("");
  };

  const isStreaming = status === "streaming";

  return (
    <div className="max-w-4xl mx-auto p-6 relative size-full rounded-lg border h-[600px]">
      <div className="flex flex-col h-full">
        <Conversation>
          <ConversationContent>
            {messages.map((message, index) => (
              <Message from={message.role} key={message.id}>
                <MessageContent>
                  <MessageParts
                    message={message}
                    isLastMessage={index === messages.length - 1}
                    isStreaming={isStreaming}
                  />
                </MessageContent>
              </Message>
            ))}
            {status === "submitted" && <Spinner />}
          </ConversationContent>
          <ConversationScrollButton />
        </Conversation>

        <PromptInput
          onSubmit={handleSubmit}
          className="mt-4 w-full max-w-2xl mx-auto relative"
        >
          <PromptInputTextarea
            value={input}
            placeholder="Say something..."
            onChange={(e) => setInput(e.currentTarget.value)}
            className="pr-12"
          />
          <PromptInputSubmit
            status={isStreaming ? "streaming" : "ready"}
            disabled={!input.trim()}
            className="absolute bottom-1 right-1"
          />
        </PromptInput>
      </div>
    </div>
  );
};

export default ReasoningDemo;
```

Add the following route to your backend:

```ts title="app/api/chat/route.ts"
import { streamText, UIMessage, convertToModelMessages } from "ai";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { model, messages }: { messages: UIMessage[]; model: string } =
    await req.json();

  const result = streamText({
    model: "deepseek/deepseek-r1",
    messages: await convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse({
    sendReasoning: true,
  });
}
```

## Reasoning vs Chain of Thought

Use the `Reasoning` component when your model outputs thinking content as a single block or continuous stream (Deepseek R1, Claude with extended thinking, etc.).

If your model outputs discrete, labeled steps (search queries, tool calls, distinct thought stages), consider using the [Chain of Thought](/components/chain-of-thought) component instead for a more structured visual representation.

## Features

- Automatically opens when streaming content and closes when finished
- Manual toggle control for user interaction
- Smooth animations and transitions powered by Radix UI
- Visual streaming indicator with pulsing animation
- Composable architecture with separate trigger and content components
- Built with accessibility in mind including keyboard navigation
- Responsive design that works across different screen sizes
- Seamlessly integrates with both light and dark themes
- Built on top of shadcn/ui Collapsible primitives
- TypeScript support with proper type definitions

## Props

### `<Reasoning />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isStreaming` | `boolean` | `false` | Whether the reasoning is currently streaming (auto-opens and closes the panel). |
| `open` | `boolean` | - | Controlled open state. |
| `defaultOpen` | `boolean` | `true` | Default open state when uncontrolled. |
| `onOpenChange` | `(open: boolean) => void` | - | Callback when open state changes. |
| `duration` | `number` | - | Duration in seconds to display (can be controlled externally). |
| `...props` | `React.ComponentProps<typeof Collapsible>` | - | Any other props are spread to the underlying Collapsible component. |

### `<ReasoningTrigger />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `getThinkingMessage` | `(isStreaming: boolean, duration?: number) => ReactNode` | - | Optional function to customize the thinking message. Receives isStreaming and duration parameters. |
| `...props` | `React.ComponentProps<typeof CollapsibleTrigger>` | - | Any other props are spread to the underlying CollapsibleTrigger component. |

### `<ReasoningContent />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `string` | Required | The reasoning text to display (rendered via Streamdown). |
| `...props` | `React.ComponentProps<typeof CollapsibleContent>` | - | Any other props are spread to the underlying CollapsibleContent component. |

## Hooks

### `useReasoning`

Access the reasoning context from child components.

```tsx
const { isStreaming, isOpen, setIsOpen, duration } = useReasoning();
```

Returns:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isStreaming` | `boolean` | - | Whether reasoning is currently streaming. |
| `isOpen` | `boolean` | - | Whether the reasoning panel is open. |
| `setIsOpen` | `(open: boolean) => void` | - | Function to set the open state. |
| `duration` | `number | undefined` | - | Duration in seconds (undefined while streaming). |
