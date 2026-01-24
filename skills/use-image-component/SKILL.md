---
name: Using the Image component from AI Elements
description: How to use the Image component to display AI-generated images from base64 data.
---

# Image Component

A simple image component for displaying AI-generated images from base64 data. Designed to work with the Vercel AI SDK's `Experimental_GeneratedImage` type.

## Import

```tsx
import { Image } from "@repo/elements/image";
```

## Sub-components

| Component | Purpose |
|-----------|---------|
| `Image` | Renders a base64-encoded image with rounded corners |

## Basic Usage

```tsx
import { Image } from "@repo/elements/image";

const GeneratedImageDisplay = ({ generatedImage }) => (
  <Image
    base64={generatedImage.base64}
    mediaType={generatedImage.mediaType}
    alt="AI generated image"
  />
);
```

## Props Reference

### `<Image />`
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `base64` | `string` | - | Base64-encoded image data (required) |
| `mediaType` | `string` | - | MIME type (e.g., "image/png") (required) |
| `uint8Array` | `Uint8Array` | - | Alternative binary data (from AI SDK) |
| `alt` | `string` | - | Alt text for accessibility |
| `className` | `string` | - | Additional CSS classes |

## Type Definition

The component extends `Experimental_GeneratedImage` from the Vercel AI SDK:

```tsx
type ImageProps = Experimental_GeneratedImage & {
  className?: string;
  alt?: string;
};
```

## Styling

Default styles applied:
- `h-auto max-w-full` - Responsive sizing
- `overflow-hidden rounded-md` - Rounded corners with overflow hidden

## Examples

See `scripts/` folder for complete working examples.
