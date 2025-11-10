# ▲ AI Elements

A command-line interface for installing [AI Elements](https://ai-sdk.dev/elements) components - a component library built on top of [shadcn/ui](https://ui.shadcn.com/) to help you build AI-native applications faster.

## Overview

AI Elements provides pre-built, customizable React components specifically designed for AI applications, including conversations, messages, code blocks, reasoning displays, and more. The CLI makes it easy to add these components to your Next.js project.

## Installation

You can use the AI Elements CLI directly with npx, or install it globally:

```bash
# Use directly (recommended)
npx ai-elements@latest

# Or using shadcn cli
npx shadcn@latest add https://registry.ai-sdk.dev/all.json
```

## Prerequisites

Before using AI Elements, ensure your project meets these requirements:

- **Node.js** 18 or later
- **Next.js** project with [AI SDK](https://ai-sdk.dev/) installed
- **shadcn/ui** initialized in your project (`npx shadcn@latest init`)
- **Tailwind CSS** configured (AI Elements supports CSS Variables mode only)

## Usage

### Install All Components

Install all available AI Elements components at once:

```bash
npx ai-elements@latest
```

This command will:
- Set up shadcn/ui if not already configured
- Install all AI Elements components to your configured components directory
- Add necessary dependencies to your project

### Install Specific Components

Install individual components using the `add` command:

```bash
npx ai-elements@latest add <component-name>
```

Examples:
```bash
# Install the message component
npx ai-elements@latest add message

# Install the conversation component
npx ai-elements@latest add conversation

# Install the code-block component
npx ai-elements@latest add code-block
```

### Alternative: Use with shadcn CLI

You can also install components using the standard shadcn/ui CLI:

```bash
# Install all components
npx shadcn@latest add https://registry.ai-sdk.dev/all.json

# Install a specific component
npx shadcn@latest add https://registry.ai-sdk.dev/message.json
```

## Available Components

AI Elements includes the following components:

| Component | Description |
|-----------|-------------|
| `actions` | Interactive action buttons for AI responses |
| `branch` | Branch visualization for conversation flows |
| `code-block` | Syntax-highlighted code display with copy functionality |
| `conversation` | Container for chat conversations |
| `image` | AI-generated image display component |
| `inline-citation` | Inline source citations |
| `loader` | Loading states for AI operations |
| `message` | Individual chat messages with avatars |
| `prompt-form` | Controlled form wrapper for prompt submission |
| `prompt-input` | Advanced input component with model selection |
| `prompt-input-attachments` | Opt-in file/image attachments for prompt input |
| `reasoning` | Display AI reasoning and thought processes |
| `response` | Formatted AI response display |
| `source` | Source attribution component |
| `suggestion` | Quick action suggestions |
| `task` | Task completion tracking |
| `tool` | Tool usage visualization |
| `web-preview` | Embedded web page previews |

## Quick Start Example

After installing components, you can use them in your React application:

```tsx
'use client';

import { useChat } from '@ai-sdk/react';
import {
  Conversation,
  ConversationContent,
} from '@/components/ai-elements/conversation';
import {
  Message,
  MessageContent,
  MessageResponse,
} from '@/components/ai-elements/message';

export default function Chat() {
  const { messages } = useChat();

  return (
    <Conversation>
      <ConversationContent>
        {messages.map((message, index) => (
          <Message key={index} from={message.role}>
            <MessageContent>
              <MessageResponse>{message.content}</MessageResponse>
            </MessageContent>
          </Message>
        ))}
      </ConversationContent>
    </Conversation>
  );
}
```

## How It Works

The AI Elements CLI:

1. **Detects your package manager** (npm, pnpm, yarn, or bun) automatically
2. **Fetches component registry** from `https://registry.ai-sdk.dev/registry.json`
3. **Installs components** using the shadcn/ui CLI under the hood
4. **Adds dependencies** and integrates with your existing shadcn/ui setup

Components are installed to your configured shadcn/ui components directory (typically `@/components/ai-elements/`) and become part of your codebase, allowing for full customization.

## Configuration

AI Elements uses your existing shadcn/ui configuration. Components will be installed to the directory specified in your `components.json` file.

## Recommended Setup

For the best experience, we recommend:

1. **AI Gateway**: Set up [Vercel AI Gateway](https://vercel.com/docs/ai-gateway) and add `AI_GATEWAY_API_KEY` to your `.env.local`
2. **CSS Variables**: Use shadcn/ui's CSS Variables mode for theming
3. **TypeScript**: Enable TypeScript for better development experience

---

Made with ❤️ by [Vercel](https://vercel.com)
