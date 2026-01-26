# Open In Chat

A dropdown menu for opening queries in various AI chat platforms including ChatGPT, Claude, T3, Scira, and v0.

The `OpenIn` component provides a dropdown menu that allows users to open queries in different AI chat platforms with a single click.

See `scripts/open-in-chat.tsx` for this example.

## Installation

```bash
npx ai-elements@latest add open-in-chat
```

## Features

- Pre-configured links to popular AI chat platforms
- Context-based query passing for cleaner API
- Customizable dropdown trigger button
- Automatic URL parameter encoding for queries
- Support for ChatGPT, Claude, T3 Chat, Scira AI, v0, and Cursor
- Branded icons for each platform
- TypeScript support with proper type definitions
- Accessible dropdown menu with keyboard navigation
- External link indicators for clarity

## Supported Platforms

- **ChatGPT** - Opens query in OpenAI's ChatGPT with search hints
- **Claude** - Opens query in Anthropic's Claude AI
- **T3 Chat** - Opens query in T3 Chat platform
- **Scira AI** - Opens query in Scira's AI assistant
- **v0** - Opens query in Vercel's v0 platform
- **Cursor** - Opens query in Cursor AI editor

## Props

### `<OpenIn />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `query` | `string` | - | The query text to be sent to all AI platforms. |
| `...props` | `React.ComponentProps<typeof DropdownMenu>` | - | Props to spread to the underlying radix-ui DropdownMenu component. |

### `<OpenInTrigger />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `React.ReactNode` | - | Custom trigger button. |
| `...props` | `React.ComponentProps<typeof DropdownMenuTrigger>` | - | Props to spread to the underlying DropdownMenuTrigger component. |

### `<OpenInContent />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | - | Additional CSS classes to apply to the dropdown content. |
| `...props` | `React.ComponentProps<typeof DropdownMenuContent>` | - | Props to spread to the underlying DropdownMenuContent component. |

### `<OpenInChatGPT />`, `<OpenInClaude />`, `<OpenInT3 />`, `<OpenInScira />`, `<OpenInv0 />`, `<OpenInCursor />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `...props` | `React.ComponentProps<typeof DropdownMenuItem>` | - | Props to spread to the underlying DropdownMenuItem component. The query is automatically provided via context from the parent OpenIn component. |

### `<OpenInItem />`, `<OpenInLabel />`, `<OpenInSeparator />`

Additional composable components for custom dropdown menu items, labels, and separators that follow the same props pattern as their underlying radix-ui counterparts.
