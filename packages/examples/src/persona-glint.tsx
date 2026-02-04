"use client";

import type { PersonaState } from "@repo/elements/persona";
import type { LucideIcon } from "lucide-react";

import { Persona } from "@repo/elements/persona";
import { Button } from "@repo/shadcn-ui/components/ui/button";
import { ButtonGroup } from "@repo/shadcn-ui/components/ui/button-group";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@repo/shadcn-ui/components/ui/tooltip";
import {
  BrainIcon,
  CircleIcon,
  EyeClosedIcon,
  MegaphoneIcon,
  MicIcon,
} from "lucide-react";
import { memo, useCallback, useState } from "react";

const states: {
  state: PersonaState;
  icon: LucideIcon;
  label: string;
}[] = [
  {
    icon: CircleIcon,
    label: "Idle",
    state: "idle",
  },
  {
    icon: MicIcon,
    label: "Listening",
    state: "listening",
  },
  {
    icon: BrainIcon,
    label: "Thinking",
    state: "thinking",
  },
  {
    icon: MegaphoneIcon,
    label: "Speaking",
    state: "speaking",
  },
  {
    icon: EyeClosedIcon,
    label: "Asleep",
    state: "asleep",
  },
];

interface StateButtonProps {
  state: (typeof states)[0];
  currentState: PersonaState;
  onStateChange: (state: PersonaState) => void;
}

const StateButton = memo(
  ({ state, currentState, onStateChange }: StateButtonProps) => {
    const handleClick = useCallback(
      () => onStateChange(state.state),
      [onStateChange, state.state]
    );
    return (
      <Tooltip key={state.state}>
        <TooltipTrigger asChild>
          <Button
            onClick={handleClick}
            size="icon-sm"
            variant={currentState === state.state ? "default" : "outline"}
          >
            <state.icon className="size-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>{state.label}</TooltipContent>
      </Tooltip>
    );
  }
);

StateButton.displayName = "StateButton";

const Example = () => {
  const [currentState, setCurrentState] = useState<PersonaState>("idle");

  const handleStateChange = useCallback((state: PersonaState) => {
    setCurrentState(state);
  }, []);

  return (
    <div className="flex size-full flex-col items-center justify-center gap-4">
      <Persona className="size-32" state={currentState} variant="glint" />

      <ButtonGroup orientation="horizontal">
        {states.map((state) => (
          <StateButton
            currentState={currentState}
            key={state.state}
            onStateChange={handleStateChange}
            state={state}
          />
        ))}
      </ButtonGroup>
    </div>
  );
};

export default Example;
