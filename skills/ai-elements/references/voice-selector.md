# Voice Selector

A composable dialog component for selecting AI voices with metadata display and search functionality.

The `VoiceSelector` component provides a flexible and composable interface for selecting AI voices. Built on shadcn/ui's Dialog and Command components, it features a searchable voice list with support for metadata display (gender, accent, age), grouping, and customizable layouts. The component includes a context provider for accessing voice selection state from any nested component.

See `scripts/voice-selector.tsx` for this example.

## Installation

```bash
npx ai-elements@latest add voice-selector
```

## Features

- Fully composable architecture with granular control components
- Built on shadcn/ui Dialog and Command components
- React Context API for accessing state in nested components
- Searchable voice list with real-time filtering
- Support for voice metadata with icons and emojis (gender icons, accent flags, age)
- Voice preview button with play/pause/loading states
- Voice grouping with separators and bullet dividers
- Keyboard navigation support
- Controlled and uncontrolled component patterns
- Full TypeScript support with proper types for all components

## Props

### `<VoiceSelector />`

Root Dialog component that provides context for all child components. Manages both voice selection and dialog open states.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | - | The selected voice ID (controlled). |
| `defaultValue` | `string` | - | The default selected voice ID (uncontrolled). |
| `onValueChange` | `(value: string | undefined) => void` | - | Callback fired when the selected voice changes. |
| `defaultOpen` | `boolean` | `false` | The default open state (uncontrolled). |
| `open` | `boolean` | - | The open state (controlled). |
| `onOpenChange` | `(open: boolean) => void` | - | Callback fired when the open state changes. |
| `modal` | `boolean` | `true` | Whether the dialog is modal (blocks interaction with the rest of the page). |
| `...props` | `React.ComponentProps<typeof Dialog>` | - | Any other props are spread to the Dialog component. |

### `<VoiceSelectorTrigger />`

Button or element that opens the voice selector dialog.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `asChild` | `boolean` | `false` | Change the default rendered element for the one passed as a child, merging their props and behavior. |
| `...props` | `React.ComponentProps<typeof DialogTrigger>` | - | Any other props are spread to the DialogTrigger component. |

### `<VoiceSelectorContent />`

Container for the Command component and voice list, rendered inside the dialog.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `ReactNode` | - | The title for screen readers. Hidden visually but accessible to assistive technologies. |
| `className` | `string` | - | Additional CSS classes to apply to the dialog content. |
| `...props` | `React.ComponentProps<typeof DialogContent>` | - | Any other props are spread to the DialogContent component. |

### `<VoiceSelectorDialog />`

Alternative dialog implementation using CommandDialog for a full-screen command palette style.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `...props` | `React.ComponentProps<typeof CommandDialog>` | - | Any other props are spread to the CommandDialog component. |

### `<VoiceSelectorInput />`

Search input for filtering voices.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `placeholder` | `string` | - | Placeholder text for the search input. |
| `className` | `string` | - | Additional CSS classes to apply. |
| `...props` | `React.ComponentProps<typeof CommandInput>` | - | Any other props are spread to the CommandInput component. |

### `<VoiceSelectorList />`

Scrollable container for voice items and groups.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `...props` | `React.ComponentProps<typeof CommandList>` | - | Any other props are spread to the CommandList component. |

### `<VoiceSelectorEmpty />`

Message shown when no voices match the search query.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | - | The message to display. |
| `...props` | `React.ComponentProps<typeof CommandEmpty>` | - | Any other props are spread to the CommandEmpty component. |

### `<VoiceSelectorGroup />`

Groups related voices together with an optional heading.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `heading` | `string` | - | The heading text for the group. |
| `...props` | `React.ComponentProps<typeof CommandGroup>` | - | Any other props are spread to the CommandGroup component. |

### `<VoiceSelectorItem />`

Selectable item representing a voice.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | - | The unique identifier for this voice. Used for search filtering. |
| `onSelect` | `(value: string) => void` | - | Callback fired when the voice is selected. |
| `...props` | `React.ComponentProps<typeof CommandItem>` | - | Any other props are spread to the CommandItem component. |

### `<VoiceSelectorSeparator />`

Visual separator between voice groups.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `...props` | `React.ComponentProps<typeof CommandSeparator>` | - | Any other props are spread to the CommandSeparator component. |

### `<VoiceSelectorName />`

Displays the voice name with proper styling.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | - | Additional CSS classes to apply. |
| `...props` | `React.ComponentProps<` | - | Any other props are spread to the span element. |

### `<VoiceSelectorGender />`

Displays the voice gender metadata with icons from Lucide. Supports multiple gender identities with corresponding icons.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `unknown` | - | The gender value that determines which icon to display. Supported values:  |
| `className` | `string` | - | Additional CSS classes to apply. |
| `children` | `ReactNode` | - | Override the icon with custom content. |
| `...props` | `React.ComponentProps<` | - | Any other props are spread to the span element. |

### `<VoiceSelectorAccent />`

Displays the voice accent metadata with emoji flags representing different countries/regions.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `unknown` | - | The accent value that determines which flag emoji to display. Supports 27 different accents including:  |
| `className` | `string` | - | Additional CSS classes to apply. |
| `children` | `ReactNode` | - | Override the flag emoji with custom content. |
| `...props` | `React.ComponentProps<` | - | Any other props are spread to the span element. |

### `<VoiceSelectorAge />`

Displays the voice age metadata with muted styling and tabular numbers for consistent alignment.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | - | Additional CSS classes to apply. |
| `...props` | `React.ComponentProps<` | - | Any other props are spread to the span element. |

### `<VoiceSelectorDescription />`

Displays a description for the voice with muted styling.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | - | Additional CSS classes to apply. |
| `...props` | `React.ComponentProps<` | - | Any other props are spread to the span element. |

### `<VoiceSelectorAttributes />`

Container for grouping voice attributes (gender, accent, age) together. Use with `VoiceSelectorBullet` for separation.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | - | Additional CSS classes to apply. |
| `...props` | `React.ComponentProps<` | - | Any other props are spread to the div element. |

### `<VoiceSelectorBullet />`

Displays a bullet separator (•) between voice attributes. Hidden from screen readers via `aria-hidden`.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | - | Additional CSS classes to apply. |
| `...props` | `React.ComponentProps<` | - | Any other props are spread to the span element. |

### `<VoiceSelectorShortcut />`

Displays keyboard shortcuts for voice items.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `...props` | `React.ComponentProps<typeof CommandShortcut>` | - | Any other props are spread to the CommandShortcut component. |

### `<VoiceSelectorPreview />`

A button that allows users to preview/play a voice sample before selecting it. Shows play, pause, or loading icons based on state.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `playing` | `boolean` | - | Whether the voice is currently playing. Shows pause icon when true. |
| `loading` | `boolean` | - | Whether the voice preview is loading. Shows loading spinner and disables the button. |
| `onPlay` | `() => void` | - | Callback fired when the preview button is clicked. |
| `className` | `string` | - | Additional CSS classes to apply. |
| `...props` | `Omit<React.ComponentProps<` | - | Any other props are spread to the button element. |

## Hooks

### `useVoiceSelector()`

A custom hook for accessing the voice selector context. This hook allows you to access and control the voice selection state from any component nested within `VoiceSelector`.

```tsx
import { useVoiceSelector } from "@repo/elements/voice-selector";

export default function CustomVoiceDisplay() {
  const { value, setValue, open, setOpen } = useVoiceSelector();

  return (
    <div>
      <p>Selected voice: {value ?? "None"}</p>
      <button onClick={() => setOpen(!open)}>Toggle Dialog</button>
    </div>
  );
}
```

#### Return Value

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string | undefined` | - | The currently selected voice ID. |
| `setValue` | `(value: string | undefined) => void` | - | Function to update the selected voice ID. |
| `open` | `boolean` | - | Whether the dialog is currently open. |
| `setOpen` | `(open: boolean) => void` | - | Function to control the dialog open state. |
