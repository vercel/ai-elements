# Conversation

Wraps messages and automatically scrolls to the bottom. Also includes a scroll button that appears when not at the bottom.

The `Conversation` component wraps messages and automatically scrolls to the bottom. Also includes a scroll button that appears when not at the bottom.

<Preview path="conversation" className="p-0" />

## Installation

```bash
npx ai-elements@latest add conversation
```

## Usage with AI SDK

Build a simple conversational UI with `Conversation` and [`PromptInput`](/components/prompt-input):

Add the following component to your frontend:

```tsx title="app/page.tsx"
"use client";

import {
  Conversation,
  ConversationContent,
  ConversationDownload,
  ConversationEmptyState,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import {
  Message,
  MessageContent,
  MessageResponse,
} from "@/components/ai-elements/message";
import {
  Input,
  PromptInputTextarea,
  PromptInputSubmit,
} from "@/components/ai-elements/prompt-input";
import { MessageSquare } from "lucide-react";
import { useState } from "react";
import { useChat } from "@ai-sdk/react";

const ConversationDemo = () => {
  const [input, setInput] = useState("");
  const { messages, sendMessage, status } = useChat();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      sendMessage({ text: input });
      setInput("");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 relative size-full rounded-lg border h-[600px]">
      <div className="flex flex-col h-full">
        <Conversation>
          <ConversationContent>
            {messages.length === 0 ? (
              <ConversationEmptyState
                icon={<MessageSquare className="size-12" />}
                title="Start a conversation"
                description="Type a message below to begin chatting"
              />
            ) : (
              messages.map((message) => (
                <Message from={message.role} key={message.id}>
                  <MessageContent>
                    {message.parts.map((part, i) => {
                      switch (part.type) {
                        case "text": // we don't use any reasoning or tool calls in this example
                          return (
                            <MessageResponse key={`${message.id}-${i}`}>
                              {part.text}
                            </MessageResponse>
                          );
                        default:
                          return null;
                      }
                    })}
                  </MessageContent>
                </Message>
              ))
            )}
          </ConversationContent>
          <ConversationDownload messages={messages} />
          <ConversationScrollButton />
        </Conversation>

        <Input
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
            status={status === "streaming" ? "streaming" : "ready"}
            disabled={!input.trim()}
            className="absolute bottom-1 right-1"
          />
        </Input>
      </div>
    </div>
  );
};

export default ConversationDemo;
```

Add the following route to your backend:

```tsx title="api/chat/route.ts"
import { streamText, UIMessage, convertToModelMessages } from "ai";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: "openai/gpt-4o",
    messages: await convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse();
}
```

## Features

- Automatic scrolling to the bottom when new messages are added
- Smooth scrolling behavior with configurable animation
- Scroll button that appears when not at the bottom
- Download conversation as Markdown
- Responsive design with customizable padding and spacing
- Flexible content layout with consistent message spacing
- Accessible with proper ARIA roles for screen readers
- Customizable styling through className prop
- Support for any number of child message components

## Props

### `<Conversation />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `contextRef` | `React.Ref<StickToBottomContext>` | - | Optional ref to access the StickToBottom context object. |
| `instance` | `StickToBottomInstance` | - | Optional instance for controlling the StickToBottom component. |
| `children` | `((context: StickToBottomContext) => ReactNode) | ReactNode` | - | Render prop or ReactNode for custom rendering with context. |
| `...props` | `Omit<React.HTMLAttributes<HTMLDivElement>, ` | - | Any other props are spread to the root div. |

### `<ConversationContent />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `((context: StickToBottomContext) => ReactNode) | ReactNode` | - | Render prop or ReactNode for custom rendering with context. |
| `...props` | `Omit<React.HTMLAttributes<HTMLDivElement>, ` | - | Any other props are spread to the root div. |

### `<ConversationEmptyState />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | - | The title text to display. |
| `description` | `string` | - | The description text to display. |
| `icon` | `React.ReactNode` | - | Optional icon to display above the text. |
| `children` | `React.ReactNode` | - | Optional additional content to render below the text. |
| `...props` | `ComponentProps<` | - | Any other props are spread to the root div. |

### `<ConversationScrollButton />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `...props` | `ComponentProps<typeof Button>` | - | Any other props are spread to the underlying shadcn/ui Button component. |

### `<ConversationDownload />`

A button that downloads the conversation as a Markdown file.

```tsx
import { ConversationDownload } from "@/components/ai-elements/conversation";

<Conversation>
  <ConversationContent>
    {messages.map(...)}
  </ConversationContent>
  <ConversationDownload messages={messages} />
  <ConversationScrollButton />
</Conversation>
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `messages` | `ConversationMessage[]` | Required | Array of messages to include in the download. |
| `filename` | `string` | - | The filename for the downloaded file. |
| `formatMessage` | `(message: ConversationMessage, index: number) => string` | - | Custom function to format each message in the output. |
| `...props` | `Omit<ComponentProps<typeof Button>, ` | - | Any other props are spread to the underlying shadcn/ui Button component. |

### `messagesToMarkdown`

A utility function to convert messages to Markdown format. Useful for custom download implementations.

```tsx
import { messagesToMarkdown } from "@/components/ai-elements/conversation";

const markdown = messagesToMarkdown(messages);

// With custom formatter
const customMarkdown = messagesToMarkdown(
  messages,
  (msg, i) => `[${msg.role}]: ${msg.content}`
);
```
