---
name: Using the Queue component from AI Elements
description: How to use the Queue component to display queued messages and todo items with collapsible sections.
---

# Queue Component

A composable component for displaying queued messages and todo items with collapsible sections, status indicators, and attachment previews.

## Import

```tsx
import {
  Queue,
  QueueItem,
  QueueItemIndicator,
  QueueItemContent,
  QueueItemDescription,
  QueueItemActions,
  QueueItemAction,
  QueueItemAttachment,
  QueueItemImage,
  QueueItemFile,
  QueueList,
  QueueSection,
  QueueSectionTrigger,
  QueueSectionLabel,
  QueueSectionContent,
  type QueueMessage,
  type QueueTodo,
  type QueueMessagePart,
} from "@repo/elements/queue";
```

## Sub-components

| Component | Purpose |
|-----------|---------|
| `Queue` | Root container with styling |
| `QueueItem` | Individual queue item container |
| `QueueItemIndicator` | Status indicator dot |
| `QueueItemContent` | Item text content |
| `QueueItemDescription` | Secondary description text |
| `QueueItemActions` | Container for action buttons |
| `QueueItemAction` | Individual action button |
| `QueueItemAttachment` | Container for file attachments |
| `QueueItemImage` | Image attachment preview |
| `QueueItemFile` | File attachment badge |
| `QueueList` | Scrollable list container |
| `QueueSection` | Collapsible section |
| `QueueSectionTrigger` | Section header/toggle |
| `QueueSectionLabel` | Section label with count |
| `QueueSectionContent` | Collapsible content |

## Basic Usage

```tsx
import {
  Queue,
  QueueItem,
  QueueItemContent,
  QueueItemIndicator,
  QueueList,
  QueueSection,
  QueueSectionContent,
  QueueSectionLabel,
  QueueSectionTrigger,
} from "@repo/elements/queue";

const Example = () => (
  <Queue>
    <QueueSection>
      <QueueSectionTrigger>
        <QueueSectionLabel count={3} label="Queued" />
      </QueueSectionTrigger>
      <QueueSectionContent>
        <QueueList>
          <QueueItem>
            <div className="flex items-center gap-2">
              <QueueItemIndicator />
              <QueueItemContent>First queued message</QueueItemContent>
            </div>
          </QueueItem>
        </QueueList>
      </QueueSectionContent>
    </QueueSection>
  </Queue>
);
```

## Props Reference

### `<QueueItemIndicator />`
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `completed` | `boolean` | `false` | Shows completed state styling |

### `<QueueItemContent />`
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `completed` | `boolean` | `false` | Shows strikethrough styling |

### `<QueueItemDescription />`
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `completed` | `boolean` | `false` | Shows muted/strikethrough styling |

### `<QueueSectionLabel />`
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `count` | `number` | - | Number to display |
| `label` | `string` | - | Label text (required) |
| `icon` | `ReactNode` | - | Optional icon |

### `<QueueSection />`
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `defaultOpen` | `boolean` | `true` | Initial open state |

## Types

```tsx
interface QueueMessagePart {
  type: string;
  text?: string;
  url?: string;
  filename?: string;
  mediaType?: string;
}

interface QueueMessage {
  id: string;
  parts: QueueMessagePart[];
}

interface QueueTodo {
  id: string;
  title: string;
  description?: string;
  status?: "pending" | "completed";
}
```

## Examples

See `scripts/` folder for complete working examples.
