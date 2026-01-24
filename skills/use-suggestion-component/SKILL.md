---
name: Using the Suggestion component from AI Elements
description: How to use the Suggestion component to display clickable prompt suggestions.
---

# Suggestion Component

A horizontally scrollable list of suggestion chips/pills that users can click to quickly fill in prompts or select options.

## Import

```tsx
import { Suggestions, Suggestion } from "@repo/elements/suggestion";
```

## Sub-components

| Component | Purpose |
|-----------|---------|
| `Suggestions` | Scrollable container for suggestion chips |
| `Suggestion` | Individual clickable suggestion button |

## Basic Usage

```tsx
const suggestions = [
  "What are the latest trends in AI?",
  "How does machine learning work?",
  "Explain quantum computing",
  "Best practices for React development",
];

const Example = () => {
  const handleSuggestionClick = (suggestion: string) => {
    console.log("Selected suggestion:", suggestion);
  };

  return (
    <Suggestions>
      {suggestions.map((suggestion) => (
        <Suggestion
          key={suggestion}
          onClick={handleSuggestionClick}
          suggestion={suggestion}
        />
      ))}
    </Suggestions>
  );
};
```

## Props Reference

### `<Suggestions />`
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | - | Additional CSS classes for the flex container |
| `children` | `ReactNode` | - | Suggestion components |
| `...props` | `ComponentProps<typeof ScrollArea>` | - | Props passed to ScrollArea |

### `<Suggestion />`
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `suggestion` | `string` | Required | The suggestion text |
| `onClick` | `(suggestion: string) => void` | - | Callback when suggestion is clicked, receives the suggestion string |
| `variant` | `"default" \| "outline" \| ...` | `"outline"` | Button variant |
| `size` | `"default" \| "sm" \| "lg"` | `"sm"` | Button size |
| `className` | `string` | - | Additional CSS classes |
| `children` | `ReactNode` | - | Custom content (overrides suggestion text) |
| `...props` | `Omit<ComponentProps<typeof Button>, "onClick">` | - | Standard Button props |

## Integration with PromptInput

```tsx
const Example = () => {
  const [text, setText] = useState("");

  const handleSuggestionClick = (suggestion: string) => {
    setText(suggestion);
  };

  return (
    <div className="grid gap-4">
      <Suggestions>
        {suggestions.map((suggestion) => (
          <Suggestion
            key={suggestion.key}
            onClick={handleSuggestionClick}
            suggestion={suggestion.value}
          />
        ))}
      </Suggestions>
      <PromptInput onSubmit={handleSubmit}>
        <PromptInputTextarea
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </PromptInput>
    </div>
  );
};
```

## Examples

See `scripts/` folder for complete working examples.
