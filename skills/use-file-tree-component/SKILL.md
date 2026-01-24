---
name: Using the FileTree component from AI Elements
description: How to use the FileTree component to display hierarchical file and folder structures with expand/collapse and selection.
---

# FileTree Component

A composable file tree component for displaying hierarchical file structures with expandable folders, file selection, and keyboard navigation. Built on Radix Collapsible for smooth animations.

## Import

```tsx
import {
  FileTree,
  FileTreeFolder,
  FileTreeFile,
  FileTreeIcon,
  FileTreeName,
  FileTreeActions,
} from "@repo/elements/file-tree";
```

## Sub-components

| Component | Purpose |
|-----------|---------|
| `FileTree` | Root container with expansion and selection state |
| `FileTreeFolder` | Expandable folder with chevron and folder icon |
| `FileTreeFile` | File item with optional custom icon |
| `FileTreeIcon` | Icon wrapper for consistent sizing |
| `FileTreeName` | Truncated name display |
| `FileTreeActions` | Container for action buttons (stops event propagation) |

## Basic Usage

```tsx
import {
  FileTree,
  FileTreeFolder,
  FileTreeFile,
} from "@repo/elements/file-tree";

const ProjectTree = () => (
  <FileTree defaultExpanded={new Set(["src"])}>
    <FileTreeFolder name="src" path="src">
      <FileTreeFile name="index.ts" path="src/index.ts" />
      <FileTreeFile name="app.tsx" path="src/app.tsx" />
    </FileTreeFolder>
    <FileTreeFile name="package.json" path="package.json" />
  </FileTree>
);
```

## Props Reference

### `<FileTree />`
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `expanded` | `Set<string>` | - | Controlled expanded paths |
| `defaultExpanded` | `Set<string>` | `new Set()` | Initially expanded paths |
| `selectedPath` | `string` | - | Currently selected path |
| `onSelect` | `(path: string) => void` | - | Selection callback |
| `onExpandedChange` | `(expanded: Set<string>) => void` | - | Expansion change callback |
| `className` | `string` | - | Additional CSS classes |

### `<FileTreeFolder />`
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `path` | `string` | - | Unique path identifier (required) |
| `name` | `string` | - | Display name (required) |
| `className` | `string` | - | Additional CSS classes |

### `<FileTreeFile />`
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `path` | `string` | - | Unique path identifier (required) |
| `name` | `string` | - | Display name (required) |
| `icon` | `ReactNode` | `<FileIcon />` | Custom file icon |
| `className` | `string` | - | Additional CSS classes |

### `<FileTreeIcon />`
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | - | Icon element |
| `className` | `string` | - | Additional CSS classes |

### `<FileTreeName />`
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | - | Name text |
| `className` | `string` | - | Additional CSS classes |

### `<FileTreeActions />`
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | - | Action buttons |
| `className` | `string` | - | Additional CSS classes |

## Features

- Keyboard navigation with Enter/Space for selection
- Automatic folder/file icons with open/closed states
- Nested indentation with border lines
- Selection highlighting with muted background

## Examples

See `scripts/` folder for complete working examples.
