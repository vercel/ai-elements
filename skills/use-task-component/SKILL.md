---
name: Using the Task component from AI Elements
description: How to use the Task component to display collapsible task progress with file references.
---

# Task Component

A collapsible component for displaying task progress, search results, and file operations. Commonly used to show what an AI agent is doing during processing.

## Import

```tsx
import {
  Task,
  TaskTrigger,
  TaskContent,
  TaskItem,
  TaskItemFile,
} from "@repo/elements/task";
```

## Sub-components

| Component | Purpose |
|-----------|---------|
| `Task` | Root collapsible container |
| `TaskTrigger` | Clickable header with title and expand icon |
| `TaskContent` | Collapsible content area for task items |
| `TaskItem` | Individual task/action item |
| `TaskItemFile` | Styled file reference badge |

## Basic Usage

```tsx
const Example = () => (
  <Task>
    <TaskTrigger title="Found project files" />
    <TaskContent>
      <TaskItem>Searching "app/page.tsx, components structure"</TaskItem>
      <TaskItem>
        <span className="inline-flex items-center gap-1">
          Read
          <TaskItemFile>
            <FileIcon className="size-4" />
            <span>page.tsx</span>
          </TaskItemFile>
        </span>
      </TaskItem>
      <TaskItem>Scanning 52 files</TaskItem>
    </TaskContent>
  </Task>
);
```

## Props Reference

### `<Task />`
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `defaultOpen` | `boolean` | `true` | Initial open state |
| `className` | `string` | - | Additional CSS classes |
| `...props` | `ComponentProps<typeof Collapsible>` | - | Props passed to Collapsible |

### `<TaskTrigger />`
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | Required | Title text displayed in the trigger |
| `children` | `ReactNode` | - | Custom trigger content (overrides default) |
| `className` | `string` | - | Additional CSS classes |
| `...props` | `ComponentProps<typeof CollapsibleTrigger>` | - | Props passed to CollapsibleTrigger |

### `<TaskContent />`
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | - | Additional CSS classes |
| `children` | `ReactNode` | - | TaskItem components |
| `...props` | `ComponentProps<typeof CollapsibleContent>` | - | Props passed to CollapsibleContent |

### `<TaskItem />`
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | - | Additional CSS classes |
| `children` | `ReactNode` | - | Task description content |
| `...props` | `ComponentProps<"div">` | - | Standard div props |

### `<TaskItemFile />`
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | - | Additional CSS classes |
| `children` | `ReactNode` | - | File icon and name |
| `...props` | `ComponentProps<"div">` | - | Standard div props |

## Examples

See `scripts/` folder for complete working examples.
