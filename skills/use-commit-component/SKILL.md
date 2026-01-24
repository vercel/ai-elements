---
name: Using the Commit component from AI Elements
description: How to use the Commit component to display git commit information with file changes.
---

# Commit Component

The Commit component displays git commit information including author, message, hash, timestamp, and file changes with additions/deletions. It features a collapsible design to show/hide file details.

## Import

```tsx
import {
  Commit,
  CommitHeader,
  CommitAuthor,
  CommitAuthorAvatar,
  CommitInfo,
  CommitMessage,
  CommitMetadata,
  CommitHash,
  CommitSeparator,
  CommitTimestamp,
  CommitActions,
  CommitCopyButton,
  CommitContent,
  CommitFiles,
  CommitFile,
  CommitFileInfo,
  CommitFileStatus,
  CommitFileIcon,
  CommitFilePath,
  CommitFileChanges,
  CommitFileAdditions,
  CommitFileDeletions,
} from "@repo/elements/commit";
```

## Sub-components

| Component | Purpose |
|-----------|---------|
| `Commit` | Root collapsible container |
| `CommitHeader` | Clickable header to expand/collapse |
| `CommitAuthor` | Author information container |
| `CommitAuthorAvatar` | Avatar with initials |
| `CommitInfo` | Container for message and metadata |
| `CommitMessage` | Commit message text |
| `CommitMetadata` | Hash and timestamp container |
| `CommitHash` | Short commit hash with icon |
| `CommitSeparator` | Bullet separator between metadata |
| `CommitTimestamp` | Relative time display |
| `CommitActions` | Action buttons container |
| `CommitCopyButton` | Copy hash to clipboard |
| `CommitContent` | Collapsible content for files |
| `CommitFiles` | Container for file list |
| `CommitFile` | Individual file row |
| `CommitFileInfo` | File status, icon, and path |
| `CommitFileStatus` | Status indicator (A/M/D/R) |
| `CommitFileIcon` | File icon |
| `CommitFilePath` | File path text |
| `CommitFileChanges` | Additions and deletions |
| `CommitFileAdditions` | Green additions count |
| `CommitFileDeletions` | Red deletions count |

## Basic Usage

```tsx
const files = [
  { path: "src/auth/login.tsx", status: "added", additions: 150, deletions: 0 },
  { path: "src/lib/session.ts", status: "modified", additions: 23, deletions: 8 },
];

const Example = () => (
  <Commit>
    <CommitHeader>
      <CommitAuthor>
        <CommitAuthorAvatar initials="HB" />
      </CommitAuthor>
      <CommitInfo>
        <CommitMessage>feat: Add user authentication flow</CommitMessage>
        <CommitMetadata>
          <CommitHash>a1b2c3d</CommitHash>
          <CommitSeparator />
          <CommitTimestamp date={new Date()} />
        </CommitMetadata>
      </CommitInfo>
      <CommitActions>
        <CommitCopyButton hash="a1b2c3d4e5f6" />
      </CommitActions>
    </CommitHeader>
    <CommitContent>
      <CommitFiles>
        {files.map((file) => (
          <CommitFile key={file.path}>
            <CommitFileInfo>
              <CommitFileStatus status={file.status} />
              <CommitFileIcon />
              <CommitFilePath>{file.path}</CommitFilePath>
            </CommitFileInfo>
            <CommitFileChanges>
              <CommitFileAdditions count={file.additions} />
              <CommitFileDeletions count={file.deletions} />
            </CommitFileChanges>
          </CommitFile>
        ))}
      </CommitFiles>
    </CommitContent>
  </Commit>
);
```

## Props Reference

### `<Commit />`
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | - | Additional CSS classes |
| `...props` | `ComponentProps<typeof Collapsible>` | - | Collapsible props |

### `<CommitHeader />`
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | - | Additional CSS classes |
| `children` | `ReactNode` | Required | Header content |

### `<CommitAuthorAvatar />`
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `initials` | `string` | Required | Two-letter initials |
| `className` | `string` | - | Additional CSS classes |

### `<CommitMessage />`
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | Required | Message text |
| `className` | `string` | - | Additional CSS classes |

### `<CommitHash />`
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | Required | Short hash (7 chars) |
| `className` | `string` | - | Additional CSS classes |

### `<CommitTimestamp />`
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `date` | `Date` | Required | Commit date |
| `children` | `ReactNode` | - | Custom time display (overrides default) |
| `className` | `string` | - | Additional CSS classes |

### `<CommitCopyButton />`
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `hash` | `string` | Required | Full commit hash to copy |
| `onCopy` | `() => void` | - | Callback on successful copy |
| `onError` | `(error: Error) => void` | - | Callback on copy error |
| `timeout` | `number` | `2000` | Reset copied state after ms |

### `<CommitFileStatus />`
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `status` | `"added" \| "modified" \| "deleted" \| "renamed"` | Required | File change status |
| `children` | `ReactNode` | - | Custom status label |
| `className` | `string` | - | Additional CSS classes |

### `<CommitFileAdditions />`
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `count` | `number` | Required | Number of lines added |
| `children` | `ReactNode` | - | Custom content |
| `className` | `string` | - | Additional CSS classes |

### `<CommitFileDeletions />`
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `count` | `number` | Required | Number of lines deleted |
| `children` | `ReactNode` | - | Custom content |
| `className` | `string` | - | Additional CSS classes |

## Examples

See `scripts/` folder for complete working examples.
