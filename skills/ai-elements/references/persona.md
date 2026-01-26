# Persona

An animated AI visual component powered by Rive that responds to different states like listening, thinking, and speaking.

The `Persona` component displays an animated AI visual that responds to different conversational states. Built with Rive WebGL2, it provides smooth, high-performance animations for various AI interaction states including idle, listening, thinking, speaking, and asleep. The component supports multiple visual variants to match different design aesthetics.

See `scripts/persona-obsidian.tsx` for this example.

## Installation

```bash
npx ai-elements@latest add persona
```

## Features

- Smooth state-based animations powered by Rive
- Multiple visual variants (obsidian, mana, opal, halo, glint, command)
- Responsive to five distinct states: idle, listening, thinking, speaking, and asleep
- WebGL2-accelerated rendering for optimal performance
- Customizable size and styling
- Lifecycle callbacks for load, ready, pause, play, and stop events
- TypeScript support with full type definitions

## Variants

The Persona component comes with 6 distinct visual variants, each with its own unique aesthetic:

### Obsidian (Default)

See `scripts/persona-obsidian.tsx` for this example.

### Mana

See `scripts/persona-mana.tsx` for this example.

### Opal

See `scripts/persona-opal.tsx` for this example.

### Halo

See `scripts/persona-halo.tsx` for this example.

### Glint

See `scripts/persona-glint.tsx` for this example.

### Command

See `scripts/persona-command.tsx` for this example.

## Props

### `<Persona />`

The root component that renders the animated AI visual.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `state` | `unknown` | - | The current state of the AI persona. Controls which animation is displayed. |
| `variant` | `unknown` | - | The visual style variant to display. |
| `className` | `string` | - | Additional CSS classes to apply to the component. |
| `onLoad` | `RiveParameters[` | - | Callback fired when the Rive file starts loading. |
| `onLoadError` | `RiveParameters[` | - | Callback fired if the Rive file fails to load. |
| `onReady` | `() => void` | - | Callback fired when the Rive animation is ready to play. |
| `onPause` | `RiveParameters[` | - | Callback fired when the animation is paused. |
| `onPlay` | `RiveParameters[` | - | Callback fired when the animation starts playing. |
| `onStop` | `RiveParameters[` | - | Callback fired when the animation is stopped. |

## States

The Persona component responds to five distinct states, each triggering different animations:

- **idle**: The default resting state when the AI is not active
- **listening**: Displayed when the AI is actively listening to user input (e.g., during voice recording)
- **thinking**: Shown when the AI is processing or generating a response
- **speaking**: Active when the AI is delivering a response (e.g., text-to-speech output)
- **asleep**: A dormant state for when the AI is inactive or in low-power mode

## Usage Examples

### Basic Usage

```tsx
import { Persona } from "@repo/elements/persona";

export default function App() {
  return <Persona state="listening" variant="opal" />;
}
```

### With State Management

```tsx
import { Persona } from "@repo/elements/persona";
import { useState } from "react";

export default function App() {
  const [state, setState] = useState<
    "idle" | "listening" | "thinking" | "speaking" | "asleep"
  >("idle");

  const startListening = () => setState("listening");
  const startThinking = () => setState("thinking");
  const startSpeaking = () => setState("speaking");
  const reset = () => setState("idle");

  return (
    <div>
      <Persona state={state} variant="opal" className="size-32" />
      <div>
        <button onClick={startListening}>Listen</button>
        <button onClick={startThinking}>Think</button>
        <button onClick={startSpeaking}>Speak</button>
        <button onClick={reset}>Reset</button>
      </div>
    </div>
  );
}
```

### With Custom Styling

```tsx
import { Persona } from "@repo/elements/persona";

export default function App() {
  return (
    <Persona
      state="thinking"
      variant="halo"
      className="size-64 rounded-full border border-border"
    />
  );
}
```

### With Lifecycle Callbacks

```tsx
import { Persona } from "@repo/elements/persona";

export default function App() {
  return (
    <Persona
      state="listening"
      variant="glint"
      onReady={() => console.log("Animation ready")}
      onLoad={() => console.log("Starting to load")}
      onLoadError={(error) => console.error("Failed to load:", error)}
      onPlay={() => console.log("Animation playing")}
      onPause={() => console.log("Animation paused")}
      onStop={() => console.log("Animation stopped")}
    />
  );
}
```
