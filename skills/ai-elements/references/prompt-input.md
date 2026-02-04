# Prompt Input

Allows a user to send a message with file attachments to a large language model. It includes a textarea, file upload capabilities, a submit button, and a dropdown for selecting the model.

The `PromptInput` component allows a user to send a message with file attachments to a large language model. It includes a textarea, file upload capabilities, a submit button, and a dropdown for selecting the model.

See `scripts/prompt-input.tsx` for this example.

## Installation

```bash
npx ai-elements@latest add prompt-input
```

## Usage with AI SDK

Build a fully functional chat app using `PromptInput`, [`Conversation`](/components/conversation) with a model picker:

Add the following component to your frontend:

```tsx title="app/page.tsx"
"use client";

import {
  Attachment,
  AttachmentPreview,
  AttachmentRemove,
  Attachments,
} from "@/components/ai-elements/attachments";
import {
  PromptInput,
  PromptInputActionAddAttachments,
  PromptInputActionMenu,
  PromptInputActionMenuContent,
  PromptInputActionMenuTrigger,
  PromptInputBody,
  PromptInputButton,
  PromptInputHeader,
  type PromptInputMessage,
  PromptInputSelect,
  PromptInputSelectContent,
  PromptInputSelectItem,
  PromptInputSelectTrigger,
  PromptInputSelectValue,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputFooter,
  PromptInputTools,
  usePromptInputAttachments,
} from "@/components/ai-elements/prompt-input";
import { GlobeIcon } from "lucide-react";
import { useState } from "react";
import { useChat } from "@ai-sdk/react";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import {
  Message,
  MessageContent,
  MessageResponse,
} from "@/components/ai-elements/message";

const PromptInputAttachmentsDisplay = () => {
  const attachments = usePromptInputAttachments();

  if (attachments.files.length === 0) {
    return null;
  }

  return (
    <Attachments variant="inline">
      {attachments.files.map((attachment) => (
        <Attachment
          data={attachment}
          key={attachment.id}
          onRemove={() => attachments.remove(attachment.id)}
        >
          <AttachmentPreview />
          <AttachmentRemove />
        </Attachment>
      ))}
    </Attachments>
  );
};

const models = [
  { id: "gpt-4o", name: "GPT-4o" },
  { id: "claude-opus-4-20250514", name: "Claude 4 Opus" },
];

const InputDemo = () => {
  const [text, setText] = useState<string>("");
  const [model, setModel] = useState<string>(models[0].id);
  const [useWebSearch, setUseWebSearch] = useState<boolean>(false);

  const { messages, status, sendMessage } = useChat();

  const handleSubmit = (message: PromptInputMessage) => {
    const hasText = Boolean(message.text);
    const hasAttachments = Boolean(message.files?.length);

    if (!(hasText || hasAttachments)) {
      return;
    }

    sendMessage(
      {
        text: message.text || "Sent with attachments",
        files: message.files,
      },
      {
        body: {
          model: model,
          webSearch: useWebSearch,
        },
      }
    );
    setText("");
  };

  return (
    <div className="max-w-4xl mx-auto p-6 relative size-full rounded-lg border h-[600px]">
      <div className="flex flex-col h-full">
        <Conversation>
          <ConversationContent>
            {messages.map((message) => (
              <Message from={message.role} key={message.id}>
                <MessageContent>
                  {message.parts.map((part, i) => {
                    switch (part.type) {
                      case "text":
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
            ))}
          </ConversationContent>
          <ConversationScrollButton />
        </Conversation>

        <PromptInput
          onSubmit={handleSubmit}
          className="mt-4"
          globalDrop
          multiple
        >
          <PromptInputHeader>
            <PromptInputAttachmentsDisplay />
          </PromptInputHeader>
          <PromptInputBody>
            <PromptInputTextarea
              onChange={(e) => setText(e.target.value)}
              value={text}
            />
          </PromptInputBody>
          <PromptInputFooter>
            <PromptInputTools>
              <PromptInputActionMenu>
                <PromptInputActionMenuTrigger />
                <PromptInputActionMenuContent>
                  <PromptInputActionAddAttachments />
                </PromptInputActionMenuContent>
              </PromptInputActionMenu>
              <PromptInputButton
                onClick={() => setUseWebSearch(!useWebSearch)}
                tooltip={{ content: "Search the web", shortcut: "⌘K" }}
                variant={useWebSearch ? "default" : "ghost"}
              >
                <GlobeIcon size={16} />
                <span>Search</span>
              </PromptInputButton>
              <PromptInputSelect
                onValueChange={(value) => {
                  setModel(value);
                }}
                value={model}
              >
                <PromptInputSelectTrigger>
                  <PromptInputSelectValue />
                </PromptInputSelectTrigger>
                <PromptInputSelectContent>
                  {models.map((model) => (
                    <PromptInputSelectItem key={model.id} value={model.id}>
                      {model.name}
                    </PromptInputSelectItem>
                  ))}
                </PromptInputSelectContent>
              </PromptInputSelect>
            </PromptInputTools>
            <PromptInputSubmit disabled={!text && !status} status={status} />
          </PromptInputFooter>
        </PromptInput>
      </div>
    </div>
  );
};

export default InputDemo;
```

Add the following route to your backend:

```ts title="app/api/chat/route.ts"
import { streamText, UIMessage, convertToModelMessages } from "ai";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const {
    model,
    messages,
    webSearch,
  }: {
    messages: UIMessage[];
    model: string;
    webSearch?: boolean;
  } = await req.json();

  const result = streamText({
    model: webSearch ? "perplexity/sonar" : model,
    messages: await convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse();
}
```

## Features

- Auto-resizing textarea that adjusts height based on content
- File attachment support with drag-and-drop
- Image preview for image attachments
- Configurable file constraints (max files, max size, accepted types)
- Automatic submit button icons based on status
- Support for keyboard shortcuts (Enter to submit, Shift+Enter for new line)
- Customizable min/max height for the textarea
- Flexible toolbar with support for custom actions and tools
- Built-in model selection dropdown
- Built-in native speech recognition button (Web Speech API)
- Optional provider for lifted state management
- Form automatically resets on submit
- Responsive design with mobile-friendly controls
- Clean, modern styling with customizable themes
- Form-based submission handling
- Hidden file input sync for native form posts
- Global document drop support (opt-in)

## Examples

### Cursor style

See `scripts/prompt-input-cursor.tsx` for this example.

### Button tooltips

Buttons can display tooltips with optional keyboard shortcut hints. Hover over the buttons below to see the tooltips.

See `scripts/prompt-input-tooltip.tsx` for this example.

## Props

### `<PromptInput />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `onSubmit` | `(message: PromptInputMessage, event: FormEvent) => void` | - | Handler called when the form is submitted with message text and files. |
| `accept` | `string` | - | File types to accept (e.g.,  |
| `multiple` | `boolean` | - | Whether to allow multiple file selection. |
| `globalDrop` | `boolean` | - | When true, accepts file drops anywhere on the document. |
| `syncHiddenInput` | `boolean` | - | Render a hidden input with given name for native form posts. |
| `maxFiles` | `number` | - | Maximum number of files allowed. |
| `maxFileSize` | `number` | - | Maximum file size in bytes. |
| `onError` | `(err: { code: ` | - | Handler for file validation errors. |
| `...props` | `React.HTMLAttributes<HTMLFormElement>` | - | Any other props are spread to the root form element. |

### `<PromptInputTextarea />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `...props` | `React.ComponentProps<typeof Textarea>` | - | Any other props are spread to the underlying Textarea component. |

### `<PromptInputFooter />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `...props` | `React.HTMLAttributes<HTMLDivElement>` | - | Any other props are spread to the toolbar div. |

### `<PromptInputTools />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `...props` | `React.HTMLAttributes<HTMLDivElement>` | - | Any other props are spread to the tools div. |

### `<PromptInputButton />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `tooltip` | `string | { content: ReactNode; shortcut?: string; side?: ` | - | Optional tooltip to display on hover. Can be a string or an object with content, shortcut, and side properties. |
| `...props` | `React.ComponentProps<typeof Button>` | - | Any other props are spread to the underlying shadcn/ui Button component. |

#### Tooltip Examples

```tsx
// Simple string tooltip
<PromptInputButton tooltip="Search the web">
  <GlobeIcon size={16} />
</PromptInputButton>

// Tooltip with keyboard shortcut hint
<PromptInputButton tooltip={{ content: "Search", shortcut: "⌘K" }}>
  <GlobeIcon size={16} />
</PromptInputButton>

// Tooltip with custom position
<PromptInputButton tooltip={{ content: "Search", side: "bottom" }}>
  <GlobeIcon size={16} />
</PromptInputButton>
```

### `<PromptInputSubmit />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `status` | `ChatStatus` | - | Current chat status to determine button icon (submitted, streaming, error). |
| `...props` | `React.ComponentProps<typeof Button>` | - | Any other props are spread to the underlying shadcn/ui Button component. |

### `<PromptInputSelect />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `...props` | `React.ComponentProps<typeof Select>` | - | Any other props are spread to the underlying Select component. |

### `<PromptInputSelectTrigger />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `...props` | `React.ComponentProps<typeof SelectTrigger>` | - | Any other props are spread to the underlying SelectTrigger component. |

### `<PromptInputSelectContent />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `...props` | `React.ComponentProps<typeof SelectContent>` | - | Any other props are spread to the underlying SelectContent component. |

### `<PromptInputSelectItem />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `...props` | `React.ComponentProps<typeof SelectItem>` | - | Any other props are spread to the underlying SelectItem component. |

### `<PromptInputSelectValue />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `...props` | `React.ComponentProps<typeof SelectValue>` | - | Any other props are spread to the underlying SelectValue component. |

### `<PromptInputBody />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `...props` | `React.HTMLAttributes<HTMLDivElement>` | - | Any other props are spread to the body div. |

### Attachments

Attachment components have been moved to a separate module. See the [Attachment](/components/attachment) component documentation for details on `<Attachments />`, `<Attachment />`, `<AttachmentPreview />`, `<AttachmentInfo />`, and `<AttachmentRemove />`.

### `<PromptInputActionMenu />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `...props` | `React.ComponentProps<typeof DropdownMenu>` | - | Any other props are spread to the underlying DropdownMenu component. |

### `<PromptInputActionMenuTrigger />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `...props` | `React.ComponentProps<typeof Button>` | - | Any other props are spread to the underlying Button component. |

### `<PromptInputActionMenuContent />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `...props` | `React.ComponentProps<typeof DropdownMenuContent>` | - | Any other props are spread to the underlying DropdownMenuContent component. |

### `<PromptInputActionMenuItem />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `...props` | `React.ComponentProps<typeof DropdownMenuItem>` | - | Any other props are spread to the underlying DropdownMenuItem component. |

### `<PromptInputActionAddAttachments />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | - | Label for the menu item. |
| `...props` | `React.ComponentProps<typeof DropdownMenuItem>` | - | Any other props are spread to the underlying DropdownMenuItem component. |

### `<PromptInputProvider />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `initialInput` | `string` | - | Initial text input value. |
| `children` | `React.ReactNode` | - | Child components that will have access to the provider context. |

Optional global provider that lifts PromptInput state outside of PromptInput. When used, it allows you to access and control the input state from anywhere within the provider tree. If not used, PromptInput stays fully self-managed.

### `<PromptInputHeader />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `...props` | `Omit<React.ComponentProps<typeof InputGroupAddon>, ` | - | Any other props (except align) are spread to the InputGroupAddon component. |

### `<PromptInputHoverCard />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `openDelay` | `number` | `0` | Delay in milliseconds before opening. |
| `closeDelay` | `number` | `0` | Delay in milliseconds before closing. |
| `...props` | `React.ComponentProps<typeof HoverCard>` | - | Any other props are spread to the HoverCard component. |

### `<PromptInputHoverCardTrigger />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `...props` | `React.ComponentProps<typeof HoverCardTrigger>` | - | Any other props are spread to the HoverCardTrigger component. |

### `<PromptInputHoverCardContent />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `align` | `unknown` | - | Alignment of the hover card content. |
| `...props` | `React.ComponentProps<typeof HoverCardContent>` | - | Any other props are spread to the HoverCardContent component. |

### `<PromptInputTabsList />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `...props` | `React.HTMLAttributes<HTMLDivElement>` | - | Any other props are spread to the div element. |

### `<PromptInputTab />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `...props` | `React.HTMLAttributes<HTMLDivElement>` | - | Any other props are spread to the div element. |

### `<PromptInputTabLabel />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `...props` | `React.HTMLAttributes<HTMLHeadingElement>` | - | Any other props are spread to the h3 element. |

### `<PromptInputTabBody />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `...props` | `React.HTMLAttributes<HTMLDivElement>` | - | Any other props are spread to the div element. |

### `<PromptInputTabItem />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `...props` | `React.HTMLAttributes<HTMLDivElement>` | - | Any other props are spread to the div element. |

### `<PromptInputCommand />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `...props` | `React.ComponentProps<typeof Command>` | - | Any other props are spread to the Command component. |

### `<PromptInputCommandInput />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `...props` | `React.ComponentProps<typeof CommandInput>` | - | Any other props are spread to the CommandInput component. |

### `<PromptInputCommandList />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `...props` | `React.ComponentProps<typeof CommandList>` | - | Any other props are spread to the CommandList component. |

### `<PromptInputCommandEmpty />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `...props` | `React.ComponentProps<typeof CommandEmpty>` | - | Any other props are spread to the CommandEmpty component. |

### `<PromptInputCommandGroup />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `...props` | `React.ComponentProps<typeof CommandGroup>` | - | Any other props are spread to the CommandGroup component. |

### `<PromptInputCommandItem />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `...props` | `React.ComponentProps<typeof CommandItem>` | - | Any other props are spread to the CommandItem component. |

### `<PromptInputCommandSeparator />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `...props` | `React.ComponentProps<typeof CommandSeparator>` | - | Any other props are spread to the CommandSeparator component. |

## Hooks

### `usePromptInputAttachments`

Access and manage file attachments within a PromptInput context.

```tsx
const attachments = usePromptInputAttachments();

// Available methods:
attachments.files; // Array of current attachments
attachments.add(files); // Add new files
attachments.remove(id); // Remove an attachment by ID
attachments.clear(); // Clear all attachments
attachments.openFileDialog(); // Open file selection dialog
```

### `usePromptInputController`

Access the full PromptInput controller from a PromptInputProvider. Only available when using the provider.

```tsx
const controller = usePromptInputController();

// Available methods:
controller.textInput.value; // Current text input value
controller.textInput.setInput(value); // Set text input value
controller.textInput.clear(); // Clear text input
controller.attachments; // Same as usePromptInputAttachments
```

### `useProviderAttachments`

Access attachments context from a PromptInputProvider. Only available when using the provider.

```tsx
const attachments = useProviderAttachments();

// Same interface as usePromptInputAttachments
```

### `usePromptInputReferencedSources`

Access referenced sources context within a PromptInput.

```tsx
const sources = usePromptInputReferencedSources();

// Available methods:
sources.sources; // Array of current referenced sources
sources.add(sources); // Add new source(s)
sources.remove(id); // Remove a source by ID
sources.clear(); // Clear all sources
```
