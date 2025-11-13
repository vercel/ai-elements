import { cn } from "@repo/shadcn-ui/lib/utils";
import {
  type RiveParameters,
  useRive,
  useStateMachineInput,
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
  obsidian: "/obsidian.riv",
  mana: "/mana.riv",
  orb: "/orb.riv",
  halo: "/halo.riv",
  glint: "/glint.riv",
  command: "/command.riv",
  pal: "/pal.riv",
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
