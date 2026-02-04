# Message

A comprehensive suite of components for displaying chat messages, including message rendering, branching, actions, and markdown responses.

The `Message` component suite provides a complete set of tools for building chat interfaces. It includes components for displaying messages from users and AI assistants, managing multiple response branches, adding action buttons, and rendering markdown content.

See `scripts/message.tsx` for this example.



## Installation

```bash
npx ai-elements@latest add message
```

## Features

- Displays messages from both user and AI assistant with distinct styling and automatic alignment
- Minimalist flat design with user messages in secondary background and assistant messages full-width
- **Response branching** with navigation controls to switch between multiple AI response versions
- **Markdown rendering** with GFM support (tables, task lists, strikethrough), math equations, and smart streaming
- **Action buttons** for common operations (retry, like, dislike, copy, share) with tooltips and state management
- **File attachments** display with support for images and generic files with preview and remove functionality
- Code blocks with syntax highlighting and copy-to-clipboard functionality
- Keyboard accessible with proper ARIA labels
- Responsive design that adapts to different screen sizes
- Seamless light/dark theme integration



## Usage with AI SDK

Build a simple chat UI where the user can copy or regenerate the most recent message.

Add the following component to your frontend:

```tsx title="app/page.tsx"
"use client";

import { useState } from "react";
import {
  MessageActions,
  MessageAction,
} from "@/components/ai-elements/message";
import { Message, MessageContent } from "@/components/ai-elements/message";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import {
  Input,
  PromptInputTextarea,
  PromptInputSubmit,
} from "@/components/ai-elements/prompt-input";
import { MessageResponse } from "@/components/ai-elements/message";
import { RefreshCcwIcon, CopyIcon } from "lucide-react";
import { useChat } from "@ai-sdk/react";
import { Fragment } from "react";

const ActionsDemo = () => {
  const [input, setInput] = useState("");
  const { messages, sendMessage, status, regenerate } = useChat();

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
            {messages.map((message, messageIndex) => (
              <Fragment key={message.id}>
                {message.parts.map((part, i) => {
                  switch (part.type) {
                    case "text":
                      const isLastMessage =
                        messageIndex === messages.length - 1;

                      return (
                        <Fragment key={`${message.id}-${i}`}>
                          <Message from={message.role}>
                            <MessageContent>
                              <MessageResponse>{part.text}</MessageResponse>
                            </MessageContent>
                          </Message>
                          {message.role === "assistant" && isLastMessage && (
                            <MessageActions>
                              <MessageAction
                                onClick={() => regenerate()}
                                label="Retry"
                              >
                                <RefreshCcwIcon className="size-3" />
                              </MessageAction>
                              <MessageAction
                                onClick={() =>
                                  navigator.clipboard.writeText(part.text)
                                }
                                label="Copy"
                              >
                                <CopyIcon className="size-3" />
                              </MessageAction>
                            </MessageActions>
                          )}
                        </Fragment>
                      );
                    default:
                      return null;
                  }
                })}
              </Fragment>
            ))}
          </ConversationContent>
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

export default ActionsDemo;
```

## Props

### `<Message />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `from` | `UIMessage[` | - | The role of the message sender ( |
| `...props` | `React.HTMLAttributes<HTMLDivElement>` | - | Any other props are spread to the root div. |

### `<MessageContent />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `...props` | `React.HTMLAttributes<HTMLDivElement>` | - | Any other props are spread to the content div. |

### `<MessageResponse />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `string` | - | The markdown content to render. |
| `parseIncompleteMarkdown` | `boolean` | `true` | Whether to parse and fix incomplete markdown syntax (e.g., unclosed code blocks or lists). |
| `className` | `string` | - | CSS class names to apply to the wrapper div element. |
| `components` | `object` | - | Custom React components to use for rendering markdown elements (e.g., custom heading, paragraph, code block components). |
| `allowedImagePrefixes` | `string[]` | `[` | Array of allowed URL prefixes for images. Use [ |
| `allowedLinkPrefixes` | `string[]` | `[` | Array of allowed URL prefixes for links. Use [ |
| `defaultOrigin` | `string` | - | Default origin to use for relative URLs in links and images. |
| `rehypePlugins` | `array` | `[rehypeKatex]` | Array of rehype plugins to use for processing HTML. Includes KaTeX for math rendering by default. |
| `remarkPlugins` | `array` | `[remarkGfm, remarkMath]` | Array of remark plugins to use for processing markdown. Includes GitHub Flavored Markdown and math support by default. |
| `...props` | `React.HTMLAttributes<HTMLDivElement>` | - | Any other props are spread to the root div. |

### `<MessageActions />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `...props` | `React.HTMLAttributes<HTMLDivElement>` | - | HTML attributes to spread to the root div. |

### `<MessageAction />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `tooltip` | `string` | - | Optional tooltip text shown on hover. |
| `label` | `string` | - | Accessible label for screen readers. Also used as fallback if tooltip is not provided. |
| `...props` | `React.ComponentProps<typeof Button>` | - | Any other props are spread to the underlying shadcn/ui Button component. |

### `<MessageBranch />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `defaultBranch` | `number` | `0` | The index of the branch to show by default. |
| `onBranchChange` | `(branchIndex: number) => void` | - | Callback fired when the branch changes. |
| `...props` | `React.HTMLAttributes<HTMLDivElement>` | - | Any other props are spread to the root div. |

### `<MessageBranchContent />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `...props` | `React.HTMLAttributes<HTMLDivElement>` | - | Any other props are spread to the root div. |

### `<MessageBranchSelector />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `from` | `UIMessage[` | - | Aligns the selector for user, assistant or system messages. |
| `...props` | `React.HTMLAttributes<HTMLDivElement>` | - | Any other props are spread to the selector container. |

### `<MessageBranchPrevious />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `...props` | `React.ComponentProps<typeof Button>` | - | Any other props are spread to the underlying shadcn/ui Button component. |

### `<MessageBranchNext />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `...props` | `React.ComponentProps<typeof Button>` | - | Any other props are spread to the underlying shadcn/ui Button component. |

### `<MessageBranchPage />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `...props` | `React.HTMLAttributes<HTMLSpanElement>` | - | Any other props are spread to the underlying span element. |

### `<MessageAttachments />`

A container component for displaying file attachments in a message. Automatically positions attachments at the end of the message with proper spacing and alignment.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | - | MessageAttachment components to render. Returns null if no children provided. |
| `...props` | `React.ComponentProps<` | - | Any other props are spread to the root div. |

**Example:**

```tsx
<MessageAttachments className="mb-2">
  {files.map((attachment) => (
    <MessageAttachment data={attachment} key={attachment.url} />
  ))}
</MessageAttachments>
```

### `<MessageAttachment />`

Displays a single file attachment. Images are shown as thumbnails (96px × 96px) with rounded corners. Non-image files show a paperclip icon with the filename.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `data` | `FileUIPart` | - | The file data to display. Must include url and mediaType. |
| `onRemove` | `() => void` | - | Optional callback fired when the remove button is clicked. If provided, a remove button will appear on hover. |
| `...props` | `React.HTMLAttributes<HTMLDivElement>` | - | Any other props are spread to the root div. |

**Example:**

```tsx
<MessageAttachment
  data={{
    type: "file",
    url: "https://example.com/image.jpg",
    mediaType: "image/jpeg",
    filename: "image.jpg",
  }}
  onRemove={() => console.log("Remove clicked")}
/>
```
