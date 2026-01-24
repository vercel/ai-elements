---
name: Using the AudioPlayer component from AI Elements
description: How to use the AudioPlayer component to play audio with controls for AI speech synthesis results.
---

# AudioPlayer Component

The AudioPlayer component provides a full-featured audio player with play/pause, seek, volume, and time display controls. It integrates with the Vercel AI SDK's speech synthesis results and supports both base64-encoded audio data and remote URLs.

## Import

```tsx
import {
  AudioPlayer,
  AudioPlayerElement,
  AudioPlayerControlBar,
  AudioPlayerPlayButton,
  AudioPlayerSeekBackwardButton,
  AudioPlayerSeekForwardButton,
  AudioPlayerTimeDisplay,
  AudioPlayerTimeRange,
  AudioPlayerDurationDisplay,
  AudioPlayerMuteButton,
  AudioPlayerVolumeRange,
} from "@repo/elements/audio-player";
```

## Sub-components

| Component | Purpose |
|-----------|---------|
| `AudioPlayer` | Root container with media controller |
| `AudioPlayerElement` | The audio element (supports base64 or URL) |
| `AudioPlayerControlBar` | Container for control buttons |
| `AudioPlayerPlayButton` | Play/pause toggle button |
| `AudioPlayerSeekBackwardButton` | Seek backward button |
| `AudioPlayerSeekForwardButton` | Seek forward button |
| `AudioPlayerTimeDisplay` | Current playback time |
| `AudioPlayerTimeRange` | Seekable progress bar |
| `AudioPlayerDurationDisplay` | Total duration display |
| `AudioPlayerMuteButton` | Mute/unmute toggle |
| `AudioPlayerVolumeRange` | Volume slider |

## Basic Usage

### With Remote URL

```tsx
const Example = () => (
  <AudioPlayer>
    <AudioPlayerElement src="https://example.com/audio.mp3" />
    <AudioPlayerControlBar>
      <AudioPlayerPlayButton />
      <AudioPlayerSeekBackwardButton seekOffset={10} />
      <AudioPlayerSeekForwardButton seekOffset={10} />
      <AudioPlayerTimeDisplay />
      <AudioPlayerTimeRange />
      <AudioPlayerDurationDisplay />
      <AudioPlayerMuteButton />
      <AudioPlayerVolumeRange />
    </AudioPlayerControlBar>
  </AudioPlayer>
);
```

### With AI SDK Speech Result

```tsx
import type { Experimental_SpeechResult as SpeechResult } from "ai";

const Example = ({ speechData }: { speechData: SpeechResult["audio"] }) => (
  <AudioPlayer>
    <AudioPlayerElement data={speechData} />
    <AudioPlayerControlBar>
      <AudioPlayerPlayButton />
      <AudioPlayerTimeDisplay />
      <AudioPlayerTimeRange />
      <AudioPlayerDurationDisplay />
    </AudioPlayerControlBar>
  </AudioPlayer>
);
```

## Props Reference

### `<AudioPlayer />`
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | - | Additional CSS classes |
| `style` | `CSSProperties` | - | Custom CSS variables for theming |
| `...props` | `ComponentProps<typeof MediaController>` | - | Media controller props |

### `<AudioPlayerElement />`
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `src` | `string` | - | URL to audio file (use this OR data) |
| `data` | `SpeechResult["audio"]` | - | AI SDK speech result with base64 audio |

### `<AudioPlayerControlBar />`
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `...props` | `ComponentProps<typeof MediaControlBar>` | - | Media control bar props |

### `<AudioPlayerPlayButton />`
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | - | Additional CSS classes |

### `<AudioPlayerSeekBackwardButton />`
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `seekOffset` | `number` | `10` | Seconds to seek backward |

### `<AudioPlayerSeekForwardButton />`
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `seekOffset` | `number` | `10` | Seconds to seek forward |

### `<AudioPlayerTimeDisplay />`
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | - | Additional CSS classes |

### `<AudioPlayerTimeRange />`
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | - | Additional CSS classes |

### `<AudioPlayerDurationDisplay />`
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | - | Additional CSS classes |

### `<AudioPlayerMuteButton />`
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | - | Additional CSS classes |

### `<AudioPlayerVolumeRange />`
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | - | Additional CSS classes |

## Examples

See `scripts/` folder for complete working examples.
