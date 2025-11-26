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
  obsidian: {
    source:
      "https://ejiidnob33g9ap1r.public.blob.vercel-storage.com/obsidian-2.0.riv",
    dynamicColor: true,
  },
  mana: {
    source:
      "https://ejiidnob33g9ap1r.public.blob.vercel-storage.com/mana-2.0.riv",
    dynamicColor: false,
  },
  orb: {
    source:
      "https://ejiidnob33g9ap1r.public.blob.vercel-storage.com/orb-1.2.riv",
    dynamicColor: false,
  },
  halo: {
    source:
      "https://ejiidnob33g9ap1r.public.blob.vercel-storage.com/halo-2.0.riv",
    dynamicColor: true,
  },
  glint: {
    source:
      "https://ejiidnob33g9ap1r.public.blob.vercel-storage.com/glint-2.0.riv",
    dynamicColor: true,
  },
  command: {
    source:
      "https://ejiidnob33g9ap1r.public.blob.vercel-storage.com/command-2.0.riv",
    dynamicColor: true,
  },
};

const getTheme = () => {
  if (typeof window !== "undefined") {
    if (document.documentElement.classList.contains("dark")) {
      return "dark";
    }
    if (window.matchMedia?.("(prefers-color-scheme: dark)").matches) {
      return "dark";
    }
  }

  return "light";
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
  const source = sources[variant];

  if (!source) {
    throw new Error(`Invalid variant: ${variant}`);
  }

  const { rive, RiveComponent } = useRive({
    src: source.source,
    stateMachines: stateMachine,
    autoplay: true,
    onLoad,
    onLoadError,
    onRiveReady: onReady,
    onPause,
    onPlay,
    onStop,
  });

  const theme = getTheme();

  const viewModel = useViewModel(rive, { useDefault: true });
  const viewModelInstance = useViewModelInstance(viewModel, {
    rive,
    useDefault: true,
  });
  const viewModelInstanceColor = useViewModelInstanceColor(
    "color",
    viewModelInstance
  );

  useEffect(() => {
    if (!(viewModelInstanceColor && source.dynamicColor)) {
      return;
    }

    if (theme === "dark") {
      viewModelInstanceColor.setRgb(255, 255, 255);
    } else {
      viewModelInstanceColor.setRgb(0, 0, 0);
    }
  }, [viewModelInstanceColor, theme, source.dynamicColor]);

  const listeningInput = useStateMachineInput(rive, stateMachine, "listening");
  const thinkingInput = useStateMachineInput(rive, stateMachine, "thinking");
  const speakingInput = useStateMachineInput(rive, stateMachine, "speaking");
  const asleepInput = useStateMachineInput(rive, stateMachine, "asleep");

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
    if (asleepInput) {
      asleepInput.value = state === "asleep";
    }
  }, [state, listeningInput, thinkingInput, speakingInput, asleepInput]);

  return <RiveComponent className={cn("size-16 shrink-0", className)} />;
};
