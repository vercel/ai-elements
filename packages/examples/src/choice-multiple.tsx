"use client";

import {
  Choice,
  ChoiceOption,
  ChoiceOptions,
  ChoiceQuestion,
  ChoiceStatus,
  ChoiceSubmit,
} from "@repo/elements/choice";
import { useCallback, useState } from "react";

const Example = () => {
  const [selected, setSelected] = useState<string[]>([]);
  const handleSubmit = useCallback((value: string | string[]) => {
    if (Array.isArray(value)) {
      setSelected(value);
    }
  }, []);

  return (
    <div className="w-full max-w-2xl space-y-3">
      <Choice multiple onSubmit={handleSubmit} submitOnSelect={false}>
        <ChoiceQuestion>Which categories should we include?</ChoiceQuestion>
        <ChoiceOptions>
          <ChoiceOption description="Incidents and safety trends" value="crime">
            Crime
          </ChoiceOption>
          <ChoiceOption description="Permits and construction" value="permits">
            Permits
          </ChoiceOption>
          <ChoiceOption description="Neighborhood events" value="events">
            Events
          </ChoiceOption>
          <ChoiceOption description="Local headlines" value="news">
            News
          </ChoiceOption>
        </ChoiceOptions>
        <ChoiceSubmit />
      </Choice>
      {selected.length > 0 ? (
        <ChoiceStatus>Selected: {selected.join(", ")}</ChoiceStatus>
      ) : (
        <ChoiceStatus>
          Select one or more categories, then confirm.
        </ChoiceStatus>
      )}
    </div>
  );
};

export default Example;
