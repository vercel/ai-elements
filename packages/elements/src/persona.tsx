"use client";

import { cn } from "@repo/shadcn-ui/lib/utils";
import {
  type RiveParameters,
  useRive,
  useStateMachineInput,
  useViewModel,
  useViewModelInstance,
  useViewModelInstanceColor,
} from "@rive-app/react-webgl2";
import type { FC } from "react";
import { useEffect } from "react";

export type PersonaState =
  | "idle"
  | "listening"
  | "thinking"
  | "speaking"
  | "asleep";

type PersonaProps = {
  state: PersonaState;
  onLoad?: RiveParameters["onLoad"];
  onLoadError?: RiveParameters["onLoadError"];
  onReady?: () => void;
  onPause?: RiveParameters["onPause"];
  onPlay?: RiveParameters["onPlay"];
  onStop?: RiveParameters["onStop"];
  className?: string;
  variant?: keyof typeof sources;
};

// The state machine name is always 'default' for Elements AI visuals
const stateMachine = "default";

const sources = {
  obsidian:
    "https://ejiidnob33g9ap1r.public.blob.vercel-storage.com/obsidian-2.0.riv",
  mana: "https://ejiidnob33g9ap1r.public.blob.vercel-storage.com/mana-2.0.rev",
  orb: "https://ejiidnob33g9ap1r.public.blob.vercel-storage.com/orb-1.2.riv",
  halo: "https://ejiidnob33g9ap1r.public.blob.vercel-storage.com/halo-2.0.riv",
  glint:
    "https://ejiidnob33g9ap1r.public.blob.vercel-storage.com/glint-2.0.riv",
  command:
    "https://ejiidnob33g9ap1r.public.blob.vercel-storage.com/command-2.0.riv",
  pal: "https://ejiidnob33g9ap1r.public.blob.vercel-storage.com/pal-1.0.0.riv",
};

export const Persona: FC<PersonaProps> = ({
  variant = "orb",
  state = "idle",
  onLoad,
  onLoadError,
  onReady,
  onPause,
  onPlay,
  onStop,
  className,
}) => {
  const { rive, RiveComponent } = useRive({
    src: sources[variant],
    stateMachines: stateMachine,
    autoplay: true,
    onLoad,
    onLoadError,
    onRiveReady: onReady,
    onPause,
    onPlay,
    onStop,
  });

  const viewModel = useViewModel(rive, { useDefault: true });
  const viewModelInstance = useViewModelInstance(viewModel, {
    rive,
    useDefault: true,
  });
  const { value: rgb, setRgb } = useViewModelInstanceColor(
    "color",
    viewModelInstance
  );

  console.log(rgb, variant, "x");

  useEffect(() => {
    setRgb(0, 0, 0);
  }, [setRgb]);

  const listeningInput = useStateMachineInput(rive, stateMachine, "listening");
  const thinkingInput = useStateMachineInput(rive, stateMachine, "thinking");
  const speakingInput = useStateMachineInput(rive, stateMachine, "speaking");

  useEffect(() => {
    if (listeningInput) {
      listeningInput.value = state === "listening";
    }
    if (thinkingInput) {
      thinkingInput.value = state === "thinking";
    }
    if (speakingInput) {
      speakingInput.value = state === "speaking";
    }
  }, [state, listeningInput, thinkingInput, speakingInput]);

  return <RiveComponent className={cn("size-16 shrink-0", className)} />;
};
