"use client";

import { SpeechInput } from "@/components/ai-elements/speech-input";
import { useState } from "react";

const Example = () => {
  const [transcript, setTranscript] = useState("");

  const handleTranscriptionChange = (text: string) => {
    setTranscript((prev) => {
      const newText = prev ? `${prev} ${text}` : text;
      return newText;
    });
  };

  const handleClear = () => {
    setTranscript("");
  };

  /**
   * Fallback handler for browsers that don't support Web Speech API (Firefox, Safari).
   * This function receives recorded audio and should send it to a transcription service.
   * Example uses OpenAI Whisper API - replace with your preferred service.
   */
  const handleAudioRecorded = async (audioBlob: Blob): Promise<string> => {
    const formData = new FormData();
    formData.append("file", audioBlob, "audio.webm");
    formData.append("model", "whisper-1");

    const response = await fetch(
      "https://api.openai.com/v1/audio/transcriptions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
        },
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error("Transcription failed");
    }

    const data = await response.json();
    return data.text;
  };

  return (
    <div className="flex size-full flex-col items-center justify-center gap-4">
      <div className="flex gap-2">
        <SpeechInput
          onAudioRecorded={handleAudioRecorded}
          onTranscriptionChange={handleTranscriptionChange}
          size="icon"
          variant="outline"
        />
        {transcript && (
          <button
            className="text-muted-foreground text-sm underline hover:text-foreground"
            onClick={handleClear}
            type="button"
          >
            Clear
          </button>
        )}
      </div>
      {transcript ? (
        <div className="max-w-md rounded-lg border bg-card p-4 text-sm">
          <p className="text-muted-foreground">
            <strong>Transcript:</strong>
          </p>
          <p className="mt-2">{transcript}</p>
        </div>
      ) : (
        <p className="text-muted-foreground text-sm">
          Click the microphone to start speaking
        </p>
      )}
    </div>
  );
};

export default Example;
