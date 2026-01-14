"use client";

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
  VoiceSelectorTrigger,
} from "@repo/elements/voice-selector";
import { Button } from "@repo/shadcn-ui/components/ui/button";
import { type ComponentProps, useState } from "react";

const voices: {
  id: string;
  name: string;
  description: string;
  gender: ComponentProps<typeof VoiceSelectorGender>["value"];
  language: string;
  age: string;
  accent: ComponentProps<typeof VoiceSelectorAccent>["value"];
}[] = [
  {
    id: "alloy",
    name: "Alloy",
    description: "Deep and resonant.",
    gender: "male",
    language: "en-US",
    age: "40-50",
    accent: "american",
  },
  {
    id: "nova",
    name: "Nova",
    description: "Bright and clear.",
    gender: "female",
    language: "en-US",
    age: "20-30",
    accent: "british",
  },
  {
    id: "echo",
    name: "Echo",
    description: "Calm and soothing.",
    gender: "androgyne",
    language: "en-US",
    age: "30-40",
    accent: "canadian",
  },
  {
    id: "shimmer",
    name: "Shimmer",
    description: "Energetic and upbeat.",
    gender: "intersex",
    language: "en-US",
    age: "25-35",
    accent: "australian",
  },
  {
    id: "onyx",
    name: "Onyx",
    description: "Rich and authoritative.",
    gender: "non-binary",
    language: "en-US",
    age: "45-55",
    accent: "american",
  },
  {
    id: "fable",
    name: "Fable",
    description: "Warm and storytelling.",
    gender: "transgender",
    language: "en-US",
    age: "35-45",
    accent: "irish",
  },
  {
    id: "marble",
    name: "Marble",
    description: "Calm and soothing.",
    gender: undefined,
    language: "en-US",
    age: "20-30",
    accent: "canadian",
  },
];

const Example = () => {
  const [open, setOpen] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState<string | null>(null);

  const handleSelect = (voiceId: string) => {
    setSelectedVoice(voiceId);
    setOpen(false);
    console.log("Selected voice:", voiceId);
  };

  const selectedVoiceData = voices.find((voice) => voice.id === selectedVoice);

  return (
    <div className="flex size-full flex-col items-center justify-center">
      <VoiceSelector onOpenChange={setOpen} open={open}>
        <VoiceSelectorTrigger asChild>
          <Button className="w-full max-w-xs" variant="outline">
            {selectedVoiceData ? (
              <>
                <VoiceSelectorName>{selectedVoiceData.name}</VoiceSelectorName>
                <VoiceSelectorAccent>
                  {selectedVoiceData.accent}
                </VoiceSelectorAccent>
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
              <VoiceSelectorItem
                key={voice.id}
                onSelect={() => handleSelect(voice.id)}
                value={voice.id}
              >
                <VoiceSelectorName>{voice.name}</VoiceSelectorName>
                <VoiceSelectorDescription>
                  {voice.description}
                </VoiceSelectorDescription>
                <VoiceSelectorBullet />
                <VoiceSelectorAccent value={voice.accent} />
                <VoiceSelectorBullet />
                <VoiceSelectorAge>{voice.age}</VoiceSelectorAge>
                <VoiceSelectorBullet />
                <VoiceSelectorGender value={voice.gender} />
              </VoiceSelectorItem>
            ))}
          </VoiceSelectorList>
        </VoiceSelectorContent>
      </VoiceSelector>
    </div>
  );
};

export default Example;
