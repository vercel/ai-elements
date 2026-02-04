"use client";

import type { Experimental_SpeechResult as SpeechResult } from "ai";

import {
  AudioPlayer,
  AudioPlayerControlBar,
  AudioPlayerDurationDisplay,
  AudioPlayerElement,
  AudioPlayerMuteButton,
  AudioPlayerPlayButton,
  AudioPlayerSeekBackwardButton,
  AudioPlayerSeekForwardButton,
  AudioPlayerTimeDisplay,
  AudioPlayerTimeRange,
  AudioPlayerVolumeRange,
} from "@/components/ai-elements/audio-player";
import { useEffect, useState } from "react";

const Example = () => {
  const [data, setData] = useState<SpeechResult["audio"] | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        "https://ejiidnob33g9ap1r.public.blob.vercel-storage.com/ElevenLabs_2025-11-10T22_07_46_Hayden_pvc_sp108_s50_sb75_se0_b_m2.mp3"
      );
      const arrayBuffer = await response.arrayBuffer();
      const base64 = Buffer.from(arrayBuffer).toString("base64");

      const newData: SpeechResult["audio"] = {
        base64,
        format: "mp3",
        mediaType: "audio/mpeg",
        uint8Array: new Uint8Array(arrayBuffer),
      };

      setData(newData);
    };

    if (!data) {
      fetchData();
    }
  }, [data]);

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex size-full items-center justify-center">
      <AudioPlayer>
        <AudioPlayerElement data={data} />
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
    </div>
  );
};

export default Example;
