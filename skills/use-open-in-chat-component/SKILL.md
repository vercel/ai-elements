---
name: Using the OpenInChat component from AI Elements
description: How to use the OpenInChat component to add "open in chat" dropdown menus for multiple AI providers.
---

# OpenInChat Component

A dropdown menu component that allows users to open a query in various AI chat providers like ChatGPT, Claude, Cursor, T3 Chat, Scira, and v0.

## Import

```tsx
import {
  OpenIn,
  OpenInContent,
  OpenInTrigger,
  OpenInItem,
  OpenInLabel,
  OpenInSeparator,
  OpenInChatGPT,
  OpenInClaude,
  OpenInCursor,
  OpenInT3,
  OpenInScira,
  OpenInv0,
} from "@repo/elements/open-in-chat";
```

## Sub-components

| Component | Purpose |
|-----------|---------|
| `OpenIn` | Root container that provides query context |
| `OpenInTrigger` | Button that triggers the dropdown menu |
| `OpenInContent` | Dropdown menu content container |
| `OpenInItem` | Generic dropdown menu item |
| `OpenInLabel` | Label within the dropdown |
| `OpenInSeparator` | Separator line between items |
| `OpenInChatGPT` | Opens query in ChatGPT |
| `OpenInClaude` | Opens query in Claude |
| `OpenInCursor` | Opens query in Cursor |
| `OpenInT3` | Opens query in T3 Chat |
| `OpenInScira` | Opens query in Scira |
| `OpenInv0` | Opens query in v0 |

## Basic Usage

```tsx
import {
  OpenIn,
  OpenInChatGPT,
  OpenInClaude,
  OpenInContent,
  OpenInCursor,
  OpenInScira,
  OpenInT3,
  OpenInTrigger,
  OpenInv0,
} from "@repo/elements/open-in-chat";

const Example = () => {
  const sampleQuery = "How can I implement authentication in Next.js?";

  return (
    <OpenIn query={sampleQuery}>
      <OpenInTrigger />
      <OpenInContent>
        <OpenInChatGPT />
        <OpenInClaude />
        <OpenInCursor />
        <OpenInT3 />
        <OpenInScira />
        <OpenInv0 />
      </OpenInContent>
    </OpenIn>
  );
};
```

## Props Reference

### `<OpenIn />`
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `query` | `string` | - | The query text to send to AI providers (required) |

### `<OpenInTrigger />`
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | Default button | Custom trigger element |

### `<OpenInContent />`
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | `"w-[240px]"` | Additional CSS classes |

### Provider Components (`OpenInChatGPT`, `OpenInClaude`, etc.)
All provider components accept standard `DropdownMenuItem` props and automatically use the query from context.

## Examples

See `scripts/` folder for complete working examples.
