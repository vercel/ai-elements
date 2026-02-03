# Model Selector

A searchable command palette for selecting AI models in your chat interface.

The `ModelSelector` component provides a searchable command palette interface for selecting AI models. It's built on top of the cmdk library and provides a keyboard-navigable interface with search functionality.

See `scripts/model-selector.tsx` for this example.

## Installation

```bash
npx ai-elements@latest add model-selector
```

## Features

- Searchable interface with keyboard navigation
- Fuzzy search filtering across model names
- Grouped model organization by provider
- Keyboard shortcuts support
- Empty state handling
- Customizable styling with Tailwind CSS
- Built on cmdk for excellent accessibility
- TypeScript support with proper type definitions

## Props

### `<ModelSelector />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `...props` | `React.ComponentProps<typeof Dialog>` | - | Any other props are spread to the underlying Dialog component. |

### `<ModelSelectorTrigger />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `...props` | `React.ComponentProps<typeof DialogTrigger>` | - | Any other props are spread to the underlying DialogTrigger component. |

### `<ModelSelectorContent />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `ReactNode` | - | Accessible title for the dialog (rendered in sr-only). |
| `...props` | `React.ComponentProps<typeof DialogContent>` | - | Any other props are spread to the underlying DialogContent component. |

### `<ModelSelectorDialog />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `...props` | `React.ComponentProps<typeof CommandDialog>` | - | Any other props are spread to the underlying CommandDialog component. |

### `<ModelSelectorInput />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `...props` | `React.ComponentProps<typeof CommandInput>` | - | Any other props are spread to the underlying CommandInput component. |

### `<ModelSelectorList />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `...props` | `React.ComponentProps<typeof CommandList>` | - | Any other props are spread to the underlying CommandList component. |

### `<ModelSelectorEmpty />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `...props` | `React.ComponentProps<typeof CommandEmpty>` | - | Any other props are spread to the underlying CommandEmpty component. |

### `<ModelSelectorGroup />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `...props` | `React.ComponentProps<typeof CommandGroup>` | - | Any other props are spread to the underlying CommandGroup component. |

### `<ModelSelectorItem />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `...props` | `React.ComponentProps<typeof CommandItem>` | - | Any other props are spread to the underlying CommandItem component. |

### `<ModelSelectorShortcut />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `...props` | `React.ComponentProps<typeof CommandShortcut>` | - | Any other props are spread to the underlying CommandShortcut component. |

### `<ModelSelectorSeparator />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `...props` | `React.ComponentProps<typeof CommandSeparator>` | - | Any other props are spread to the underlying CommandSeparator component. |

### `<ModelSelectorLogo />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `provider` | `string` | Required | The AI provider name. Supports major providers like  |
| `...props` | `Omit<React.ComponentProps<` | - | Any other props are spread to the underlying img element (except src and alt which are generated). |

### `<ModelSelectorLogoGroup />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `...props` | `React.ComponentProps<` | - | Any other props are spread to the underlying div element. |

### `<ModelSelectorName />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `...props` | `React.ComponentProps<` | - | Any other props are spread to the underlying span element. |
