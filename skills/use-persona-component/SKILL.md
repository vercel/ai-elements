---
name: Using the Persona component from AI Elements
description: How to use the Persona component to display animated AI visual avatars with multiple states.
---

# Persona Component

An animated AI visual avatar component powered by Rive animations. Supports multiple visual variants and states like idle, listening, thinking, speaking, and asleep.

## Import

```tsx
import { Persona, type PersonaState } from "@repo/elements/persona";
```

## Sub-components

| Component | Purpose |
|-----------|---------|
| `Persona` | Animated AI avatar with Rive integration |

## Basic Usage

```tsx
import { Persona, type PersonaState } from "@repo/elements/persona";
import { useState } from "react";

const Example = () => {
  const [state, setState] = useState<PersonaState>("idle");

  return (
    <Persona
      className="size-32"
      state={state}
      variant="obsidian"
    />
  );
};
```

## Props Reference

### `<Persona />`
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `state` | `PersonaState` | `"idle"` | Current animation state |
| `variant` | `"obsidian" \| "mana" \| "opal" \| "halo" \| "glint" \| "command"` | `"obsidian"` | Visual style variant |
| `className` | `string` | `"size-16"` | Additional CSS classes |
| `onLoad` | `RiveParameters["onLoad"]` | - | Callback when Rive loads |
| `onLoadError` | `RiveParameters["onLoadError"]` | - | Callback on load error |
| `onReady` | `() => void` | - | Callback when animation is ready |
| `onPause` | `RiveParameters["onPause"]` | - | Callback when animation pauses |
| `onPlay` | `RiveParameters["onPlay"]` | - | Callback when animation plays |
| `onStop` | `RiveParameters["onStop"]` | - | Callback when animation stops |

## PersonaState Type

```tsx
type PersonaState = "idle" | "listening" | "thinking" | "speaking" | "asleep";
```

## Variants

| Variant | Description | Dynamic Color |
|---------|-------------|---------------|
| `obsidian` | Dark geometric style | Yes |
| `mana` | Fluid energy style | No |
| `opal` | Orb-like appearance | No |
| `halo` | Ring/halo style | Yes |
| `glint` | Sparkle effect | Yes |
| `command` | Command prompt style | Yes |

Variants with "Dynamic Color" automatically adapt to light/dark theme.

## Examples

See `scripts/` folder for complete working examples.
