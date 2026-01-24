---
name: Using the Agent component from AI Elements
description: How to use the Agent component to display AI agent configurations with tools and instructions.
---

# Agent Component

The Agent component displays an AI agent's configuration, including its name, model, instructions, available tools, and output schema. It provides a clear visual representation of how an agent is set up.

## Import

```tsx
import {
  Agent,
  AgentHeader,
  AgentContent,
  AgentInstructions,
  AgentTools,
  AgentTool,
  AgentOutput,
} from "@repo/elements/agent";
```

## Sub-components

| Component | Purpose |
|-----------|---------|
| `Agent` | Root container for the agent display |
| `AgentHeader` | Displays agent name and model badge |
| `AgentContent` | Container for instructions, tools, and output |
| `AgentInstructions` | Displays the agent's system instructions |
| `AgentTools` | Accordion container for available tools |
| `AgentTool` | Individual tool item showing description and schema |
| `AgentOutput` | Displays the expected output schema |

## Basic Usage

```tsx
import { z } from "zod";

const searchTool = {
  description: "Search the web for information",
  inputSchema: z.object({
    query: z.string().describe("The search query"),
  }),
};

const Example = () => (
  <Agent>
    <AgentHeader name="Research Assistant" model="anthropic/claude-sonnet-4-5" />
    <AgentContent>
      <AgentInstructions>
        You are a helpful research assistant.
      </AgentInstructions>
      <AgentTools>
        <AgentTool tool={searchTool} value="web_search" />
      </AgentTools>
      <AgentOutput schema={`z.object({ result: z.string() })`} />
    </AgentContent>
  </Agent>
);
```

## Props Reference

### `<Agent />`
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | - | Additional CSS classes |
| `...props` | `ComponentProps<"div">` | - | Standard div props |

### `<AgentHeader />`
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `name` | `string` | Required | The agent's display name |
| `model` | `string` | - | Optional model identifier to display as badge |
| `className` | `string` | - | Additional CSS classes |

### `<AgentContent />`
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | - | Additional CSS classes |
| `...props` | `ComponentProps<"div">` | - | Standard div props |

### `<AgentInstructions />`
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `string` | Required | The instruction text to display |
| `className` | `string` | - | Additional CSS classes |

### `<AgentTools />`
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | - | Additional CSS classes |
| `...props` | `ComponentProps<typeof Accordion>` | - | Accordion props |

### `<AgentTool />`
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `tool` | `Tool` | Required | The tool object with description and schema |
| `value` | `string` | Required | Unique identifier for the accordion item |
| `className` | `string` | - | Additional CSS classes |

### `<AgentOutput />`
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `schema` | `string` | Required | TypeScript/Zod schema string to display |
| `className` | `string` | - | Additional CSS classes |

## Examples

See `scripts/` folder for complete working examples.
