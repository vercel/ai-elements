---
name: Using the VoiceSelector component from AI Elements
description: How to use the VoiceSelector component to browse and select AI voices with previews.
---

# VoiceSelector Component

A dialog-based voice picker component with search, filtering, audio preview, and rich metadata display for gender, accent, and age.

## Import

```tsx
import {
  VoiceSelector,
  VoiceSelectorTrigger,
  VoiceSelectorContent,
  VoiceSelectorInput,
  VoiceSelectorList,
  VoiceSelectorEmpty,
  VoiceSelectorGroup,
  VoiceSelectorItem,
  VoiceSelectorName,
  VoiceSelectorDescription,
  VoiceSelectorGender,
  VoiceSelectorAccent,
  VoiceSelectorAge,
  VoiceSelectorPreview,
  VoiceSelectorBullet,
  VoiceSelectorSeparator,
  VoiceSelectorShortcut,
  useVoiceSelector,
} from "@repo/elements/voice-selector";
```

## Sub-components

| Component | Purpose |
|-----------|---------|
| `VoiceSelector` | Root provider with value and open state |
| `VoiceSelectorTrigger` | Button that opens the selector dialog |
| `VoiceSelectorContent` | Dialog content with Command interface |
| `VoiceSelectorInput` | Search input for filtering voices |
| `VoiceSelectorList` | Scrollable list of voice options |
| `VoiceSelectorEmpty` | Empty state when no matches |
| `VoiceSelectorGroup` | Group voices by category |
| `VoiceSelectorItem` | Individual voice option |
| `VoiceSelectorName` | Voice name text |
| `VoiceSelectorDescription` | Voice description/style |
| `VoiceSelectorGender` | Gender icon display |
| `VoiceSelectorAccent` | Accent flag emoji |
| `VoiceSelectorAge` | Age range text |
| `VoiceSelectorPreview` | Play/pause preview button |
| `VoiceSelectorBullet` | Separator bullet |
| `VoiceSelectorSeparator` | Visual separator line |
| `VoiceSelectorShortcut` | Keyboard shortcut display |
| `useVoiceSelector` | Hook to access selector context |

## Basic Usage

```tsx
const voices = [
  {
    id: "liam",
    name: "Liam",
    description: "Energetic, Social Media Creator",
    gender: "male",
    accent: "american",
    age: "20-30",
    previewUrl: "https://example.com/liam-preview.mp3",
  },
  // more voices...
];

const Example = () => {
  const [open, setOpen] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState<string | null>(null);

  const handleSelect = (voiceId: string) => {
    setSelectedVoice(voiceId);
    setOpen(false);
  };

  return (
    <VoiceSelector onOpenChange={setOpen} open={open}>
      <VoiceSelectorTrigger asChild>
        <Button variant="outline">Select a voice...</Button>
      </VoiceSelectorTrigger>
      <VoiceSelectorContent>
        <VoiceSelectorInput placeholder="Search voices..." />
        <VoiceSelectorList>
          <VoiceSelectorEmpty>No voices found.</VoiceSelectorEmpty>
          {voices.map((voice) => (
            <VoiceSelectorItem
              key={voice.id}
              value={voice.id}
              onSelect={() => handleSelect(voice.id)}
            >
              <VoiceSelectorName>{voice.name}</VoiceSelectorName>
              <VoiceSelectorDescription>{voice.description}</VoiceSelectorDescription>
              <VoiceSelectorBullet />
              <VoiceSelectorAccent value={voice.accent} />
              <VoiceSelectorBullet />
              <VoiceSelectorAge>{voice.age}</VoiceSelectorAge>
              <VoiceSelectorBullet />
              <VoiceSelectorGender value={voice.gender} />
            </VoiceSelectorItem>
          ))}
        </VoiceSelectorList>
      </VoiceSelectorContent>
    </VoiceSelector>
  );
};
```

## Props Reference

### `<VoiceSelector />`
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | - | Controlled selected value |
| `defaultValue` | `string` | - | Initial selected value |
| `onValueChange` | `(value: string \| undefined) => void` | - | Selection change callback |
| `open` | `boolean` | - | Controlled open state |
| `defaultOpen` | `boolean` | `false` | Initial open state |
| `onOpenChange` | `(open: boolean) => void` | - | Open state change callback |

### `<VoiceSelectorGender />`
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `"male" \| "female" \| "transgender" \| "androgyne" \| "non-binary" \| "intersex"` | - | Gender to display icon for |
| `children` | `ReactNode` | - | Custom content (overrides icon) |

### `<VoiceSelectorAccent />`
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `"american" \| "british" \| "australian" \| ...` | - | Accent to display flag for |
| `children` | `ReactNode` | - | Custom content (overrides emoji) |

### `<VoiceSelectorPreview />`
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `playing` | `boolean` | - | Whether audio is currently playing |
| `loading` | `boolean` | - | Whether audio is loading |
| `onPlay` | `() => void` | - | Callback when preview button clicked |
| `onClick` | `(event) => void` | - | Standard click handler |

## Audio Preview Implementation

```tsx
const handlePreview = (voiceId: string) => {
  const voice = voices.find((v) => v.id === voiceId);
  if (playingVoice === voiceId) {
    audioRef.current?.pause();
    setPlayingVoice(null);
    return;
  }

  const audio = new Audio(voice.previewUrl);
  audioRef.current = audio;
  setLoadingVoice(voiceId);

  audio.addEventListener("canplaythrough", () => {
    setLoadingVoice(null);
    setPlayingVoice(voiceId);
    audio.play();
  });

  audio.addEventListener("ended", () => setPlayingVoice(null));
  audio.load();
};

<VoiceSelectorPreview
  loading={loadingVoice === voice.id}
  playing={playingVoice === voice.id}
  onPlay={() => handlePreview(voice.id)}
/>
```

## Examples

See `scripts/` folder for complete working examples.
