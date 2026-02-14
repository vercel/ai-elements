# Checkpoint

A simple component for marking conversation history points and restoring the chat to a previous state.

The `Checkpoint` component provides a way to mark specific points in a conversation history and restore the chat to that state. Inspired by VSCode's Copilot checkpoint feature, it allows users to revert to an earlier conversation state while maintaining a clear visual separation between different conversation segments.

See `scripts/checkpoint.tsx` for this example.

## Installation

```bash
npx ai-elements@latest add checkpoint
```

## Features

- Simple flex layout with icon, trigger, and separator
- Visual separator line for clear conversation breaks
- Clickable restore button for reverting to checkpoint
- Customizable icon (defaults to BookmarkIcon)
- Keyboard accessible with proper ARIA labels
- Responsive design that adapts to different screen sizes
- Seamless light/dark theme integration

## Usage with AI SDK

Build a chat interface with conversation checkpoints that allow users to restore to previous states.

Add the following component to your frontend:

```tsx title="app/page.tsx"
"use client";

import { useState, Fragment } from "react";
import { useChat } from "@ai-sdk/react";
import {
  Checkpoint,
  CheckpointIcon,
  CheckpointTrigger,
} from "@/components/ai-elements/checkpoint";
import {
  Message,
  MessageContent,
  MessageResponse,
} from "@/components/ai-elements/message";
import {
  Conversation,
  ConversationContent,
} from "@/components/ai-elements/conversation";

type CheckpointType = {
  id: string;
  messageIndex: number;
  timestamp: Date;
  messageCount: number;
};

const CheckpointDemo = () => {
  const { messages, setMessages } = useChat();
  const [checkpoints, setCheckpoints] = useState<CheckpointType[]>([]);

  const createCheckpoint = (messageIndex: number) => {
    const checkpoint: CheckpointType = {
      id: nanoid(),
      messageIndex,
      timestamp: new Date(),
      messageCount: messageIndex + 1,
    };
    setCheckpoints([...checkpoints, checkpoint]);
  };

  const restoreToCheckpoint = (messageIndex: number) => {
    // Restore messages to checkpoint state
    setMessages(messages.slice(0, messageIndex + 1));
    // Remove checkpoints after this point
    setCheckpoints(checkpoints.filter((cp) => cp.messageIndex <= messageIndex));
  };

  return (
    <div className="max-w-4xl mx-auto p-6 relative size-full rounded-lg border h-[600px]">
      <Conversation>
        <ConversationContent>
          {messages.map((message, index) => {
            const checkpoint = checkpoints.find(
              (cp) => cp.messageIndex === index
            );

            return (
              <Fragment key={message.id}>
                <Message from={message.role}>
                  <MessageContent>
                    <MessageResponse>{message.content}</MessageResponse>
                  </MessageContent>
                </Message>
                {checkpoint && (
                  <Checkpoint>
                    <CheckpointIcon />
                    <CheckpointTrigger
                      onClick={() =>
                        restoreToCheckpoint(checkpoint.messageIndex)
                      }
                    >
                      Restore checkpoint
                    </CheckpointTrigger>
                  </Checkpoint>
                )}
              </Fragment>
            );
          })}
        </ConversationContent>
      </Conversation>
    </div>
  );
};

export default CheckpointDemo;
```

## Use Cases

### Manual Checkpoints

Allow users to manually create checkpoints at important conversation points:

```tsx
<Button onClick={() => createCheckpoint(messages.length - 1)}>
  Create Checkpoint
</Button>
```

### Automatic Checkpoints

Create checkpoints automatically after significant conversation milestones:

```tsx
useEffect(() => {
  // Create checkpoint every 5 messages
  if (messages.length > 0 && messages.length % 5 === 0) {
    createCheckpoint(messages.length - 1);
  }
}, [messages.length]);
```

### Branching Conversations

Use checkpoints to enable conversation branching where users can explore different conversation paths:

```tsx
const restoreAndBranch = (messageIndex: number) => {
  // Save current branch
  const currentBranch = messages.slice(messageIndex + 1);
  saveBranch(currentBranch);

  // Restore to checkpoint
  restoreToCheckpoint(messageIndex);
};
```

## Props

### `<Checkpoint />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `React.ReactNode` | - | The checkpoint icon and trigger components. Automatically includes a Separator at the end. |
| `...props` | `React.HTMLAttributes<HTMLDivElement>` | - | Any other props are spread to the root div. |

### `<CheckpointIcon />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `React.ReactNode` | - | Custom icon content. If not provided, defaults to a BookmarkIcon from lucide-react. |
| `...props` | `LucideProps` | - | Any other props are spread to the BookmarkIcon component. |

### `<CheckpointTrigger />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `React.ReactNode` | - | The text or content to display in the trigger button. |
| `variant` | `string` | - | The button variant style. |
| `size` | `string` | - | The button size. |
| `...props` | `React.ComponentProps<typeof Button>` | - | Any other props are spread to the underlying shadcn/ui Button component. |
