---
name: Using the PromptInput component from AI Elements
description: How to use the PromptInput component to build rich AI chat input fields with attachments, model selection, and more.
---

# PromptInput Component

A comprehensive chat input component with support for file attachments, model selection, action menus, hover cards, and streaming status indicators. Highly composable with many sub-components.

## Import

```tsx
import {
  PromptInput,
  PromptInputProvider,
  PromptInputBody,
  PromptInputTextarea,
  PromptInputHeader,
  PromptInputFooter,
  PromptInputTools,
  PromptInputButton,
  PromptInputSubmit,
  PromptInputActionMenu,
  PromptInputActionMenuTrigger,
  PromptInputActionMenuContent,
  PromptInputActionMenuItem,
  PromptInputActionAddAttachments,
  PromptInputSelect,
  PromptInputSelectTrigger,
  PromptInputSelectContent,
  PromptInputSelectItem,
  PromptInputSelectValue,
  PromptInputHoverCard,
  PromptInputHoverCardTrigger,
  PromptInputHoverCardContent,
  PromptInputCommand,
  PromptInputCommandInput,
  PromptInputCommandList,
  PromptInputCommandEmpty,
  PromptInputCommandGroup,
  PromptInputCommandItem,
  PromptInputCommandSeparator,
  PromptInputTab,
  PromptInputTabLabel,
  PromptInputTabBody,
  PromptInputTabItem,
  usePromptInputAttachments,
  usePromptInputController,
  usePromptInputReferencedSources,
  type PromptInputMessage,
} from "@repo/elements/prompt-input";
```

## Sub-components

| Component | Purpose |
|-----------|---------|
| `PromptInput` | Root form container with file handling |
| `PromptInputProvider` | Optional global state provider |
| `PromptInputBody` | Content container |
| `PromptInputTextarea` | Main text input with keyboard handling |
| `PromptInputHeader` | Header section for attachments/tabs |
| `PromptInputFooter` | Footer with tools and submit |
| `PromptInputTools` | Container for tool buttons |
| `PromptInputButton` | Generic button component |
| `PromptInputSubmit` | Submit button with status states |
| `PromptInputActionMenu` | Dropdown action menu |
| `PromptInputActionMenuTrigger` | Action menu trigger button |
| `PromptInputActionMenuContent` | Action menu content |
| `PromptInputActionMenuItem` | Action menu item |
| `PromptInputActionAddAttachments` | Add attachments action |
| `PromptInputSelect` | Select dropdown |
| `PromptInputHoverCard` | Hover card container |
| `PromptInputCommand` | Command palette |

## Basic Usage

```tsx
import {
  PromptInput,
  PromptInputBody,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
  type PromptInputMessage,
} from "@repo/elements/prompt-input";

const Example = () => {
  const handleSubmit = (message: PromptInputMessage) => {
    console.log("Message:", message.text);
    console.log("Files:", message.files);
  };

  return (
    <PromptInput onSubmit={handleSubmit}>
      <PromptInputBody>
        <PromptInputTextarea placeholder="Ask anything..." />
      </PromptInputBody>
      <PromptInputFooter>
        <PromptInputTools />
        <PromptInputSubmit />
      </PromptInputFooter>
    </PromptInput>
  );
};
```

## Props Reference

### `<PromptInput />`
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `onSubmit` | `(message: PromptInputMessage, event: FormEvent) => void \| Promise<void>` | - | Submit handler (required) |
| `accept` | `string` | - | File input accept attribute (e.g., "image/*") |
| `multiple` | `boolean` | `false` | Allow multiple file uploads |
| `globalDrop` | `boolean` | `false` | Accept drops anywhere on document |
| `maxFiles` | `number` | - | Maximum number of files |
| `maxFileSize` | `number` | - | Maximum file size in bytes |
| `onError` | `(err: { code: string; message: string }) => void` | - | Error callback |

### `<PromptInputTextarea />`
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `placeholder` | `string` | `"What would you like to know?"` | Placeholder text |
| `onChange` | `ChangeEventHandler` | - | Change handler |
| `onKeyDown` | `KeyboardEventHandler` | - | Key down handler |

### `<PromptInputSubmit />`
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `status` | `ChatStatus` | - | Current chat status |
| `onStop` | `() => void` | - | Stop generation callback |

## Hooks

### `usePromptInputAttachments()`
Access attachment state: `files`, `add()`, `remove()`, `clear()`, `openFileDialog()`

### `usePromptInputController()`
Access controlled state via `PromptInputProvider`: `textInput`, `attachments`

### `usePromptInputReferencedSources()`
Access referenced sources: `sources`, `add()`, `remove()`, `clear()`

## PromptInputMessage Type

```tsx
interface PromptInputMessage {
  text: string;
  files: FileUIPart[];
}
```

## Examples

See `scripts/` folder for complete working examples.
