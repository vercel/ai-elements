---
name: Using the Message component from AI Elements
description: How to use the Message component to display chat messages with actions, branching, and markdown rendering.
---

# Message Component

A comprehensive message component system for chat interfaces. Supports user and assistant messages, action buttons, response branching (regeneration), and markdown rendering via Streamdown.

## Import

```tsx
import {
  Message,
  MessageContent,
  MessageActions,
  MessageAction,
  MessageBranch,
  MessageBranchContent,
  MessageBranchSelector,
  MessageBranchPrevious,
  MessageBranchNext,
  MessageBranchPage,
  MessageResponse,
  MessageToolbar,
} from "@repo/elements/message";
```

## Sub-components

| Component | Purpose |
|-----------|---------|
| `Message` | Root container with user/assistant styling |
| `MessageContent` | Content wrapper with role-based styles |
| `MessageActions` | Container for action buttons |
| `MessageAction` | Individual action button with optional tooltip |
| `MessageBranch` | Container for response branching/regeneration |
| `MessageBranchContent` | Renders branch children with visibility toggle |
| `MessageBranchSelector` | Button group for branch navigation |
| `MessageBranchPrevious` | Previous branch button |
| `MessageBranchNext` | Next branch button |
| `MessageBranchPage` | Current/total display (e.g., "1 of 3") |
| `MessageResponse` | Markdown renderer with code/mermaid/math support |
| `MessageToolbar` | Bottom toolbar for actions and branch selector |

## Basic Usage

```tsx
import {
  Message,
  MessageContent,
  MessageResponse,
} from "@repo/elements/message";

const ChatMessage = ({ message }) => (
  <Message from={message.role}>
    <MessageContent>
      {message.role === "assistant" ? (
        <MessageResponse>{message.content}</MessageResponse>
      ) : (
        message.content
      )}
    </MessageContent>
  </Message>
);
```

## With Actions

```tsx
import {
  Message,
  MessageContent,
  MessageActions,
  MessageAction,
  MessageResponse,
} from "@repo/elements/message";
import { CopyIcon, ThumbsUpIcon, RefreshCcwIcon } from "lucide-react";

const AssistantMessage = ({ content }) => (
  <Message from="assistant">
    <MessageContent>
      <MessageResponse>{content}</MessageResponse>
    </MessageContent>
    <MessageActions>
      <MessageAction tooltip="Regenerate" label="Retry">
        <RefreshCcwIcon className="size-4" />
      </MessageAction>
      <MessageAction tooltip="Like" label="Like">
        <ThumbsUpIcon className="size-4" />
      </MessageAction>
      <MessageAction tooltip="Copy" label="Copy">
        <CopyIcon className="size-4" />
      </MessageAction>
    </MessageActions>
  </Message>
);
```

## With Branching

```tsx
import {
  Message,
  MessageBranch,
  MessageBranchContent,
  MessageBranchSelector,
  MessageBranchPrevious,
  MessageBranchPage,
  MessageBranchNext,
  MessageContent,
  MessageResponse,
  MessageToolbar,
} from "@repo/elements/message";

const BranchedMessage = ({ versions }) => (
  <Message from="assistant">
    <MessageBranch defaultBranch={0}>
      <MessageBranchContent>
        {versions.map((version) => (
          <MessageContent key={version.id}>
            <MessageResponse>{version.content}</MessageResponse>
          </MessageContent>
        ))}
      </MessageBranchContent>
      <MessageToolbar>
        <MessageBranchSelector from="assistant">
          <MessageBranchPrevious />
          <MessageBranchPage />
          <MessageBranchNext />
        </MessageBranchSelector>
      </MessageToolbar>
    </MessageBranch>
  </Message>
);
```

## Props Reference

### `<Message />`
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `from` | `"user" \| "assistant" \| "system" \| "tool"` | - | Message role (required) |
| `className` | `string` | - | Additional CSS classes |

### `<MessageContent />`
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `"default" \| "flat"` | `"default"` | Styling variant |
| `className` | `string` | - | Additional CSS classes |

### `<MessageAction />`
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `tooltip` | `string` | - | Tooltip text on hover |
| `label` | `string` | - | Accessibility label |
| `variant` | `string` | `"ghost"` | Button variant |
| `size` | `string` | `"icon-sm"` | Button size |

### `<MessageBranch />`
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `defaultBranch` | `number` | `0` | Initial branch index |
| `onBranchChange` | `(index: number) => void` | - | Branch change callback |

### `<MessageResponse />`
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `string` | - | Markdown content |
| `className` | `string` | - | Additional CSS classes |

## Examples

See `scripts/` folder for complete working examples.
