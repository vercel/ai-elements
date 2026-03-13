"use client";

import {
  Choice,
  ChoiceOption,
  ChoiceOptions,
  ChoiceQuestion,
  ChoiceStatus,
} from "@repo/elements/choice";
import { useCallback, useState } from "react";

const labels: Record<string, string> = {
  brief: "Brief",
  standard: "Standard",
  detailed: "Detailed",
};

const Example = () => {
  const [selected, setSelected] = useState<string>();
  const handleSubmit = useCallback((value: string | string[]) => {
    if (typeof value === "string") {
      setSelected(value);
    }
  }, []);

  return (
    <div className="w-full max-w-2xl space-y-3">
      {selected ? (
        <ChoiceStatus>Response detail: {labels[selected]}</ChoiceStatus>
      ) : (
        <Choice onSubmit={handleSubmit}>
          <ChoiceQuestion>How detailed should the response be?</ChoiceQuestion>
          <ChoiceOptions>
            <ChoiceOption
              description="A few sentences at most"
              value="brief"
            >
              Brief
            </ChoiceOption>
            <ChoiceOption description="A balanced overview" value="standard">
              Standard
            </ChoiceOption>
            <ChoiceOption
              description="In-depth with examples"
              value="detailed"
            >
              Detailed
            </ChoiceOption>
          </ChoiceOptions>
        </Choice>
      )}
    </div>
  );
};

export default Example;
