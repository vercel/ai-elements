# Attachments

A flexible, composable attachment component for displaying files, images, videos, audio, and source documents.

The `Attachment` component provides a unified way to display file attachments and source documents with multiple layout variants.

See `scripts/attachments.tsx` for this example.

## Installation

```bash
npx ai-elements@latest add attachments
```

## Usage with AI SDK

Display user-uploaded files in chat messages or input areas.

```tsx title="app/page.tsx"
"use client";

import {
  Attachments,
  Attachment,
  AttachmentPreview,
  AttachmentInfo,
  AttachmentRemove,
} from "@/components/ai-elements/attachments";
import type { FileUIPart } from "ai";

interface MessageProps {
  attachments: (FileUIPart & { id: string })[];
  onRemove?: (id: string) => void;
}

const MessageAttachments = ({ attachments, onRemove }: MessageProps) => (
  <Attachments variant="grid">
    {attachments.map((file) => (
      <Attachment
        key={file.id}
        data={file}
        onRemove={onRemove ? () => onRemove(file.id) : undefined}
      >
        <AttachmentPreview />
        <AttachmentRemove />
      </Attachment>
    ))}
  </Attachments>
);

export default MessageAttachments;
```

## Features

- Three display variants: grid (thumbnails), inline (badges), and list (rows)
- Supports both FileUIPart and SourceDocumentUIPart from the AI SDK
- Automatic media type detection (image, video, audio, document, source)
- Hover card support for inline previews
- Remove button with customizable callback
- Composable architecture for maximum flexibility
- Accessible with proper ARIA labels
- TypeScript support with exported utility functions

## Examples

### Grid Variant

Best for displaying attachments in messages with visual thumbnails.

See `scripts/attachments.tsx` for this example.

### Inline Variant

Best for compact badge-style display in input areas with hover previews.

See `scripts/attachments-inline.tsx` for this example.

### List Variant

Best for file lists with full metadata display.

See `scripts/attachments-list.tsx` for this example.

## Props

### `<Attachments />`

Container component that sets the layout variant.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `unknown` | - | The display layout variant. |
| `...props` | `React.HTMLAttributes<HTMLDivElement>` | - | Spread to the underlying div element. |

### `<Attachment />`

Individual attachment item wrapper.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `data` | `unknown` | - | The attachment data (FileUIPart or SourceDocumentUIPart with id). |
| `onRemove` | `() => void` | - | Callback fired when the remove button is clicked. |
| `...props` | `React.HTMLAttributes<HTMLDivElement>` | - | Spread to the underlying div element. |

### `<AttachmentPreview />`

Displays the media preview (image, video, or icon).

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `fallbackIcon` | `React.ReactNode` | - | Custom icon to display when no preview is available. |
| `...props` | `React.HTMLAttributes<HTMLDivElement>` | - | Spread to the underlying div element. |

### `<AttachmentInfo />`

Displays the filename and optional media type.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `showMediaType` | `boolean` | `false` | Whether to show the media type below the filename. |
| `...props` | `React.HTMLAttributes<HTMLDivElement>` | - | Spread to the underlying div element. |

### `<AttachmentRemove />`

Remove button that appears on hover.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | - | Screen reader label for the button. |
| `...props` | `React.ComponentProps<typeof Button>` | - | Spread to the underlying Button component. |

### `<AttachmentHoverCard />`

Wrapper for hover preview functionality.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `openDelay` | `number` | `0` | Delay in ms before opening the hover card. |
| `closeDelay` | `number` | `0` | Delay in ms before closing the hover card. |
| `...props` | `React.ComponentProps<typeof HoverCard>` | - | Spread to the underlying HoverCard component. |

### `<AttachmentHoverCardTrigger />`

Trigger element for the hover card.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `...props` | `React.ComponentProps<typeof HoverCardTrigger>` | - | Spread to the underlying HoverCardTrigger component. |

### `<AttachmentHoverCardContent />`

Content displayed in the hover card.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `align` | `unknown` | - | Alignment of the hover card content. |
| `...props` | `React.ComponentProps<typeof HoverCardContent>` | - | Spread to the underlying HoverCardContent component. |

### `<AttachmentEmpty />`

Empty state component when no attachments are present.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `...props` | `React.HTMLAttributes<HTMLDivElement>` | - | Spread to the underlying div element. |

## Utility Functions

### `getMediaCategory(data)`

Returns the media category for an attachment.

```tsx
import { getMediaCategory } from "@/components/ai-elements/attachments";

const category = getMediaCategory(attachment);
// Returns: "image" | "video" | "audio" | "document" | "source" | "unknown"
```

### `getAttachmentLabel(data)`

Returns the display label for an attachment.

```tsx
import { getAttachmentLabel } from "@/components/ai-elements/attachments";

const label = getAttachmentLabel(attachment);
// Returns filename or fallback like "Image" or "Attachment"
```
