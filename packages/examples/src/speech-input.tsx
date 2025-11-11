"use client";

import { SpeechInput } from "@repo/elements/speech-input";
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

  return (
    <div className="flex size-full flex-col items-center justify-center gap-4">
      <div className="flex gap-2">
        <SpeechInput
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
