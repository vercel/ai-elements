---
name: Using the Transcription component from AI Elements
description: How to use the Transcription component to display synchronized audio transcripts.
---

# Transcription Component

A component for displaying audio transcriptions with word-level timing synchronization. Highlights the current word based on playback position and supports seeking by clicking on words.

## Import

```tsx
import {
  Transcription,
  TranscriptionSegment,
} from "@repo/elements/transcription";
```

## Sub-components

| Component | Purpose |
|-----------|---------|
| `Transcription` | Container that provides timing context and renders segments |
| `TranscriptionSegment` | Individual word/segment with timing-based styling |

## Basic Usage

```tsx
import type { Experimental_TranscriptionResult as TranscriptionResult } from "ai";

const segments: TranscriptionResult["segments"] = [
  { text: "Hello", startSecond: 0, endSecond: 0.5 },
  { text: " ", startSecond: 0.5, endSecond: 0.6 },
  { text: "world", startSecond: 0.6, endSecond: 1.0 },
];

const Example = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentTime, setCurrentTime] = useState(0);

  const handleSeek = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  return (
    <div>
      <audio ref={audioRef} onTimeUpdate={handleTimeUpdate} controls>
        <source src="/audio.mp3" />
      </audio>

      <Transcription
        currentTime={currentTime}
        onSeek={handleSeek}
        segments={segments}
      >
        {(segment, index) => (
          <TranscriptionSegment
            key={`${segment.startSecond}-${segment.endSecond}`}
            index={index}
            segment={segment}
          />
        )}
      </Transcription>
    </div>
  );
};
```

## Props Reference

### `<Transcription />`
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `segments` | `TranscriptionResult["segments"]` | Required | Array of transcription segments with timing |
| `currentTime` | `number` | `0` | Current playback time in seconds |
| `onSeek` | `(time: number) => void` | - | Callback when user clicks a segment to seek |
| `children` | `(segment: TranscriptionSegment, index: number) => ReactNode` | Required | Render function for each segment |
| `className` | `string` | - | Additional CSS classes |

### `<TranscriptionSegment />`
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `segment` | `TranscriptionSegment` | Required | Segment data with text and timing |
| `index` | `number` | Required | Segment index for data attributes |
| `className` | `string` | - | Additional CSS classes |
| `onClick` | `(event) => void` | - | Additional click handler |
| `...props` | `ComponentProps<"button">` | - | Standard button props |

## Segment Data Structure

Each segment follows the Vercel AI SDK transcription format:

```tsx
interface TranscriptionSegment {
  text: string;        // The transcribed text
  startSecond: number; // Start time in seconds
  endSecond: number;   // End time in seconds
}
```

## Styling States

Segments are automatically styled based on playback position:

| State | Styling | Description |
|-------|---------|-------------|
| Active | `text-primary` | Current word being spoken |
| Past | `text-muted-foreground` | Words already spoken |
| Future | `text-muted-foreground/60` | Words not yet spoken |

When `onSeek` is provided, segments become clickable with hover state.

## Examples

See `scripts/` folder for complete working examples.
