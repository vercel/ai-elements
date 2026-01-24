---
name: Using the SpeechInput component from AI Elements
description: How to use the SpeechInput component to capture voice input with transcription.
---

# SpeechInput Component

A voice input button that supports real-time speech recognition using the Web Speech API, with MediaRecorder fallback for browsers without native speech recognition support.

## Import

```tsx
import { SpeechInput } from "@repo/elements/speech-input";
```

## Sub-components

| Component | Purpose |
|-----------|---------|
| `SpeechInput` | Button that toggles voice recording with visual feedback |

## Basic Usage

```tsx
const Example = () => {
  const [transcript, setTranscript] = useState("");

  const handleTranscriptionChange = (text: string) => {
    setTranscript((prev) => prev ? `${prev} ${text}` : text);
  };

  return (
    <SpeechInput
      onTranscriptionChange={handleTranscriptionChange}
      size="icon"
      variant="outline"
    />
  );
};
```

## Props Reference

### `<SpeechInput />`
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `onTranscriptionChange` | `(text: string) => void` | - | Callback when transcription text is available |
| `onAudioRecorded` | `(audioBlob: Blob) => Promise<string>` | - | Fallback handler for browsers without Web Speech API (required for Firefox/Safari) |
| `lang` | `string` | `"en-US"` | Language code for speech recognition |
| `className` | `string` | - | Additional CSS classes |
| `...props` | `ComponentProps<typeof Button>` | - | Standard Button props (size, variant, etc.) |

## Browser Support

The component automatically detects browser capabilities:

1. **Chrome/Edge**: Uses native Web Speech API for real-time transcription
2. **Firefox/Safari**: Falls back to MediaRecorder, requires `onAudioRecorded` callback to send audio to a transcription service (e.g., OpenAI Whisper)
3. **Unsupported browsers**: Button is disabled

## MediaRecorder Fallback Example

```tsx
const handleAudioRecorded = async (audioBlob: Blob): Promise<string> => {
  const formData = new FormData();
  formData.append("file", audioBlob, "audio.webm");
  formData.append("model", "whisper-1");

  const response = await fetch("https://api.openai.com/v1/audio/transcriptions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
    },
    body: formData,
  });

  const data = await response.json();
  return data.text;
};

<SpeechInput
  onAudioRecorded={handleAudioRecorded}
  onTranscriptionChange={handleTranscriptionChange}
/>
```

## Examples

See `scripts/` folder for complete working examples.
