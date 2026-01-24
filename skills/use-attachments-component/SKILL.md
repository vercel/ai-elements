---
name: Using the Attachments component from AI Elements
description: How to use the Attachments component to display file attachments in grid, inline, or list layouts.
---

# Attachments Component

The Attachments component displays file attachments with support for multiple layout variants (grid, inline, list), media previews, hover cards, and remove functionality. It handles images, videos, audio, documents, and source documents.

## Import

```tsx
import {
  Attachments,
  Attachment,
  AttachmentPreview,
  AttachmentInfo,
  AttachmentRemove,
  AttachmentHoverCard,
  AttachmentHoverCardTrigger,
  AttachmentHoverCardContent,
  AttachmentEmpty,
  getMediaCategory,
  getAttachmentLabel,
} from "@repo/elements/attachments";
```

## Sub-components

| Component | Purpose |
|-----------|---------|
| `Attachments` | Container with layout variant (grid/inline/list) |
| `Attachment` | Individual attachment item with context |
| `AttachmentPreview` | Media preview (image/video/icon) |
| `AttachmentInfo` | Filename and media type display |
| `AttachmentRemove` | Remove button with variant-specific styling |
| `AttachmentHoverCard` | Hover card wrapper for previews |
| `AttachmentHoverCardTrigger` | Trigger element for hover card |
| `AttachmentHoverCardContent` | Content shown on hover |
| `AttachmentEmpty` | Empty state placeholder |

## Basic Usage

### Grid Layout

```tsx
const Example = () => {
  const [attachments, setAttachments] = useState([
    { id: "1", type: "file", url: "image.jpg", mediaType: "image/jpeg", filename: "photo.jpg" },
  ]);

  return (
    <Attachments variant="grid">
      {attachments.map((attachment) => (
        <Attachment
          key={attachment.id}
          data={attachment}
          onRemove={() => setAttachments((prev) => prev.filter((a) => a.id !== attachment.id))}
        >
          <AttachmentPreview />
          <AttachmentRemove />
        </Attachment>
      ))}
    </Attachments>
  );
};
```

### Inline Layout

```tsx
<Attachments variant="inline">
  {attachments.map((attachment) => (
    <Attachment key={attachment.id} data={attachment}>
      <AttachmentPreview />
      <AttachmentInfo />
      <AttachmentRemove />
    </Attachment>
  ))}
</Attachments>
```

### List Layout

```tsx
<Attachments variant="list">
  {attachments.map((attachment) => (
    <Attachment key={attachment.id} data={attachment}>
      <AttachmentPreview />
      <AttachmentInfo showMediaType />
      <AttachmentRemove />
    </Attachment>
  ))}
</Attachments>
```

## Props Reference

### `<Attachments />`
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `"grid" \| "inline" \| "list"` | `"grid"` | Layout variant |
| `className` | `string` | - | Additional CSS classes |

### `<Attachment />`
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `data` | `AttachmentData` | Required | Attachment data (FileUIPart or SourceDocumentUIPart with id) |
| `onRemove` | `() => void` | - | Callback when remove is clicked |
| `className` | `string` | - | Additional CSS classes |

### `<AttachmentPreview />`
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `fallbackIcon` | `ReactNode` | - | Custom fallback icon |
| `className` | `string` | - | Additional CSS classes |

### `<AttachmentInfo />`
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `showMediaType` | `boolean` | `false` | Show media type below filename |
| `className` | `string` | - | Additional CSS classes |

### `<AttachmentRemove />`
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | `"Remove"` | Accessible label |
| `className` | `string` | - | Additional CSS classes |

### `<AttachmentHoverCard />`
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `openDelay` | `number` | `0` | Delay before opening |
| `closeDelay` | `number` | `0` | Delay before closing |

### `<AttachmentHoverCardContent />`
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `align` | `string` | `"start"` | Alignment of popover |
| `className` | `string` | - | Additional CSS classes |

## Utility Functions

### `getMediaCategory(data: AttachmentData): AttachmentMediaCategory`
Returns the media category: `"image"`, `"video"`, `"audio"`, `"document"`, `"source"`, or `"unknown"`.

### `getAttachmentLabel(data: AttachmentData): string`
Returns a display label for the attachment based on filename or type.

## Examples

See `scripts/` folder for complete working examples.
