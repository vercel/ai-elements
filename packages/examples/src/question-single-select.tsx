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
  const [answer, setAnswer] = useState<string>();
  const handleSubmit = useCallback(({ selectedValues }: QuestionResponse) => {
    setAnswer(selectedValues[0]);
  }, []);

  if (answer) {
    return (
      <div className="w-full max-w-2xl rounded-lg border bg-background p-4 text-sm">
        <span className="text-muted-foreground">Selected: </span>
        {answer}
      </div>
    );
  }

  return (
    <Question className="w-full max-w-2xl" onSubmit={handleSubmit}>
      <div className="space-y-1">
        <QuestionPrompt>Which framework should we use?</QuestionPrompt>
        <QuestionDescription>Select one option.</QuestionDescription>
      </div>
      <QuestionOptions aria-label="Framework">
        <QuestionOption value="Next.js">Next.js</QuestionOption>
        <QuestionOption value="Nuxt">Nuxt</QuestionOption>
        <QuestionOption value="SvelteKit">SvelteKit</QuestionOption>
      </QuestionOptions>
      <QuestionActions>
        <QuestionSubmit>Continue</QuestionSubmit>
      </QuestionActions>
    </Question>
  );
};

export default Example;
