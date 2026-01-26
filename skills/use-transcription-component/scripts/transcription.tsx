"use client";

import {
  Transcription,
  TranscriptionSegment,
} from "@/components/ai-elements/transcription";
import type { Experimental_TranscriptionResult as TranscriptionResult } from "ai";
import { useRef, useState } from "react";

const segments: TranscriptionResult["segments"] = [
  {
    text: "You",
    startSecond: 0.119,
    endSecond: 0.219,
  },
  {
    text: " ",
    startSecond: 0.219,
    endSecond: 0.259,
  },
  {
    text: "can",
    startSecond: 0.259,
    endSecond: 0.439,
  },
  {
    text: " ",
    startSecond: 0.439,
    endSecond: 0.459,
  },
  {
    text: "build",
    startSecond: 0.459,
    endSecond: 0.699,
  },
  {
    text: " ",
    startSecond: 0.699,
    endSecond: 0.72,
  },
  {
    text: "and",
    startSecond: 0.72,
    endSecond: 0.799,
  },
  {
    text: " ",
    startSecond: 0.799,
    endSecond: 0.879,
  },
  {
    text: "host",
    startSecond: 0.879,
    endSecond: 1.339,
  },
  {
    text: " ",
    startSecond: 1.339,
    endSecond: 1.359,
  },
  {
    text: "many",
    startSecond: 1.36,
    endSecond: 1.539,
  },
  {
    text: " ",
    startSecond: 1.539,
    endSecond: 1.6,
  },
  {
    text: "different",
    startSecond: 1.6,
    endSecond: 1.86,
  },
  {
    text: " ",
    startSecond: 1.86,
    endSecond: 1.899,
  },
  {
    text: "types",
    startSecond: 1.899,
    endSecond: 2.099,
  },
  {
    text: " ",
    startSecond: 2.099,
    endSecond: 2.119,
  },
  {
    text: "of",
    startSecond: 2.119,
    endSecond: 2.2,
  },
  {
    text: " ",
    startSecond: 2.2,
    endSecond: 2.259,
  },
  {
    text: "applications",
    startSecond: 2.259,
    endSecond: 2.96,
  },
  {
    text: " ",
    startSecond: 2.96,
    endSecond: 3.479,
  },
  {
    text: "from",
    startSecond: 3.48,
    endSecond: 3.699,
  },
  {
    text: " ",
    startSecond: 3.699,
    endSecond: 3.779,
  },
  {
    text: "static",
    startSecond: 3.779,
    endSecond: 4.099,
  },
  {
    text: " ",
    startSecond: 4.099,
    endSecond: 4.179,
  },
  {
    text: "sites",
    startSecond: 4.179,
    endSecond: 4.519,
  },
  {
    text: " ",
    startSecond: 4.519,
    endSecond: 4.539,
  },
  {
    text: "with",
    startSecond: 4.539,
    endSecond: 4.759,
  },
  {
    text: " ",
    startSecond: 4.759,
    endSecond: 4.799,
  },
  {
    text: "your",
    startSecond: 4.799,
    endSecond: 4.939,
  },
  {
    text: " ",
    startSecond: 4.939,
    endSecond: 4.96,
  },
  {
    text: "favorite",
    startSecond: 4.96,
    endSecond: 5.219,
  },
  {
    text: " ",
    startSecond: 5.219,
    endSecond: 5.319,
  },
  {
    text: "framework,",
    startSecond: 5.319,
    endSecond: 5.939,
  },
  {
    text: " ",
    startSecond: 5.939,
    endSecond: 5.96,
  },
  {
    text: "multi-tenant",
    startSecond: 5.96,
    endSecond: 6.519,
  },
  {
    text: " ",
    startSecond: 6.519,
    endSecond: 6.559,
  },
  {
    text: "applications",
    startSecond: 6.559,
    endSecond: 7.259,
  },
  {
    text: " ",
    startSecond: 7.259,
    endSecond: 7.699,
  },
  {
    text: "or",
    startSecond: 7.699,
    endSecond: 7.759,
  },
  {
    text: " ",
    startSecond: 7.759,
    endSecond: 7.859,
  },
  {
    text: "micro-frontends",
    startSecond: 7.859,
    endSecond: 8.739,
  },
  {
    text: " ",
    startSecond: 8.739,
    endSecond: 8.78,
  },
  {
    text: "to",
    startSecond: 8.78,
    endSecond: 8.96,
  },
  {
    text: " ",
    startSecond: 8.96,
    endSecond: 9.099,
  },
  {
    text: "AI-powered",
    startSecond: 9.099,
    endSecond: 9.779,
  },
  {
    text: " ",
    startSecond: 9.779,
    endSecond: 9.82,
  },
  {
    text: "agents.",
    startSecond: 9.82,
    endSecond: 10.439,
  },
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
    <div className="space-y-6 p-6">
      {/** biome-ignore lint/a11y/useMediaCaption: "No caption needed" */}
      <audio controls onTimeUpdate={handleTimeUpdate} ref={audioRef}>
        <source src="https://ejiidnob33g9ap1r.public.blob.vercel-storage.com/ElevenLabs_2025-11-10T22_10_24_Hayden_pvc_sp110_s50_sb75_se0_b_m2.mp3" />
      </audio>

      <Transcription
        currentTime={currentTime}
        onSeek={handleSeek}
        segments={segments}
      >
        {(segment, index) => (
          <TranscriptionSegment
            className="text-lg"
            index={index}
            key={`${segment.startSecond}-${segment.endSecond}`}
            segment={segment}
          />
        )}
      </Transcription>
    </div>
  );
};

export default Example;
