"use client";

import {
  Choice,
  ChoiceOption,
  ChoiceOptions,
  ChoiceQuestion,
  ChoiceStatus,
} from "@repo/elements/choice";
import { useCallback, useState } from "react";

const Example = () => {
  const [selected, setSelected] = useState<string>();
  const handleSubmit = useCallback((value: string | string[]) => {
    if (typeof value === "string") {
      setSelected(value);
    }
  }, []);

  return (
    <div className="w-full max-w-2xl space-y-3">
      <Choice onSubmit={handleSubmit}>
        <ChoiceQuestion>How should I scope this briefing?</ChoiceQuestion>
        <ChoiceOptions>
          <ChoiceOption
            description="Most recent 24 hours"
            value="last-24-hours"
          >
            Last 24 hours
          </ChoiceOption>
          <ChoiceOption description="Past 7 days" value="last-week">
            Last week
          </ChoiceOption>
          <ChoiceOption description="Past 30 days" value="last-month">
            Last month
          </ChoiceOption>
        </ChoiceOptions>
      </Choice>
      {selected ? (
        <ChoiceStatus>Selected: {selected}</ChoiceStatus>
      ) : (
        <ChoiceStatus>Choose one option to continue.</ChoiceStatus>
      )}
    </div>
  );
};

export default Example;
