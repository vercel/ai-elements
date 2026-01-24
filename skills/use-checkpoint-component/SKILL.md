---
name: Using the Checkpoint component from AI Elements
description: How to use the Checkpoint component to display conversation restore points.
---

# Checkpoint Component

The Checkpoint component displays a visual marker in conversations that allows users to restore to a previous state. It shows a separator line with a bookmark icon and restore trigger.

## Import

```tsx
import {
  Checkpoint,
  CheckpointIcon,
  CheckpointTrigger,
} from "@repo/elements/checkpoint";
```

## Sub-components

| Component | Purpose |
|-----------|---------|
| `Checkpoint` | Root container with separator line |
| `CheckpointIcon` | Bookmark icon (customizable) |
| `CheckpointTrigger` | Button to trigger restoration with optional tooltip |

## Basic Usage

```tsx
const Example = () => {
  const handleRestore = () => {
    // Restore conversation to this checkpoint
  };

  return (
    <Checkpoint>
      <CheckpointIcon />
      <CheckpointTrigger
        onClick={handleRestore}
        tooltip="Restores workspace and chat to this point"
      >
        Restore checkpoint
      </CheckpointTrigger>
    </Checkpoint>
  );
};
```

## With Conversation Context

```tsx
import { Conversation, ConversationContent } from "@repo/elements/conversation";
import { Message, MessageContent, MessageResponse } from "@repo/elements/message";

const Example = () => {
  const [messages, setMessages] = useState(initialMessages);
  const checkpoints = [{ messageCount: 2 }];

  const handleRestore = (messageCount: number) => {
    setMessages(initialMessages.slice(0, messageCount));
  };

  return (
    <Conversation>
      <ConversationContent>
        {messages.map((message, index) => {
          const checkpoint = checkpoints.find((cp) => cp.messageCount === index + 1);
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
                  <CheckpointTrigger onClick={() => handleRestore(checkpoint.messageCount)}>
                    Restore checkpoint
                  </CheckpointTrigger>
                </Checkpoint>
              )}
            </Fragment>
          );
        })}
      </ConversationContent>
    </Conversation>
  );
};
```

## Props Reference

### `<Checkpoint />`
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | - | Additional CSS classes |
| `children` | `ReactNode` | Required | Icon and trigger components |

### `<CheckpointIcon />`
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | - | Custom icon (defaults to BookmarkIcon) |
| `className` | `string` | - | Additional CSS classes |
| `...props` | `LucideProps` | - | Lucide icon props |

### `<CheckpointTrigger />`
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `tooltip` | `string` | - | Tooltip text on hover |
| `variant` | `string` | `"ghost"` | Button variant |
| `size` | `string` | `"sm"` | Button size |
| `children` | `ReactNode` | Required | Button text |
| `onClick` | `() => void` | - | Click handler |
| `...props` | `ComponentProps<typeof Button>` | - | Button props |

## Examples

See `scripts/` folder for complete working examples.
