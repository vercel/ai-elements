# Speech Input

A button component that captures voice input and converts it to text, with cross-browser support.

The `SpeechInput` component provides an easy-to-use interface for capturing voice input in your application. It uses the Web Speech API for real-time transcription in supported browsers (Chrome, Edge), and falls back to MediaRecorder with an external transcription service for browsers that don't support Web Speech API (Firefox, Safari).

See `scripts/speech-input.tsx` for this example.

## Installation

```bash
npx ai-elements@latest add speech-input
```

## Features

- Built on Web Speech API (SpeechRecognition) with MediaRecorder fallback
- Cross-browser support (Chrome, Edge, Firefox, Safari)
- Continuous speech recognition with interim results
- Visual feedback with pulse animation when listening
- Loading state during transcription processing
- Automatic browser compatibility detection
- Final transcript extraction and callbacks
- Error handling and automatic state management
- Extends shadcn/ui Button component
- Full TypeScript support

## Props

### `<SpeechInput />`

The component extends the shadcn/ui Button component, so all Button props are available.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `onTranscriptionChange` | `(text: string) => void` | - | Callback fired when final transcription text is available. Only fires for completed phrases, not interim results. |
| `onAudioRecorded` | `(audioBlob: Blob) => Promise<string>` | - | Callback for MediaRecorder fallback. Required for Firefox/Safari support. Receives recorded audio blob and should return transcribed text from an external service (e.g., OpenAI Whisper). |
| `lang` | `string` | - | Language for speech recognition. |
| `...props` | `React.ComponentProps<typeof Button>` | - | Any other props are spread to the Button component, including variant, size, disabled, etc. |

## Behavior

### Speech Recognition Modes

The component automatically detects browser capabilities and uses the best available method:

| Browser         | Mode           | Behavior                                               |
| --------------- | -------------- | ------------------------------------------------------ |
| Chrome, Edge    | Web Speech API | Real-time transcription, no server required            |
| Firefox, Safari | MediaRecorder  | Records audio, sends to external transcription service |
| Unsupported     | Disabled       | Button is disabled                                     |

### Web Speech API Mode (Chrome, Edge)

Uses the Web Speech API with the following configuration:

- **Continuous**: Set to `true` to keep recognition active until manually stopped
- **Interim Results**: Set to `true` to receive partial results during speech
- **Language**: Configurable via `lang` prop, defaults to `"en-US"`

### MediaRecorder Mode (Firefox, Safari)

When the Web Speech API is unavailable, the component falls back to recording audio:

1. Records audio using `MediaRecorder` API
2. On stop, creates an audio blob (`audio/webm`)
3. Calls `onAudioRecorded` with the blob
4. Waits for transcription result
5. Passes result to `onTranscriptionChange`

**Note**: The `onAudioRecorded` prop is required for this mode to work. Without it, the button will be disabled in Firefox/Safari.

### Transcription Processing

The component only calls `onTranscriptionChange` with **final transcripts**. Interim results (Web Speech API) are ignored to prevent incomplete text from being processed.

### Visual States

- **Default State**: Standard button appearance with microphone icon
- **Listening State**: Pulsing animation with accent colors to indicate active listening
- **Processing State**: Loading spinner while waiting for transcription (MediaRecorder mode)
- **Disabled State**: Button is disabled when no API is available or required props are missing

### Lifecycle

1. **Mount**: Detects available APIs and initializes appropriate mode
2. **Click**: Toggles between listening/recording and stopped states
3. **Stop (MediaRecorder)**: Processes audio and waits for transcription
4. **Unmount**: Stops recognition/recording and releases microphone

## Browser Support

The component provides cross-browser support through a two-tier system:

| Browser | API Used       | Requirements           |
| ------- | -------------- | ---------------------- |
| Chrome  | Web Speech API | None                   |
| Edge    | Web Speech API | None                   |
| Firefox | MediaRecorder  | `onAudioRecorded` prop |
| Safari  | MediaRecorder  | `onAudioRecorded` prop |

For full cross-browser support, provide the `onAudioRecorded` callback that sends audio to a transcription service like OpenAI Whisper, Google Cloud Speech-to-Text, or AssemblyAI.

## Accessibility

- Uses semantic button element via shadcn/ui Button
- Visual feedback for listening state
- Keyboard accessible (can be triggered with Space/Enter)
- Screen reader friendly with proper button semantics

## Usage with MediaRecorder Fallback

To support Firefox and Safari, provide an `onAudioRecorded` callback that sends audio to a transcription service:

```tsx
const handleAudioRecorded = async (audioBlob: Blob): Promise<string> => {
  const formData = new FormData();
  formData.append("file", audioBlob, "audio.webm");
  formData.append("model", "whisper-1");

  const response = await fetch(
    "https://api.openai.com/v1/audio/transcriptions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: formData,
    }
  );

  const data = await response.json();
  return data.text;
};

<SpeechInput
  onTranscriptionChange={(text) => console.log(text)}
  onAudioRecorded={handleAudioRecorded}
/>;
```

## Notes

- Requires a secure context (HTTPS or localhost)
- Browser may prompt user for microphone permission
- Only final transcripts trigger the `onTranscriptionChange` callback
- Language is configurable via the `lang` prop
- Continuous recognition continues until button is clicked again
- Errors are logged to console and automatically stop recognition/recording
- MediaRecorder fallback requires the `onAudioRecorded` prop to be provided
- Audio is recorded in `audio/webm` format for the MediaRecorder fallback

## TypeScript

The component includes full TypeScript definitions for the Web Speech API:

- `SpeechRecognition`
- `SpeechRecognitionEvent`
- `SpeechRecognitionResult`
- `SpeechRecognitionAlternative`
- `SpeechRecognitionErrorEvent`

These types are properly declared for both standard and webkit-prefixed implementations.
