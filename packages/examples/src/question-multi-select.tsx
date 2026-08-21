"use client";

import type { QuestionResponse } from "@repo/elements/question";

import {
  Question,
  QuestionActions,
  QuestionDescription,
  QuestionOption,
  QuestionOptions,
  QuestionPrompt,
  QuestionSubmit,
} from "@repo/elements/question";
import { useCallback, useState } from "react";

const Example = () => {
  const [answer, setAnswer] = useState<readonly string[]>();
  const handleSubmit = useCallback(({ selectedValues }: QuestionResponse) => {
    setAnswer(selectedValues);
  }, []);

  if (answer) {
    return (
      <div className="w-full max-w-2xl rounded-lg border bg-background p-4 text-sm">
        <span className="text-muted-foreground">Selected: </span>
        {answer.join(", ")}
      </div>
    );
  }

  return (
    <Question
      className="w-full max-w-2xl"
      onSubmit={handleSubmit}
      selectionMode="multiple"
    >
      <div className="space-y-1">
        <QuestionPrompt>Which features should we include?</QuestionPrompt>
        <QuestionDescription>Select all that apply.</QuestionDescription>
      </div>
      <QuestionOptions aria-label="Features">
        <QuestionOption value="Authentication">Authentication</QuestionOption>
        <QuestionOption value="Database">Database</QuestionOption>
        <QuestionOption value="Payments">Payments</QuestionOption>
      </QuestionOptions>
      <QuestionActions>
        <QuestionSubmit>Continue</QuestionSubmit>
      </QuestionActions>
    </Question>
  );
};

export default Example;
