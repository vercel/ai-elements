---
name: Using the Artifact component from AI Elements
description: How to use the Artifact component to display generated content with actions and controls.
---

# Artifact Component

The Artifact component displays generated content (code, documents, etc.) in a panel with a header for metadata and action buttons. It provides a consistent UI for AI-generated artifacts.

## Import

```tsx
import {
  Artifact,
  ArtifactHeader,
  ArtifactClose,
  ArtifactTitle,
  ArtifactDescription,
  ArtifactActions,
  ArtifactAction,
  ArtifactContent,
} from "@repo/elements/artifact";
```

## Sub-components

| Component | Purpose |
|-----------|---------|
| `Artifact` | Root container with border and shadow |
| `ArtifactHeader` | Top bar with title, description, and actions |
| `ArtifactClose` | Close button for dismissing the artifact |
| `ArtifactTitle` | Main title text |
| `ArtifactDescription` | Secondary description text |
| `ArtifactActions` | Container for action buttons |
| `ArtifactAction` | Individual action button with tooltip support |
| `ArtifactContent` | Scrollable content area |

## Basic Usage

```tsx
import { CopyIcon, DownloadIcon, PlayIcon } from "lucide-react";

const Example = () => (
  <Artifact>
    <ArtifactHeader>
      <div>
        <ArtifactTitle>Generated Code</ArtifactTitle>
        <ArtifactDescription>Created just now</ArtifactDescription>
      </div>
      <ArtifactActions>
        <ArtifactAction icon={PlayIcon} tooltip="Run code" />
        <ArtifactAction icon={CopyIcon} tooltip="Copy to clipboard" />
        <ArtifactAction icon={DownloadIcon} tooltip="Download file" />
      </ArtifactActions>
    </ArtifactHeader>
    <ArtifactContent>
      {/* Your content here */}
    </ArtifactContent>
  </Artifact>
);
```

## Props Reference

### `<Artifact />`
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | - | Additional CSS classes |
| `...props` | `HTMLAttributes<HTMLDivElement>` | - | Standard div props |

### `<ArtifactHeader />`
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | - | Additional CSS classes |
| `...props` | `HTMLAttributes<HTMLDivElement>` | - | Standard div props |

### `<ArtifactClose />`
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `string` | `"sm"` | Button size |
| `variant` | `string` | `"ghost"` | Button variant |
| `className` | `string` | - | Additional CSS classes |
| `...props` | `ComponentProps<typeof Button>` | - | Button props |

### `<ArtifactTitle />`
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | - | Additional CSS classes |
| `...props` | `HTMLAttributes<HTMLParagraphElement>` | - | Standard p props |

### `<ArtifactDescription />`
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | - | Additional CSS classes |
| `...props` | `HTMLAttributes<HTMLParagraphElement>` | - | Standard p props |

### `<ArtifactActions />`
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | - | Additional CSS classes |
| `...props` | `HTMLAttributes<HTMLDivElement>` | - | Standard div props |

### `<ArtifactAction />`
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `tooltip` | `string` | - | Tooltip text on hover |
| `label` | `string` | - | Accessible label for screen readers |
| `icon` | `LucideIcon` | - | Icon component to display |
| `size` | `string` | `"sm"` | Button size |
| `variant` | `string` | `"ghost"` | Button variant |
| `className` | `string` | - | Additional CSS classes |

### `<ArtifactContent />`
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | - | Additional CSS classes |
| `...props` | `HTMLAttributes<HTMLDivElement>` | - | Standard div props |

## Examples

See `scripts/` folder for complete working examples.
