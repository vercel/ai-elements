"use client";

import { Persona, type PersonaState } from "@repo/elements/persona";
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
  type LucideIcon,
  MegaphoneIcon,
  MicIcon,
} from "lucide-react";
import { useState } from "react";

const states: {
  state: PersonaState;
  icon: LucideIcon;
  label: string;
}[] = [
  {
    state: "idle",
    icon: CircleIcon,
    label: "Idle",
  },
  {
    state: "listening",
    icon: MicIcon,
    label: "Listening",
  },
  {
    state: "thinking",
    icon: BrainIcon,
    label: "Thinking",
  },
  {
    state: "speaking",
    icon: MegaphoneIcon,
    label: "Speaking",
  },
  {
    state: "asleep",
    icon: EyeClosedIcon,
    label: "Asleep",
  },
];

const Example = () => {
  const [currentState, setCurrentState] = useState<PersonaState>("idle");

  return (
    <div className="flex size-full flex-col items-center justify-center gap-4">
      <Persona className="size-32" state={currentState} variant="opal" />

      <ButtonGroup orientation="horizontal">
        {states.map((state) => (
          <Tooltip key={state.state}>
            <TooltipTrigger asChild>
              <Button
                onClick={() => setCurrentState(state.state)}
                size="icon-sm"
                variant={currentState === state.state ? "default" : "outline"}
              >
                <state.icon className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>{state.label}</TooltipContent>
          </Tooltip>
        ))}
      </ButtonGroup>
    </div>
  );
};

export default Example;
