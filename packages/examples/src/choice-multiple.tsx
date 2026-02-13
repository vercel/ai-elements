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

const labels: Record<string, string> = {
  "key-points": "Key points",
  "action-items": "Action items",
  timeline: "Timeline",
  sources: "Sources",
};

const Example = () => {
  const [selected, setSelected] = useState<string[]>([]);
  const handleSubmit = useCallback((value: string | string[]) => {
    if (Array.isArray(value)) {
      setSelected(value);
    }
  }, []);

  return (
    <div className="w-full max-w-2xl space-y-3">
      {selected.length > 0 ? (
        <ChoiceStatus>
          Includes: {selected.map((v) => labels[v]).join(", ")}
        </ChoiceStatus>
      ) : (
        <Choice multiple onSubmit={handleSubmit} submitOnSelect={false}>
          <ChoiceQuestion>
            What should the summary include?
          </ChoiceQuestion>
          <ChoiceOptions>
            <ChoiceOption
              description="Main takeaways and findings"
              value="key-points"
            >
              Key points
            </ChoiceOption>
            <ChoiceOption
              description="Next steps and follow-ups"
              value="action-items"
            >
              Action items
            </ChoiceOption>
            <ChoiceOption
              description="Key dates and milestones"
              value="timeline"
            >
              Timeline
            </ChoiceOption>
            <ChoiceOption
              description="References and citations"
              value="sources"
            >
              Sources
            </ChoiceOption>
          </ChoiceOptions>
          <ChoiceSubmit />
        </Choice>
      )}
    </div>
  );
};

export default Example;
