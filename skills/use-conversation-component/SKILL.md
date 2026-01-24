---
name: Using the Conversation component from AI Elements
description: How to use the Conversation component to display scrollable chat message threads with auto-scroll behavior.
---

# Conversation Component

A composable conversation container that provides auto-scrolling behavior for chat interfaces. Built on `use-stick-to-bottom` for smooth scroll behavior and automatic scroll-to-bottom functionality.

## Import

```tsx
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from "@repo/elements/conversation";
```

## Sub-components

| Component | Purpose |
|-----------|---------|
| `Conversation` | Root container with overflow handling and auto-scroll |
| `ConversationContent` | Content wrapper with flex column layout and gap spacing |
| `ConversationEmptyState` | Placeholder shown when no messages exist |
| `ConversationScrollButton` | Floating button to scroll to bottom when not at bottom |

## Basic Usage

```tsx
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from "@repo/elements/conversation";
import { Message, MessageContent } from "@repo/elements/message";

const ChatView = ({ messages }) => (
  <Conversation className="h-full">
    <ConversationContent>
      {messages.length === 0 ? (
        <ConversationEmptyState
          title="No messages yet"
          description="Start a conversation"
        />
      ) : (
        messages.map((msg) => (
          <Message from={msg.role} key={msg.id}>
            <MessageContent>{msg.content}</MessageContent>
          </Message>
        ))
      )}
    </ConversationContent>
    <ConversationScrollButton />
  </Conversation>
);
```

## Props Reference

### `<Conversation />`
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | - | Additional CSS classes |
| `...props` | `ComponentProps<typeof StickToBottom>` | - | All StickToBottom props supported |

### `<ConversationContent />`
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | - | Additional CSS classes |
| `children` | `ReactNode` | - | Message components |

### `<ConversationEmptyState />`
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | `"No messages yet"` | Heading text |
| `description` | `string` | `"Start a conversation to see messages here"` | Subtext |
| `icon` | `ReactNode` | - | Optional icon to display |
| `children` | `ReactNode` | - | Custom content (overrides title/description) |
| `className` | `string` | - | Additional CSS classes |

### `<ConversationScrollButton />`
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | - | Additional CSS classes |
| `...props` | `ComponentProps<typeof Button>` | - | All Button props supported |

## Examples

See `scripts/` folder for complete working examples.
