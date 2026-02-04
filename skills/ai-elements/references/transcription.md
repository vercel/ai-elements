# Transcription

A composable component for displaying interactive, synchronized transcripts from AI SDK transcribe() results with click-to-seek functionality.

The `Transcription` component provides a flexible render props interface for displaying audio transcripts with synchronized playback. It automatically highlights the current segment based on playback time and supports click-to-seek functionality for interactive navigation.

See `scripts/transcription.tsx` for this example.

## Installation

```bash
npx ai-elements@latest add transcription
```

## Features

- Render props pattern for maximum flexibility
- Automatic segment highlighting based on current time
- Click-to-seek functionality for interactive navigation
- Controlled and uncontrolled component patterns
- Automatic filtering of empty segments
- Visual state indicators (active, past, future)
- Built on Radix UI's `useControllableState` for flexible state management
- Full TypeScript support with AI SDK transcription types

## Props

### `<Transcription />`

Root component that provides context and manages transcript state. Uses render props pattern for rendering segments.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `segments` | `TranscriptionSegment[]` | - | Array of transcription segments from AI SDK transcribe() function. |
| `currentTime` | `number` | `0` | Current playback time in seconds (controlled). |
| `onSeek` | `(time: number) => void` | - | Callback fired when a segment is clicked or when currentTime changes. |
| `children` | `(segment: TranscriptionSegment, index: number) => ReactNode` | - | Render function that receives each segment and its index. |
| `...props` | `Omit<React.ComponentProps<` | - | Any other props are spread to the root div element. |

### `<TranscriptionSegment />`

Individual segment button with automatic state styling and click-to-seek functionality.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `segment` | `TranscriptionSegment` | - | The transcription segment data. |
| `index` | `number` | - | The segment index. |
| `...props` | `React.ComponentProps<` | - | Any other props are spread to the button element. |

## Behavior

### Render Props Pattern

The component uses a render props pattern where the `children` prop is a function that receives each segment and its index. This provides maximum flexibility for custom rendering while still benefiting from automatic state management and context.

### Segment Highlighting

Segments are automatically styled based on their relationship to the current playback time:

- **Active** (`isActive`): When `currentTime` is within the segment's time range. Styled with primary color.
- **Past** (`isPast`): When `currentTime` is after the segment's end time. Styled with muted foreground.
- **Future**: When `currentTime` is before the segment's start time. Styled with dimmed muted foreground.

### Click-to-Seek

When `onSeek` is provided, segments become interactive buttons. Clicking a segment calls `onSeek` with the segment's start time, allowing your audio/video player to seek to that position.

### Empty Segment Filtering

The component automatically filters out segments with empty or whitespace-only text to avoid rendering unnecessary elements.

### State Management

Uses Radix UI's `useControllableState` hook to support both controlled and uncontrolled patterns. When `currentTime` is provided, the component operates in controlled mode. Otherwise, it maintains its own internal state.

## Data Format

The component expects segments from the AI SDK `transcribe()` function:

```ts
type TranscriptionSegment = {
  text: string;
  startSecond: number;
  endSecond: number;
};
```

## Styling

The component uses data attributes for custom styling:

- `data-slot="transcription"`: Root container
- `data-slot="transcription-segment"`: Individual segment button
- `data-active`: Present on the currently playing segment
- `data-index`: The segment's index in the array

Default segment appearance:

- Active segment: `text-primary` (primary brand color)
- Past segments: `text-muted-foreground`
- Future segments: `text-muted-foreground/60` (dimmed)
- Interactive segments: `cursor-pointer hover:text-foreground`
- Non-interactive segments: `cursor-default`

## Accessibility

- Uses semantic `<button>` elements for interactive segments
- Full keyboard navigation support
- Proper button semantics for screen readers
- `data-active` attribute for assistive technology
- Hover and focus states for keyboard users

## Notes

- Empty or whitespace-only segments are automatically filtered out
- The component uses `flex-wrap` for responsive text flow
- Segments maintain inline layout with `gap-1` spacing
- `text-sm` and `leading-relaxed` provide comfortable reading
- Click events on segments still fire the `onClick` handler if provided
- The `onSeek` callback is called both when segments are clicked and when controlled `currentTime` changes
