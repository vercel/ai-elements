---
name: Using the File Tree component from AI Elements
description: Display hierarchical file and folder structure with expand/collapse functionality.
---

The `FileTree` component displays a hierarchical file system structure with expandable folders and file selection.



## Installation

```bash
npx ai-elements@latest add file-tree
```

## Features

- Hierarchical folder structure
- Expand/collapse folders
- File selection with callback
- Keyboard accessible
- Customizable icons
- Controlled and uncontrolled modes

## Examples

### Basic Usage



### With Selection



### Default Expanded



## Props

### `<FileTree />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `expanded` | `Set<string>` | - | Controlled expanded paths. |
| `defaultExpanded` | `Set<string>` | `new Set()` | Default expanded paths. |
| `selectedPath` | `string` | - | Currently selected file/folder path. |
| `onSelect` | `(path: string) => void` | - | Callback when a file/folder is selected. |
| `onExpandedChange` | `(expanded: Set<string>) => void` | - | Callback when expanded paths change. |
| `className` | `string` | - | Additional CSS classes. |

### `<FileTreeFolder />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `path` | `string` | - | Unique folder path. |
| `name` | `string` | - | Display name. |
| `className` | `string` | - | Additional CSS classes. |

### `<FileTreeFile />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `path` | `string` | - | Unique file path. |
| `name` | `string` | - | Display name. |
| `icon` | `ReactNode` | - | Custom file icon. |
| `className` | `string` | - | Additional CSS classes. |

### Subcomponents

- `FileTreeIcon` - Icon wrapper
- `FileTreeName` - Name text
- `FileTreeActions` - Action buttons container (stops click propagation)
