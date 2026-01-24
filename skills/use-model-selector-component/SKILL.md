---
name: Using the ModelSelector component from AI Elements
description: How to use the ModelSelector component to select AI models with searchable grouped lists and provider logos.
---

# ModelSelector Component

A composable model selector for choosing AI models. Features a searchable dialog interface with grouped models by provider, provider logos from models.dev, and keyboard navigation. Built on shadcn/ui Dialog and Command components.

## Import

```tsx
import {
  ModelSelector,
  ModelSelectorTrigger,
  ModelSelectorContent,
  ModelSelectorDialog,
  ModelSelectorInput,
  ModelSelectorList,
  ModelSelectorEmpty,
  ModelSelectorGroup,
  ModelSelectorItem,
  ModelSelectorSeparator,
  ModelSelectorShortcut,
  ModelSelectorLogo,
  ModelSelectorLogoGroup,
  ModelSelectorName,
} from "@repo/elements/model-selector";
```

## Sub-components

| Component | Purpose |
|-----------|---------|
| `ModelSelector` | Root Dialog wrapper |
| `ModelSelectorTrigger` | Dialog trigger button |
| `ModelSelectorContent` | Dialog content with Command wrapper |
| `ModelSelectorDialog` | Alternative CommandDialog wrapper |
| `ModelSelectorInput` | Search input for filtering models |
| `ModelSelectorList` | Scrollable list container |
| `ModelSelectorEmpty` | Empty state when no results |
| `ModelSelectorGroup` | Group with heading (e.g., by provider) |
| `ModelSelectorItem` | Individual model option |
| `ModelSelectorSeparator` | Visual separator between groups |
| `ModelSelectorShortcut` | Keyboard shortcut display |
| `ModelSelectorLogo` | Provider logo from models.dev |
| `ModelSelectorLogoGroup` | Stacked logo group for multi-provider models |
| `ModelSelectorName` | Model name with truncation |

## Basic Usage

```tsx
import {
  ModelSelector,
  ModelSelectorTrigger,
  ModelSelectorContent,
  ModelSelectorInput,
  ModelSelectorList,
  ModelSelectorEmpty,
  ModelSelectorGroup,
  ModelSelectorItem,
  ModelSelectorLogo,
  ModelSelectorName,
} from "@repo/elements/model-selector";
import { Button } from "@repo/shadcn-ui/components/ui/button";

const models = [
  { id: "gpt-4o", name: "GPT-4o", provider: "openai" },
  { id: "claude-3.5-sonnet", name: "Claude 3.5 Sonnet", provider: "anthropic" },
];

const ModelPicker = () => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState("gpt-4o");

  return (
    <ModelSelector open={open} onOpenChange={setOpen}>
      <ModelSelectorTrigger asChild>
        <Button variant="outline">
          {models.find((m) => m.id === selected)?.name}
        </Button>
      </ModelSelectorTrigger>
      <ModelSelectorContent>
        <ModelSelectorInput placeholder="Search models..." />
        <ModelSelectorList>
          <ModelSelectorEmpty>No models found.</ModelSelectorEmpty>
          <ModelSelectorGroup heading="Models">
            {models.map((model) => (
              <ModelSelectorItem
                key={model.id}
                value={model.id}
                onSelect={() => {
                  setSelected(model.id);
                  setOpen(false);
                }}
              >
                <ModelSelectorLogo provider={model.provider} />
                <ModelSelectorName>{model.name}</ModelSelectorName>
              </ModelSelectorItem>
            ))}
          </ModelSelectorGroup>
        </ModelSelectorList>
      </ModelSelectorContent>
    </ModelSelector>
  );
};
```

## With Provider Logos

```tsx
<ModelSelectorItem value={model.id}>
  <ModelSelectorLogo provider={model.provider} />
  <ModelSelectorName>{model.name}</ModelSelectorName>
  <ModelSelectorLogoGroup>
    {model.providers.map((p) => (
      <ModelSelectorLogo key={p} provider={p} />
    ))}
  </ModelSelectorLogoGroup>
</ModelSelectorItem>
```

## Props Reference

### `<ModelSelector />`
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `open` | `boolean` | - | Controlled open state |
| `onOpenChange` | `(open: boolean) => void` | - | Open state callback |
| `...props` | `ComponentProps<typeof Dialog>` | - | All Dialog props |

### `<ModelSelectorContent />`
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `ReactNode` | `"Model Selector"` | Dialog title (sr-only) |
| `className` | `string` | - | Additional CSS classes |

### `<ModelSelectorLogo />`
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `provider` | `string` | - | Provider slug (e.g., "openai", "anthropic") |
| `className` | `string` | - | Additional CSS classes |

Supported providers include: `openai`, `anthropic`, `google`, `google-vertex`, `amazon-bedrock`, `azure`, `mistral`, `groq`, `togetherai`, `perplexity`, `deepseek`, `xai`, `llama`, `alibaba`, `cohere`, `fireworks-ai`, `openrouter`, and many more.

### `<ModelSelectorGroup />`
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `heading` | `string` | - | Group heading text |
| `...props` | `ComponentProps<typeof CommandGroup>` | - | All CommandGroup props |

### `<ModelSelectorItem />`
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | - | Item value for selection |
| `onSelect` | `() => void` | - | Selection callback |
| `...props` | `ComponentProps<typeof CommandItem>` | - | All CommandItem props |

## Examples

See `scripts/` folder for complete working examples.
