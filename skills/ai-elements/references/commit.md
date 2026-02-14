# Commit

Display commit information with hash, message, author, and file changes.

The `Commit` component displays commit details including hash, message, author, timestamp, and changed files.

See `scripts/commit.tsx` for this example.

## Installation

```bash
npx ai-elements@latest add commit
```

## Features

- Commit hash display with copy button
- Author avatar with initials
- Relative timestamp formatting
- Collapsible file changes list
- Color-coded file status (added/modified/deleted/renamed)
- Line additions/deletions count

## File Status

| Status     | Label | Color  |
| ---------- | ----- | ------ |
| `added`    | A     | Green  |
| `modified` | M     | Yellow |
| `deleted`  | D     | Red    |
| `renamed`  | R     | Blue   |

## Props

### `<Commit />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `...props` | `React.ComponentProps<typeof Collapsible>` | - | Spread to the Collapsible component. |

### `<CommitHeader />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `...props` | `React.ComponentProps<typeof CollapsibleTrigger>` | - | Spread to the CollapsibleTrigger component. |

### `<CommitAuthor />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `...props` | `React.HTMLAttributes<HTMLDivElement>` | - | Spread to the container div. |

### `<CommitAuthorAvatar />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `initials` | `string` | Required | Author initials to display. |
| `...props` | `React.ComponentProps<typeof Avatar>` | - | Spread to the Avatar component. |

### `<CommitInfo />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `...props` | `React.HTMLAttributes<HTMLDivElement>` | - | Spread to the container div. |

### `<CommitMessage />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `...props` | `React.HTMLAttributes<HTMLSpanElement>` | - | Spread to the span element. |

### `<CommitMetadata />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `...props` | `React.HTMLAttributes<HTMLDivElement>` | - | Spread to the container div. |

### `<CommitHash />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `...props` | `React.HTMLAttributes<HTMLSpanElement>` | - | Spread to the span element. |

### `<CommitSeparator />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `React.ReactNode` | - | Custom separator content. |
| `...props` | `React.HTMLAttributes<HTMLSpanElement>` | - | Spread to the span element. |

### `<CommitTimestamp />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `date` | `Date` | Required | Commit date. |
| `children` | `React.ReactNode` | - | Custom timestamp content. Defaults to relative time. |
| `...props` | `React.HTMLAttributes<HTMLTimeElement>` | - | Spread to the time element. |

### `<CommitActions />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `...props` | `React.HTMLAttributes<HTMLDivElement>` | - | Spread to the container div. |

### `<CommitCopyButton />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `hash` | `string` | Required | Commit hash to copy. |
| `onCopy` | `() => void` | - | Callback after successful copy. |
| `onError` | `(error: Error) => void` | - | Callback if copying fails. |
| `timeout` | `number` | `2000` | Duration to show copied state (ms). |
| `...props` | `React.ComponentProps<typeof Button>` | - | Spread to the Button component. |

### `<CommitContent />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `...props` | `React.ComponentProps<typeof CollapsibleContent>` | - | Spread to the CollapsibleContent component. |

### `<CommitFiles />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `...props` | `React.HTMLAttributes<HTMLDivElement>` | - | Spread to the container div. |

### `<CommitFile />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `...props` | `React.HTMLAttributes<HTMLDivElement>` | - | Spread to the row div. |

### `<CommitFileInfo />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `...props` | `React.HTMLAttributes<HTMLDivElement>` | - | Spread to the container div. |

### `<CommitFileStatus />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `status` | `unknown` | Required | File change status. |
| `children` | `React.ReactNode` | - | Custom status label. |
| `...props` | `React.HTMLAttributes<HTMLSpanElement>` | - | Spread to the span element. |

### `<CommitFileIcon />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `...props` | `React.ComponentProps<typeof FileIcon>` | - | Spread to the FileIcon component. |

### `<CommitFilePath />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `...props` | `React.HTMLAttributes<HTMLSpanElement>` | - | Spread to the span element. |

### `<CommitFileChanges />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `...props` | `React.HTMLAttributes<HTMLDivElement>` | - | Spread to the container div. |

### `<CommitFileAdditions />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `count` | `number` | Required | Number of lines added. |
| `...props` | `React.HTMLAttributes<HTMLSpanElement>` | - | Spread to the span element. |

### `<CommitFileDeletions />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `count` | `number` | Required | Number of lines deleted. |
| `...props` | `React.HTMLAttributes<HTMLSpanElement>` | - | Spread to the span element. |
