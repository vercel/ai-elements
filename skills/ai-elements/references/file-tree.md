# File Tree

Display hierarchical file and folder structure with expand/collapse functionality.

The `FileTree` component displays a hierarchical file system structure with expandable folders and file selection.

See `scripts/file-tree.tsx` for this example.

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

See `scripts/file-tree-basic.tsx` for this example.

### With Selection

See `scripts/file-tree-selection.tsx` for this example.

### Default Expanded

See `scripts/file-tree-expanded.tsx` for this example.

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
