"use client";

import type { ComponentProps } from "react";

import {
  VoiceSelector,
  VoiceSelectorAccent,
  VoiceSelectorAge,
  VoiceSelectorBullet,
  VoiceSelectorContent,
  VoiceSelectorDescription,
  VoiceSelectorEmpty,
  VoiceSelectorGender,
  VoiceSelectorInput,
  VoiceSelectorItem,
  VoiceSelectorList,
  VoiceSelectorName,
  VoiceSelectorPreview,
  VoiceSelectorTrigger,
} from "@/components/ai-elements/voice-selector";
import { Button } from "@/components/ui/button";
import { memo, useCallback, useRef, useState } from "react";

const voices: {
  id: string;
  name: string;
  description: string;
  gender: ComponentProps<typeof VoiceSelectorGender>["value"];
  accent: ComponentProps<typeof VoiceSelectorAccent>["value"];
  age: string;
  previewUrl: string;
}[] = [
  {
    accent: "american",
    age: "20-30",
    description: "Energetic, Social Media Creator",
    gender: "male",
    id: "liam",
    name: "Liam",
    previewUrl:
      "https://ejiidnob33g9ap1r.public.blob.vercel-storage.com/ElevenLabs_2026-01-16T21_16_50_Liam%20-%20Energetic%2C%20Social%20Media%20Creator_pre_sp100_s50_sb75_se0_b_m2.mp3",
  },
  {
    accent: "american",
    age: "30-40",
    description: "Dominant, Firm",
    gender: "male",
    id: "adam",
    name: "Adam",
    previewUrl:
      "https://ejiidnob33g9ap1r.public.blob.vercel-storage.com/ElevenLabs_2026-01-16T21_17_00_Adam%20-%20Dominant%2C%20Firm_pre_sp100_s50_sb75_se0_b_m2.mp3",
  },
  {
    accent: "british",
    age: "30-40",
    description: "Clear, Engaging Educator",
    gender: "female",
    id: "alice",
    name: "Alice",
    previewUrl:
      "https://ejiidnob33g9ap1r.public.blob.vercel-storage.com/ElevenLabs_2026-01-16T21_17_09_Alice%20-%20Clear%2C%20Engaging%20Educator_pre_sp100_s50_sb75_se0_b_m2.mp3",
  },
  {
    accent: "american",
    age: "50-60",
    description: "Wise, Mature, Balanced",
    gender: "male",
    id: "bill",
    name: "Bill",
    previewUrl:
      "https://ejiidnob33g9ap1r.public.blob.vercel-storage.com/ElevenLabs_2026-01-16T21_17_25_Bill%20-%20Wise%2C%20Mature%2C%20Balanced_pre_sp100_s50_sb75_se0_b_m2.mp3",
  },
  {
    accent: "american",
    age: "20-30",
    description: "Playful, Bright, Warm",
    gender: "female",
    id: "jessica",
    name: "Jessica",
    previewUrl:
      "https://ejiidnob33g9ap1r.public.blob.vercel-storage.com/ElevenLabs_2026-01-16T21_17_50_Jessica%20-%20Playful%2C%20Bright%2C%20Warm_pre_sp100_s50_sb75_se0_b_m2.mp3",
  },
  {
    accent: "british",
    age: "30-40",
    description: "Velvety Actress",
    gender: "female",
    id: "lily",
    name: "Lily",
    previewUrl:
      "https://ejiidnob33g9ap1r.public.blob.vercel-storage.com/ElevenLabs_2026-01-16T21_18_03_Lily%20-%20Velvety%20Actress_pre_sp100_s50_sb75_se0_b_m2.mp3",
  },
];

interface VoiceItemProps {
  voice: (typeof voices)[0];
  playingVoice: string | null;
  loadingVoice: string | null;
  onSelect: (id: string) => void;
  onPreview: (id: string) => void;
}

const VoiceItem = memo(
  ({
    voice,
    playingVoice,
    loadingVoice,
    onSelect,
    onPreview,
  }: VoiceItemProps) => {
    const handleSelect = useCallback(
      () => onSelect(voice.id),
      [onSelect, voice.id]
    );
    const handlePreview = useCallback(
      () => onPreview(voice.id),
      [onPreview, voice.id]
    );
    return (
      <VoiceSelectorItem
        key={voice.id}
        onSelect={handleSelect}
        value={voice.id}
      >
        <VoiceSelectorPreview
          loading={loadingVoice === voice.id}
          onPlay={handlePreview}
          playing={playingVoice === voice.id}
        />
        <VoiceSelectorName>{voice.name}</VoiceSelectorName>
        <VoiceSelectorDescription>{voice.description}</VoiceSelectorDescription>
        <VoiceSelectorBullet />
        <VoiceSelectorAccent value={voice.accent} />
        <VoiceSelectorBullet />
        <VoiceSelectorAge>{voice.age}</VoiceSelectorAge>
        <VoiceSelectorBullet />
        <VoiceSelectorGender value={voice.gender} />
      </VoiceSelectorItem>
    );
  }
);

VoiceItem.displayName = "VoiceItem";

const Example = () => {
  const [open, setOpen] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState<string | null>(null);
  const [playingVoice, setPlayingVoice] = useState<string | null>(null);
  const [loadingVoice, setLoadingVoice] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleSelect = useCallback((voiceId: string) => {
    setSelectedVoice(voiceId);
    setOpen(false);
  }, []);

  const handlePreview = useCallback(
    (voiceId: string) => {
      const voice = voices.find((v) => v.id === voiceId);
      if (!voice) {
        return;
      }

      // If clicking the same voice that's playing, pause it
      if (playingVoice === voiceId) {
        audioRef.current?.pause();
        setPlayingVoice(null);
        return;
      }

      // Stop any currently playing audio
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }

      setLoadingVoice(voiceId);

      const audio = new Audio(voice.previewUrl);
      audioRef.current = audio;

      audio.addEventListener("canplaythrough", () => {
        setLoadingVoice(null);
        setPlayingVoice(voiceId);
        audio.play();
      });

      audio.addEventListener("ended", () => {
        setPlayingVoice(null);
      });

      audio.addEventListener("error", () => {
        setLoadingVoice(null);
        setPlayingVoice(null);
      });

      audio.load();
    },
    [playingVoice]
  );

  const selectedVoiceData = voices.find((voice) => voice.id === selectedVoice);

  return (
    <div className="flex size-full flex-col items-center justify-center">
      <VoiceSelector onOpenChange={setOpen} open={open}>
        <VoiceSelectorTrigger asChild>
          <Button className="w-full max-w-xs" variant="outline">
            {selectedVoiceData ? (
              <>
                <VoiceSelectorName>{selectedVoiceData.name}</VoiceSelectorName>
                <VoiceSelectorAccent value={selectedVoiceData.accent} />
                <VoiceSelectorBullet />
                <VoiceSelectorAge>{selectedVoiceData.age}</VoiceSelectorAge>
                <VoiceSelectorBullet />
                <VoiceSelectorGender value={selectedVoiceData.gender} />
              </>
            ) : (
              <span className="flex-1 text-left text-sm">
                Select a voice...
              </span>
            )}
          </Button>
        </VoiceSelectorTrigger>
        <VoiceSelectorContent className="max-w-md">
          <VoiceSelectorInput placeholder="Search voices..." />
          <VoiceSelectorList>
            <VoiceSelectorEmpty>No voices found.</VoiceSelectorEmpty>
            {voices.map((voice) => (
              <VoiceItem
                key={voice.id}
                loadingVoice={loadingVoice}
                onPreview={handlePreview}
                onSelect={handleSelect}
                playingVoice={playingVoice}
                voice={voice}
              />
            ))}
          </VoiceSelectorList>
        </VoiceSelectorContent>
      </VoiceSelector>
    </div>
  );
};

export default Example;
