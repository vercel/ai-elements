# Agent

A composable component for displaying AI agent configuration with model, instructions, tools, and output schema.

The `Agent` component displays an interface for showing AI agent configuration details. It's designed to represent a configured agent from the AI SDK, showing the agent's model, system instructions, available tools (with expandable input schemas), and output schema.

See `scripts/agent.tsx` for this example.

## Installation

```bash
npx ai-elements@latest add agent
```

## Usage with AI SDK

Display an agent's configuration alongside your chat interface. Tools are displayed in an accordion where clicking the description expands to show the input schema.

```tsx title="app/page.tsx"
"use client";

import { tool } from "ai";
import { z } from "zod";
import {
  Agent,
  AgentContent,
  AgentHeader,
  AgentInstructions,
  AgentOutput,
  AgentTool,
  AgentTools,
} from "@/components/ai-elements/agent";

const webSearch = tool({
  description: "Search the web for information",
  inputSchema: z.object({
    query: z.string().describe("The search query"),
  }),
});

const readUrl = tool({
  description: "Read and parse content from a URL",
  inputSchema: z.object({
    url: z.string().url().describe("The URL to read"),
  }),
});

const outputSchema = `z.object({
  sentiment: z.enum(['positive', 'negative', 'neutral']),
  score: z.number(),
  summary: z.string(),
})`;

export default function Page() {
  return (
    <Agent>
      <AgentHeader
        name="Sentiment Analyzer"
        model="anthropic/claude-sonnet-4-5"
      />
      <AgentContent>
        <AgentInstructions>
          Analyze the sentiment of the provided text and return a structured
          analysis with sentiment classification, confidence score, and summary.
        </AgentInstructions>
        <AgentTools>
          <AgentTool tool={webSearch} value="web_search" />
          <AgentTool tool={readUrl} value="read_url" />
        </AgentTools>
        <AgentOutput schema={outputSchema} />
      </AgentContent>
    </Agent>
  );
}
```

## Features

- Model badge in header
- Instructions rendered as markdown
- Tools displayed as accordion items with expandable input schemas
- Output schema display with syntax highlighting
- Composable structure for flexible layouts
- Works with AI SDK `Tool` type

## Props

### `<Agent />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `...props` | `React.ComponentProps<` | - | Any props are spread to the root div. |

### `<AgentHeader />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `name` | `string` | Required | The name of the agent. |
| `model` | `string` | - | The model identifier (e.g.  |
| `...props` | `React.ComponentProps<` | - | Any other props are spread to the container div. |

### `<AgentContent />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `...props` | `React.ComponentProps<` | - | Any other props are spread to the container div. |

### `<AgentInstructions />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `string` | Required | The instruction text. |
| `...props` | `React.ComponentProps<` | - | Any other props are spread to the container div. |

### `<AgentTools />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `...props` | `React.ComponentProps<typeof Accordion>` | - | Any other props are spread to the Accordion component. |

### `<AgentTool />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `tool` | `Tool` | Required | The tool object from the AI SDK containing description and inputSchema. |
| `value` | `string` | Required | Unique identifier for the accordion item. |
| `...props` | `React.ComponentProps<typeof AccordionItem>` | - | Any other props are spread to the AccordionItem component. |

### `<AgentOutput />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `schema` | `string` | Required | The output schema as a string (displayed with syntax highlighting). |
| `...props` | `React.ComponentProps<` | - | Any other props are spread to the container div. |
