"use client";

import type { Experimental_TranscriptionResult as TranscriptionResult } from "ai";

import {
  Transcription,
  TranscriptionSegment,
} from "@/components/ai-elements/transcription";
import { useCallback, useRef, useState } from "react";

const segments: TranscriptionResult["segments"] = [
  {
    endSecond: 0.219,
    startSecond: 0.119,
    text: "You",
  },
  {
    endSecond: 0.259,
    startSecond: 0.219,
    text: " ",
  },
  {
    endSecond: 0.439,
    startSecond: 0.259,
    text: "can",
  },
  {
    endSecond: 0.459,
    startSecond: 0.439,
    text: " ",
  },
  {
    endSecond: 0.699,
    startSecond: 0.459,
    text: "build",
  },
  {
    endSecond: 0.72,
    startSecond: 0.699,
    text: " ",
  },
  {
    endSecond: 0.799,
    startSecond: 0.72,
    text: "and",
  },
  {
    endSecond: 0.879,
    startSecond: 0.799,
    text: " ",
  },
  {
    endSecond: 1.339,
    startSecond: 0.879,
    text: "host",
  },
  {
    endSecond: 1.359,
    startSecond: 1.339,
    text: " ",
  },
  {
    endSecond: 1.539,
    startSecond: 1.36,
    text: "many",
  },
  {
    endSecond: 1.6,
    startSecond: 1.539,
    text: " ",
  },
  {
    endSecond: 1.86,
    startSecond: 1.6,
    text: "different",
  },
  {
    endSecond: 1.899,
    startSecond: 1.86,
    text: " ",
  },
  {
    endSecond: 2.099,
    startSecond: 1.899,
    text: "types",
  },
  {
    endSecond: 2.119,
    startSecond: 2.099,
    text: " ",
  },
  {
    endSecond: 2.2,
    startSecond: 2.119,
    text: "of",
  },
  {
    endSecond: 2.259,
    startSecond: 2.2,
    text: " ",
  },
  {
    endSecond: 2.96,
    startSecond: 2.259,
    text: "applications",
  },
  {
    endSecond: 3.479,
    startSecond: 2.96,
    text: " ",
  },
  {
    endSecond: 3.699,
    startSecond: 3.48,
    text: "from",
  },
  {
    endSecond: 3.779,
    startSecond: 3.699,
    text: " ",
  },
  {
    endSecond: 4.099,
    startSecond: 3.779,
    text: "static",
  },
  {
    endSecond: 4.179,
    startSecond: 4.099,
    text: " ",
  },
  {
    endSecond: 4.519,
    startSecond: 4.179,
    text: "sites",
  },
  {
    endSecond: 4.539,
    startSecond: 4.519,
    text: " ",
  },
  {
    endSecond: 4.759,
    startSecond: 4.539,
    text: "with",
  },
  {
    endSecond: 4.799,
    startSecond: 4.759,
    text: " ",
  },
  {
    endSecond: 4.939,
    startSecond: 4.799,
    text: "your",
  },
  {
    endSecond: 4.96,
    startSecond: 4.939,
    text: " ",
  },
  {
    endSecond: 5.219,
    startSecond: 4.96,
    text: "favorite",
  },
  {
    endSecond: 5.319,
    startSecond: 5.219,
    text: " ",
  },
  {
    endSecond: 5.939,
    startSecond: 5.319,
    text: "framework,",
  },
  {
    endSecond: 5.96,
    startSecond: 5.939,
    text: " ",
  },
  {
    endSecond: 6.519,
    startSecond: 5.96,
    text: "multi-tenant",
  },
  {
    endSecond: 6.559,
    startSecond: 6.519,
    text: " ",
  },
  {
    endSecond: 7.259,
    startSecond: 6.559,
    text: "applications",
  },
  {
    endSecond: 7.699,
    startSecond: 7.259,
    text: " ",
  },
  {
    endSecond: 7.759,
    startSecond: 7.699,
    text: "or",
  },
  {
    endSecond: 7.859,
    startSecond: 7.759,
    text: " ",
  },
  {
    endSecond: 8.739,
    startSecond: 7.859,
    text: "micro-frontends",
  },
  {
    endSecond: 8.78,
    startSecond: 8.739,
    text: " ",
  },
  {
    endSecond: 8.96,
    startSecond: 8.78,
    text: "to",
  },
  {
    endSecond: 9.099,
    startSecond: 8.96,
    text: " ",
  },
  {
    endSecond: 9.779,
    startSecond: 9.099,
    text: "AI-powered",
  },
  {
    endSecond: 9.82,
    startSecond: 9.779,
    text: " ",
  },
  {
    endSecond: 10.439,
    startSecond: 9.82,
    text: "agents.",
  },
];

const Example = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentTime, setCurrentTime] = useState(0);

  const handleSeek = useCallback((time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  }, []);

  const handleTimeUpdate = useCallback(() => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  }, []);

  return (
    <div className="space-y-6 p-6">
      {/* biome-ignore lint/a11y/useMediaCaption: "No caption needed" */}
      {/* oxlint-disable-next-line eslint-plugin-jsx-a11y(media-has-caption) */}
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
